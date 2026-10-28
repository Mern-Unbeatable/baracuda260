import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Heart,
  Megaphone,
  RefreshCw,
} from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import AdminBasicStatCard from '@/components/data-display/AdminBasicStatCard/AdminBasicStatCard';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  getPromotedDetailPath,
  PROMOTED_FILTERS,
  PROMOTED_STAT_CARDS,
  PROMOTED_STATUS_FILTERS,
  PROMOTED_TYPE_KEYS,
} from '@/portals/admin/data/adminPromotedProductsData';
import useAdminPromotedProductsShowcase from '@/portals/admin/hooks/useAdminPromotedProductsShowcase';
import { ROUTES } from '@/shared/config';

const StatCardsStrip = memo(({ summary, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {PROMOTED_STAT_CARDS.map((card) => {
        const Icon =
          card.id === 'totalPromotions'
            ? Megaphone
            : card.id === 'activePromotions'
              ? CheckCircle2
              : card.id === 'expiredPromotions'
                ? Clock
                : DollarSign;

        let displayVal = summary ? summary[card.id] : 0;
        if (card.isCurrency) {
          displayVal = `$${Number(displayVal || 0).toLocaleString()}`;
        } else {
          displayVal = Number(displayVal || 0).toLocaleString();
        }

        return (
          <AdminBasicStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={isLoading ? '...' : displayVal}
            icon={<Icon size={16} />}
            iconBg={card.iconBg}
            borderClass="border-[#f3f4f6]"
            valueClass="text-[#111827] sm:text-[30px]"
            cardClass="px-5 py-4"
          />
        );
      })}
    </div>
  );
});
StatCardsStrip.displayName = 'StatCardsStrip';

