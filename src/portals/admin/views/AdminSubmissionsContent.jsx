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

const CARD_IMAGE_SIZES =
  '(max-width:640px) 50vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw';

const SubmissionCard = memo(({ card, onApprove, onReject, isUpdating }) => {
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
    <article className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[rgba(203,195,213,0.25)] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#c5cae9] hover:shadow-[0_10px_24px_rgba(27,39,69,0.08)] sm:rounded-2xl">
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
            sizes={CARD_IMAGE_SIZES}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="absolute top-1.5 left-1.5 max-w-[calc(100%-4.5rem)] truncate rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-bold tracking-[0.3px] text-[#4048cd] uppercase sm:top-2.5 sm:left-2.5 sm:max-w-[calc(100%-5.5rem)] sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-[0.4px]">
          {typeLabel}
        </span>
        <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-[#fff6e9] px-1.5 py-0.5 text-[9px] font-bold text-[#bd7b25] sm:top-2.5 sm:right-2.5 sm:rounded-lg sm:px-2 sm:py-1 sm:text-[11px]">
          <span
            className="size-1.5 rounded-sm bg-[#bd7b25]"
            aria-hidden="true"
          />
          {t('adminOverview.pending.badge', 'Pending')}
        </span>
        {card.extraPhotos ? (
          <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:right-2.5 sm:bottom-2.5 sm:px-2 sm:py-1 sm:text-[11px]">
            {t('adminSubmissions.extraPhotos', {
              defaultValue: '+{{count}} photos',
              count: card.extraPhotos,
            })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="line-clamp-1 text-[13px] font-semibold leading-4 text-[#161c27] sm:text-[16px] sm:leading-5">
            {titleText}
          </h3>
        </Link>
        {meta ? (
          <p className="truncate text-[11px] leading-3.5 text-[#8590a1] sm:text-[12px] sm:leading-4">
            {meta}
          </p>
        ) : null}
        {descriptionText ? (
          <p className="line-clamp-2 text-[11px] leading-3.5 text-[#494453] sm:text-[13px] sm:leading-4">
            {descriptionText}
          </p>
        ) : null}

        {/* Mobile footer */}
        <div className="mt-auto border-t border-[#f0f1f4] pt-1.5 sm:hidden">
          <div className="flex items-center justify-end gap-1">
            <Link
              to={detailPath}
              aria-label={t('adminCompetitions.viewDetails')}
              title={t('adminCompetitions.viewDetails')}
              className="inline-flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#4048cd]"
            >
              <SquareArrowOutUpRight size={13} aria-hidden="true" />
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
              className="inline-flex size-7 items-center justify-center rounded-md border border-[#dcfce7] bg-[#f0fdf4] text-[#16a34a] disabled:opacity-50"
            >
              <Check size={14} aria-hidden="true" strokeWidth={2.5} />
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
              className="inline-flex size-7 items-center justify-center rounded-md border border-[#fde8e9] bg-[#fef2f2] text-[#ee1c25] disabled:opacity-50"
            >
              <X size={14} aria-hidden="true" strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        {/* Desktop footer */}
        <div className="mt-auto hidden items-center justify-end gap-1.5 border-t border-[#f0f1f4] pt-2 sm:flex">
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
});

SubmissionCard.displayName = 'SubmissionCard';

const SubmissionFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminSubmissions.filters.aria')}
      className="flex w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold sm:px-3.5 sm:py-2 sm:text-[13px] ${
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

const ShowcaseGrid = memo(({ cards, onApprove, onReject, isUpdating }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminSubmissions.gridAria')}
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <SubmissionCard
          key={card.id}
          card={card}
          onApprove={onApprove}
          onReject={onReject}
          isUpdating={isUpdating}
        />
      ))}
    </section>
  );
});

ShowcaseGrid.displayName = 'ShowcaseGrid';

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
      <header className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
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
        <div className="min-w-0 w-full lg:ml-auto lg:w-auto lg:max-w-none">
          <SubmissionFilters
            activeFilter={activeFilter}
            onFilterClick={handleFilterClick}
          />
        </div>
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
            className="cursor-pointer rounded-lg bg-[#ee1c25] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#d41921]"
          >
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : visibleCards.length > 0 ? (
        <ShowcaseGrid
          cards={visibleCards}
          onApprove={handleApprove}
          onReject={handleReject}
          isUpdating={isUpdating}
        />
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
