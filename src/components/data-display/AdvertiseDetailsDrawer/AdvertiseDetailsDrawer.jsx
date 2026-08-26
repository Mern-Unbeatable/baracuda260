import { useTranslation } from 'react-i18next';
import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Right sidebar drawer for advertise submission details — mirrors CommentDetailsDrawer.
 *
 * @param {{ row: object | null, onClose: () => void }} props
 */
const AdvertiseDetailsDrawer = memo(({ row, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!row) return undefined;

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
  }, [row, onClose]);

  if (!row) return null;

  const summaryRows = [
    { labelKey: 'adminAds.drawer.adsStartDate', value: row.adsStartDate },
    { labelKey: 'adminAds.drawer.adsEndDate', value: row.adsEndDate },
    { labelKey: 'adminAds.drawer.totalDays', value: t(row.totalDaysKey) },
    { labelKey: 'adminAds.drawer.subtotal', value: row.subtotal },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advertise-details-title"
    >
      <button
        type="button"
        aria-label={t('adminAds.drawer.close')}
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col bg-white shadow-[-8px_0_30px_rgba(15,23,42,0.12)] sm:w-120 sm:max-w-120">
        <div className="flex items-start justify-between border-b border-[#f3f4f6] px-6 py-5">
          <div>
            <h2
              id="advertise-details-title"
              className="text-[16px] font-semibold leading-6 text-[#111827]"
            >
              {t('adminAds.drawer.title')}
            </h2>
            <p className="text-[12px] leading-4.5 text-[#6b7280]">{row.code}</p>
          </div>
          <button
            type="button"
            aria-label={t('adminAds.drawer.close')}
            onClick={onClose}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#e5e7eb] text-[16px] text-[#6b7280] hover:bg-[#f3f4f6]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="overflow-hidden rounded-xl">
            <img src={row.image} alt="" className="aspect-2/1 w-full object-cover" />
          </div>

          <div className="pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminAds.drawer.businessName')}
            </p>
            <div className="mt-2 rounded-xl bg-[#f9fafb] px-4 py-3">
              <p className="text-[14px] leading-6 text-[#374151]">{t(row.businessNameKey)}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminAds.drawer.businessLocation')}
            </p>
            <div className="mt-2 rounded-xl bg-[#f9fafb] px-4 py-3">
              <p className="text-[14px] leading-6 text-[#374151]">{t(row.businessLocationKey)}</p>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminAds.drawer.description')}
            </p>
            <div className="mt-2 rounded-xl bg-[#f9fafb] px-4 py-3.5">
              <p className="text-[14px] leading-6 text-[#374151]">{t(row.descriptionKey)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#f9fafb] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminAds.drawer.customerName')}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={row.avatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold leading-5.75 text-[#111827]">
                  {t(row.nameKey)}
                </p>
                <p className="truncate text-[12px] leading-4.5 text-[#6b7280]">{row.email}</p>
                <p className="text-[12px] leading-4.5 text-[#6b7280]">{row.phone}</p>
              </div>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-[#f3f4f6] pt-5">
            {summaryRows.map(({ labelKey, value }) => (
              <div key={labelKey} className="flex items-center justify-between gap-4">
                <dt className="text-[13px] leading-[19.5px] text-[#6b7280]">{t(labelKey)}</dt>
                <dd className="text-[13px] font-semibold leading-[19.5px] text-[#111827]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>,
    document.body,
  );
});

AdvertiseDetailsDrawer.displayName = 'AdvertiseDetailsDrawer';

export default AdvertiseDetailsDrawer;