const PromotedCard = memo(({ card }) => {
  const { t } = useTranslation();

  const detailPath = getPromotedDetailPath(
    card.id,
    ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL,
  );

  const title = card.titleKey ? t(card.titleKey) : card.title || 'Untitled';
  const category = card.categoryKey
    ? t(card.categoryKey)
    : card.category || 'General';
  const description = card.descriptionKey
    ? t(card.descriptionKey)
    : card.description || '';
  const uploadDate = card.uploadDateKey
    ? t(card.uploadDateKey)
    : card.uploadDate || '';
  const uploadTime = card.uploadTimeKey
    ? t(card.uploadTimeKey)
    : card.uploadTime || '';

  const expiryText = card.expiryKey
    ? t(card.expiryKey)
    : card.isExpired
      ? t('adminPromoted.expired', 'Expired')
      : card.daysRemaining
        ? t('adminPromoted.daysRemaining', { count: card.daysRemaining })
        : card.expiryDate || '';

  const typeLabel = PROMOTED_TYPE_KEYS[card.type]
    ? t(PROMOTED_TYPE_KEYS[card.type])
    : String(card.type || 'PROMOTED').toUpperCase();

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_4px_8px_rgba(27,39,69,0.02)]">
      <Link
        to={detailPath}
        className="group relative block h-52 shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-60"
      >
        <Image
          src={card.image}
          alt={title}
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase leading-3.75 tracking-[0.4px] text-[#3f51b5] sm:text-[11px]">
          {typeLabel}
        </span>
        <span
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold leading-4 text-white ${
            card.isExpired ? 'bg-[#6b7280]' : 'bg-[#ee1c25]'
          }`}
        >
          {card.isExpired
            ? t('adminPromoted.badge.expired', 'Expired')
            : t('adminPromoted.badge.promoted', 'Promoted')}
        </span>
        {card.extraPhotos ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[12px] font-semibold leading-4 text-white">
            {t('adminPromoted.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6b7280] sm:text-[13px]">
          <span className="font-medium text-[#374151]">{category}</span>
          {uploadDate ? (
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5 opacity-60" />
              {t('adminPromoted.uploadedLabel')} {uploadDate}
            </span>
          ) : null}
          {uploadTime ? (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 opacity-60" />
              {uploadTime}
            </span>
          ) : null}
        </div>

        {card.user?.name ? (
          <div className="flex items-center gap-2 pt-0.5">
            {card.user.avatar ? (
              <Image
                src={card.user.avatar}
                alt={card.user.name}
                className="size-5 rounded-full object-cover"
              />
            ) : null}
            <span className="text-[12px] text-[#6b7280]">
              {t('adminPromoted.promotedBy', 'Promoted by')}{' '}
              <strong className="font-semibold text-[#111827]">
                {card.user.name}
              </strong>
            </span>
          </div>
        ) : null}

        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="line-clamp-1 font-manrope text-[16px] font-semibold leading-5 text-[#111827] sm:text-[18px] sm:leading-6">
            {title}
          </h3>
        </Link>
        {description ? (
          <p className="line-clamp-2 font-manrope text-[13px] leading-5 text-[#6b7280] sm:text-[14px]">
            {description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-y-2 border-t border-[#f0f1f4] pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] sm:text-[14px]">
            <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
              <Eye className="size-4 opacity-70" />
              {card.views} {t('adminPromoted.viewsLabel')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#ee1c25]">
              <Heart className="size-4" />
              {card.hearts} {t('adminPromoted.heartLabel')}
            </span>
          </div>
          {expiryText ? (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6b7280] sm:text-[13px]">
              <Calendar className="size-3.5 opacity-70" />
              {expiryText}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
});
PromotedCard.displayName = 'PromotedCard';

const SimpleCard = memo(({ card }) => {
  const { t } = useTranslation();

  const detailPath = getPromotedDetailPath(
    card.id,
    ROUTES.ADMIN_PROMOTED_PRODUCTS_DETAIL,
  );

  const title = card.titleKey ? t(card.titleKey) : card.title || 'Untitled';
  const expiryText = card.expiryKey
    ? t(card.expiryKey)
    : card.isExpired
      ? t('adminPromoted.expired', 'Expired')
      : card.daysRemaining
        ? t('adminPromoted.daysRemaining', { count: card.daysRemaining })
        : card.expiryDate || '';

  const typeLabel = PROMOTED_TYPE_KEYS[card.type]
    ? t(PROMOTED_TYPE_KEYS[card.type])
    : String(card.type || 'PRODUCT').toUpperCase();

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0px_4px_8px_rgba(27,39,69,0.02)]">
      <Link
        to={detailPath}
        className="group relative block h-52 shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-60"
      >
        <Image
          src={card.image}
          alt={title}
          width={CARD_IMAGE_WIDTH}
          height={CARD_IMAGE_HEIGHT}
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase leading-3.75 tracking-[0.4px] text-[#3f51b5] sm:text-[11px]">
          {typeLabel}
        </span>
        <span
          className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-[11px] font-bold leading-4 text-white ${
            card.isExpired ? 'bg-[#6b7280]' : 'bg-[#ee1c25]'
          }`}
        >
          {card.isExpired
            ? t('adminPromoted.badge.expired', 'Expired')
            : t('adminPromoted.badge.promoted', 'Promoted')}
        </span>
        {card.extraPhotos ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[12px] font-semibold leading-4 text-white">
            {t('adminPromoted.extraPhotos', { count: card.extraPhotos })}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <Link to={detailPath} className="transition hover:text-[#ee1c25]">
          <h3 className="line-clamp-1 font-manrope text-[18px] font-semibold leading-6 text-[#111827] sm:text-[20px]">
            {title}
          </h3>
        </Link>

        {card.user?.name ? (
          <div className="flex items-center gap-2">
            {card.user.avatar ? (
              <Image
                src={card.user.avatar}
                alt={card.user.name}
                className="size-5 rounded-full object-cover"
              />
            ) : null}
            <span className="text-[12px] text-[#6b7280]">
              {t('adminPromoted.promotedBy', 'Promoted by')}{' '}
              <strong className="font-semibold text-[#111827]">
                {card.user.name}
              </strong>
            </span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[#ee1c25]">
            <Heart className="size-4" />
            {card.likes}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[#6b7280]">
            <Eye className="size-4 opacity-70" />
            {card.viewsSimple}
          </span>
          {card.uploadDate ? (
            <span className="text-[14px] text-[#6b7280]">{card.uploadDate}</span>
          ) : null}
        </div>

        <p className="mt-auto font-manrope text-[20px] font-bold leading-6 text-[#111827] sm:text-[22px]">
          {card.price}
        </p>
        {expiryText ? (
          <p className="text-[13px] text-[#6b7280] sm:text-[14px]">
            {t('adminPromoted.expiryLabel')}: {expiryText}
          </p>
        ) : null}
      </div>
    </article>
  );
});
SimpleCard.displayName = 'SimpleCard';

const ShowcaseCard = memo(({ card }) => {
  if (card.variant === 'simple') return <SimpleCard card={card} />;
  return <PromotedCard card={card} />;
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
        const selected =
          activeFilter.toLowerCase() === filter.id.toLowerCase();
        const isAll = filter.id.toLowerCase() === 'all';

        return (
          <Button
            unstyled
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onFilterClick(filter.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold leading-5 transition sm:px-5 sm:text-[14px] ${
              selected
                ? isAll
                  ? 'bg-[#4048cd] text-white'
                  : 'bg-[#dfe1f5] text-[#171717] ring-1 ring-[#c5cae9]'
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
PromotedTypeFilters.displayName = 'PromotedTypeFilters';

const PromotedStatusFilters = memo(({ statusFilter, onStatusFilterClick }) => {
  const { t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t('adminPromoted.status.aria')}
      className="flex flex-wrap items-center gap-2"
    >
      {PROMOTED_STATUS_FILTERS.map((filter) => {
        const selected =
          statusFilter.toUpperCase() === filter.id.toUpperCase();

        return (
          <Button
            unstyled
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onStatusFilterClick(filter.id)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-semibold leading-4 transition sm:text-[13px] ${
              selected
                ? 'bg-[#111827] text-white shadow-sm'
                : 'border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f9fafb]'
            }`}
          >
            {t(filter.labelKey)}
          </Button>
        );
      })}
    </div>
  );
});
PromotedStatusFilters.displayName = 'PromotedStatusFilters';

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
    statusFilter,
    page,
    totalPages,
    summary,
    visibleCards,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleFilterClick,
    handleStatusFilterClick,
    handlePageChange,
  } = useAdminPromotedProductsShowcase();

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Top summary stat cards */}
      <StatCardsStrip summary={summary} isLoading={isLoading} />

      {/* Header and filters */}
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <AdminPageHeader title={t('adminPromoted.title')} />
            {isFetching && !isLoading ? (
              <RefreshCw
                size={18}
                className="animate-spin text-[#9ca3af]"
                aria-label="Updating"
              />
            ) : null}
          </div>
          <PromotedTypeFilters
            activeFilter={activeFilter}
            onFilterClick={handleFilterClick}
          />
        </header>

        {/* Secondary status filter */}
        <div className="flex items-center justify-between border-t border-[#f0f1f4] pt-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#9ca3af]">
            {t('adminPromoted.status.aria', 'Filter by status')}
          </span>
          <PromotedStatusFilters
            statusFilter={statusFilter}
            onStatusFilterClick={handleStatusFilterClick}
          />
        </div>
      </div>

      {/* Content states */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-[#687186]">
          <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
          <span className="text-[14px] font-medium">
            {t('adminPromoted.loading', 'Loading promoted items...')}
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-[#6b7280]">
          <p className="text-[15px] font-medium text-[#ee1c25]">
            {error?.message ||
              t('adminPromoted.error', 'Failed to load promoted items.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#d41921]"
          >
            {t('adminPromoted.retry', 'Retry')}
          </Button>
        </div>
      ) : visibleCards.length > 0 ? (
        <ShowcaseGrid cards={visibleCards} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#6b7280]">
          <p className="text-[16px] font-medium">{t('adminPromoted.empty')}</p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 ? (
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
            pageLabel={(pageNumber) =>
              t('adminPromoted.pagination.page', { page: pageNumber })
            }
          />
        </div>
      ) : null}
    </div>
  );
});

AdminPromotedProductsContent.displayName = 'AdminPromotedProductsContent';

export default AdminPromotedProductsContent;
