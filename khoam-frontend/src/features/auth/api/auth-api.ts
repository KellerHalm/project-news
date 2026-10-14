import { Endpoints } from '@/shared/constants';
import apiClient from '@/shared/core';
import { UserEntity } from '@/shared/model';

export type RegisterPayload = { email: string; name: string; password: string };
export type LoginPayload = Pick<RegisterPayload, 'email' | 'password'>;
export type AuthResponse = { token: string; user: UserEntity };
type ApiResponse<T> = { data: T };

export async function loginUser(payload: LoginPayload) {
  return (await apiClient.post<ApiResponse<AuthResponse>>(Endpoints.AUTH_LOGIN, payload)).data.data;
}

export async function registerUser(payload: RegisterPayload) {
  return (await apiClient.post<ApiResponse<AuthResponse>>(Endpoints.AUTH_REGISTER, payload)).data.data;
}
