'use client';

import * as React from 'react';

import { useUserStore } from '@/app/store/user-store';
import { Endpoints } from '@/shared/constants';
import axios from '@/shared/core';
import { LoginResponse } from '@/shared/model';
import { getAccessToken, saveTokenStorage } from '@/shared/services';
import { errorNotification } from '@/shared/utils';

/**
 * Хук авторизации: загрузка профиля, вход и выход.
 *
 * @example
 * const { loadUser, signIn, signOut } = useAuth();
 *
 * useEffect(() => {
 *   loadUser();
 * }, [loadUser]);
 *
 * @returns Объект с методами `loadUser`, `signIn` и `signOut`
 */
export const useAuth = () => {
  const setUserData = useUserStore(state => state.setUserData);
  const setLoading = useUserStore(state => state.setLoading);
  const logout = useUserStore(state => state.logout);

  /**
   * Загружает профиль текущего пользователя по access-токену.
   * Без токена сбрасывает loading и возвращает `null`.
   * При ошибке показывает уведомление и выполняет logout.
   */
  const loadUser = React.useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const { data } = await axios.get(Endpoints.AUTH_PROFILE);

      setUserData(data);
      return data;
    } catch (error) {
      errorNotification(error);
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout, setUserData, setLoading]);

  /**
   * Сохраняет токен и данные пользователя после успешного логина.
   *
   * @param payload Ответ логина с токеном и пользователем
   */
  const signIn = async (payload: LoginResponse) => {
    saveTokenStorage(payload.token);
    setUserData(payload.user);
  };

  /**
   * Выход из аккаунта: очищает данные пользователя в сторе.
   */
  const signOut = React.useCallback(() => {
    logout();
  }, [logout]);

  return {
    loadUser,
    signIn,
    signOut
  };
};
