import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getStripe } from '../utils/stripe.js';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId required' });
    const stripe = getStripe();
    const user = await User.findById(req.userId);

    const customer = user.subscription?.stripeCustomerId
      ? user.subscription.stripeCustomerId
      : (await stripe.customers.create({ email: user.email, name: user.name || undefined })).id;

    if (!user.subscription?.stripeCustomerId) {
      user.subscription.stripeCustomerId = customer;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/billing`,
      metadata: { userId: user._id.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = getStripe();
  let event = req.body;
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
        if (user) {
          user.subscription.status = subscription.status;
          user.subscription.stripeSubscriptionId = subscription.id;
          user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          await user.save();
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
        if (user) {
          user.subscription.status = 'canceled';
          await user.save();
        }
        break;
      }
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handling error', err);
    res.status(500).send('Server error');
  }
});

export default router; 