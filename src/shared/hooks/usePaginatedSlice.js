import { useEffect, useMemo, useState } from 'react';

/** Page state + slice for grid lists (gallery, winners, …). Resets to page 1 when `resetDeps` change. */
export default function usePaginatedSlice(items, pageSize, resetDeps = []) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when filters change
  }, resetDeps);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    currentPage,
    setPage,
    totalPages,
    pagedItems,
  };
}
