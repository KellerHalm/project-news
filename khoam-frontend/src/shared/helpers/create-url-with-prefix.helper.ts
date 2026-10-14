/**
 * Генерирует URL с параметрами запроса для фильтрации, включая вложенные значения.
 *
 * @param {string} baseUrl - Базовый URL, к которому будут добавлены параметры запроса.
 * @param {Record<string, T>} [params={}] - Объект с параметрами фильтрации. Поддерживаются вложенные объекты.
 * @returns {string} Сформированный URL с параметрами запроса или базовый URL, если нет валидных параметров.
 */

// {
//   name: 'Досхоев',
//   gender: 'all',
//   birthday: {
//     start: '1450-01-01',
//     stop: '2025-01-10'
//   }
// };
// превратит в prefix[name]=%D0%94%D0%BE%D1%81%D1%85%D0%BE%D0%B5%D0%B2&prefix[birthday][start]=1450-01-01&prefix[birthday][stop]=2025-01-10

export const createUrlWithPrefix = <T>({
  baseUrl,
  params = {},
  prefix = 'props'
}: {
  baseUrl: string;
  params?: Record<string, T>;
  prefix?: string;
}): string => {
  const buildQuery = (
    obj: Record<string, any>,
    parentKey?: string
  ): string[] => {
    return Object.entries(obj).flatMap(([key, value]) => {
      const paramKey = parentKey
        ? `${parentKey}[${key}]`
        : prefix
          ? `${prefix}[${key}]`
          : key;

      if (value === undefined || value === null || value === '') {
        return [];
      }

      if (Array.isArray(value)) {
        return value
          .filter(v => v !== undefined && v !== null && v !== '')
          .map(v => `${paramKey}[]=${encodeURIComponent(v)}`);
      }

      if (typeof value === 'object') {
        return buildQuery(value, paramKey);
      }

      return `${paramKey}=${encodeURIComponent(value)}`;
    });
  };

  const queryString = buildQuery(params).join('&');

  if (!queryString) return baseUrl;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
};
