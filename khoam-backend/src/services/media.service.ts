import fs from 'node:fs/promises';
import path from 'node:path';
import { MediaAsset } from '../models/MediaAsset.js';
import { News } from '../models/News.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');

function isLocalUploadUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith('/uploads/') && !parsed.pathname.includes('/../');
  } catch {
    return false;
  }
}

async function deletePhysicalFile(filename: string): Promise<void> {
  const safeName = path.basename(filename);
  if (safeName !== filename) throw new ApiError(400, 'INVALID_MEDIA', 'Invalid media filename.');
  const filePath = path.join(uploadDir, safeName);
  await fs.rm(filePath, { force: true });
}

async function isReferencedElsewhere(url: string, excludeNewsId?: string): Promise<boolean> {
  const query: Record<string, unknown> = { 'medias.url': url };
  if (excludeNewsId) query._id = { $ne: excludeNewsId };
  return Boolean(await News.exists(query));
}

export async function registerUploadedMedia(input: {
  owner: string;
  filename: string;
  type: 'image' | 'video';
  url: string;
}) {
  try {
    return await MediaAsset.create(input);
  } catch (error) {
    await deletePhysicalFile(input.filename);
    throw error;
  }
}

export async function deleteMediaAsset(userId: string, assetId: string) {
  const asset = await MediaAsset.findById(assetId);
  if (!asset) throw new ApiError(404, 'MEDIA_NOT_FOUND', 'Media file not found.');

  const user = await User.findById(userId).select('role');
  if (!user) throw new ApiError(401, 'UNAUTHORIZED', 'User not found.');

  if (user.role !== 'admin' && String(asset.owner) !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'You cannot delete this media file.');
  }

  if (await isReferencedElsewhere(asset.url)) {
    throw new ApiError(409, 'MEDIA_IN_USE', 'This media file is still used by a news item.');
  }

  await deletePhysicalFile(asset.filename);
  await MediaAsset.deleteOne({ _id: asset._id });
}

export async function cleanupNewsMedia(mediaUrls: string[]) {
  const localUrls = mediaUrls.filter(isLocalUploadUrl);
  if (!localUrls.length) return;

  const assets = await MediaAsset.find({ url: { $in: localUrls } });
  const assetsByUrl = new Map(assets.map(asset => [asset.url, asset]));

  for (const url of localUrls) {
    if (await isReferencedElsewhere(url)) continue;

    const asset = assetsByUrl.get(url);
    const filename = asset?.filename ?? decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '');
    if (!filename) continue;

    await deletePhysicalFile(filename);
    if (asset) await MediaAsset.deleteOne({ _id: asset._id });
  }
}

export async function cleanupRemovedNewsMedia(oldUrls: string[], newUrls: string[]) {
  const removed = oldUrls.filter(url => !newUrls.includes(url));
  await cleanupNewsMedia(removed);
}

export async function cleanupOrphanedMediaForOwner(ownerId: string) {
  const assets = await MediaAsset.find({ owner: ownerId });
  for (const asset of assets) {
    if (await isReferencedElsewhere(asset.url)) continue;
    await deletePhysicalFile(asset.filename);
    await MediaAsset.deleteOne({ _id: asset._id });
  }
}
