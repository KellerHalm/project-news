import type { Request, Response } from 'express';
import { ApiError } from '../utils/api-error.js';
import { registerUploadedMedia, deleteMediaAsset } from '../services/media.service.js';

function publicUrl(req: Request, filename: string) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

export async function uploadImage(req: Request, res: Response) {
  if (!req.file) throw new ApiError(400, 'IMAGE_REQUIRED', 'An image file is required.');
  const url = publicUrl(req, req.file.filename);
  const asset = await registerUploadedMedia({ owner: req.user!.id, filename: req.file.filename, type: 'image', url });
  // Editor.js Image Tool compatible response.
  res.json({ success: 1, file: { url, id: String(asset._id) }, data: { id: String(asset._id), type: 'image', url } });
}

export async function uploadMedia(req: Request, res: Response) {
  if (!req.file) throw new ApiError(400, 'MEDIA_REQUIRED', 'A media file is required.');
  const url = publicUrl(req, req.file.filename);
  const type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  const asset = await registerUploadedMedia({ owner: req.user!.id, filename: req.file.filename, type, url });
  res.json({ data: { id: String(asset._id), type, url } });
}

export async function removeMedia(req: Request, res: Response) {
  await deleteMediaAsset(req.user!.id, String(req.params.id));
  res.status(204).send();
}
