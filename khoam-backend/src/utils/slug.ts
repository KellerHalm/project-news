import slugify from 'slugify';
import { News } from '../models/News.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';

function baseSlug(value: string): string {
  return slugify(value, { lower: true, strict: true, trim: true });
}

async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  const normalized = base || `item-${Date.now()}`;
  let candidate = normalized;
  let counter = 2;
  while (await exists(candidate)) candidate = `${normalized}-${counter++}`;
  return candidate;
}

export async function createNewsSlug(title: string, excludeId?: string): Promise<string> {
  return uniqueSlug(baseSlug(title), async slug => {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    return Boolean(await News.exists(query));
  });
}

export async function createEditorSlug(name: string, excludeId?: string): Promise<string> {
  return uniqueSlug(baseSlug(name), async slug => {
    const query: Record<string, unknown> = { role: 'editor', editorSlug: slug };
    if (excludeId) query._id = { $ne: excludeId };
    return Boolean(await User.exists(query));
  });
}

export async function createCategorySlug(name: string, excludeId?: string): Promise<string> {
  return uniqueSlug(baseSlug(name), async slug => {
    const query: Record<string, unknown> = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    return Boolean(await Category.exists(query));
  });
}
