import express from 'express';

const router = express.Router();

// Static plan definitions; map to Stripe price IDs via env
const plans = [
  {
    id: 'plan_3m',
    name: 'Quarterly',
    tagline: 'Focus for a season',
    priceMonthly: 12,
    priceDisplay: '$36 / 3 months',
    interval: '3mo',
    features: ['All premium features', 'Priority support', 'Member-only drops'],
    stripePriceId: process.env.STRIPE_PRICE_QUARTERLY || '',
  },
  {
    id: 'plan_monthly',
    name: 'Monthly',
    tagline: 'Pay as you grow',
    priceMonthly: 15,
    priceDisplay: '$15 / month',
    interval: 'month',
    features: ['All premium features', 'Standard support'],
    stripePriceId: process.env.STRIPE_PRICE_MONTHLY || '',
  },
  {
    id: 'plan_yearly',
    name: 'Yearly',
    tagline: 'Best value',
    priceMonthly: 9,
    priceDisplay: '$108 / year',
    interval: 'year',
    features: ['All premium features', 'VIP support', '2 months free'],
    stripePriceId: process.env.STRIPE_PRICE_YEARLY || '',
  },
];

router.get('/', (_req, res) => {
  res.json({ plans });
});

export default router; 