import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import MarketingSearchBar from '@/components/marketing/MarketingSearchBar/MarketingSearchBar';
import SectionHeader from '@/components/marketing/SectionHeader/SectionHeader';
import Pagination from '@/components/common/Pagination/Pagination';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_PAGE_SIZE,
  MARKETPLACE_PRODUCTS,
  MARKETPLACE_STORES,
  filterMarketplaceProducts,
} from '@/portals/public/marketplace/data/marketplaceData';

const MarketplaceProductCard = memo(({ product }) => {
  const { t } = useTranslation();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-4/3 overflow-hidden bg-[#f3f4f6]">
        <img
          src={product.image}
          alt={product.title}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#111827]/85 px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white">
          {t(product.badgeKey)}
        </span>
        {product.promoted ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
            {t('marketplace.promoted')}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div>
          <Link to={ROUTES.PHOTOGRAPHER_PROFILE} state={{ tab: 'store' }}>
            <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[#111827] transition hover:text-[#4048cd] hover:underline cursor-pointer">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-4 text-[#6b7280]">{product.description}</p>
          <p className="mt-2 text-[12px] font-medium text-[#8b95a5]">
            {t('marketplace.soldBy', { store: product.store })}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <p className="text-[16px] font-bold text-[#111827]">{product.price}</p>
          <div className="flex items-center gap-1.5">
            <Link
              to={ROUTES.PHOTOGRAPHER_PROFILE}
              state={{ tab: 'store' }}
              className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-[#4048cd] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#343bb0]"
            >
              {t('marketplace.viewProduct')}
            </Link>
            <button
              type="button"
              onClick={() => toast.success(t('marketplace.buyStarted', { title: product.title }))}
              className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-[#ee1c25] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#d01820]"
            >
              {t('marketplace.buyNow')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
MarketplaceProductCard.displayName = 'MarketplaceProductCard';

const MarketplaceStoreCard = memo(({ store }) => {
  const { t } = useTranslation();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-video overflow-hidden bg-[#f3f4f6]">
        <img
          src={store.image}
          alt={store.storeName}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {store.promoted ? (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
            {t('marketplace.promoted')}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div>
          <Link to={ROUTES.PHOTOGRAPHER_PROFILE} state={{ tab: 'store' }}>
            <h3 className="line-clamp-2 text-[16px] font-bold leading-5 text-[#111827] transition hover:text-[#4048cd] hover:underline cursor-pointer">
              {store.storeName}
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#6b7280]">{store.description}</p>
        </div>
        <div className="mt-auto pt-3">
          <Link
            to={ROUTES.PHOTOGRAPHER_PROFILE}
            state={{ tab: 'store' }}
            className="inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-4 text-[13px] font-semibold text-white transition hover:bg-[#343bb0]"
          >
            {t('marketplace.visitStore', { defaultValue: 'Visit Store' })}
          </Link>
        </div>
      </div>
    </article>
  );
});
MarketplaceStoreCard.displayName = 'MarketplaceStoreCard';

const MarketplaceMain = memo(() => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [promotedOnly, setPromotedOnly] = useState(false);

  const isSearchMode = query.trim().length > 0;

  const filteredProducts = useMemo(
    () => filterMarketplaceProducts(MARKETPLACE_PRODUCTS, { category, query, promotedOnly }),
    [category, query, promotedOnly],
  );

  const filteredStores = useMemo(() => {
    const stores = MARKETPLACE_STORES;
    const filtered = promotedOnly ? stores.filter(s => s.promoted) : stores;
    return [...filtered].sort((a, b) => Number(Boolean(b.promoted)) - Number(Boolean(a.promoted)));
  }, [promotedOnly]);

  const activeItems = isSearchMode ? filteredProducts : filteredStores;

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    activeItems,
    MARKETPLACE_PAGE_SIZE,
    [isSearchMode, category, query, promotedOnly],
  );

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
            <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#494453]">
              <input
                type="checkbox"
                checked={promotedOnly}
                onChange={(event) => setPromotedOnly(event.target.checked)}
                className="size-4 accent-[#ee1c25]"
              />
              {t('marketplace.filters.promotedOnly')}
            </label>
          </div>

          {pagedItems.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#e4e4e4] bg-[#fafafa] px-6 py-14 text-center">
              <p className="text-[18px] font-bold text-[#161c27]">{t('marketplace.emptyTitle')}</p>
              <p className="mt-2 text-[14px] text-[#6b7280]">{t('marketplace.emptyBody')}</p>
            </div>
          ) : (
            <section
              aria-label={t('marketplace.gridAria')}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
              {pagedItems.map((item) => (
                isSearchMode ? (
                  <MarketplaceProductCard key={item.id} product={item} />
                ) : (
                  <MarketplaceStoreCard key={item.id} store={item} />
                )
              ))}
            </section>
          )}

          {activeItems.length > 0 ? (
            <footer className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
                {t('marketplace.showing', {
                  from: (currentPage - 1) * MARKETPLACE_PAGE_SIZE + 1,
                  to: Math.min(currentPage * MARKETPLACE_PAGE_SIZE, activeItems.length),
                  total: activeItems.length,
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
