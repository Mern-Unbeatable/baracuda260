import { useState } from 'react';
import {
  SUBMISSION_CARDS,
  SUBMISSIONS_TOTAL_PAGES,
  filterSubmissionCards,
  selectSubmissionFilter,
} from '@/portals/admin/data/adminSubmissionsData';

/**
 * Filter + pagination + review actions for Admin Submissions.
 */
export default function useAdminSubmissions(
  cards = SUBMISSION_CARDS,
  totalPages = SUBMISSIONS_TOTAL_PAGES,
) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [decisions, setDecisions] = useState({});

  const visibleCards = filterSubmissionCards(cards, activeFilter);

  const handleFilterClick = (filterId) => {
    setActiveFilter((current) => selectSubmissionFilter(current, filterId));
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
  };

  const handleApprove = (cardId) => {
    setDecisions((current) => ({ ...current, [cardId]: 'approved' }));
  };

  const handleReject = (cardId) => {
    setDecisions((current) => ({ ...current, [cardId]: 'rejected' }));
  };

  return {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    decisions,
    handleFilterClick,
    handlePageChange,
    handleApprove,
    handleReject,
  };
}
