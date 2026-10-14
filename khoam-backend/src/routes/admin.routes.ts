import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import * as news from '../controllers/news.controller.js';
import * as categories from '../controllers/category.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { adminNewsStatusSchema } from '../validators/news.validator.js';
import { z } from 'zod';

const editorSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.email(),
    editorName: z.string().trim().min(2).max(120),
    editorDescription: z.string().trim().max(1000).optional(),
    editorAvatar: z.url().optional()
  }).strict()
});

const editorBlockSchema = z.object({
  body: z.object({ isBlocked: z.boolean() }).strict()
});

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.post('/editors', validate(editorSchema), admin.createEditor);
router.get('/editors', admin.listEditors);
router.patch('/editors/:id/block', validate(editorBlockSchema), admin.blockEditor);
router.delete('/editors/:id', admin.deleteEditor);
router.get('/news', news.adminList);
router.patch('/news/:id/status', validate(adminNewsStatusSchema), news.adminStatus);
router.delete('/news/:id', news.adminRemove);
router.post('/categories', validate(createCategorySchema), categories.create);
router.patch('/categories/:id', validate(updateCategorySchema), categories.update);
router.delete('/categories/:id', categories.remove);

export default router;
