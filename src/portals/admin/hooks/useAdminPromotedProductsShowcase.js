import { useState } from 'react';
import {
  filterPromotedCards,
  PROMOTED_CARDS,
  PROMOTED_TOTAL_PAGES,
} from '@/portals/admin/data/adminPromotedProductsData';

export default function useAdminPromotedProductsShowcase(
  cards = PROMOTED_CARDS,
  totalPages = PROMOTED_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const visibleCards = filterPromotedCards(cards, activeFilter);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
  };

  return {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    handleFilterClick,
    handlePageChange,
  };
}
