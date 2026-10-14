import type { Request, Response } from 'express';
import * as service from '../services/category.service.js';
export async function list(_req: Request, res: Response) { res.json({ data: await service.listCategories() }); }
export async function create(req: Request, res: Response) { res.status(201).json({ data: await service.createCategory(req.body.name) }); }
export async function update(req: Request, res: Response) { res.json({ data: await service.updateCategory(String(req.params.id), req.body.name) }); }
export async function remove(req: Request, res: Response) { await service.deleteCategory(String(req.params.id)); res.status(204).send(); }
