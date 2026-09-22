import { Download, FileText } from 'lucide-react';
import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { PURCHASE_BADGE_KEYS } from '@/portals/member/data/purchasePhotosData';

/**
 * @param {{
 *   purchase: {
 *     id: string,
 *     title: string,
 *     photographer: string,
 *     initials: string,
 *     price: string,
 *     purchasedLabel: string,
 *     badge: string,
 *     image: string,
 *     downloadAvailable: boolean,
 *   },
 * }} props
 */
const MemberPurchasePhotoCard = memo(({ purchase }) => {
  const { t } = useTranslation();
  const badgeLabel = t(PURCHASE_BADGE_KEYS[purchase.badge] || purchase.badge, {
    defaultValue: purchase.badge,
  });

  const handleDownload = () => {
    if (!purchase.downloadAvailable) {
      toast.error(t('purchasePhotos.downloadUnavailable'));
      return;
    }
    toast.success(
      t('purchasePhotos.downloadStarted', { title: purchase.title }),
    );
  };

  const handleInvoiceDownload = () => {
    toast.success(
      t('purchasePhotos.invoiceStarted', { title: purchase.title }),
    );
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.12)] bg-white shadow-sm">
      <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
        <Image
          src={purchase.image}
          alt={purchase.title}
          width={368}
          height={252}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center rounded-md bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm backdrop-blur-[2px]">
          {badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 text-[16px] font-bold leading-5 text-[#0d0d14] line-clamp-2">
            {purchase.title}
          </h3>
          <p className="shrink-0 text-[16px] font-bold leading-5 text-[#0d0d14]">
            {purchase.price}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ecedfa] text-[11px] font-bold text-[#4048cd]">
              {purchase.initials}
            </span>
            <span className="truncate text-[13px] font-medium text-[#687186]">
              {purchase.photographer}
            </span>
          </div>
          <span className="shrink-0 text-[12px] text-[#9aa3b5]">
            {purchase.purchasedLabel}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            unstyled
            type="button"
            onClick={handleDownload}
            className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#ee1c25] px-4 text-[14px] font-bold text-white transition hover:bg-[#d41921]"
          >
            <Download size={16} aria-hidden="true" />
            {t('purchasePhotos.download')}
          </Button>
          <Button
            unstyled
            type="button"
            onClick={handleInvoiceDownload}
            aria-label={t('purchasePhotos.invoiceAria', {
              title: purchase.title,
            })}
            className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#dfe3f4] bg-white text-[#4048cd] transition hover:bg-[#f4f5ff]"
          >
            <FileText size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
});

MemberPurchasePhotoCard.displayName = 'MemberPurchasePhotoCard';

export default MemberPurchasePhotoCard;
