import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './utils/mongo.js';
import authRouter from './routes/auth.js';
import plansRouter from './routes/plans.js';
import stripeRouter from './routes/stripe.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));

// Stripe webhook must use raw body parsing
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/plans', plansRouter);
app.use('/api/stripe', stripeRouter);

const PORT = process.env.PORT || 5000;

connectToMongo()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }); 