import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, Calendar, Clock } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  PROMOTED_FILTERS,
  PROMOTED_TYPE_KEYS,
  getPromotedDetailPath,
} from '@/portals/admin/data/adminPromotedProductsData';
import useAdminPromotedProductsShowcase from '@/portals/admin/hooks/useAdminPromotedProductsShowcase';
import AdminPagination from '@/portals/admin/components/ui/AdminPagination';

const PromotedCard = memo(({ card }) => {
  const { t } = useTranslation();
  const detailPath = getPromotedDetailPath(card.id, ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL);

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
          {t(PROMOTED_TYPE_KEYS[card.type])}
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-[#ee1c25] px-3 py-1 text-[11px] font-bold leading-4 text-white">
          {t('adminPromoted.badge.promoted')}
        </span>
        {card.extraPhotos ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[12px] font-semibold leading-4 text-white">
            {t('adminPromoted.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6b7280] sm:text-[13px]">
          <span>{t(card.categoryKey)}</span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5 opacity-60" />
            {t('adminPromoted.uploadedLabel')} {t(card.uploadDateKey)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5 opacity-60" />
            {t(card.uploadTimeKey)}
          </span>
        </div>

        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="font-manrope text-[16px] font-semibold leading-5 text-[#111827] sm:text-[18px] sm:leading-6">
            {t(card.titleKey)}
          </h3>
        </Link>
        <p className="line-clamp-2 font-manrope text-[13px] leading-5 text-[#6b7280] sm:text-[14px]">
          {t(card.descriptionKey)}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0f1f4] pt-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6b7280] sm:text-[14px]">
            <Eye className="size-4 opacity-70" />
            {card.views} {t('adminPromoted.viewsLabel')}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#ee1c25] sm:text-[14px]">
            <Heart className="size-4" />
            {card.hearts} {t('adminPromoted.heartLabel')}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6b7280] sm:text-[14px]">
            <Calendar className="size-4 opacity-70" />
            {t('adminPromoted.expiryLabel')} {t(card.expiryKey)}
          </span>
        </div>
      </div>
    </article>
  );
});
PromotedCard.displayName = 'PromotedCard';

const SimpleCard = memo(({ card }) => {
  const { t } = useTranslation();
  const detailPath = getPromotedDetailPath(card.id, ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL);

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
          {t(PROMOTED_TYPE_KEYS[card.type])}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="font-manrope text-[18px] font-semibold leading-6 text-[#111827] sm:text-[20px]">
            {t(card.titleKey)}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[#ee1c25]">
            <Heart className="size-4" />
            {card.likes}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[#6b7280]">
            <Eye className="size-4 opacity-70" />
            {card.viewsSimple}
          </span>
          <span className="text-[14px] text-[#6b7280]">{t(card.dateKey)}</span>
        </div>

        <p className="font-manrope text-[20px] font-bold leading-6 text-[#111827] sm:text-[22px]">
          {card.price}
        </p>
        <p className="text-[13px] text-[#6b7280] sm:text-[14px]">
          {t('adminPromoted.expiryLabel')} {t(card.expiryKey)}
        </p>
      </div>
    </article>
  );
});
SimpleCard.displayName = 'SimpleCard';

const ShowcaseCard = memo(({ card }) => {
  if (card.variant === 'promoted') return <PromotedCard card={card} />;
  return <SimpleCard card={card} />;
});
ShowcaseCard.displayName = 'ShowcaseCard';

const PromotedTypeFilters = memo(({ activeFilter, onFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminPromoted.filters.aria')}
      className="flex flex-wrap items-center gap-2 sm:gap-3"
    >
      {PROMOTED_FILTERS.map((filter) => {
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
PromotedTypeFilters.displayName = 'PromotedTypeFilters';

const ShowcaseGrid = memo(({ cards }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t('adminPromoted.gridAria')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {cards.map((card) => (
        <ShowcaseCard key={card.id} card={card} />
      ))}
    </section>
  );
});
ShowcaseGrid.displayName = 'ShowcaseGrid';

const AdminPromotedProductsContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeFilter,
    page,
    totalPages,
    visibleCards,
    handleFilterClick,
    handlePageChange,
  } = useAdminPromotedProductsShowcase();

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="font-manrope text-[28px] font-semibold leading-8 tracking-[-0.5px] text-[#111827] sm:text-[32px] sm:leading-9">
          {t('adminPromoted.title')}
        </h1>
        <PromotedTypeFilters activeFilter={activeFilter} onFilterClick={handleFilterClick} />
      </header>

      <ShowcaseGrid cards={visibleCards} />

      {visibleCards.length === 0 ? (
        <p className="text-center text-[16px] text-[#6b7280]">{t('adminPromoted.empty')}</p>
      ) : null}

      <div className="flex justify-center pt-2 sm:pt-4">
        <AdminPagination
          variant="competitions"
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          navAriaLabel={t('adminPromoted.pagination.aria')}
          firstLabel={t('adminPromoted.pagination.first')}
          prevLabel={t('adminPromoted.pagination.prev')}
          nextLabel={t('adminPromoted.pagination.next')}
          lastLabel={t('adminPromoted.pagination.last')}
          pageLabel={(pageNumber) => t('adminPromoted.pagination.page', { page: pageNumber })}
        />
      </div>
    </div>
  );
});

AdminPromotedProductsContent.displayName = 'AdminPromotedProductsContent';

export default AdminPromotedProductsContent;
