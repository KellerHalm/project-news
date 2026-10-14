import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    avatar: z.url().optional()
  }).strict()
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128)
  }).strict()
});
