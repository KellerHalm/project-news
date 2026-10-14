import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';
import { verifyAccessToken, type JwtPayload } from '../utils/jwt.js';

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.header('Authorization');

  if (!header?.startsWith('Bearer ')) {
    next(
      new ApiError(
        401,
        'UNAUTHORIZED',
        'Authentication is required.'
      )
    );
    return;
  }

  let payload: JwtPayload;

  try {
    payload = verifyAccessToken(header.slice(7));
  } catch {
    next(
      new ApiError(
        401,
        'INVALID_TOKEN',
        'The access token is invalid or expired.'
      )
    );
    return;
  }

  try {
    const user = await User.findById(payload.sub)
      .select('_id role')
      .lean();

    if (!user) {
      next(
        new ApiError(
          401,
          'USER_NOT_FOUND',
          'The account for this access token no longer exists.'
        )
      );
      return;
    }

    req.user = {
      id: String(user._id),
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
}