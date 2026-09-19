import { useState, useMemo } from 'react';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import {
  MARKETPLACE_PAGE_SIZE,
  MARKETPLACE_PRODUCTS,
  MARKETPLACE_STORES,
  filterMarketplaceProducts,
} from '@/portals/public/marketplace/data/marketplaceData';

export function useMarketplaceFilters() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [promotedOnly, setPromotedOnly] = useState(false);

  const isSearchMode = query.trim().length > 0;

  const filteredProducts = useMemo(
    () => filterMarketplaceProducts(MARKETPLACE_PRODUCTS, { category, query, promotedOnly }),
    [category, query, promotedOnly],
  );

  const filteredStores = useMemo(() => {
    const stores = MARKETPLACE_STORES;
    const filtered = promotedOnly ? stores.filter((s) => s.promoted) : stores;
    return [...filtered].sort((a, b) => Number(Boolean(b.promoted)) - Number(Boolean(a.promoted)));
  }, [promotedOnly]);

  const activeItems = isSearchMode ? filteredProducts : filteredStores;

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    activeItems,
    MARKETPLACE_PAGE_SIZE,
    [isSearchMode, category, query, promotedOnly],
  );

  return {
    query,
    setQuery,
    category,
    setCategory,
    promotedOnly,
    setPromotedOnly,
    isSearchMode,
    activeItems,
    currentPage,
    setPage,
    totalPages,
    pagedItems,
  };
}
