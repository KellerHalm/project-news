import { z } from 'zod';

const mediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.url()
});

export const createNewsSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200),
    excerpt: z.string().trim().min(1).max(5000),
    medias: z.array(mediaSchema).max(8),
    content: z.unknown().optional(),
    category: z.string().min(1)
  }).strict()
});

export const updateNewsSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200).optional(),
    excerpt: z.string().trim().min(1).max(5000).optional(),
    medias: z.array(mediaSchema).max(8).optional(),
    content: z.unknown().optional(),
    category: z.string().min(1).optional()
  }).strict()
});

export const adminNewsStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'published'])
  }).strict()
});
