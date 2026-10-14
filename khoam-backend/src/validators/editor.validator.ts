import { z } from 'zod';

export const updateEditorSchema = z.object({
  body: z.object({
    editorName: z.string().trim().min(2).max(120).optional(),
    editorDescription: z.string().trim().max(1000).optional(),
    editorAvatar: z.url().optional()
  }).strict()
});
