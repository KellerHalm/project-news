import { useQueryClient } from '@tanstack/react-query';

/**
 * Хук для инвалидации кэша react-query по ключам запросов.
 *
 * @example
 * const { invalidateQueries } = useInvalidateQueries();
 *
 * await invalidateQueries('posts');
 * await invalidateQueries(['posts', 'users']);
 *
 * @returns Объект с методом `invalidateQueries`
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  /**
   * Делает недействительным кэш для одного ключа или массива ключей.
   *
   * @param queryKeys Строка или массив строк — ключи запросов react-query
   */
  const invalidateQueries = async (queryKeys: string[] | string) => {
    if (Array.isArray(queryKeys)) {
      queryKeys.forEach(async queryKey => {
        await queryClient.invalidateQueries({
          queryKey: [queryKey]
        });
      });
    } else {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys]
      });
    }
  };

  return {
    invalidateQueries
  };
};
