import { Heart, RefreshCw, ShoppingBag } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberStoreProductCard from '@/components/data-display/MemberStoreProductCard/MemberStoreProductCard';
import Button from '@/components/ui/Button';
import {
  getWatchlistApi,
  STORE_WATCHLIST_QUERY_KEY,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';

const PAGE_SIZE = 8;

/**
 * Member Item Watchlist view — displays store items saved to the user's watchlist
 * fetched from GET /api/v1/store/watchlist.
 */
const ItemWatchlistContent = memo(() => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [STORE_WATCHLIST_QUERY_KEY, currentPage],
    queryFn: () => getWatchlistApi({ page: currentPage, limit: PAGE_SIZE }),
  });

  const products = data?.data || [];
  const meta = data?.meta || {
    totalRecords: products.length,
    totalPages: 1,
    currentPage: 1,
  };

  const totalRecords = meta.totalRecords ?? products.length;
  const totalPages = meta.totalPages ?? 1;
  const from = totalRecords > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(currentPage * PAGE_SIZE, totalRecords);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#fee2e2] text-[#ee1c25]">
              <Heart size={22} className="fill-[#ee1c25]" />
            </span>
            <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[34px] sm:leading-9.5">
              {t('myStore.watchlist.title', 'Item Watchlist')}
            </h1>
          </div>
          {isFetching && !isLoading ? (
            <div className="flex items-center gap-2 text-[13px] text-[#7a7484]">
              <RefreshCw size={14} className="animate-spin text-[#4048cd]" />
              <span>{t('common.updating', 'Updating...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t(
            'myStore.watchlist.subtitle',
            'Explore and manage your collection of saved store items and merchandise.',
          )}
        </p>
      </header>

      {isLoading && products.length === 0 ? (
        <div className="flex min-h-70 items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white p-8">
          <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
        </div>
      ) : isError && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-[15px] font-medium text-red-600">
            {error?.message ||
              t('common.error', 'Failed to load item watchlist.')}
          </p>
          <Button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#d41921]"
          >
            {t('common.tryAgain', 'Try Again')}
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border border-[#eceef3] bg-white p-12 text-center shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#f3f4f6] text-[#9ca3af]">
            <Heart size={28} strokeWidth={1.75} />
          </span>
          <div className="max-w-md">
            <h3 className="text-[18px] font-bold text-[#111827]">
              {t('myStore.watchlist.emptyTitle', 'Your watchlist is empty')}
            </h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#6b7280]">
              {t(
                'myStore.watchlist.emptySubtitle',
                'Click the heart icon on any store product card to save it to your personal watchlist.',
              )}
            </p>
          </div>
          <Link
            to={ROUTES.MARKETPLACE}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#4048cd] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#343cb0]"
          >
            <ShoppingBag size={16} />
            <span>{t('myStore.watchlist.browseStore', 'Explore My Store')}</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <MemberStoreProductCard
                key={product.id}
                product={{
                  ...product,
                  isSaved: true,
                }}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="pt-2">
              <Pagination
                from={from}
                to={to}
                totalRecords={totalRecords}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
});

ItemWatchlistContent.displayName = 'ItemWatchlistContent';

export default ItemWatchlistContent;
