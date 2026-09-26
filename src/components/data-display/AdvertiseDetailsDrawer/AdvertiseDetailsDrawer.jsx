import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import AdsStatusBadge from '@/portals/admin/components/admin-ads/AdsStatusBadge';
import {
  formatAdAmount,
  formatAdDate,
  getBusinessTypeLabel,
  getPageNameLabel,
} from '@/portals/admin/data/adminAdsData';
import { resolveMediaUrl } from '@/shared/utils/media';

const isSafeHttpUrl = (url) => /^https?:\/\//i.test(String(url || ''));

/**
 * @param {{ labelKey: string, children: React.ReactNode }} props
 */
const DetailField = ({ labelKey, children }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
        {t(labelKey)}
      </p>
      <div className="mt-2 rounded-xl bg-[#f9fafb] px-4 py-3">
        <div className="break-words text-[14px] leading-6 text-[#374151]">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * @param {{ ad: object }} props
 */
const AdvertiseDetailsBody = ({ ad }) => {
  const { t, i18n } = useTranslation();
  const imageUrl = resolveMediaUrl(ad.businessImage);
  const customerInitial = (ad.name || '?').trim().charAt(0).toUpperCase();

  const summaryRows = [
    {
      labelKey: 'adminAds.drawer.adsStartDate',
      value: formatAdDate(ad.startsAt, i18n.language),
    },
    {
      labelKey: 'adminAds.drawer.adsEndDate',
      value: formatAdDate(ad.endsAt, i18n.language),
    },
    {
      labelKey: 'adminAds.drawer.totalDays',
      value:
        ad.durationDays != null
          ? t('adminAds.drawer.daysValue', { count: ad.durationDays })
          : '—',
    },
    {
      labelKey: 'adminAds.drawer.pageName',
      value: getPageNameLabel(t, ad.selectPage),
    },
    {
      labelKey: 'adminAds.drawer.businessType',
      value: getBusinessTypeLabel(t, ad.businessType),
    },
    { labelKey: 'adminAds.drawer.paymentId', value: ad.paymentId || '—' },
    {
      labelKey: 'adminAds.drawer.subtotal',
      value: formatAdAmount(ad.amount, i18n.language, { fixedDecimals: true }),
    },
  ];

  return (
    <>
      {imageUrl ? (
        <div className="overflow-hidden rounded-xl bg-[#f3f4f6]">
          <Image
            src={imageUrl}
            alt={ad.businessName || ''}
            className="aspect-2/1 w-full object-cover"
          />
        </div>
      ) : null}

      <div className={imageUrl ? 'pt-2' : '-mt-4'}>
        <DetailField labelKey="adminAds.drawer.businessName">
          {ad.businessName || '—'}
        </DetailField>
        <DetailField labelKey="adminAds.drawer.businessLocation">
          {ad.location || '—'}
        </DetailField>
        <DetailField labelKey="adminAds.drawer.website">
          {isSafeHttpUrl(ad.websiteUrl) ? (
            <a
              href={ad.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-[#4048cd] underline-offset-2 hover:underline"
            >
              {ad.websiteUrl}
            </a>
          ) : (
            ad.websiteUrl || '—'
          )}
        </DetailField>
        <DetailField labelKey="adminAds.drawer.description">
          {ad.description || '—'}
        </DetailField>
      </div>

      <div className="mt-6 rounded-xl bg-[#f9fafb] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
          {t('adminAds.drawer.customerName')}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ecedfa] text-[16px] font-semibold text-[#4048cd]"
            aria-hidden="true"
          >
            {customerInitial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold leading-5.75 text-[#111827]">
              {ad.name || '—'}
            </p>
            <p className="truncate text-[12px] leading-4.5 text-[#6b7280]">
              {ad.email}
            </p>
            <p className="text-[12px] leading-4.5 text-[#6b7280]">{ad.phone}</p>
          </div>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t border-[#f3f4f6] pt-5">
        {summaryRows.map(({ labelKey, value }) => (
          <div
            key={labelKey}
            className="flex items-center justify-between gap-4"
          >
            <dt className="text-[13px] leading-[19.5px] text-[#6b7280]">
              {t(labelKey)}
            </dt>
            <dd className="text-right text-[13px] font-semibold leading-[19.5px] break-all text-[#111827]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
};

/**
 * Right sidebar drawer for an advertisement from `/v1/advertisements/admin/:id`.
 *
 * @param {{
 *   open: boolean,
 *   ad: object | null,
 *   isLoading: boolean,
 *   isError: boolean,
 *   errorMessage?: string,
 *   onRetry: () => void,
 *   onClose: () => void,
 * }} props
 */
const AdvertiseDetailsDrawer = memo(
  ({ open, ad, isLoading, isError, errorMessage, onRetry, onClose }) => {
    const { t } = useTranslation();

    useEffect(() => {
      if (!open) return undefined;

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose]);

    if (!open) return null;

    let body;
    if (isLoading) {
      body = (
        <div className="flex flex-col gap-4" aria-busy="true">
          <div className="aspect-2/1 w-full animate-pulse rounded-xl bg-[#f3f4f6]" />
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-12 w-full animate-pulse rounded-xl bg-[#f3f4f6]"
            />
          ))}
        </div>
      );
    } else if (isError || !ad) {
      body = (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-[14px] text-[#ee1c25]">
            {errorMessage || t('adminAds.drawer.loadError')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => onRetry()}
            className="cursor-pointer rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#374151] hover:bg-[#f3f4f6]"
          >
            {t('adminAds.retry')}
          </Button>
        </div>
      );
    } else {
      body = <AdvertiseDetailsBody ad={ad} />;
    }

    return createPortal(
      <div
        className="fixed inset-0 z-70"
        role="dialog"
        aria-modal="true"
        aria-labelledby="advertise-details-title"
      >
        <Button
          unstyled
          type="button"
          aria-label={t('adminAds.drawer.close')}
          className="absolute inset-0 cursor-pointer bg-black/40"
          onClick={onClose}
        />
        <aside className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col bg-white shadow-[-8px_0_30px_rgba(15,23,42,0.12)] sm:w-120 sm:max-w-120">
          <div className="flex items-start justify-between border-b border-[#f3f4f6] px-6 py-5">
            <div className="flex flex-col items-start gap-1.5">
              <h2
                id="advertise-details-title"
                className="text-[16px] font-semibold leading-6 text-[#111827]"
              >
                {t('adminAds.drawer.title')}
              </h2>
              {ad?.status ? <AdsStatusBadge status={ad.status} /> : null}
            </div>
            <Button
              unstyled
              type="button"
              aria-label={t('adminAds.drawer.close')}
              onClick={onClose}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#e5e7eb] text-[16px] text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">{body}</div>
        </aside>
      </div>,
      document.body,
    );
  },
);

AdvertiseDetailsDrawer.displayName = 'AdvertiseDetailsDrawer';

export default AdvertiseDetailsDrawer;
