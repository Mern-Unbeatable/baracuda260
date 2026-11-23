import { Check, SquareArrowOutUpRight, X } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  COMPETITION_FILTERS,
  COMPETITION_TYPE_KEYS,
  getCompetitionDetailPath,
} from '@/portals/admin/data/adminCompetitionsData';
import useAdminSubmissionsReview from '@/portals/admin/hooks/useAdminSubmissionsReview';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl } from '@/shared/utils/media';

const SubmissionCard = memo(
  ({ card, onApprove, onReject, isUpdating }) => {
    const { t } = useTranslation();
    const detailPath = getCompetitionDetailPath(
      card.id,
      ROUTES.ADMIN_MY_COMPETITION_DETAIL,
    );

    const typeKey =
      COMPETITION_TYPE_KEYS[card.type] ||
      COMPETITION_TYPE_KEYS[card.kind] ||
      COMPETITION_TYPE_KEYS.single;
    const typeLabel = t(typeKey);
    const titleText = card.title || '';
    const descriptionText = card.story || card.description || '';
    const meta = [card.author, card.country].filter(Boolean).join(' • ');
    const imageSrc = optimizeImageUrl(card.image || card.coverImage || '', 480);

    return (
      <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.25)] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#c5cae9] hover:shadow-[0_10px_24px_rgba(27,39,69,0.08)]">
        <Link
          to={detailPath}
          className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-[#f3f4f6]"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              width={480}
              height={360}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            />
          ) : null}
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold tracking-[0.4px] text-[#4048cd] uppercase">
            {typeLabel}
          </span>
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-[#fff6e9] px-2 py-1 text-[11px] font-bold text-[#bd7b25]">
            <span className="size-1.5 rounded-sm bg-[#bd7b25]" aria-hidden="true" />
            {t('adminOverview.pending.badge', 'Pending')}
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
          <Link to={detailPath} className="transition hover:text-[#ee1c25]">
            <h3 className="line-clamp-1 text-[15px] font-semibold leading-5 text-[#161c27] sm:text-[16px]">
              {titleText}
            </h3>
          </Link>
          {meta ? (
            <p className="truncate text-[12px] leading-4 text-[#8590a1]">{meta}</p>
          ) : null}
          {descriptionText ? (
            <p className="line-clamp-2 text-[12px] leading-4 text-[#494453] sm:text-[13px]">
              {descriptionText}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-end gap-1.5 border-t border-[#f0f1f4] pt-2">
            <Link
              to={detailPath}
              aria-label={t('adminCompetitions.viewDetails')}
              title={t('adminCompetitions.viewDetails')}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#4048cd] transition hover:border-[#4048cd] hover:bg-[#f5f6ff]"
            >
              <SquareArrowOutUpRight size={15} aria-hidden="true" />
            </Link>
            <Button
              unstyled
              type="button"
              disabled={isUpdating}
              aria-label={t('adminSubmissions.actions.approve', {
                title: titleText,
              })}
              title={t('common.approve', 'Approve')}
              onClick={() => onApprove?.(card.id, titleText)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#dcfce7] bg-[#f0fdf4] text-[#16a34a] transition hover:border-[#16a34a] hover:bg-[#16a34a] hover:text-white disabled:opacity-50"
            >
              <Check size={16} aria-hidden="true" strokeWidth={2.5} />
            </Button>
            <Button
              unstyled
              type="button"
              disabled={isUpdating}
              aria-label={t('adminSubmissions.actions.reject', {
                title: titleText,
              })}
              title={t('common.reject', 'Reject')}
              onClick={() => onReject?.(card.id, titleText)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#fde8e9] bg-[#fef2f2] text-[#ee1c25] transition hover:border-[#ee1c25] hover:bg-[#ee1c25] hover:text-white disabled:opacity-50"
            >
              <X size={16} aria-hidden="true" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </article>
    );
  },
);

SubmissionCard.displayName = 'SubmissionCard';

const SubmissionFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminSubmissions.filters.aria')}
      className="flex flex-wrap items-center gap-2"
    >
      {COMPETITION_FILTERS.map((filter) => {
        const selected =
          filter.id === 'all' ? !activeFilter : activeFilter === filter.id;
        return (
          <Button
            unstyled
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onFilterClick(filter.id)}
            className={`rounded-full px-3.5 py-2 text-[12px] font-semibold sm:text-[13px] ${
              selected
                ? 'bg-[#dfe1f5] text-[#171717] ring-1 ring-[#c5cae9]'
                : 'bg-[#ecedfa] text-[#171717] hover:bg-[#e0e2f5]'
            }`}
          >
            {t(filter.labelKey)}
          </Button>
        );
      })}
    </div>
  );
});

SubmissionFilters.displayName = 'SubmissionFilters';

const AdminSubmissionsContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    totalRecords,
    visibleCards,
    isLoading,
    isError,
    error,
    isUpdating,
    refetch,
    handleApprove,
    handleReject,
    handleFilterClick,
    handlePageChange,
  } = useAdminSubmissionsReview();

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-7">
      <header className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <AdminPageHeader title={t('adminSubmissions.title')} />
          <p className="mt-1 text-[13px] text-[#8993a5] sm:text-[14px]">
            {isLoading
              ? t('common.loading', 'Loading...')
              : t('adminSubmissions.pendingCount', {
                  defaultValue: '{{count}} pending',
                  count: totalRecords,
                })}
          </p>
        </div>
        <SubmissionFilters
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
        />
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
          <div className="size-7 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
          <span className="text-[13px] font-medium">
            {t('adminSubmissions.loading', 'Loading submissions...')}
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-[14px] font-medium text-[#ee1c25]">
            {error?.message ||
              t('adminSubmissions.error', 'Failed to load submissions.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#ee1c25] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#d41921]"
          >
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : visibleCards.length > 0 ? (
        <section
          aria-label={t('adminSubmissions.gridAria')}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visibleCards.map((card) => (
            <SubmissionCard
              key={card.id}
              card={card}
              onApprove={handleApprove}
              onReject={handleReject}
              isUpdating={isUpdating}
            />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#6b7280]">
          <p className="text-[14px] font-medium">{t('adminSubmissions.empty')}</p>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="flex justify-center pt-1">
          <AdminPagination
            variant="competitions"
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            navAriaLabel={t('adminSubmissions.pagination.aria')}
            firstLabel={t('adminSubmissions.pagination.first')}
            prevLabel={t('adminSubmissions.pagination.prev')}
            nextLabel={t('adminSubmissions.pagination.next')}
            lastLabel={t('adminSubmissions.pagination.last')}
            pageLabel={(pageNumber) =>
              t('adminSubmissions.pagination.page', { page: pageNumber })
            }
          />
        </div>
      ) : null}
    </div>
  );
});

AdminSubmissionsContent.displayName = 'AdminSubmissionsContent';

export default AdminSubmissionsContent;
