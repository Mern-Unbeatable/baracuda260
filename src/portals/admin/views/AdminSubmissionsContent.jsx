import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ACTION_ICON_SIZE,
  ADMIN_SUBMISSIONS_ASSETS,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  SUBMISSION_FILTERS,
  SUBMISSION_TYPE_KEYS,
} from '@/portals/admin/data/adminSubmissionsData';
import useAdminSubmissions from '@/portals/admin/hooks/useAdminSubmissions';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';
import AdminPagination from '@/portals/admin/components/ui/AdminPagination';

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
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-63">
        <img
          src={card.image}
          alt=""
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold leading-3.75 uppercase tracking-[0.5px] text-[#3f51b5]">
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
              className={`inline-flex cursor-pointer items-center overflow-hidden rounded-lg p-1.5 transition ${
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
              className={`inline-flex cursor-pointer items-center overflow-hidden rounded-lg p-1.5 transition ${
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
            className={`cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold leading-4 transition ${
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
      <AdminPageHeader
        eyebrow={t('adminSubmissions.eyebrow')}
        title={t('adminSubmissions.title')}
        description={t('adminSubmissions.subtitle')}
      />

      <div className="flex flex-col gap-10 py-8">
        <SubmissionFilters activeFilter={activeFilter} onFilterClick={handleFilterClick} />

        <div className="flex flex-col items-center gap-9">
          <section
            aria-label={t('adminSubmissions.gridAria')}
            className="grid w-full grid-cols-1 gap-4.25 sm:grid-cols-2 sm:gap-4.75 xl:grid-cols-3 2xl:grid-cols-4"
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

          <AdminPagination
            variant="submissions"
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            navAriaLabel={t('adminSubmissions.pagination.aria')}
            firstLabel={t('adminSubmissions.pagination.first')}
            prevLabel={t('adminSubmissions.pagination.prev')}
            nextLabel={t('adminSubmissions.pagination.next')}
            lastLabel={t('adminSubmissions.pagination.last')}
            pageLabel={(pageNumber) => t('adminSubmissions.pagination.page', { page: pageNumber })}
          />
        </div>
      </div>
    </div>
  );
});

AdminSubmissionsContent.displayName = 'AdminSubmissionsContent';

export default AdminSubmissionsContent;
