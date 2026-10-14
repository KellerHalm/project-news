/**
 * Генерирует URL с параметрами запроса в плоском виде (без вложенности).
 *
 * @param {string} baseUrl - Базовый URL, к которому будут добавлены параметры запроса.
 * @param {Record<string, any>} [params={}] - Объект с параметрами фильтрации.
 * @returns {string} Сформированный URL с параметрами запроса или базовый URL, если нет валидных параметров.
 */

// {
//   sort: 'createdAt',
//   direction: 'desc',
//   city: ['Магас', 'Назрань']
// }
// превратит в ?sort=createdAt&direction=desc&city=%D0%9C%D0%B0%D0%B3%D0%B0%D1%81&city=%D0%9D%D0%B0%D0%B7%D1%80%D0%B0%D0%BD%D1%8C

export const createFlatUrlParams = (
  baseUrl: string,
  params: Record<string, any> = {}
): string => {
  const queryString = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
    .flatMap(([key, value]) => {
      const encodedKey = encodeURIComponent(key);

      if (Array.isArray(value)) {
        return value
          .filter(item => item !== undefined && item !== null && item !== '')
          .map(item => `${encodedKey}=${encodeURIComponent(item)}`);
      }

      return `${encodedKey}=${encodeURIComponent(value)}`;
    })
    .join('&');

  if (!queryString) return baseUrl;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
};
