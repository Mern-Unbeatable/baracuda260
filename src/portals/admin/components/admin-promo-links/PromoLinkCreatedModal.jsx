import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { Check, Copy, Link2, Sparkles, X } from 'lucide-react';
import { buildPromoJoinAbsoluteUrl } from '@/portals/admin/data/adminPromoLinksData';

/**
 * @param {{
 *   open: boolean,
 *   link: object | null,
 *   onClose: () => void,
 * }} props
 */
const PromoLinkCreatedModal = memo(({ open, link, onClose }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [copied, setCopied] = useState(false);
  const absoluteUrl = link ? buildPromoJoinAbsoluteUrl(link.code) : '';

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return undefined;
    }

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      toast.success(t('adminPromoLinks.copySuccess'));
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error(t('adminPromoLinks.copyFailed'));
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.4)] p-4 backdrop-blur-[4px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-[0px_24px_80px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-5 pt-5 sm:px-7 sm:pt-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#eeeffc] text-[#5850ec]">
                <Sparkles size={20} strokeWidth={2} fill="currentColor" aria-hidden="true" />
              </span>
              <h2
                id={titleId}
                className="font-manrope text-[20px] font-bold leading-7 tracking-[-0.3px] text-[#151e31] sm:text-[22px]"
              >
                {t('adminPromoLinks.created.title')}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('adminPromoLinks.created.close')}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#9aa3b5] transition hover:bg-[#f3f4f6] hover:text-[#687186]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 max-w-[440px] text-[14px] leading-5 text-[#687186] sm:mt-3.5 sm:text-[15px] sm:leading-6">
            {t('adminPromoLinks.created.subtitle')}
          </p>
        </div>

        <div className="px-5 pb-5 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
          <div className="flex flex-col gap-3 rounded-[14px] bg-[#f3f4ff] p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 px-1 sm:px-2">
              <Link2 size={18} className="shrink-0 text-[#5850ec]" aria-hidden="true" />
              <p className="min-w-0 flex-1 truncate text-[13px] font-medium leading-5 text-[#151e31] sm:text-[14px]">
                {absoluteUrl}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#5850ec] px-4 text-[14px] font-bold text-white transition hover:bg-[#4a43d4] sm:h-10"
            >
              {copied ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              {copied ? t('adminPromoLinks.created.copied') : t('adminPromoLinks.created.copy')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
});

PromoLinkCreatedModal.displayName = 'PromoLinkCreatedModal';

export default PromoLinkCreatedModal;
