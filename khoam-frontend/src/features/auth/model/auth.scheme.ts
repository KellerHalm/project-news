import { z } from 'zod';

import { phoneSchema as sharedPhoneSchema } from '@/shared/constants';

export const phoneSchema = z.object({
  phone: sharedPhoneSchema
});

export const smsCodeSchema = z.object({
  code: z.string().length(6, 'Код должен содержать 6 символов')
});

export const finalStepSchema = z.object({
  email: z.string().email('Неверный email'),
  name: z.string().min(1, 'Введите имя')
});
