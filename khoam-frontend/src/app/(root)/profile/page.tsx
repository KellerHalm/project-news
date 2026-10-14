'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Endpoints, routes } from '@/shared/constants';
import apiClient from '@/shared/core';
import { getMyNews, getSavedNews, type News } from '@/shared/services/news-api';
import { Button, NewsCard, Title, Typography } from '@/shared/ui';

type User = { name: string; role: 'user' | 'editor' | 'admin' };
type ApiResponse<T> = { data: T };
const date = (value: string) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null); const [news, setNews] = useState<News[]>([]); const [error, setError] = useState(false);
  useEffect(() => {
    apiClient.get<ApiResponse<User>>(Endpoints.AUTH_PROFILE).then(({ data }) => {
      setUser(data.data); return data.data.role === 'editor' ? getMyNews() : getSavedNews();
    }).then(setNews).catch(() => setError(true));
  }, []);
  if (error) return <div className="flex flex-col gap-4"><Typography variant="h1">Войдите в аккаунт</Typography><Button asChild><Link href={routes.login}>Войти</Link></Button></div>;
  if (!user) return <Typography variant="body1">Загрузка профиля...</Typography>;
  const isEditor = user.role === 'editor';
  return <div className="flex flex-col gap-8"><div className="flex items-center justify-between gap-4"><Typography variant="h1">{isEditor ? 'Материалы редакции' : 'Сохранённое'}</Typography>{isEditor && <Typography variant="body1">Создание и публикация статей доступны через API редактора.</Typography>}</div><Title text={isEditor ? 'Ваши материалы' : 'Сохранённые новости'} />{news.length === 0 ? <Typography variant="body1">Пока здесь ничего нет.</Typography> : news.map(item => <Link key={item._id} href={item.status === 'published' ? `/news/${item.slug}` : '#'}><NewsCard variant="secondary" size="sm" title={item.title} author={item.editor?.editorName || item.editor?.name || user.name} date={date(item.publishedAt || item.createdAt)} preview={item.medias.find(media => media.type === 'image')?.url} /></Link>)}</div>;
}
