import { Calendar, Eye, Heart, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import { formatCompactStatValue } from '@/components/data-display/AdminOverviewStatCard/AdminOverviewStatCard';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  GALLERY_FILTERS,
  GALLERY_TYPE_KEYS,
  getGalleryDetailPath,
} from '@/portals/admin/data/adminGalleryData';
import useAdminGalleryShowcase from '@/portals/admin/hooks/useAdminGalleryShowcase';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl } from '@/shared/utils/media';

const MetricStat = memo(({ icon: Icon, value, tone = 'default' }) => (
  <span
    className={`inline-flex max-w-full items-center gap-0.5 truncate text-[10px] leading-3.5 sm:gap-1 sm:text-[13px] sm:leading-4 ${
      tone === 'accent' ? 'text-[#ee1c25]' : 'text-[#6b7280]'
    }`}
  >
    {Icon ? (
      <Icon size={12} aria-hidden="true" className="shrink-0 sm:size-[14px]" />
    ) : null}
    <span className="truncate">{value}</span>
  </span>
));

MetricStat.displayName = 'MetricStat';

const ShowcaseCard = memo(({ card, onDelete, isDeleting }) => {
  const { t } = useTranslation();
  const detailPath = getGalleryDetailPath(card.id, ROUTES.ADMIN_GALLERY_DETAIL);

  const typeKey =
    GALLERY_TYPE_KEYS[card.type] ||
    GALLERY_TYPE_KEYS[card.kind] ||
    GALLERY_TYPE_KEYS.single;
  const typeLabel = t(typeKey);
  const titleText = card.title || (card.titleKey ? t(card.titleKey) : '');
  const descriptionText =
    card.story ||
    card.description ||
    (card.descriptionKey ? t(card.descriptionKey) : '');
  const dateText = card.formattedDate || (card.dateKey ? t(card.dateKey) : '');
  let shortDateText = dateText;
  if (card.createdAt) {
    try {
      const d = new Date(card.createdAt);
      if (!Number.isNaN(d.getTime())) {
        shortDateText = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      shortDateText = dateText;
    }
  }
  const imageSrc = optimizeImageUrl(card.image || card.coverImage || '', 480);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[rgba(203,195,213,0.25)] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#c5cae9] hover:shadow-[0_10px_24px_rgba(27,39,69,0.08)] sm:rounded-2xl">
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
            sizes="(max-width:640px) 50vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="absolute top-1.5 left-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-white/95 px-1.5 py-0.5 text-[8px] font-bold tracking-[0.3px] text-[#4048cd] uppercase sm:top-2.5 sm:left-2.5 sm:px-2 sm:py-1 sm:text-[10px] sm:tracking-[0.4px]">
          {typeLabel}
        </span>
        {card.extraPhotos ? (
          <span className="absolute right-1.5 bottom-1.5 rounded-full bg-black/65 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:right-2.5 sm:bottom-2.5 sm:px-2 sm:py-1 sm:text-[11px]">
            {t('adminGallery.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4">
        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="line-clamp-1 text-[13px] font-semibold leading-4 text-[#161c27] sm:text-[16px] sm:leading-5">
            {titleText}
          </h3>
        </Link>
        {descriptionText ? (
          <p className="line-clamp-2 text-[11px] leading-3.5 text-[#494453] sm:text-[13px] sm:leading-4">
            {descriptionText}
          </p>
        ) : null}

        <div className="mt-auto border-t border-[#f0f1f4] pt-1.5 sm:hidden">
          <div className="flex items-center gap-1.5">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <MetricStat
                icon={Heart}
                value={formatCompactStatValue(
                  card.likesCount ?? card.likes ?? 0,
                )}
                tone="accent"
              />
              <MetricStat
                icon={Eye}
                value={formatCompactStatValue(
                  card.viewsCount ?? card.views ?? 0,
                )}
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                to={detailPath}
                aria-label={t('adminGallery.viewDetails', 'View details')}
                title={t('adminGallery.viewDetails', 'View details')}
                className="inline-flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#4048cd]"
              >
                <SquareArrowOutUpRight size={13} aria-hidden="true" />
              </Link>
              <Button
                unstyled
                type="button"
                disabled={isDeleting}
                aria-label={t('adminGallery.delete')}
                title={t('adminGallery.delete')}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(card.id);
                }}
                className="inline-flex size-7 items-center justify-center rounded-md border border-[#fde8e9] bg-[#fef2f2] text-[#ee1c25] disabled:opacity-50"
              >
                <Trash2 size={13} aria-hidden="true" />
              </Button>
            </div>
          </div>
          {shortDateText || dateText ? (
            <div className="mt-1.5">
              <MetricStat icon={Calendar} value={shortDateText || dateText} />
            </div>
          ) : null}
        </div>

        <div className="mt-auto hidden items-center gap-2 border-t border-[#f0f1f4] pt-2 sm:flex">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
            <MetricStat
              icon={Heart}
              value={formatCompactStatValue(card.likesCount ?? card.likes ?? 0)}
              tone="accent"
            />
            <MetricStat
              icon={Eye}
              value={formatCompactStatValue(card.viewsCount ?? card.views ?? 0)}
            />
            {dateText ? <MetricStat icon={Calendar} value={dateText} /> : null}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              to={detailPath}
              aria-label={t('adminGallery.viewDetails', 'View details')}
              title={t('adminGallery.viewDetails', 'View details')}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#4048cd] transition hover:border-[#4048cd] hover:bg-[#f5f6ff]"
            >
              <SquareArrowOutUpRight size={15} aria-hidden="true" />
            </Link>
            <Button
              unstyled
              type="button"
              disabled={isDeleting}
              aria-label={t('adminGallery.delete')}
              title={t('adminGallery.delete')}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete?.(card.id);
              }}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#fde8e9] bg-[#fef2f2] text-[#ee1c25] transition hover:border-[#ee1c25] hover:bg-[#ee1c25] hover:text-white disabled:opacity-50"
            >
              <Trash2 size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});

ShowcaseCard.displayName = 'ShowcaseCard';

const GalleryTypeFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminGallery.filters.aria')}
      className="flex w-full max-w-full items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {GALLERY_FILTERS.map((filter) => {
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

GalleryTypeFilters.displayName = 'GalleryTypeFilters';

const ShowcaseGrid = memo(({ cards, onDelete, isDeleting }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminGallery.gridAria')}
      className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <ShowcaseCard
          key={card.id}
          card={card}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </section>
  );
});

ShowcaseGrid.displayName = 'ShowcaseGrid';

const AdminGalleryContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    isLoading,
    isError,
    error,
    isDeleting,
    refetch,
    handleDeleteArtwork,
    handleFilterClick,
    handlePageChange,
  } = useAdminGalleryShowcase();

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-7">
      <header className="flex min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdminPageHeader title={t('adminGallery.title')} />
        <div className="min-w-0 w-full lg:ml-auto lg:w-auto lg:max-w-none">
          <GalleryTypeFilters
            activeFilter={activeFilter}
            onFilterClick={handleFilterClick}
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
          <div className="size-7 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
          <span className="text-[13px] font-medium">
            {t('adminGallery.loading', 'Loading gallery artworks...')}
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-[14px] font-medium text-[#ee1c25]">
            {error?.message ||
              t('adminGallery.error', 'Failed to load gallery artworks.')}
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
        <ShowcaseGrid
          cards={visibleCards}
          onDelete={handleDeleteArtwork}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#6b7280]">
          <p className="text-[14px] font-medium">{t('adminGallery.empty')}</p>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="flex justify-center pt-1">
          <AdminPagination
            variant="competitions"
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            navAriaLabel={t('adminGallery.pagination.aria')}
            firstLabel={t('adminGallery.pagination.first')}
            prevLabel={t('adminGallery.pagination.prev')}
            nextLabel={t('adminGallery.pagination.next')}
            lastLabel={t('adminGallery.pagination.last')}
            pageLabel={(pageNumber) =>
              t('adminGallery.pagination.page', { page: pageNumber })
            }
          />
        </div>
      ) : null}
    </div>
  );
});

AdminGalleryContent.displayName = 'AdminGalleryContent';

export default AdminGalleryContent;
