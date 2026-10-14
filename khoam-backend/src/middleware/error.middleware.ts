import type { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }

  if (error instanceof ZodError) {
    res.status(422).json({ error: { code: 'VALIDATION_ERROR', message: error.issues.map(i => i.message).join('; ') } });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: { code: 'UPLOAD_ERROR', message: error.message } });
    return;
  }

  if (error?.code === 11000) {
    res.status(409).json({ error: { code: 'DUPLICATE_RESOURCE', message: 'A resource with these unique fields already exists.' } });
    return;
  }

  console.error(error);
  res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong on the server.' } });
};
