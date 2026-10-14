'use client';

import { usePathname } from 'next/navigation';

/**
 * Проверяет, совпадает ли текущий pathname хотя бы с одним из переданных роутов.
 * Поддерживает динамические сегменты вида `:id` и префиксное совпадение (`/users` → `/users/1`).
 *
 * @example
 * const isProfileSection = useHasSomeRoute(['/profile', '/users/:id']);
 *
 * @param routes Список путей для сравнения с текущим pathname
 * @returns `true`, если текущий путь совпадает с одним из роутов
 */
export const useHasSomeRoute = (routes: string[]): boolean => {
  const pathname = usePathname();

  return routes.some(route => {
    if (route.includes(':')) {
      const pattern = new RegExp(
        '^' + route.replace(/:[^/]+/g, '[^/]+') + '(?:/|$)'
      );
      return pattern.test(pathname);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
};
