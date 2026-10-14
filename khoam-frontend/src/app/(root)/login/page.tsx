'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { loginUser } from '@/features/auth/api/auth-api';
import { routes } from '@/shared/constants';
import { saveTokenStorage } from '@/shared/services';
import { Button, Input, PasswordInput, Typography } from '@/shared/ui';
import { errorNotification } from '@/shared/utils';
import styles from './page.module.scss';

export default function LoginPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setLoading(true);
    try { const auth = await loginUser({ email: String(form.get('email')), password: String(form.get('password')) }); saveTokenStorage(auth.token); router.push(routes.profile); }
    catch (error) { errorNotification(error); } finally { setLoading(false); }
  }
  return <div className="flex h-full items-center justify-center p-16"><form onSubmit={submit} className={styles.form}><Typography variant="h1">Вход</Typography><div className="flex flex-col gap-2"><Input type="email" name="email" label="Email" placeholder="Электронная почта" autoComplete="email" required /><PasswordInput name="password" label="Пароль" placeholder="Введите пароль" autoComplete="current-password" required /></div><Button type="submit" className="w-full" disabled={loading}>{loading ? 'Входим...' : 'Войти'}</Button><Typography variant="body1" className="text-center text-(--neutral-70)">Нет аккаунта?<Link href={routes.register} className="ml-1"><Typography variant="h6" component="span" className="text-(--neutral-100) hover:underline">Регистрация</Typography></Link></Typography></form></div>;
}
