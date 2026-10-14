import { Schema, model } from 'mongoose';

export interface SavedNewsDocument {
  user: Schema.Types.ObjectId;
  news: Schema.Types.ObjectId;
  createdAt: Date;
}

const savedNewsSchema = new Schema<SavedNewsDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  news: { type: Schema.Types.ObjectId, ref: 'News', required: true },
  createdAt: { type: Date, default: Date.now }
});

savedNewsSchema.index({ user: 1, news: 1 }, { unique: true });
savedNewsSchema.index({ user: 1, createdAt: -1 });

export const SavedNews = model<SavedNewsDocument>('SavedNews', savedNewsSchema);
