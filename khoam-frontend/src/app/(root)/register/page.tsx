'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { registerUser } from '@/features/auth/api/auth-api';
import { routes } from '@/shared/constants';
import { saveTokenStorage } from '@/shared/services';
import { Button, Input, PasswordInput, Typography } from '@/shared/ui';
import { errorNotification } from '@/shared/utils';
import styles from './page.module.scss';

export default function RegisterPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const password = String(form.get('password'));
    if (password !== String(form.get('confirmPassword'))) { errorNotification('Пароли не совпадают'); return; }
    setLoading(true); try { const auth = await registerUser({ name: String(form.get('name')), email: String(form.get('email')), password }); saveTokenStorage(auth.token); router.push(routes.profile); } catch (error) { errorNotification(error); } finally { setLoading(false); }
  }
  return <div className="flex h-full items-center justify-center p-16"><form onSubmit={submit} className={styles.form}><Typography variant="h1">Регистрация</Typography><div className="flex flex-col gap-2"><Input name="name" label="Имя" placeholder="Введите имя" autoComplete="name" required /><Input type="email" name="email" label="Email" placeholder="Электронная почта" autoComplete="email" required /><PasswordInput name="password" label="Пароль" placeholder="Минимум 8 символов" autoComplete="new-password" minLength={8} required /><PasswordInput name="confirmPassword" label="Подтверждение пароля" placeholder="Повторите пароль" autoComplete="new-password" minLength={8} required /></div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Создаём...' : 'Зарегистрироваться'}</Button><Typography variant="body1" className="text-center text-(--neutral-70)">Уже есть аккаунт?<Link href={routes.login} className="ml-1"><Typography variant="h6" component="span" className="text-(--neutral-100) hover:underline">Вход</Typography></Link></Typography></form></div>;
}
