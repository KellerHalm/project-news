import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action.'));
      return;
    }
    next();
  };
}
