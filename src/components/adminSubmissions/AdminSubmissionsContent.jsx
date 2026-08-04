import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  ACTION_ICON_SIZE,
  ADMIN_SUBMISSIONS_ASSETS,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  PAGINATION_ICON_SIZE,
  PAGINATION_LEADING_PAGES,
  SUBMISSION_FILTERS,
  SUBMISSION_TYPE_KEYS,
} from './adminSubmissionsData';
import useAdminSubmissions from './useAdminSubmissions';

/**
 * @param {{
 *   card: {
 *     id: string,
 *     type: string,
 *     titleKey: string,
 *     metaKey: string,
 *     image: string,
 *   },
 *   decision?: 'approved' | 'rejected',
 *   onApprove: (id: string) => void,
 *   onReject: (id: string) => void,
 * }} props
 */
const SubmissionCard = memo(({ card, decision, onApprove, onReject }) => {
  const { t } = useTranslation();

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
      <div className="relative h-[208px] w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-[252px]">
        <img
          src={card.image}
          alt=""
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold leading-[15px] uppercase tracking-[0.5px] text-[#3f51b5]">
          {t(SUBMISSION_TYPE_KEYS[card.type])}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-manrope truncate text-[20px] font-bold leading-5 text-[#111827]">
          {t(card.titleKey)}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="font-manrope min-w-0 truncate text-[16px] leading-4 text-[#6b7280]">
            {t(card.metaKey)}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label={t('adminSubmissions.actions.approve', { title: t(card.titleKey) })}
              aria-pressed={decision === 'approved'}
              onClick={() => onApprove(card.id)}
              className={`inline-flex items-center overflow-hidden rounded-[8px] p-[6px] transition ${
                decision === 'approved'
                  ? 'bg-[#4048cd] ring-2 ring-[#4048cd]/40'
                  : 'bg-[#a7abe8] hover:bg-[#9499e0]'
              }`}
            >
              <img
                src={ADMIN_SUBMISSIONS_ASSETS.check}
                alt=""
                width={ACTION_ICON_SIZE}
                height={ACTION_ICON_SIZE}
                className="size-5"
              />
            </button>
            <button
              type="button"
              aria-label={t('adminSubmissions.actions.reject', { title: t(card.titleKey) })}
              aria-pressed={decision === 'rejected'}
              onClick={() => onReject(card.id)}
              className={`inline-flex items-center overflow-hidden rounded-[8px] p-[6px] transition ${
                decision === 'rejected'
                  ? 'bg-[#ee1c25] ring-2 ring-[#ee1c25]/40'
                  : 'bg-[#f4676d] hover:bg-[#e4555c]'
              }`}
            >
              <img
                src={ADMIN_SUBMISSIONS_ASSETS.reject}
                alt=""
                width={ACTION_ICON_SIZE}
                height={ACTION_ICON_SIZE}
                className="size-5"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

SubmissionCard.displayName = 'SubmissionCard';

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
const SubmissionsPagination = memo(({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav
      aria-label={t('adminSubmissions.pagination.aria')}
      className="flex flex-wrap items-center justify-center gap-[5px]"
    >
      <PaginationControl
        label={t('adminSubmissions.pagination.first')}
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
        label={t('adminSubmissions.pagination.prev')}
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
          label={t('adminSubmissions.pagination.page', { page: pageNumber })}
          active={page === pageNumber}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationControl>
      ))}

      <span
        className="inline-flex size-8 items-center justify-center rounded-[8px] border border-[#f1f1f1] bg-white text-[13px] leading-none text-[#333333]"
        aria-hidden="true"
      >
        …
      </span>

      <PaginationControl
        label={t('adminSubmissions.pagination.page', { page: totalPages })}
        active={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </PaginationControl>

      <PaginationControl
        label={t('adminSubmissions.pagination.next')}
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
        label={t('adminSubmissions.pagination.last')}
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

SubmissionsPagination.displayName = 'SubmissionsPagination';

/**
 * @param {{
 *   activeFilter: string,
 *   onFilterClick: (filterId: string) => void,
 * }} props
 */
const SubmissionFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminSubmissions.filters.aria')}
      className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-4"
    >
      {SUBMISSION_FILTERS.map((filter) => {
        const selected = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onFilterClick(filter.id)}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-4 transition ${
              selected
                ? 'bg-[#4048cd] text-white'
                : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'
            }`}
          >
            {t(filter.labelKey)}
          </button>
        );
      })}
    </div>
  );
});

SubmissionFilters.displayName = 'SubmissionFilters';

/**
 * Admin Submissions (Submission review) — Figma node 339:2677.
 */
const AdminSubmissionsContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    decisions,
    handleFilterClick,
    handlePageChange,
    handleApprove,
    handleReject,
  } = useAdminSubmissions();

  return (
    <div className="flex w-full flex-col">
      <header className="flex flex-col gap-1">
        <p className="text-[14px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]">
          {t('adminSubmissions.eyebrow')}
        </p>
        <h1 className="font-manrope pt-3 text-[36px] font-normal leading-[42px] tracking-[-1.68px] text-[#151e31]">
          {t('adminSubmissions.title')}
        </h1>
        <p className="pt-3 text-[16px] leading-[25px] text-[#687186]">
          {t('adminSubmissions.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-10 py-8">
        <SubmissionFilters activeFilter={activeFilter} onFilterClick={handleFilterClick} />

        <div className="flex flex-col items-center gap-9">
          <section
            aria-label={t('adminSubmissions.gridAria')}
            className="grid w-full grid-cols-1 gap-[17px] sm:grid-cols-2 sm:gap-[19px] xl:grid-cols-3 2xl:grid-cols-4"
          >
            {visibleCards.map((card) => (
              <SubmissionCard
                key={card.id}
                card={card}
                decision={decisions[card.id]}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </section>

          {visibleCards.length === 0 ? (
            <p className="text-center text-[16px] text-[#6b7280]">{t('adminSubmissions.empty')}</p>
          ) : null}

          <SubmissionsPagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
});

AdminSubmissionsContent.displayName = 'AdminSubmissionsContent';

export default AdminSubmissionsContent;
