import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_COMPETITIONS_ASSETS,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  COMPETITION_FILTERS,
  COMPETITION_TYPE_KEYS,
  getCompetitionDetailPath,
  METRIC_ICON_SIZE,
} from '@/portals/admin/data/adminCompetitionsData';
import useAdminCompetitionsShowcase from '@/portals/admin/hooks/useAdminCompetitionsShowcase';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';
import AdminPagination from '@/portals/admin/components/ui/AdminPagination';

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
        <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-63">
          <img
            src={card.image}
            alt=""
            width={CARD_IMAGE_WIDTH}
            height={CARD_IMAGE_HEIGHT}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold leading-3.75 uppercase tracking-[0.5px] text-[#3f51b5]">
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
      className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6.75"
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
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.75 xl:grid-cols-3 2xl:grid-cols-4"
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
        <AdminPageHeader as="div" title={t('adminCompetitions.title')} />
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
          pageLabel={(pageNumber) => t('adminCompetitions.pagination.page', { page: pageNumber })}
        />
      </div>
    </div>
  );
});

AdminCompetitionsContent.displayName = 'AdminCompetitionsContent';

export default AdminCompetitionsContent;
