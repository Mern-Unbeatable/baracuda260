import { useState } from 'react';
import {
  COMPETITION_CARDS,
  COMPETITIONS_PAGE_SIZE,
  COMPETITIONS_TOTAL_PAGES,
  filterCompetitionCards,
  paginateCompetitionCards,
  toggleCompetitionFilter,
} from './adminCompetitionsData';

/**
 * Showcase filter + pagination state for Admin Photo Showcase.
 * Derived lists stay pure; updates happen only via event handlers.
 */
export default function useAdminCompetitionsShowcase(
  cards = COMPETITION_CARDS,
  pageSize = COMPETITIONS_PAGE_SIZE,
  totalPages = COMPETITIONS_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);

  const filteredCards = filterCompetitionCards(cards, activeFilter);
  const visibleCards = paginateCompetitionCards(filteredCards, page, pageSize);

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
    filteredCards,
    visibleCards,
    handleFilterClick,
    handlePageChange,
  };
}
