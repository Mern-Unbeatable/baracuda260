import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';
import { MARKETPLACE_PAGE_SIZE } from '@/portals/public/marketplace/data/marketplaceData';
import {
  getPublicStoresApi,
  STORE_PUBLIC_STORES_QUERY_KEY,
} from '@/shared/api/store.api';

const SEARCH_DEBOUNCE_MS = 300;

export const isOwnStore = (store, currentUser) => {
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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [promotedOnly, setPromotedOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, promotedOnly]);

  const isSearchMode = debouncedQuery.length > 0;

  const {
    data: apiResult,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      STORE_PUBLIC_STORES_QUERY_KEY,
      debouncedQuery,
      promotedOnly,
      page,
      MARKETPLACE_PAGE_SIZE,
    ],
    queryFn: () =>
      getPublicStoresApi({
        page,
        limit: MARKETPLACE_PAGE_SIZE,
        search: debouncedQuery || undefined,
        promotedOnly,
      }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  // Keep own store visible so searching your name still finds you.
  const stores = useMemo(() => {
    const list = apiResult?.data || [];
    return list.map((store) => ({
      ...store,
      isOwn: isOwnStore(store, currentUser),
    }));
  }, [apiResult?.data, currentUser]);

  const searchProducts = useMemo(() => {
    if (!isSearchMode) return [];
    return stores.flatMap((store) =>
      (store.products || []).map((product) => ({
        ...product,
        store: store.storeName,
        username: store.username,
        promoted: store.promoted || product.promoted,
        isOwn: store.isOwn,
      })),
    );
  }, [isSearchMode, stores]);

  const activeItems = isSearchMode ? searchProducts : stores;
  const totalPages = isSearchMode
    ? Math.max(1, Math.ceil(activeItems.length / MARKETPLACE_PAGE_SIZE) || 1)
    : Number(apiResult?.meta?.totalPages || 1);
  const totalRecords = isSearchMode
    ? activeItems.length
    : Number(apiResult?.meta?.totalRecords || activeItems.length);

  const pagedItems = useMemo(() => {
    if (!isSearchMode) return stores;
    const start = (page - 1) * MARKETPLACE_PAGE_SIZE;
    return searchProducts.slice(start, start + MARKETPLACE_PAGE_SIZE);
  }, [isSearchMode, stores, searchProducts, page]);

  const setQueryValue = useCallback((value) => {
    setQuery(value);
  }, []);

  const setPromotedOnlyValue = useCallback((value) => {
    setPromotedOnly(value);
  }, []);

  const setCategoryValue = useCallback((value) => {
    setCategory(value);
  }, []);

  return {
    query,
    setQuery: setQueryValue,
    category,
    setCategory: setCategoryValue,
    promotedOnly,
    setPromotedOnly: setPromotedOnlyValue,
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
