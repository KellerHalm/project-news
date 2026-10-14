import { Router } from 'express';
import * as c from '../controllers/category.controller.js';
const router = Router();
router.get('/', c.list);
export default router;
