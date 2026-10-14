import { Endpoints } from '@/shared/constants';
import apiClient from '@/shared/core';

export type Category = { _id: string; name: string; slug: string };
export type News = { _id: string; title: string; slug: string; excerpt: string; medias: { type: 'image' | 'video'; url: string }[]; category: Category; editor?: { name: string; editorName?: string }; status: 'draft' | 'published'; publishedAt?: string; createdAt: string };
type ApiResponse<T> = { data: T };
export const getNews = async () => (await apiClient.get<ApiResponse<News[]>>(Endpoints.NEWS)).data.data;
export const getNewsBySlug = async (slug: string) => (await apiClient.get<ApiResponse<News>>(`${Endpoints.NEWS}/${slug}`)).data.data;
export const getCategories = async () => (await apiClient.get<ApiResponse<Category[]>>(Endpoints.CATEGORIES)).data.data;
export const getMyNews = async () => (await apiClient.get<ApiResponse<News[]>>(`${Endpoints.NEWS}/my`)).data.data;
export const getSavedNews = async () => (await apiClient.get<ApiResponse<News[]>>(`${Endpoints.NEWS}/saved`)).data.data;
export async function createNews(payload: { title: string; excerpt: string; category: string; medias: News['medias'] }) { return (await apiClient.post<ApiResponse<News>>(Endpoints.NEWS, payload)).data.data; }
export async function publishNews(id: string) { return (await apiClient.patch<ApiResponse<News>>(`${Endpoints.NEWS}/${id}/publish`)).data.data; }
