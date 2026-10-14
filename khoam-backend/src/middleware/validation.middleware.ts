import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ApiError } from '../utils/api-error.js';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
    if (!result.success) {
      next(new ApiError(422, 'VALIDATION_ERROR', result.error.issues.map(issue => issue.message).join('; ')));
      return;
    }
    const parsed = result.data as { body?: unknown; params?: unknown; query?: unknown };
    if (parsed.body !== undefined) req.body = parsed.body;
    next();
  };
}
