import { Router } from 'express';
import * as c from '../controllers/editor.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateEditorSchema } from '../validators/editor.validator.js';

const router = Router();
router.use(requireAuth, requireRole('editor'));
router.get('/me', c.getMine);
router.patch('/me', validate(updateEditorSchema), c.updateMine);

export default router;
