import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';

export async function register(req: Request, res: Response) { res.status(201).json({ data: await authService.register(req.body) }); }
export async function login(req: Request, res: Response) { res.json({ data: await authService.login(req.body) }); }
export async function me(req: Request, res: Response) { res.json({ data: await userService.getMe(req.user!.id) }); }
