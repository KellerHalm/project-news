export function getPagination(pageValue: unknown, limitValue: unknown) {
  const rawPage = Number(pageValue);
  const rawLimit = Number(limitValue);

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const requestedLimit = Number.isFinite(rawLimit) && rawLimit >= 1 ? Math.floor(rawLimit) : 12;
  const limit = Math.min(requestedLimit, 50);

  return { page, limit, skip: (page - 1) * limit };
}
