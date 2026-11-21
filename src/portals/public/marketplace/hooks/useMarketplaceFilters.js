import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import { MARKETPLACE_PAGE_SIZE } from '@/portals/public/marketplace/data/marketplaceData';
import {
  getPublicStoresApi,
  STORE_PUBLIC_STORES_QUERY_KEY,
} from '@/shared/api/store.api';

const isOwnStore = (store, currentUser) => {
  if (!store || !currentUser) return false;
  if (currentUser.id && String(store.id) === String(currentUser.id)) return true;
  const storeUsername = String(store.username || '')
    .replace(/^@/, '')
    .toLowerCase();
  const myUsername = String(currentUser.username || '')
    .replace(/^@/, '')
    .toLowerCase();
  return Boolean(storeUsername && myUsername && storeUsername === myUsername);
};

export function useMarketplaceFilters() {
  const currentUser = useSelector(selectUser);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [promotedOnly, setPromotedOnly] = useState(false);
  const [page, setPage] = useState(1);

  const trimmedQuery = query.trim();
  const isSearchMode = trimmedQuery.length > 0;

  const {
    data: apiResult,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      STORE_PUBLIC_STORES_QUERY_KEY,
      trimmedQuery,
      promotedOnly,
      page,
      MARKETPLACE_PAGE_SIZE,
      currentUser?.id || 'guest',
    ],
    queryFn: () =>
      getPublicStoresApi({
        page,
        limit: MARKETPLACE_PAGE_SIZE,
        search: trimmedQuery || undefined,
        promotedOnly,
      }),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  const stores = useMemo(
    () =>
      (apiResult?.data || []).filter(
        (store) => !isOwnStore(store, currentUser),
      ),
    [apiResult?.data, currentUser],
  );

  const searchProducts = useMemo(() => {
    if (!isSearchMode) return [];
    return stores.flatMap((store) =>
      (store.products || []).map((product) => ({
        ...product,
        store: store.storeName,
        username: store.username,
        promoted: store.promoted || product.promoted,
      })),
    );
  }, [isSearchMode, stores]);

  const activeItems = isSearchMode ? searchProducts : stores;
  const removedOwn = Boolean(
    currentUser &&
      (apiResult?.data || []).some((store) => isOwnStore(store, currentUser)),
  );
  const totalPages = isSearchMode
    ? Math.max(1, Math.ceil(activeItems.length / MARKETPLACE_PAGE_SIZE) || 1)
    : Number(apiResult?.meta?.totalPages || 1);
  const totalRecords = isSearchMode
    ? activeItems.length
    : Math.max(
        0,
        Number(apiResult?.meta?.totalRecords || activeItems.length) -
          (removedOwn ? 1 : 0),
      );

  const pagedItems = useMemo(() => {
    if (!isSearchMode) return stores;
    const start = (page - 1) * MARKETPLACE_PAGE_SIZE;
    return searchProducts.slice(start, start + MARKETPLACE_PAGE_SIZE);
  }, [isSearchMode, stores, searchProducts, page]);

  const setQueryAndReset = (value) => {
    setQuery(value);
    setPage(1);
  };

  const setPromotedOnlyAndReset = (value) => {
    setPromotedOnly(value);
    setPage(1);
  };

  const setCategoryAndReset = (value) => {
    setCategory(value);
    setPage(1);
  };

  return {
    query,
    setQuery: setQueryAndReset,
    category,
    setCategory: setCategoryAndReset,
    promotedOnly,
    setPromotedOnly: setPromotedOnlyAndReset,
    isSearchMode,
    activeItems,
    currentPage: page,
    setPage,
    totalPages,
    totalRecords,
    pagedItems,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
