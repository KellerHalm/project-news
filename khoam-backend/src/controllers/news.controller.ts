import type { Request, Response } from 'express';
import * as newsService from '../services/news.service.js';
import { getPagination } from '../utils/pagination.js';

export async function list(req: Request, res: Response) {
  const p = getPagination(req.query.page, req.query.limit);
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  res.json(await newsService.listPublishedNews({ ...p, category }));
}

export async function getBySlug(req: Request, res: Response) {
  res.json({ data: await newsService.getPublishedNews(String(req.params.slug)) });
}

export async function myList(req: Request, res: Response) {
  const p = getPagination(req.query.page, req.query.limit);
  res.json(await newsService.listMyNews(req.user!.id, p.page, p.limit, p.skip));
}

export async function myGet(req: Request, res: Response) {
  res.json({ data: await newsService.getMyNewsById(req.user!.id, String(req.params.id)) });
}

export async function create(req: Request, res: Response) {
  res.status(201).json({ data: await newsService.createNews(req.user!.id, req.body) });
}

export async function update(req: Request, res: Response) {
  res.json({ data: await newsService.updateMyNews(req.user!.id, String(req.params.id), req.body) });
}

export async function remove(req: Request, res: Response) {
  await newsService.deleteMyNews(req.user!.id, String(req.params.id));
  res.status(204).send();
}

export async function publish(req: Request, res: Response) {
  res.json({ data: await newsService.publishMyNews(req.user!.id, String(req.params.id), true) });
}

export async function unpublish(req: Request, res: Response) {
  res.json({ data: await newsService.publishMyNews(req.user!.id, String(req.params.id), false) });
}

export async function save(req: Request, res: Response) {
  await newsService.saveNews(req.user!.id, String(req.params.id));
  res.status(204).send();
}

export async function unsave(req: Request, res: Response) {
  await newsService.unsaveNews(req.user!.id, String(req.params.id));
  res.status(204).send();
}

export async function saved(req: Request, res: Response) {
  const p = getPagination(req.query.page, req.query.limit);
  res.json(await newsService.listSavedNews(req.user!.id, p.page, p.limit, p.skip));
}

export async function adminList(req: Request, res: Response) {
  const p = getPagination(req.query.page, req.query.limit);
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  res.json(await newsService.adminListNews(p.page, p.limit, p.skip, status));
}

export async function adminStatus(req: Request, res: Response) {
  res.json({ data: await newsService.adminSetNewsStatus(String(req.params.id), req.body.status) });
}

export async function adminRemove(req: Request, res: Response) {
  await newsService.adminDeleteNews(String(req.params.id));
  res.status(204).send();
}
