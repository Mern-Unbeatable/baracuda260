import { useMemo, useState } from 'react';
import {
  PROMO_LINK_DATE_RANGE,
  PROMO_LINKS_PAGE_SIZE,
  computePromoLinkStats,
  createPromoLink,
  filterPromoLinks,
  getPromoLinkById,
  getPromoLinksStore,
  paginatePromoLinks,
  prependPromoLink,
  setPromoLinksStore,
  updatePromoLinkReward,
} from '@/portals/admin/data/adminPromoLinksData';

const INITIAL_FILTERS = {
  status: 'all',
  dateRange: PROMO_LINK_DATE_RANGE.LAST_30,
  requirements: 'all',
  reward: 'all',
};

export default function useAdminPromoLinks(
  initialLinks = getPromoLinksStore(),
  pageSize = PROMO_LINKS_PAGE_SIZE,
) {
  const [links, setLinks] = useState(initialLinks);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [openFilter, setOpenFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);
  const [detailLinkId, setDetailLinkId] = useState(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);

  const filteredLinks = useMemo(() => filterPromoLinks(links, filters), [links, filters]);
  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleLinks = paginatePromoLinks(filteredLinks, safePage, pageSize);
  const detailLink = getPromoLinkById(links, detailLinkId);
  const stats = useMemo(() => computePromoLinkStats(links), [links]);

  const patchFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setOpenFilter(null);
    setOpenActionId(null);
  };

  const handleToggleFilter = (filterKey) => {
    setOpenFilter((current) => (current === filterKey ? null : filterKey));
    setOpenActionId(null);
  };

  const handleCloseFilter = () => setOpenFilter(null);

  const handleToggleAction = (linkId) => {
    setOpenActionId((current) => (current === linkId ? null : linkId));
    setOpenFilter(null);
  };

  const handleCloseAction = () => setOpenActionId(null);

  const handleOpenDetails = (linkId) => {
    setDetailLinkId(linkId);
    setOpenActionId(null);
  };

  const handleCloseDetails = () => setDetailLinkId(null);

  const handleSetReward = (linkId, nextReward) => {
    setLinks((current) => {
      const next = updatePromoLinkReward(current, linkId, nextReward);
      setPromoLinksStore(next);
      return next;
    });
    setOpenActionId(null);
  };

  const handleOpenGenerate = () => {
    setGenerateOpen(true);
    setOpenActionId(null);
    setOpenFilter(null);
  };

  const handleCloseGenerate = () => setGenerateOpen(false);

  const handleConfirmGenerate = () => {
    const nextLink = createPromoLink(links);
    setLinks((current) => {
      const next = prependPromoLink(current, nextLink);
      setPromoLinksStore(next);
      return next;
    });
    setGenerateOpen(false);
    setCreatedLink(nextLink);
    setPage(1);
  };

  const handleCloseCreated = () => setCreatedLink(null);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
    setOpenActionId(null);
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
    setOpenActionId(null);
  };

  const resultsFrom = filteredLinks.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const resultsTo = Math.min(safePage * pageSize, filteredLinks.length);

  return {
    links,
    stats,
    filters,
    openFilter,
    openActionId,
    detailLink,
    generateOpen,
    createdLink,
    visibleLinks,
    page: safePage,
    totalPages,
    resultsFrom,
    resultsTo,
    resultsTotal: filteredLinks.length,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    patchFilter,
    handleToggleFilter,
    handleCloseFilter,
    handleToggleAction,
    handleCloseAction,
    handleOpenDetails,
    handleCloseDetails,
    handleSetReward,
    handleOpenGenerate,
    handleCloseGenerate,
    handleConfirmGenerate,
    handleCloseCreated,
    handlePreviousPage,
    handleNextPage,
  };
}
