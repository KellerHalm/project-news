import { News } from '../models/News.js';
import { Category } from '../models/Category.js';
import { SavedNews } from '../models/SavedNews.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';
import { createNewsSlug } from '../utils/slug.js';
import { cleanupNewsMedia, cleanupRemovedNewsMedia } from './media.service.js';

export async function listPublishedNews(input: { page: number; limit: number; skip: number; category?: string }) {
  const filter: Record<string, unknown> = { status: 'published' };
  if (input.category) {
    const category = await Category.findOne({ slug: input.category });
    if (!category) return { data: [], meta: { page: input.page, limit: input.limit, total: 0, totalPages: 0 } };
    filter.category = category._id;
  }

  const [data, total] = await Promise.all([
    News.find(filter)
      .sort({ publishedAt: -1 })
      .skip(input.skip)
      .limit(input.limit)
      .populate('category', 'name slug')
      .populate('editor', 'name editorName editorSlug editorDescription editorAvatar')
      .lean(),
    News.countDocuments(filter)
  ]);

  return { data, meta: { page: input.page, limit: input.limit, total, totalPages: Math.ceil(total / input.limit) } };
}

export async function getPublishedNews(slug: string) {
  const news = await News.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('category', 'name slug')
    .populate('editor', 'name editorName editorSlug editorDescription editorAvatar');

  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  return news;
}

export async function listMyNews(userId: string, page: number, limit: number, skip: number) {
  const filter = { editor: userId };
  const [data, total] = await Promise.all([
    News.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('category', 'name slug').lean(),
    News.countDocuments(filter)
  ]);
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function createNews(userId: string, input: any) {
  const [user, category] = await Promise.all([
    User.findById(userId),
    Category.findById(input.category)
  ]);

  if (!user || user.role !== 'editor') throw new ApiError(403, 'EDITOR_REQUIRED', 'Only editors can create news.');
  if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found.');

  const news = await News.create({
    ...input,
    slug: await createNewsSlug(input.title),
    editor: userId,
    status: 'draft',
    views: 0
  });
  return news;
}

export async function getMyNewsById(userId: string, id: string) {
  const news = await News.findOne({ _id: id, editor: userId }).populate('category', 'name slug');
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  return news;
}

export async function updateMyNews(userId: string, id: string, input: any) {
  const news = await News.findOne({ _id: id, editor: userId });
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');

  if (input.category) {
    const category = await Category.findById(input.category);
    if (!category) throw new ApiError(404, 'CATEGORY_NOT_FOUND', 'Category not found.');
  }

  const oldMediaUrls = news.medias.map(media => media.url);
  Object.assign(news, input);
  if (input.title) news.slug = await createNewsSlug(input.title, id);
  await news.save();
  if (input.medias) await cleanupRemovedNewsMedia(oldMediaUrls, news.medias.map(media => media.url));
  return news;
}

export async function deleteMyNews(userId: string, id: string) {
  const news = await News.findOne({ _id: id, editor: userId });
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  await News.deleteOne({ _id: news._id });
  await SavedNews.deleteMany({ news: id });
  await cleanupNewsMedia(news.medias.map(media => media.url));
}

export async function publishMyNews(userId: string, id: string, published: boolean) {
  const [user, news] = await Promise.all([
    User.findOne({ _id: userId, role: 'editor' }),
    News.findOne({ _id: id, editor: userId })
  ]);

  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  if (!user) throw new ApiError(403, 'EDITOR_REQUIRED', 'Only editors can publish news.');
  if (published && user.isBlocked) {
    throw new ApiError(403, 'EDITOR_BLOCKED', 'Blocked editors cannot publish news.');
  }

  news.status = published ? 'published' : 'draft';
  news.publishedAt = published ? new Date() : undefined;
  await news.save();
  return news;
}

export async function saveNews(userId: string, newsId: string) {
  const news = await News.findOne({ _id: newsId, status: 'published' });
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  await SavedNews.updateOne({ user: userId, news: newsId }, { $setOnInsert: { user: userId, news: newsId } }, { upsert: true });
}

export async function unsaveNews(userId: string, newsId: string) {
  await SavedNews.deleteOne({ user: userId, news: newsId });
}

export async function listSavedNews(userId: string, page: number, limit: number, skip: number) {
  const filter = { user: userId };
  const [items, total] = await Promise.all([
    SavedNews.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'news',
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'editor', select: 'name editorName editorSlug editorDescription editorAvatar' }
        ]
      })
      .lean(),
    SavedNews.countDocuments(filter)
  ]);
  const data = items.map((item: any) => item.news).filter(Boolean);
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function adminListNews(page: number, limit: number, skip: number, status?: string) {
  const filter: Record<string, unknown> = {};
  if (status === 'draft' || status === 'published') filter.status = status;

  const [data, total] = await Promise.all([
    News.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name slug')
      .populate('editor', 'name email editorName editorSlug isBlocked')
      .lean(),
    News.countDocuments(filter)
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function adminDeleteNews(id: string) {
  const news = await News.findById(id);
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');
  await News.deleteOne({ _id: news._id });
  await SavedNews.deleteMany({ news: id });
  await cleanupNewsMedia(news.medias.map(media => media.url));
}

export async function adminSetNewsStatus(id: string, status: 'draft' | 'published') {
  const news = await News.findById(id);
  if (!news) throw new ApiError(404, 'NEWS_NOT_FOUND', 'News not found.');

  news.status = status;
  news.publishedAt = status === 'published' ? new Date() : undefined;
  await news.save();
  return news;
}
