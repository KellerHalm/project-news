import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../models/User.js';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.sub || !decoded.role) {
    throw new Error('Invalid token payload');
  }
  return { sub: String(decoded.sub), role: decoded.role as UserRole };
}
