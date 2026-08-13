import { useState } from 'react';
import {
  PREMIUM_PHOTOS_CARDS,
  PREMIUM_PHOTOS_TOTAL_PAGES,
  filterPremiumPhotosCards,
} from '@/portals/admin/data/adminPremiumPhotosData';

/**
 * Showcase filter + pagination state for Admin Premium Photos.
 */
export default function useAdminPremiumPhotosShowcase(
  cards = PREMIUM_PHOTOS_CARDS,
  totalPages = PREMIUM_PHOTOS_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const visibleCards = filterPremiumPhotosCards(cards, activeFilter);

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
