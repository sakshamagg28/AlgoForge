export function getPagination(page = 1, limit = 20) {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit
  };
}
