import { useState } from 'react';
import {
  ADMIN_BUSINESS_LINK_ROWS,
  BUSINESS_LINK_PAGE_SIZE,
  getBusinessLinkResultRange,
  paginateBusinessLinkRows,
} from '@/modules/admin/data/adminBusinessLinkData';

/**
 * Pagination for Admin Business Link Photos table.
 */
export default function useAdminBusinessLink(
  initialRows = ADMIN_BUSINESS_LINK_ROWS,
  pageSize = BUSINESS_LINK_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);

  const total = initialRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleRows = paginateBusinessLinkRows(initialRows, safePage, pageSize);
  const range = getBusinessLinkResultRange(safePage, pageSize, total);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  return {
    visibleRows,
    page: safePage,
    totalPages,
    range,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    handlePreviousPage,
    handleNextPage,
  };
}
