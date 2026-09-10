import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Clock3, Info, Link2, ShieldCheck, X, Zap } from 'lucide-react';
import { PROMO_LINK_VALIDITY_DAYS } from '@/portals/admin/data/adminPromoLinksData';

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 * }} props
 */
const GeneratePromoLinkModal = memo(({ open, onClose, onConfirm }) => {
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

  if (!open) return null;

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
        className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#ecedfa] text-[#4048cd]">
              <Link2 size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-manrope text-[20px] font-bold leading-7 tracking-[-0.3px] text-[#151e31] sm:text-[22px]"
              >
                {t('adminPromoLinks.generate.title')}
              </h2>
              <p className="mt-1 text-[14px] leading-5 text-[#687186]">
                {t('adminPromoLinks.generate.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminPromoLinks.generate.close')}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#687186] transition hover:bg-black/5"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6">
          <p className="text-[11px] font-bold tracking-[0.16em] text-[#9aa3b5]">
            {t('adminPromoLinks.generate.settingsLabel')}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <article className="rounded-[14px] border border-[#edf0f3] bg-[#fafbff] p-4">
              <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-[#ecedfa] text-[#4048cd]">
                <Clock3 size={18} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-[#9aa3b5]">
                {t('adminPromoLinks.generate.validityLabel')}
              </p>
              <p className="mt-1 text-[18px] font-bold leading-6 text-[#151e31]">
                {t('adminPromoLinks.generate.validityValue', { days: PROMO_LINK_VALIDITY_DAYS })}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[#687186]">
                {t('adminPromoLinks.generate.validityHint', { days: PROMO_LINK_VALIDITY_DAYS })}
              </p>
            </article>

            <article className="rounded-[14px] border border-[#edf0f3] bg-[#fafbff] p-4">
              <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-[#eef7f3] text-[#268262]">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[11px] font-bold tracking-[0.14em] text-[#9aa3b5]">
                {t('adminPromoLinks.generate.usageLabel')}
              </p>
              <p className="mt-1 text-[18px] font-bold leading-6 text-[#151e31]">
                {t('adminPromoLinks.generate.usageValue')}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[#687186]">
                {t('adminPromoLinks.generate.usageHint')}
              </p>
            </article>
          </div>

          <div className="flex items-start gap-3 rounded-[12px] border border-[#e4e8f8] bg-[#f4f5ff] px-4 py-3">
            <Info size={18} className="mt-0.5 shrink-0 text-[#4048cd]" aria-hidden="true" />
            <p className="text-[13px] leading-5 text-[#4b556f]">
              {t('adminPromoLinks.generate.info')}
            </p>
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#edf0f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="inline-flex items-center gap-2 text-[13px] font-medium text-[#268262]">
            <span className="size-2 rounded-full bg-[#268262]" aria-hidden="true" />
            {t('adminPromoLinks.generate.ready')}
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-[#687186] transition hover:bg-[#f6f7f9]"
            >
              {t('adminPromoLinks.generate.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] bg-[#4048cd] px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#353cb0]"
            >
              <Zap size={16} aria-hidden="true" />
              {t('adminPromoLinks.generate.confirm')}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
});

GeneratePromoLinkModal.displayName = 'GeneratePromoLinkModal';

export default GeneratePromoLinkModal;
