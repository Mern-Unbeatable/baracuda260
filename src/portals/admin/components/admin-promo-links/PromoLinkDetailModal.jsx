import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { Copy, X } from 'lucide-react';
import {
  CLOSE_ICON_SIZE,
  REWARD_LABEL_KEYS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  buildPromoJoinAbsoluteUrl,
  formatIssuedAt,
  getRequirementStage,
  getValidityMeta,
} from '@/portals/admin/data/adminPromoLinksData';

/**
 * @param {{
 *   open: boolean,
 *   link: object | null,
 *   onClose: () => void,
 * }} props
 */
const PromoLinkDetailModal = memo(({ open, link, onClose }) => {
  const { t } = useTranslation();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !link) return null;

  const statusStyle = STATUS_STYLES[link.status] || STATUS_STYLES.active;
  const validity = getValidityMeta(link);
  const stage = getRequirementStage(link);

  const validityLabel =
    validity.kind === 'used'
      ? t('adminPromoLinks.validity.used')
      : validity.kind === 'expired'
        ? t('adminPromoLinks.validity.expired')
        : t('adminPromoLinks.validity.daysLeft', { count: validity.daysLeft });

  const checklistLabel =
    stage === 'none'
      ? t('adminPromoLinks.checklist.none')
      : stage === 'completed'
        ? t('adminPromoLinks.checklist.completed', {
            done: link.checklistDone,
            total: link.checklistTotal,
          })
        : t('adminPromoLinks.checklist.incomplete', {
            done: link.checklistDone,
            total: link.checklistTotal,
          });

  const absoluteUrl = buildPromoJoinAbsoluteUrl(link.code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      toast.success(t('adminPromoLinks.copySuccess'));
    } catch {
      toast.error(t('adminPromoLinks.copyFailed'));
    }
  };

  const rows = [
    { label: t('adminPromoLinks.columns.linkId'), value: link.linkId },
    { label: t('adminPromoLinks.columns.dateIssued'), value: formatIssuedAt(link.issuedAt) },
    { label: t('adminPromoLinks.columns.validity'), value: validityLabel },
    { label: t('adminPromoLinks.columns.checklist'), value: checklistLabel },
    { label: t('adminPromoLinks.columns.reward'), value: t(REWARD_LABEL_KEYS[link.reward]) },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.35)] p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-5 pb-4 pt-5 sm:px-6">
          <div>
            <h2
              id={titleId}
              className="font-manrope text-[22px] font-bold leading-8 tracking-[-0.5px] text-[#202838]"
            >
              {t('adminPromoLinks.detail.title')}
            </h2>
            <p className="mt-1 text-[14px] text-[#687186]">{link.linkId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminPromoLinks.detail.close')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-black/5"
          >
            <X size={CLOSE_ICON_SIZE - 4} aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex h-[30px] items-center rounded-[8px] px-[9px] py-[5px] text-[13px] font-bold ${statusStyle.bg} ${statusStyle.text}`}
            >
              {t(STATUS_LABEL_KEYS[link.status])}
            </span>
          </div>

          <div className="mb-5 flex items-start gap-3 rounded-[12px] border border-[#edf0f3] bg-[#fafbff] px-4 py-3">
            <p className="min-w-0 flex-1 break-all text-[14px] leading-5 text-[#151e31]">{absoluteUrl}</p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={t('adminPromoLinks.copyAria')}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[8px] text-[#ee1c25] transition hover:bg-[#fde8e9]"
            >
              <Copy size={16} aria-hidden="true" />
            </button>
          </div>

          <dl className="grid grid-cols-1 gap-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 border-b border-[#f1f3f6] pb-3 last:border-b-0 last:pb-0"
              >
                <dt className="text-[13px] text-[#7f8ba1]">{row.label}</dt>
                <dd className="text-right text-[14px] font-medium text-[#0c0c0c]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <footer className="border-t border-[#edf0f3] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#f6f7f9] px-4 py-2.5 text-[14px] font-semibold text-[#373737] transition hover:bg-[#eef0f3]"
          >
            {t('adminPromoLinks.detail.closeButton')}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
});

PromoLinkDetailModal.displayName = 'PromoLinkDetailModal';

export default PromoLinkDetailModal;
