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
  COMPETITION_FILTERS,
  COMPETITION_TYPE_KEYS,
  getCompetitionDetailPath,
} from '@/portals/admin/data/adminCompetitionsData';
import useAdminCompetitionsShowcase from '@/portals/admin/hooks/useAdminCompetitionsShowcase';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl } from '@/shared/utils/media';

const MetricStat = memo(({ icon: Icon, value, tone = 'default' }) => (
  <span
    className={`inline-flex items-center gap-1 text-[12px] leading-4 sm:text-[13px] ${
      tone === 'accent' ? 'text-[#ee1c25]' : 'text-[#6b7280]'
    }`}
  >
    {Icon ? <Icon size={14} aria-hidden="true" className="shrink-0" /> : null}
    {value}
  </span>
));

MetricStat.displayName = 'MetricStat';

const ShowcaseCard = memo(({ card, onDelete, isDeleting }) => {
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
  const titleText = card.title || (card.titleKey ? t(card.titleKey) : '');
  const descriptionText =
    card.story ||
    card.description ||
    (card.descriptionKey ? t(card.descriptionKey) : '');
  const dateText = card.formattedDate || (card.dateKey ? t(card.dateKey) : '');
  const imageSrc = optimizeImageUrl(
    card.image || card.coverImage || '',
    480,
  );

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
        {card.extraPhotos ? (
          <span className="absolute right-2.5 bottom-2.5 rounded-full bg-black/65 px-2 py-1 text-[11px] font-semibold text-white">
            {t('adminCompetitions.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="line-clamp-1 text-[15px] font-semibold leading-5 text-[#161c27] sm:text-[16px]">
            {titleText}
          </h3>
        </Link>
        {descriptionText ? (
          <p className="line-clamp-2 text-[12px] leading-4 text-[#494453] sm:text-[13px]">
            {descriptionText}
          </p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 border-t border-[#f0f1f4] pt-2">
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
              aria-label={t('adminCompetitions.viewDetails')}
              title={t('adminCompetitions.viewDetails')}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#4048cd] transition hover:border-[#4048cd] hover:bg-[#f5f6ff]"
            >
              <SquareArrowOutUpRight size={15} aria-hidden="true" />
            </Link>
            <Button
              unstyled
              type="button"
              disabled={isDeleting}
              aria-label={t('adminCompetitions.delete')}
              title={t('adminCompetitions.delete')}
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

const CompetitionTypeFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminCompetitions.filters.aria')}
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

CompetitionTypeFilters.displayName = 'CompetitionTypeFilters';

const ShowcaseGrid = memo(({ cards, onDelete, isDeleting }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminCompetitions.gridAria')}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
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

const AdminCompetitionsContent = memo(() => {
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
  } = useAdminCompetitionsShowcase();

  return (
    <div className="flex w-full flex-col gap-5 sm:gap-7">
      <header className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdminPageHeader title={t('adminCompetitions.title')} />
        <CompetitionTypeFilters
          activeFilter={activeFilter}
          onFilterClick={handleFilterClick}
        />
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
          <div className="size-7 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
          <span className="text-[13px] font-medium">
            {t('adminCompetitions.loading', 'Loading artworks...')}
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-[14px] font-medium text-[#ee1c25]">
            {error?.message ||
              t('adminCompetitions.error', 'Failed to load artworks.')}
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
          <p className="text-[14px] font-medium">{t('adminCompetitions.empty')}</p>
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 ? (
        <div className="flex justify-center pt-1">
          <AdminPagination
            variant="competitions"
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            navAriaLabel={t('adminCompetitions.pagination.aria')}
            firstLabel={t('adminCompetitions.pagination.first')}
            prevLabel={t('adminCompetitions.pagination.prev')}
            nextLabel={t('adminCompetitions.pagination.next')}
            lastLabel={t('adminCompetitions.pagination.last')}
            pageLabel={(pageNumber) =>
              t('adminCompetitions.pagination.page', { page: pageNumber })
            }
          />
        </div>
      ) : null}
    </div>
  );
});

AdminCompetitionsContent.displayName = 'AdminCompetitionsContent';

export default AdminCompetitionsContent;
