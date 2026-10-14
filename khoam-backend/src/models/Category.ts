import { Schema, model } from 'mongoose';

export interface CategoryDocument {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    slug: { type: String, required: true, unique: true, index: true, trim: true }
  },
  { timestamps: true }
);

export const Category = model<CategoryDocument>('Category', categorySchema);
