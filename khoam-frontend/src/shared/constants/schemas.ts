import { z } from 'zod';

export const passwordSchema = z
  .string({
    required_error: 'Пароль обязателен'
  })
  .min(6, { message: 'Пароль не может быть меньше 6-и символов' });

export const phoneSchema = z
  .string({
    required_error: 'Номер телефона обязателен'
  })
  .min(10, { message: 'Номер должен содержать не менее 10-ти символов' });

export const loginFormSchema = z.object({
  login: z
    .string({
      required_error: 'Логин обязателен'
    })
    .min(2, {
      message: 'Логин должен содержать не менее 2-х символов'
    }),
  password: passwordSchema
});

export const forgotPasswordFormSchema = z.object({
  phone: phoneSchema
});

export type LoginFormDTO = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormDTO = z.infer<typeof forgotPasswordFormSchema>;
