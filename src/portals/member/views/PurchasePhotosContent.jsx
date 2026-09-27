import { CloudDownload, Image, Wallet } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberPurchasePhotoCard from '@/components/data-display/MemberPurchasePhotoCard/MemberPurchasePhotoCard';
import {
  computePurchaseStats,
  PURCHASE_PHOTOS,
  PURCHASE_PHOTOS_PAGE_SIZE,
  PURCHASE_PHOTOS_PAGE_SIZE_OPTIONS,
  PURCHASE_STAT_CARDS,
} from '@/portals/member/data/purchasePhotosData';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';

const PurchaseStatCards = memo(({ stats }) => {
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
          iconBg = parts.find(p => p.startsWith('bg-')) || iconBg;
          iconColor = parts.find(p => p.startsWith('text-')) || iconColor;
        }

        return (
          <DashboardStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={stats[card.id]}
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

  const items = useMemo(() => PURCHASE_PHOTOS, []);
  const stats = useMemo(() => computePurchaseStats(items), [items]);
  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    items,
    pageSize,
    [pageSize],
  );

  const from = items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, items.length);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
          {t('purchasePhotos.title')}
        </h1>
        <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('purchasePhotos.subtitle')}
        </p>
      </header>

      <PurchaseStatCards stats={stats} />

      {pagedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('purchasePhotos.empty')}
        </p>
      ) : (
        <section
          aria-label={t('purchasePhotos.gridAria')}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {pagedItems.map((purchase) => (
            <MemberPurchasePhotoCard key={purchase.id} purchase={purchase} />
          ))}
        </section>
      )}

      {items.length > 0 ? (
        <footer className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
              {t('purchasePhotos.showing', { from, to, total: items.length })}
            </p>
            <label className="inline-flex items-center gap-2 text-[13px] text-[#687186]">
              <span>{t('purchasePhotos.perPage')}</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('purchasePhotos.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

PurchasePhotosContent.displayName = 'PurchasePhotosContent';

export default PurchasePhotosContent;
