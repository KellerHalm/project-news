import { Schema, model } from 'mongoose';

export type MediaAssetType = 'image' | 'video';

export interface MediaAssetDocument {
  owner: Schema.Types.ObjectId;
  filename: string;
  type: MediaAssetType;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<MediaAssetDocument>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    filename: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

mediaAssetSchema.index({ owner: 1, createdAt: -1 });

export const MediaAsset = model<MediaAssetDocument>('MediaAsset', mediaAssetSchema);
