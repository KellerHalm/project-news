import { Schema, model } from 'mongoose';

export type NewsStatus = 'draft' | 'published';
export type MediaType = 'image' | 'video';

export interface NewsMedia {
  type: MediaType;
  url: string;
}

export interface NewsDocument {
  title: string;
  slug: string;
  excerpt: string;
  medias: NewsMedia[];
  content?: unknown;
  category: Schema.Types.ObjectId;
  editor?: Schema.Types.ObjectId;
  status: NewsStatus;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<NewsMedia>(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const newsSchema = new Schema<NewsDocument>(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    excerpt: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    medias: {
      type: [mediaSchema],
      required: true,
      default: [],
      validate: {
        validator: (value: NewsMedia[]) => value.length <= 8,
        message: 'A news item can contain at most 8 media items.'
      }
    },
    // Reserved for a future Editor.js migration. It is intentionally optional for now.
    content: { type: Schema.Types.Mixed, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    editor: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    views: { type: Number, default: 0, min: 0 },
    publishedAt: { type: Date, index: true }
  },
  { timestamps: true }
);

newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ editor: 1, status: 1, updatedAt: -1 });

export const News = model<NewsDocument>('News', newsSchema);
