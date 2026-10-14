import type { Request, Response } from 'express';
import * as service from '../services/admin.service.js';

export async function createEditor(req: Request, res: Response) {
  res.status(201).json({ data: await service.createEditor(req.body) });
}

export async function listEditors(_req: Request, res: Response) {
  res.json({ data: await service.listEditors() });
}

export async function blockEditor(req: Request, res: Response) {
  res.json({ data: await service.setEditorBlocked(String(req.params.id), req.body.isBlocked) });
}

export async function deleteEditor(req: Request, res: Response) {
  await service.deleteEditor(String(req.params.id));
  res.status(204).send();
}
