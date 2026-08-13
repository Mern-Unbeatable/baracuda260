import { useState } from 'react';
import {
  GALLERY_CARDS,
  GALLERY_TOTAL_PAGES,
  filterGalleryCards,
} from '@/portals/admin/data/adminGalleryData';

/**
 * Showcase filter + pagination state for Admin Gallery.
 * All filtered cards stay visible (Figma shows the full grid);
 * page state only drives pagination chrome.
 */
export default function useAdminGalleryShowcase(
  cards = GALLERY_CARDS,
  totalPages = GALLERY_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  const visibleCards = filterGalleryCards(cards, activeFilter);

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
