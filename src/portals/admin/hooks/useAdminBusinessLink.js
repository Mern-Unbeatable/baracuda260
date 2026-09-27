import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUSINESS_LINK_PAGE_SIZE } from '@/portals/admin/data/adminBusinessLinkData';
import {
  ADMIN_BUSINESS_LINKS_QUERY_KEY,
  getAdminBusinessLinksApi,
} from '@/shared/api/businessLinks.api';
import { getApiErrorMessage } from '@/shared/api/client';

/**
 * Server-paginated Admin Business Link Photos table.
 */
export default function useAdminBusinessLink(
  pageSize = BUSINESS_LINK_PAGE_SIZE,
) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const listQuery = useQuery({
    queryKey: [...ADMIN_BUSINESS_LINKS_QUERY_KEY, 'list', page, pageSize],
    queryFn: () => getAdminBusinessLinksApi({ page, limit: pageSize }),
    placeholderData: keepPreviousData,
  });

  const rows = listQuery.data?.items ?? [];
  const meta = listQuery.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  useEffect(() => {
    if (meta && page > totalPages) setPage(totalPages);
  }, [meta, page, totalPages]);

  const goToPage = (nextPage) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(from + rows.length - 1, total);

  return {
    rows,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    isFetching: listQuery.isFetching,
    loadErrorMessage: getApiErrorMessage(
      listQuery.error,
      t('adminBusinessLink.loadError'),
    ),
    refetch: listQuery.refetch,
    range: { from, to, total },
    isFirstPage: page <= 1,
    isLastPage: page >= totalPages,
    handlePreviousPage: () => goToPage(page - 1),
    handleNextPage: () => goToPage(page + 1),
  };
}
