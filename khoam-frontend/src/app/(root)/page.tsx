'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getNews, type News } from '@/shared/services/news-api';
import { NewsCard, Title, Typography } from '@/shared/ui';

function formatDate(date?: string) {
  return date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date)) : '';
}

export default function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => { getNews().then(setNews).catch(() => setError(true)); }, []);
  return <div className="flex w-full flex-col gap-8">
    <Title text="Последние новости" />
    {error && <Typography variant="body1">Не удалось загрузить новости. Проверьте, что бэкенд запущен.</Typography>}
    {!error && news.length === 0 && <Typography variant="body1">Пока нет опубликованных новостей.</Typography>}
    <div className="grid gap-6 md:grid-cols-2">{news.map(item => <Link key={item._id} href={`/news/${item.slug}`}><NewsCard title={item.title} author={item.editor?.editorName || item.editor?.name || 'Редакция'} date={formatDate(item.publishedAt || item.createdAt)} preview={item.medias.find(media => media.type === 'image')?.url} /></Link>)}</div>
  </div>;
}
