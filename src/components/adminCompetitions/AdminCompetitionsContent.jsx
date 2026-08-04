import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  ADMIN_COMPETITIONS_ASSETS,
  COMPETITION_CARDS,
  COMPETITION_FILTERS,
  COMPETITION_TYPE_KEYS,
  COMPETITIONS_PAGE_SIZE,
  COMPETITIONS_TOTAL_PAGES,
} from './adminCompetitionsData';

const ShowcaseCard = memo(({ card }) => {
  const { t } = useTranslation();

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-[220px] lg:h-[252px]">
        <img
          src={card.image}
          alt=""
          width={370}
          height={252}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#3f51b5]">
          {t(COMPETITION_TYPE_KEYS[card.type])}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="truncate text-[18px] font-bold leading-5 text-[#111827] sm:text-[20px]">
          {t(card.titleKey)}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="min-w-0 truncate text-[14px] leading-4 text-[#6b7280] sm:text-[16px]">
            {t(card.metaKey)}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[14px] leading-4 text-[#6b7280] sm:text-[16px]">
              <img
                src={ADMIN_COMPETITIONS_ASSETS.eye}
                alt=""
                width={24}
                height={24}
                className="size-5 sm:size-6"
              />
              {card.views}
            </span>
            <span className="inline-flex items-center gap-1 text-[14px] leading-4 text-[#6b7280] sm:text-[16px]">
              <img
                src={ADMIN_COMPETITIONS_ASSETS.heart}
                alt=""
                width={24}
                height={24}
                className="size-5 sm:size-6"
              />
              {card.likes}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
});

ShowcaseCard.displayName = 'ShowcaseCard';

const PaginationControl = memo(({ label, onClick, disabled, children, active = false }) => (
  <button
    type="button"
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border p-[10px] text-[14px] font-medium leading-none transition ${
      active
        ? 'border-[#ee1c25] bg-[#ee1c25] text-white'
        : 'border-[#f1f1f1] bg-white text-[#111827] hover:border-[#e5e7eb] hover:bg-[#f9fafb]'
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    {children}
  </button>
));

PaginationControl.displayName = 'PaginationControl';

const CompetitionsPagination = memo(({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const pages = [1, 2, 3];

  return (
    <nav
      aria-label={t('adminCompetitions.pagination.aria')}
      className="flex flex-wrap items-center justify-center gap-[5px]"
    >
      <PaginationControl
        label={t('adminCompetitions.pagination.first')}
        disabled={page <= 1}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft size={16} strokeWidth={2} aria-hidden="true" className="text-[#333333]" />
      </PaginationControl>

      <PaginationControl
        label={t('adminCompetitions.pagination.prev')}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" className="text-[#333333]" />
      </PaginationControl>

      {pages.map((pageNumber) => (
        <PaginationControl
          key={pageNumber}
          label={t('adminCompetitions.pagination.page', { page: pageNumber })}
          active={page === pageNumber}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationControl>
      ))}

      <span
        className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[#f1f1f1] bg-white text-[14px] leading-none text-[#6b7280]"
        aria-hidden="true"
      >
        …
      </span>

      <PaginationControl
        label={t('adminCompetitions.pagination.page', { page: totalPages })}
        active={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </PaginationControl>

      <PaginationControl
        label={t('adminCompetitions.pagination.next')}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={16} strokeWidth={2} aria-hidden="true" className="text-[#333333]" />
      </PaginationControl>

      <PaginationControl
        label={t('adminCompetitions.pagination.last')}
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight size={16} strokeWidth={2} aria-hidden="true" className="text-[#333333]" />
      </PaginationControl>
    </nav>
  );
});

CompetitionsPagination.displayName = 'CompetitionsPagination';

/**
 * Admin Competitions (Photo Showcase) — Figma node 339:1447.
 */
const AdminCompetitionsContent = memo(() => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);

  const filteredCards = activeFilter
    ? COMPETITION_CARDS.filter((card) => card.type === activeFilter)
    : COMPETITION_CARDS;

  const visibleCards = filteredCards.slice(0, COMPETITIONS_PAGE_SIZE);

  const handleFilterClick = (filterId) => {
    setActiveFilter((current) => (current === filterId ? null : filterId));
    setPage(1);
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-[32px] font-extrabold leading-tight text-[#111827] sm:text-[40px] lg:text-[48px]">
          {t('adminCompetitions.title')}
        </h1>

        <div
          role="group"
          aria-label={t('adminCompetitions.filters.aria')}
          className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-[27px]"
        >
          {COMPETITION_FILTERS.map((filter) => {
            const selected = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={selected}
                onClick={() => handleFilterClick(filter.id)}
                className={`rounded-full px-4 py-2.5 text-[14px] leading-5 transition sm:px-5 sm:text-[16px] ${
                  selected
                    ? 'bg-[#ee1c25] text-white'
                    : 'bg-[#ecedfa] text-[#171717] hover:bg-[#e0e2f5]'
                }`}
              >
                {t(filter.labelKey)}
              </button>
            );
          })}
        </div>
      </header>

      <section
        aria-label={t('adminCompetitions.gridAria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[19px] xl:grid-cols-3 2xl:grid-cols-4"
      >
        {visibleCards.map((card) => (
          <ShowcaseCard key={card.id} card={card} />
        ))}
      </section>

      {visibleCards.length === 0 ? (
        <p className="text-center text-[16px] text-[#6b7280]">{t('adminCompetitions.empty')}</p>
      ) : null}

      <div className="flex justify-center pt-2 sm:pt-4">
        <CompetitionsPagination
          page={page}
          totalPages={COMPETITIONS_TOTAL_PAGES}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
});

AdminCompetitionsContent.displayName = 'AdminCompetitionsContent';

export default AdminCompetitionsContent;
