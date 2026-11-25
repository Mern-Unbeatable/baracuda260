import { Clock3, Info, Link2, ShieldCheck, X, Zap } from 'lucide-react';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { PROMO_LINK_VALIDITY_DAYS } from '@/portals/admin/data/adminPromoLinksData';

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void,
 *   isPending?: boolean,
 * }} props
 */
const GeneratePromoLinkModal = memo(
  ({ open, onClose, onConfirm, isPending }) => {
    const { t } = useTranslation();
    const titleId = useId();

    useEffect(() => {
      if (!open) return undefined;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event) => {
        if (event.key === 'Escape' && !isPending) onClose();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose, isPending]);

    if (!open) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,32,51,0.4)] p-0 sm:items-center sm:p-4"
        role="presentation"
        onClick={isPending ? undefined : onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)] sm:rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#edf0f3] px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ecedfa] text-[#4048cd]">
                <Link2 size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0 pt-0.5">
                <h2
                  id={titleId}
                  className="text-[17px] font-bold leading-6 tracking-[-0.2px] text-[#151e31] sm:text-[20px] sm:leading-7"
                >
                  {t('adminPromoLinks.generate.title')}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-[#687186]">
                  {t('adminPromoLinks.generate.subtitle')}
                </p>
              </div>
            </div>
            <Button
              unstyled
              type="button"
              disabled={isPending}
              onClick={onClose}
              aria-label={t('adminPromoLinks.generate.close')}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#687186] transition hover:bg-black/5 disabled:opacity-50"
            >
              <X size={18} aria-hidden="true" />
            </Button>
          </header>

          <div className="overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[#9aa3b5]">
              {t('adminPromoLinks.generate.settingsLabel')}
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              <article className="flex items-start gap-3 rounded-xl border border-[#edf0f3] bg-[#fafbff] p-3.5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ecedfa] text-[#4048cd]">
                  <Clock3 size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-[#9aa3b5]">
                    {t('adminPromoLinks.generate.validityLabel')}
                  </p>
                  <p className="mt-0.5 text-[16px] font-bold leading-5 text-[#151e31]">
                    {t('adminPromoLinks.generate.validityValue', {
                      days: PROMO_LINK_VALIDITY_DAYS,
                    })}
                  </p>
                  <p className="mt-1 text-[12px] leading-4 text-[#687186]">
                    {t('adminPromoLinks.generate.validityHint', {
                      days: PROMO_LINK_VALIDITY_DAYS,
                    })}
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-3 rounded-xl border border-[#edf0f3] bg-[#fafbff] p-3.5">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#eef7f3] text-[#268262]">
                  <ShieldCheck size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-[#9aa3b5]">
                    {t('adminPromoLinks.generate.usageLabel')}
                  </p>
                  <p className="mt-0.5 text-[16px] font-bold leading-5 text-[#151e31]">
                    {t('adminPromoLinks.generate.usageValue')}
                  </p>
                  <p className="mt-1 text-[12px] leading-4 text-[#687186]">
                    {t('adminPromoLinks.generate.usageHint')}
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#e4e8f8] bg-[#f4f5ff] px-3.5 py-3">
              <Info
                size={16}
                className="mt-0.5 shrink-0 text-[#4048cd]"
                aria-hidden="true"
              />
              <p className="text-[12px] leading-5 text-[#4b556f] sm:text-[13px]">
                {t('adminPromoLinks.generate.info')}
              </p>
            </div>
          </div>

          <footer className="flex shrink-0 flex-col gap-3 border-t border-[#edf0f3] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <p className="inline-flex items-center gap-2 text-[12px] font-medium text-[#268262]">
              <span
                className="size-2 rounded-full bg-[#268262]"
                aria-hidden="true"
              />
              {t('adminPromoLinks.generate.ready')}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
              <Button
                unstyled
                type="button"
                disabled={isPending}
                onClick={onClose}
                className="cursor-pointer rounded-xl px-3 py-2.5 text-center text-[13px] font-semibold text-[#687186] transition hover:bg-[#f6f7f9] disabled:opacity-50 sm:px-4 sm:text-[14px]"
              >
                {t('adminPromoLinks.generate.cancel')}
              </Button>
              <Button
                unstyled
                type="button"
                disabled={isPending}
                onClick={onConfirm}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#4048cd] px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#353cb0] disabled:opacity-50 sm:px-4 sm:text-[14px]"
              >
                {isPending ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Zap size={15} aria-hidden="true" />
                )}
                {isPending
                  ? t('common.loading', 'Generating...')
                  : t('adminPromoLinks.generate.confirm')}
              </Button>
            </div>
          </footer>
        </div>
      </div>,
      document.body,
    );
  },
);

GeneratePromoLinkModal.displayName = 'GeneratePromoLinkModal';

export default GeneratePromoLinkModal;
