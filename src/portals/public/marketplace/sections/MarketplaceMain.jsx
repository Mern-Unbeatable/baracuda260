import React, { memo, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Pagination from '@/components/common/Pagination/Pagination';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Image from '@/components/ui/Image';
import { MARKETPLACE_PAGE_SIZE } from '@/portals/public/marketplace/data/marketplaceData';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';

const photographerStorePath = (username) => {
  const base = username
    ? `/photographer/${encodeURIComponent(String(username).replace(/^@/, ''))}`
    : ROUTES.PHOTOGRAPHER_PROFILE;
  return `${base}?tab=store`;
};

const MarketplaceProductCard = memo(({ product }) => {
  const { t } = useTranslation();
  const href = photographerStorePath(product.username);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-4/3 overflow-hidden bg-[#f3f4f6]">
        <Image
          src={product.image}
          alt={product.title}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#111827]/85 px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white">
          {t(product.badgeKey, product.category || 'Product')}
        </span>
        {product.promoted ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
            {t('marketplace.promoted')}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div>
          <Link to={href}>
            <h3 className="line-clamp-2 cursor-pointer text-[14px] font-bold leading-5 text-[#111827] transition hover:text-[#4048cd] hover:underline">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-4 text-[#6b7280]">
            {product.description}
          </p>
          <p className="mt-2 text-[12px] font-medium text-[#8b95a5]">
            {t('marketplace.soldBy', { store: product.store })}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <p className="text-[16px] font-bold text-[#111827]">
            {product.price}
          </p>
          <div className="flex items-center gap-1.5">
            <Link to={href}>
              <Button variant="outline" className="h-8 px-2.5 text-[12px]">
                {t('marketplace.viewProduct')}
              </Button>
            </Link>
            <Button
              onClick={() =>
                toast.success(
                  t('marketplace.buyStarted', { title: product.title }),
                )
              }
              className="h-8 px-2.5 text-[12px]"
            >
              {t('marketplace.buyNow')}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
MarketplaceProductCard.displayName = 'MarketplaceProductCard';

const CameraIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 7C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7H16.83L15 4H9L7.17 7H4ZM12 18C9.23858 18 7 15.7614 7 13C7 10.2386 9.23858 8 12 8C14.7614 8 17 10.2386 17 13C17 15.7614 14.7614 18 12 18ZM12 16.5C13.933 16.5 15.5 14.933 15.5 13C15.5 11.067 13.933 9.5 12 9.5C10.067 9.5 8.5 11.067 8.5 13C8.5 14.933 10.067 16.5 12 16.5Z" />
  </svg>
);

const MarketplaceStoreCard = memo(({ store }) => {
  const { t } = useTranslation();
  const href = photographerStorePath(store.username);
  const storeProducts = useMemo(
    () => (Array.isArray(store.products) ? store.products.slice(0, 12) : []),
    [store.products],
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link
          to={href}
          className="group flex items-center gap-3.5 transition hover:opacity-80"
        >
          <Image
            src={store.authorImage || store.image}
            alt={store.storeName}
            className="size-14 shrink-0 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-[#e8eaef] transition-all group-hover:ring-[#4048cd] sm:size-16"
            loading="lazy"
            decoding="async"
          />
          <div>
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-[#111827]">
              {store.storeName}
              {store.promoted ? (
                <span className="shrink-0 rounded-md bg-[#ee1c25] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
                  {t('marketplace.promoted')}
                </span>
              ) : null}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[13px] text-[#6b7280]">
              {store.description}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 flex-col">
          <span className="mb-1 text-[11px] font-medium tracking-wide text-[#9ca3af]">
            Artwork Appreciation:
          </span>
          <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto">
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#f3e5c8] bg-[#fdfaf2] px-2.5 py-1">
              <CameraIcon className="h-4 w-4 text-[#d4af37]" />
              <span className="text-[13px] font-bold text-[#927129]">
                {store.scores?.gold || 0}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e2e8f0] bg-[#f5f7f9] px-2.5 py-1">
              <CameraIcon className="h-4 w-4 text-[#94a3b8]" />
              <span className="text-[13px] font-bold text-[#475569]">
                {store.scores?.silver || 0}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#eedfd5] bg-[#fdf7f4] px-2.5 py-1">
              <CameraIcon className="h-4 w-4 text-[#cd7f32]" />
              <span className="text-[13px] font-bold text-[#925c42]">
                {store.scores?.bronze || 0}
              </span>
            </div>
            <Link
              to={href}
              className="ml-1 whitespace-nowrap text-[13px] font-semibold text-[#4048cd] hover:underline"
            >
              See All
            </Link>
          </div>
        </div>
      </div>

      <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {storeProducts.length === 0 ? (
          <p className="py-6 text-[13px] text-[#9ca3af]">
            {t('marketplace.noProducts', 'No products yet')}
          </p>
        ) : (
          storeProducts.map((product) => (
            <Link
              key={product.id}
              to={href}
              className="group block shrink-0 overflow-hidden rounded-[10px] border border-[#e8eaef] transition-all hover:border-[#4048cd] hover:shadow-md"
            >
              <div className="relative h-24 w-24 bg-[#f3f4f6] sm:h-28 sm:w-28">
                <Image
                  src={product.image}
                  alt={product.title}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </article>
  );
});
MarketplaceStoreCard.displayName = 'MarketplaceStoreCard';

const MarketplaceMain = memo(() => {
  const { t } = useTranslation();
  const {
    query,
    setQuery,
    promotedOnly,
    setPromotedOnly,
    isSearchMode,
    activeItems,
    currentPage,
    setPage,
    totalPages,
    totalRecords,
    pagedItems,
    isLoading,
    isError,
    refetch,
  } = useMarketplaceFilters();

  return (
    <SitePageLayout
      activeHref={ROUTES.MARKETPLACE}
      rootClassName="marketplace-page-root"
      announcementTone="navy"
      newsletterVariant="page"
    >
      <section className="bg-white section-py">
        <Shell>
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              className="min-w-0"
              align="left"
              badge={t('marketplace.eyebrow')}
              badgeTone="indigo"
              title={t('marketplace.title')}
            />
            <p className="max-w-130 text-[14px] leading-6 text-[#6b7280] lg:text-right">
              {t('marketplace.subtitle')}
            </p>
          </div>

          <div className="mb-5">
            <MarketingSearchBar
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('marketplace.searchPlaceholder')}
              ariaLabel={t('marketplace.searchPlaceholder')}
            />
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#494453]">
              <Checkbox
                id="promotedOnly"
                checked={promotedOnly}
                onChange={(event) => setPromotedOnly(event.target.checked)}
                label={t('marketplace.filters.promotedOnly')}
                className="mt-0 font-semibold"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center">
              <RefreshCw size={22} className="animate-spin text-[#4048cd]" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-[#e4e4e4] bg-[#fafafa] px-6 py-14 text-center">
              <p className="text-[16px] font-bold text-[#161c27]">
                {t('marketplace.loadError', 'Failed to load stores.')}
              </p>
              <Button
                unstyled
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-[#4048cd] px-4 py-2 text-[13px] font-semibold text-white"
              >
                {t('common.retry', 'Retry')}
              </Button>
            </div>
          ) : pagedItems.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#e4e4e4] bg-[#fafafa] px-6 py-14 text-center">
              <p className="text-[18px] font-bold text-[#161c27]">
                {t('marketplace.emptyTitle')}
              </p>
              <p className="mt-2 text-[14px] text-[#6b7280]">
                {t('marketplace.emptyBody')}
              </p>
            </div>
          ) : (
            <section
              aria-label={t('marketplace.gridAria')}
              className={`grid gap-5 ${
                isSearchMode
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}
            >
              {pagedItems.map((item) =>
                isSearchMode ? (
                  <MarketplaceProductCard key={item.id} product={item} />
                ) : (
                  <MarketplaceStoreCard key={item.id} store={item} />
                ),
              )}
            </section>
          )}

          {!isLoading && !isError && totalRecords > 0 ? (
            <footer className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
                {t('marketplace.showing', {
                  from: (currentPage - 1) * MARKETPLACE_PAGE_SIZE + 1,
                  to: Math.min(
                    currentPage * MARKETPLACE_PAGE_SIZE,
                    totalRecords,
                  ),
                  total: totalRecords,
                })}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                ariaLabel={t('marketplace.paginationAria')}
              />
            </footer>
          ) : null}
        </Shell>
      </section>
    </SitePageLayout>
  );
});

MarketplaceMain.displayName = 'MarketplaceMain';

export default MarketplaceMain;
