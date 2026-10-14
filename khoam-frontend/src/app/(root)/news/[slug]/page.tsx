'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNewsBySlug, type News } from '@/shared/services/news-api';
import { Typography } from '@/shared/ui';

export default function NewsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { if (slug) getNewsBySlug(slug).then(setNews).catch(() => setError(true)); }, [slug]);
  if (error) return <Typography variant="h2">Новость не найдена.</Typography>;
  if (!news) return <Typography variant="body1">Загрузка новости...</Typography>;
  const image = news.medias.find(media => media.type === 'image');
  return <article className="flex max-w-[788px] flex-col gap-8"><Typography variant="h2">{news.title}</Typography><div className="flex gap-6 text-(--neutral-70)"><Typography variant="body1">{news.editor?.editorName || news.editor?.name || 'Редакция'}</Typography><Typography variant="body1">{new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(news.publishedAt || news.createdAt))}</Typography></div>{image && <img className="max-h-110 w-full rounded-xl object-cover" src={image.url} alt={news.title} />}<Typography variant="body1" className="whitespace-pre-wrap">{news.excerpt}</Typography></article>;
}
