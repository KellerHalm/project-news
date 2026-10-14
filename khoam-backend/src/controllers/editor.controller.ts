import type { Request, Response } from 'express';
import * as service from '../services/editor.service.js';

export async function getMine(req: Request, res: Response) {
  res.json({ data: await service.getMyEditor(req.user!.id) });
}

export async function updateMine(req: Request, res: Response) {
  res.json({ data: await service.updateMyEditor(req.user!.id, req.body) });
}
