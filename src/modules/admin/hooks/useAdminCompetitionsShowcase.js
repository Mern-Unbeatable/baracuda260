import { useState } from 'react';
import {
  COMPETITION_CARDS,
  COMPETITIONS_TOTAL_PAGES,
  filterCompetitionCards,
  toggleCompetitionFilter,
} from '@/modules/admin/data/adminCompetitionsData';

/**
 * Showcase filter + pagination state for Admin Photo Showcase.
 * All filtered cards stay visible (Figma shows the full grid);
 * page state only drives pagination chrome.
 */
export default function useAdminCompetitionsShowcase(
  cards = COMPETITION_CARDS,
  totalPages = COMPETITIONS_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);

  const visibleCards = filterCompetitionCards(cards, activeFilter);

  const handleFilterClick = (filterId) => {
    setActiveFilter((current) => toggleCompetitionFilter(current, filterId));
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
