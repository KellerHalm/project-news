import express from 'express';
import cors from 'cors';
import path from 'node:path';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import newsRoutes from './routes/news.routes.js';
import editorRoutes from './routes/editor.routes.js';
import categoryRoutes from './routes/category.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';

export const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.FRONTEND_URL, credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

app.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.get('/api', (_req, res) => res.json({ data: { name: 'news-backend', status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/editors', editorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use((_req, res) => res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'Route not found.' } }));
app.use(errorMiddleware);
