import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  mongoose.set('autoIndex', env.NODE_ENV !== 'production');
  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
}
