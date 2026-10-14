import { QueryClient } from '@tanstack/react-query';

import { errorNotification } from '../utils';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время жизни данных в кеше
      staleTime: 5 * 60 * 1000,
      // Максимальное время хранения данных в кеше
      gcTime: 30 * 60 * 1000,
      throwOnError(error) {
        errorNotification(error);
        return false;
      }
    }
  }
});
