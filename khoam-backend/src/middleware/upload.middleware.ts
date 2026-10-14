import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const mediaMimeTypes = new Set([
  ...imageMimeTypes,
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
]);

function extensionForMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/ogg': '.ogv',
    'video/quicktime': '.mov'
  };
  return extensions[mimeType] ?? path.extname(mimeType);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${extensionForMimeType(file.mimetype)}`);
  }
});

function createUpload(allowedMimeTypes: Set<string>, message: string) {
  return multer({
    storage,
    limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        cb(new ApiError(400, 'INVALID_FILE_TYPE', message));
        return;
      }
      cb(null, true);
    }
  });
}

export const imageUpload = createUpload(
  imageMimeTypes,
  'Only JPEG, PNG, WEBP and GIF images are allowed.'
);

export const mediaUpload = createUpload(
  mediaMimeTypes,
  'Allowed media types: JPEG, PNG, WEBP, GIF, MP4, WEBM, OGG and MOV.'
);
