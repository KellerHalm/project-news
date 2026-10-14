import { Category } from '../models/Category.js';
import { ApiError } from '../utils/api-error.js';
import { createCategorySlug } from '../utils/slug.js';
import { News } from '../models/News.js';

export async function listCategories() { return Category.find().sort({ name: 1 }).lean(); }

export async function createCategory(name: string) {
  const category = await Category.create({ name, slug: await createCategorySlug(name) });
  return category;
}

export async function updateCategory(id: string, name: string) {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found.');
  category.name = name;
  category.slug = await createCategorySlug(name, id);
  await category.save();
  return category;
}

export async function deleteCategory(id: string) {
  const used = await News.exists({ category: id });
  if (used) throw new ApiError(409, 'CATEGORY_IN_USE', 'This category is used by news and cannot be deleted yet.');
  const result = await Category.deleteOne({ _id: id });
  if (!result.deletedCount) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found.');
}
