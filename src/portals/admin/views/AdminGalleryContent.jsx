import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_GALLERY_ASSETS,
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  GALLERY_FILTERS,
  GALLERY_TYPE_KEYS,
  getGalleryDetailPath,
  METRIC_ICON_SIZE,
} from '@/portals/admin/data/adminGalleryData';
import useAdminGalleryShowcase from '@/portals/admin/hooks/useAdminGalleryShowcase';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';

/** @param {{ icon: string, value: string, tone?: 'default' | 'accent' }} props */
const MetricStat = memo(({ icon, value, tone = 'default' }) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[14px] leading-4 sm:text-[15px] ${
      tone === 'accent' ? 'text-[#ee1c25]' : 'text-[#6b7280]'
    }`}
  >
    <img
      src={icon}
      alt=""
      width={METRIC_ICON_SIZE}
      height={METRIC_ICON_SIZE}
      className={tone === 'accent' ? 'size-5' : 'size-5 opacity-80'}
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
 *     descriptionKey: string,
 *     image: string,
 *     views: string,
 *     likes: string,
 *     dateKey: string,
 *     extraPhotos: number | null,
 *   },
 * }} props
 */
const ShowcaseCard = memo(({ card }) => {
  const { t } = useTranslation();
  const detailPath = getGalleryDetailPath(card.id, ROUTES.ADMIN_GALLERY_DETAIL);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_4px_8px_rgba(27,39,69,0.02)]">
      <Link to={detailPath} className="group relative block h-52 shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-60">
        <img
          src={card.image}
          alt=""
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase leading-3.75 tracking-[0.4px] text-[#3f51b5] sm:text-[11px]">
          {t(GALLERY_TYPE_KEYS[card.type])}
        </span>
        {card.extraPhotos ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[12px] font-semibold leading-4 text-white">
            {t('adminGallery.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-col gap-2">
          <Link to={detailPath} className="transition hover:text-[#ee1c25]">
            <h3 className="font-manrope text-[18px] font-semibold leading-6 text-[#111827] sm:text-[20px]">
              {t(card.titleKey)}
            </h3>
          </Link>
          <p className="line-clamp-2 font-manrope text-[14px] leading-5 text-[#6b7280] sm:text-[15px]">
            {t(card.descriptionKey)}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0f1f4] pt-3">
          <MetricStat icon={ADMIN_GALLERY_ASSETS.heart} value={card.likes} tone="accent" />
          <MetricStat icon={ADMIN_GALLERY_ASSETS.eye} value={card.views} />
          <MetricStat icon={ADMIN_GALLERY_ASSETS.calendar} value={t(card.dateKey)} />
        </div>

        <button
          type="button"
          className="w-full rounded-xl bg-[#ee1c25] px-4 py-3 text-[14px] font-bold leading-5 text-white transition hover:bg-[#d41921] sm:text-[15px]"
        >
          {t('adminGallery.delete')}
        </button>
      </div>
    </article>
  );
});

ShowcaseCard.displayName = 'ShowcaseCard';

/**
 * @param {{
 *   activeFilter: string,
 *   onFilterClick: (filterId: string) => void,
 * }} props
 */
const GalleryTypeFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminGallery.filters.aria')}
      className="flex flex-wrap items-center gap-2 sm:gap-3"
    >
      {GALLERY_FILTERS.map((filter) => {
        const selected = activeFilter === filter.id;
        const isAll = filter.id === 'all';

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onFilterClick(filter.id)}
            className={`rounded-full px-4 py-2.5 text-[14px] font-semibold leading-5 transition sm:px-5 sm:text-[15px] ${
              selected
                ? isAll
                  ? 'bg-[#4048cd] text-white'
                  : 'bg-[#dfe1f5] text-[#171717] ring-1 ring-[#c5cae9]'
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

GalleryTypeFilters.displayName = 'GalleryTypeFilters';

/**
 * @param {{
 *   cards: Array<{ id: string }>,
 * }} props
 */
const ShowcaseGrid = memo(({ cards }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminGallery.gridAria')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {cards.map((card) => (
        <ShowcaseCard key={card.id} card={card} />
      ))}
    </section>
  );
});

ShowcaseGrid.displayName = 'ShowcaseGrid';

/**
 * Admin Gallery — Figma gallery list.
 */
const AdminGalleryContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    handleFilterClick,
    handlePageChange,
  } = useAdminGalleryShowcase();

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="font-manrope text-[28px] font-semibold leading-8 tracking-[-0.5px] text-[#111827] sm:text-[32px] sm:leading-9">
          {t('adminGallery.title')}
        </h1>
        <GalleryTypeFilters activeFilter={activeFilter} onFilterClick={handleFilterClick} />
      </header>

      <ShowcaseGrid cards={visibleCards} />

      {visibleCards.length === 0 ? (
        <p className="text-center text-[16px] text-[#6b7280]">{t('adminGallery.empty')}</p>
      ) : null}

      <div className="flex justify-center pt-2 sm:pt-4">
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
          pageLabel={(pageNumber) => t('adminGallery.pagination.page', { page: pageNumber })}
        />
      </div>
    </div>
  );
});

AdminGalleryContent.displayName = 'AdminGalleryContent';

export default AdminGalleryContent;
