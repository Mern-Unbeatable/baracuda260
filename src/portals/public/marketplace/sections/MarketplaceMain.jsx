import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Pagination from '@/components/common/Pagination/Pagination';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Image from '@/components/ui/Image';
import { publicStoreProductPath } from '@/portals/member/data/myStoreData';
import { MARKETPLACE_PAGE_SIZE } from '@/portals/public/marketplace/data/marketplaceData';
import { ROUTES } from '@/shared/config';
import { Shell } from '@/shared/site-chrome';
import { useMarketplaceFilters } from '../hooks/useMarketplaceFilters';

const photographerStorePath = (username) => {
  const base = username
    ? `/photographer/${encodeURIComponent(String(username).replace(/^@/, ''))}`
    : ROUTES.PHOTOGRAPHER_PROFILE;
  return `${base}?tab=store`;
};

const MarketplaceProductCard = memo(({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const detailHref = publicStoreProductPath(product.username, product.id);

  const openDetails = () => {
    if (!detailHref || detailHref === ROUTES.MARKETPLACE) return;
    navigate(detailHref);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetails();
        }
      }}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#c7cbe8] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
    >
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
          <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[#111827] transition group-hover:text-[#4048cd]">
            {product.title}
          </h3>
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
            <Button
              variant="outline"
              className="h-8 px-2.5 text-[12px]"
              onClick={(event) => {
                event.stopPropagation();
                openDetails();
              }}
            >
              {t('marketplace.viewProduct')}
            </Button>
            <Button
              className="h-8 px-2.5 text-[12px]"
              onClick={(event) => {
                event.stopPropagation();
                navigate(ROUTES.PHOTOGRAPHER_STORE_CHECKOUT, {
                  state: {
                    product,
                    username: product.username || undefined,
                  },
                });
              }}
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

const MarketplaceStoreCard = memo(({ store }) => {
  const { t } = useTranslation();
  const href = photographerStorePath(store.username);
  const storeProducts = useMemo(
    () => (Array.isArray(store.products) ? store.products.slice(0, 3) : []),
    [store.products],
  );
  const previewSlots = useMemo(() => {
    const slots = [...storeProducts];
    while (slots.length < 3) slots.push(null);
    return slots;
  }, [storeProducts]);

  return (
    <article className="flex flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] [content-visibility:auto] [contain-intrinsic-size:auto_320px] sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <Link
          to={href}
          className="group flex min-w-0 flex-1 items-center gap-3 transition hover:opacity-80"
        >
          <Image
            src={store.authorImage || store.image}
            alt={store.storeName}
            className="size-12 shrink-0 rounded-full border border-white object-cover shadow-sm ring-1 ring-[#e8eaef] transition-all group-hover:ring-[#4048cd] sm:size-14"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-1.5 text-[15px] font-bold leading-tight text-[#111827] sm:text-[16px]">
              <span className="truncate">{store.storeName}</span>
              {store.isOwn ? (
                <span className="shrink-0 rounded-md bg-[#4048cd] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.35px] text-white">
                  {t('marketplace.yourStore', 'You')}
                </span>
              ) : null}
              {store.promoted ? (
                <span className="shrink-0 rounded-md bg-[#ee1c25] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.35px] text-white">
                  {t('marketplace.promoted')}
                </span>
              ) : null}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[#6b7280] sm:text-[13px]">
              {store.username
                ? `@${String(store.username).replace(/^@/, '')}`
                : null}
              {store.username && store.description ? ' · ' : null}
              {store.description}
            </p>
          </div>
        </Link>
        <Link
          to={href}
          className="shrink-0 whitespace-nowrap pt-1 text-[12px] font-semibold text-[#4048cd] hover:underline sm:text-[13px]"
        >
          See All
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-[#9ca3af]">
          {t('marketplace.artworkAppreciation', 'Artwork Appreciation:')}
        </span>
        <PhotographerAwardCounters awards={store.scores} size="sm" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {storeProducts.length === 0 ? (
          <p className="col-span-3 rounded-[10px] border border-dashed border-[#e5e7eb] bg-[#fafafa] py-8 text-center text-[12px] text-[#9ca3af]">
            {t('marketplace.noProducts', 'No products yet')}
          </p>
        ) : (
          previewSlots.map((product, index) =>
            product ? (
              <Link
                key={product.id}
                to={href}
                className="group block overflow-hidden rounded-[10px] border border-[#e8eaef] bg-[#f3f4f6] transition hover:border-[#4048cd]"
              >
                <div className="aspect-square">
                  <Image
                    src={product.image}
                    alt={product.title}
                    className="size-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Link>
            ) : (
              <div
                key={`empty-${store.id || store.storeName}-${index}`}
                className="aspect-square rounded-[10px] border border-dashed border-[#e8eaef] bg-[#fafafa]"
                aria-hidden="true"
              />
            ),
          )
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

        <div className="mb-6 flex items-center justify-end">
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
  );
});

MarketplaceMain.displayName = 'MarketplaceMain';

export default MarketplaceMain;
