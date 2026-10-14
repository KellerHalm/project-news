import type { Request, Response } from 'express';
import * as userService from '../services/user.service.js';

export async function getMe(req: Request, res: Response) { res.json({ data: await userService.getMe(req.user!.id) }); }
export async function updateMe(req: Request, res: Response) { res.json({ data: await userService.updateMe(req.user!.id, req.body) }); }
export async function changePassword(req: Request, res: Response) { await userService.changePassword(req.user!.id, req.body); res.status(204).send(); }
export async function deleteMe(req: Request, res: Response) { await userService.deleteMe(req.user!.id); res.status(204).send(); }
