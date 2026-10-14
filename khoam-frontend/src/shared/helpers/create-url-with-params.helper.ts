/**
 * Заменяет динамические части заданного пути соответствующими значениями из объекта params.
 *
 * @param {string} path - Путь к роуту (с параметрами или без)
 * @param {Params} params - Параметры, которые должны быть заменены в пути
 * @return {string} - Возвращает замененный путь с параметрами
 */

// /users/:id/posts превратит в /users/1/posts

export function createUrlWithParams(
  path: string,
  params: Record<string, any> = {}
): string {
  const paramsRegExp = /:(\w+)/g;
  const paramsReplacer = (_: unknown, capture: string): string =>
    String(params[capture]);

  return path.replace(paramsRegExp, paramsReplacer);
}
