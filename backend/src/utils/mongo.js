import mongoose from 'mongoose';

export async function connectToMongo() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, { dbName: process.env.MONGO_DB || 'stripe_demo' });
  console.log('Connected to MongoDB');
} 