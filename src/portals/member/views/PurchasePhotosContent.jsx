import { CloudDownload, Image, RefreshCw, Wallet } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';
import MemberPurchasePhotoCard from '@/components/data-display/MemberPurchasePhotoCard/MemberPurchasePhotoCard';
import Button from '@/components/ui/Button';
import {
  PURCHASE_PHOTOS_PAGE_SIZE,
  PURCHASE_PHOTOS_PAGE_SIZE_OPTIONS,
  PURCHASE_STAT_CARDS,
} from '@/portals/member/data/purchasePhotosData';
import usePurchasePhotos from '@/portals/member/hooks/usePurchasePhotos';

const PurchaseStatCards = memo(({ stats, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('purchasePhotos.stats.aria')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {PURCHASE_STAT_CARDS.map((card) => {
        let iconBg = card.iconBg;
        let iconColor = 'text-current';

        if (iconBg && iconBg.includes('text-')) {
          const parts = iconBg.split(' ');
          iconBg = parts.find((p) => p.startsWith('bg-')) || iconBg;
          iconColor = parts.find((p) => p.startsWith('text-')) || iconColor;
        }

        return (
          <DashboardStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={isLoading ? '...' : (stats?.[card.id] ?? 0)}
            icon={card.icon}
            iconBg={iconBg}
            iconColor={iconColor}
          />
        );
      })}
    </div>
  );
});
PurchaseStatCards.displayName = 'PurchaseStatCards';

const PurchasePhotosContent = memo(() => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(PURCHASE_PHOTOS_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    items,
    meta,
    stats,
    isLoading,
    isPurchasesLoading,
    isStatsLoading,
    isError,
    error,
    refetch,
  } = usePurchasePhotos({ page: currentPage, limit: pageSize });

  const totalRecords = meta?.totalRecords ?? items.length;
  const totalPages = meta?.totalPages ?? 1;

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const from = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('purchasePhotos.title')}
          </h1>
          {isLoading ? (
            <div className="flex items-center gap-2 text-[14px] text-[#7a7484]">
              <RefreshCw size={16} className="animate-spin text-[#4048cd]" />
              <span>{t('common.loading', 'Loading purchases...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('purchasePhotos.subtitle')}
        </p>
      </header>

      <PurchaseStatCards stats={stats} isLoading={isStatsLoading} />

      {isPurchasesLoading && items.length === 0 ? (
        <div className="flex min-h-60 items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white p-8">
          <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
        </div>
      ) : isError && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-[15px] font-medium text-red-600">
            {error?.message ||
              t('common.error', 'Failed to load purchased photos.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#343bb0]"
          >
            <RefreshCw size={14} />
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cbc3d5] bg-white p-8 text-center">
          <p className="text-[16px] font-medium text-[#494453]" role="status">
            {t('purchasePhotos.empty')}
          </p>
        </div>
      ) : (
        <section
          aria-label={t('purchasePhotos.gridAria')}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {items.map((purchase) => (
            <MemberPurchasePhotoCard key={purchase.id} purchase={purchase} />
          ))}
        </section>
      )}

      {totalRecords > 0 ? (
        <footer className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
              {t('purchasePhotos.showing', { from, to, total: totalRecords })}
            </p>
            <label className="inline-flex items-center gap-2 text-[13px] text-[#687186]">
              <span>{t('purchasePhotos.perPage')}</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="h-9 rounded-lg border border-[#e4e4e4] bg-white px-2.5 text-[13px] font-medium text-[#373737] outline-none focus:ring-2 focus:ring-[#4048cd]/20"
              >
                {PURCHASE_PHOTOS_PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel={t('purchasePhotos.paginationAria')}
            />
          ) : null}
        </footer>
      ) : null}
    </div>
  );
});

PurchasePhotosContent.displayName = 'PurchasePhotosContent';

export default PurchasePhotosContent;
