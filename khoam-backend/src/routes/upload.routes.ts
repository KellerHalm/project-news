import { Router } from 'express';
import { uploadImage, uploadMedia, removeMedia } from '../controllers/upload.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { imageUpload, mediaUpload } from '../middleware/upload.middleware.js';

const router = Router();
router.post('/image', requireAuth, requireRole('editor', 'admin'), imageUpload.single('image'), uploadImage);
router.post('/media', requireAuth, requireRole('editor', 'admin'), mediaUpload.single('media'), uploadMedia);

router.delete('/media/:id', requireAuth, requireRole('editor', 'admin'), removeMedia);

export default router;
