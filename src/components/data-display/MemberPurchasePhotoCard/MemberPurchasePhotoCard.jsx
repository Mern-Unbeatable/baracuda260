import { Download, FileText, Loader2 } from 'lucide-react';
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { getApiErrorMessage } from '@/shared/api/client';
import { downloadBuyerOrderInvoiceApi } from '@/shared/api/orders.api';
import {
  downloadMarketplacePremiumPhotoApi,
  triggerFileDownload,
} from '@/shared/api/premiumPhotos.api';
import { PURCHASE_BADGE_KEYS } from '@/portals/member/data/purchasePhotosData';

/**
 * @param {{
 *   purchase: {
 *     id: string,
 *     orderId?: string,
 *     premiumPhotoId?: string,
 *     title: string,
 *     photographer: string,
 *     initials: string,
 *     price: string,
 *     purchasedLabel: string,
 *     badge: string,
 *     image: string,
 *     downloadUrl?: string,
 *     downloadAvailable: boolean,
 *   },
 * }} props
 */
const MemberPurchasePhotoCard = memo(({ purchase }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

  const badgeLabel = t(PURCHASE_BADGE_KEYS[purchase.badge] || purchase.badge, {
    defaultValue: purchase.badge,
  });

  const handleDownload = async () => {
    const photoId = purchase.premiumPhotoId || purchase.id;
    if (!photoId && !purchase.downloadUrl) {
      toast.error(
        t('purchasePhotos.downloadUnavailable', 'Download is not available for this item'),
      );
      return;
    }

    const safeTitle = (purchase.title || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');
    setIsDownloading(true);
    const toastId = toast.loading(
      t('purchasePhotos.downloadStarted', { title: purchase.title }),
    );

    try {
      if (photoId) {
        await downloadMarketplacePremiumPhotoApi(photoId, safeTitle);
      } else if (purchase.downloadUrl) {
        await triggerFileDownload(purchase.downloadUrl, safeTitle);
      }
      toast.success(
        t('purchasePhotos.downloadComplete', 'Download completed successfully!'),
        { id: toastId },
      );
    } catch (err) {
      // If endpoint call fails, attempt fallback with downloadUrl if available
      if (purchase.downloadUrl) {
        try {
          await triggerFileDownload(purchase.downloadUrl, safeTitle);
          toast.success(
            t('purchasePhotos.downloadComplete', 'Download completed successfully!'),
            { id: toastId },
          );
          return;
        } catch {
          // fallback also failed
        }
      }
      toast.error(
        err?.message ||
          t('purchasePhotos.downloadFailed', 'Failed to download photo'),
        { id: toastId },
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleInvoiceDownload = async () => {
    if (!purchase?.orderId || isDownloadingInvoice) {
      toast.error(
        t(
          'purchasePhotos.invoiceUnavailable',
          'Invoice is not available for this purchase.',
        ),
      );
      return;
    }

    try {
      setIsDownloadingInvoice(true);
      await downloadBuyerOrderInvoiceApi(purchase.orderId);
      toast.success(
        t('purchasePhotos.invoiceStarted', {
          title: purchase.title,
          defaultValue: `Invoice downloaded for ${purchase.title}.`,
        }),
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          t('purchasePhotos.invoiceFailed', 'Failed to download invoice.'),
        ),
      );
    } finally {
      setIsDownloadingInvoice(false);
    }
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
        <span className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center rounded-md bg-white/92 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm backdrop-blur-[2px] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
          {badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:gap-4 sm:p-4">
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <h3 className="min-w-0 flex-1 text-[13px] font-bold leading-4 text-[#0d0d14] line-clamp-2 sm:text-[16px] sm:leading-5">
            {purchase.title}
          </h3>
          <p className="shrink-0 text-[13px] font-bold leading-4 text-[#0d0d14] sm:text-[16px] sm:leading-5">
            {purchase.price}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ecedfa] text-[10px] font-bold text-[#4048cd] sm:size-7 sm:text-[11px]">
              {purchase.initials}
            </span>
            <span className="truncate text-[11px] font-medium text-[#687186] sm:text-[13px]">
              {purchase.photographer}
            </span>
          </div>
          <span className="shrink-0 text-[10px] text-[#9aa3b5] sm:text-[12px]">
            {purchase.purchasedLabel}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-1.5 sm:gap-2">
          <Button
            unstyled
            type="button"
            disabled={isDownloading}
            onClick={handleDownload}
            aria-busy={isDownloading}
            className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[10px] bg-[#ee1c25] px-2 text-[12px] font-bold text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-60 sm:h-11 sm:gap-2 sm:px-4 sm:text-[14px]"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin sm:size-4" aria-hidden="true" />
            ) : (
              <Download size={14} className="sm:size-4" aria-hidden="true" />
            )}
            <span className="truncate">
              {isDownloading
                ? t('common.downloading', 'Downloading...')
                : t('purchasePhotos.download')}
            </span>
          </Button>
          <Button
            unstyled
            type="button"
            onClick={handleInvoiceDownload}
            disabled={isDownloadingInvoice || !purchase.orderId}
            title={t('purchasePhotos.downloadInvoice', 'Download invoice')}
            aria-label={t('purchasePhotos.invoiceAria', {
              title: purchase.title,
              defaultValue: `Download invoice for ${purchase.title}`,
            })}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#dfe3f4] bg-white text-[#4048cd] transition hover:bg-[#f4f5ff] disabled:cursor-not-allowed disabled:opacity-50 sm:size-11"
          >
            {isDownloadingInvoice ? (
              <Loader2
                size={16}
                className="animate-spin sm:size-[18px]"
                aria-hidden="true"
              />
            ) : (
              <FileText size={16} className="sm:size-[18px]" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
});

MemberPurchasePhotoCard.displayName = 'MemberPurchasePhotoCard';

export default MemberPurchasePhotoCard;
