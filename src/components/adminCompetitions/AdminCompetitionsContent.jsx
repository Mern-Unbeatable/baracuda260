import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { ROUTES } from '../../config';
import {
  ADMIN_COMPETITIONS_ASSETS,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  COMPETITION_FILTERS,
  COMPETITION_TYPE_KEYS,
  getCompetitionDetailPath,
  METRIC_ICON_SIZE,
  PAGINATION_ICON_SIZE,
  PAGINATION_LEADING_PAGES,
} from './adminCompetitionsData';
import useAdminCompetitionsShowcase from './useAdminCompetitionsShowcase';

/** @param {{ icon: string, value: string }} props */
const MetricStat = memo(({ icon, value }) => (
  <span className="inline-flex items-center gap-1 text-[16px] leading-4 text-[#6b7280]">
    <img
      src={icon}
      alt=""
      width={METRIC_ICON_SIZE}
      height={METRIC_ICON_SIZE}
      className="size-6"
    />
    {value}
  </span>
));

MetricStat.displayName = 'MetricStat';

/**
 * @param {{
 *   card: {
 *     id: string,
 *     type: string,
 *     titleKey: string,
 *     metaKey: string,
 *     image: string,
 *     views: string,
 *     likes: string,
 *   },
 * }} props
 */
const ShowcaseCard = memo(({ card }) => {
  const { t } = useTranslation();
  const detailPath = getCompetitionDetailPath(card.id, ROUTES.ADMIN_MY_COMPETITION_DETAIL);

  return (
    <Link
      to={detailPath}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition hover:border-[#d1d5db] hover:shadow-sm"
      aria-label={t(card.titleKey)}
    >
      <article className="flex h-full min-w-0 flex-col">
        <div className="relative h-[208px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-[252px]">
          <img
            src={card.image}
            alt=""
            width={CARD_IMAGE_WIDTH}
            height={CARD_IMAGE_HEIGHT}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold leading-[15px] uppercase tracking-[0.5px] text-[#3f51b5]">
            {t(COMPETITION_TYPE_KEYS[card.type])}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-manrope truncate text-[20px] font-bold leading-5 text-[#111827]">
            {t(card.titleKey)}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <p className="font-manrope min-w-0 truncate text-[16px] leading-4 text-[#6b7280]">
              {t(card.metaKey)}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <MetricStat icon={ADMIN_COMPETITIONS_ASSETS.eye} value={card.views} />
              <MetricStat icon={ADMIN_COMPETITIONS_ASSETS.heart} value={card.likes} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});

ShowcaseCard.displayName = 'ShowcaseCard';

/**
 * @param {{
 *   label: string,
 *   onClick: () => void,
 *   disabled?: boolean,
 *   active?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
const PaginationControl = memo(({ label, onClick, disabled, children, active = false }) => (
  <button
    type="button"
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border p-[10px] text-[13px] font-semibold leading-none transition ${
      active
        ? 'border-[#ee1c25] bg-[#ee1c25] text-white'
        : 'border-[#f1f1f1] bg-white text-[#333333] hover:border-[#e5e7eb] hover:bg-[#f9fafb]'
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    {children}
  </button>
));

PaginationControl.displayName = 'PaginationControl';

/**
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 * }} props
 */
const CompetitionsPagination = memo(({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav
      aria-label={t('adminCompetitions.pagination.aria')}
      className="flex flex-wrap items-center justify-center gap-[5px]"
    >
      <PaginationControl
        label={t('adminCompetitions.pagination.first')}
        disabled={isFirstPage}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>

      <PaginationControl
        label={t('adminCompetitions.pagination.prev')}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>

      {PAGINATION_LEADING_PAGES.map((pageNumber) => (
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
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>

      <PaginationControl
        label={t('adminCompetitions.pagination.last')}
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight
          size={PAGINATION_ICON_SIZE}
          strokeWidth={2}
          aria-hidden="true"
          className="text-[#333333]"
        />
      </PaginationControl>
    </nav>
  );
});

CompetitionsPagination.displayName = 'CompetitionsPagination';

/**
 * @param {{
 *   activeFilter: string | null,
 *   onFilterClick: (filterId: string) => void,
 * }} props
 */
const CompetitionTypeFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
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
            onClick={() => onFilterClick(filter.id)}
            className={`rounded-full px-5 py-2.5 text-[16px] leading-5 transition ${
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
  );
});

CompetitionTypeFilters.displayName = 'CompetitionTypeFilters';

/**
 * @param {{
 *   cards: Array<{ id: string }>,
 * }} props
 */
const ShowcaseGrid = memo(({ cards }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminCompetitions.gridAria')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-[19px] xl:grid-cols-3 2xl:grid-cols-4"
    >
      {cards.map((card) => (
        <ShowcaseCard key={card.id} card={card} />
      ))}
    </section>
  );
});

ShowcaseGrid.displayName = 'ShowcaseGrid';

/**
 * Admin Competitions (Photo Showcase) — Figma node 339:1447.
 * Orchestrates filters, grid, and pagination; domain logic lives in helpers/hook.
 */
const AdminCompetitionsContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    handleFilterClick,
    handlePageChange,
  } = useAdminCompetitionsShowcase();

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="font-manrope text-[48px] font-extrabold leading-none text-[#111827]">
          {t('adminCompetitions.title')}
        </h1>
        <CompetitionTypeFilters
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
        />
      </header>

      <ShowcaseGrid cards={visibleCards} />

      {visibleCards.length === 0 ? (
        <p className="text-center text-[16px] text-[#6b7280]">{t('adminCompetitions.empty')}</p>
      ) : null}

      <div className="flex justify-center pt-2 sm:pt-4">
        <CompetitionsPagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
});

AdminCompetitionsContent.displayName = 'AdminCompetitionsContent';

export default AdminCompetitionsContent;
