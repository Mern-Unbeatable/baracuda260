import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle,
  Ban,
  Camera,
  Copyright,
  EyeOff,
  Megaphone,
  MessageCircleWarning,
  MoreHorizontal,
  X,
} from 'lucide-react';

const MAX_DETAILS_LENGTH = 500;

const REPORT_REASONS = [
  { id: 'copyright', icon: Copyright },
  { id: 'illegal', icon: Ban },
  { id: 'harmful', icon: AlertTriangle },
  { id: 'offensive', icon: MessageCircleWarning },
  { id: 'nudity', icon: EyeOff },
  { id: 'spam', icon: Megaphone },
  { id: 'stolen', icon: Camera },
  { id: 'other', icon: MoreHorizontal },
];

const ReportPhotoModal = memo(({ open, onClose, photoTitle = '', onSubmit }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const detailsId = useId();
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    setSelectedReason('');
    setDetails('');
    setAttempted(false);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!selectedReason) return;

    onSubmit?.({ reason: selectedReason, details: details.trim(), photoTitle });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-130 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[min(92vh,900px)] w-full max-w-225 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_22px_70px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="border-b border-[#edf0f3] px-6 pb-5 pt-6 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-[22px] font-bold leading-tight text-[#0d0d14]">
                {t('gallery.reportModal.title', { defaultValue: 'Report This Photo' })}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.5] text-[#6b7280]">
                {t('gallery.reportModal.subtitle', {
                  defaultValue:
                    'Help us keep the community safe. Please tell us what is wrong with this content.',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('gallery.reportModal.close', { defaultValue: 'Close' })}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/10 text-[#0d0d14] transition hover:bg-[#f3f4f6]"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {REPORT_REASONS.map(({ id, icon: Icon }) => {
                const selected = selectedReason === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedReason(id)}
                    aria-pressed={selected}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                      selected
                        ? 'border-[#4048cd] bg-[#4048cd]/5'
                        : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${
                        selected ? 'bg-[#4048cd]/10 text-[#4048cd]' : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold text-[#0d0d14]">
                        {t(`gallery.reportModal.reasons.${id}.title`)}
                      </span>
                      <span className="mt-1 block text-[12px] leading-[1.45] text-[#6b7280]">
                        {t(`gallery.reportModal.reasons.${id}.description`)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {attempted && !selectedReason ? (
              <p className="mt-3 text-[13px] font-medium text-[#e53935]">
                {t('gallery.reportModal.reasonRequired', {
                  defaultValue: 'Please select a reason before submitting.',
                })}
              </p>
            ) : null}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor={detailsId} className="text-[14px] font-bold text-[#0d0d14]">
                  {t('gallery.reportModal.detailsLabel', {
                    defaultValue: 'Tell us more about the problem',
                  })}
                </label>
                <span className="text-[12px] text-[#9ca3af]">
                  {details.length}/{MAX_DETAILS_LENGTH}
                </span>
              </div>
              <textarea
                id={detailsId}
                value={details}
                maxLength={MAX_DETAILS_LENGTH}
                rows={4}
                placeholder={t('gallery.reportModal.detailsPlaceholder', {
                  defaultValue:
                    'Please briefly explain why you believe this content violates our rules.',
                })}
                onChange={(event) => setDetails(event.target.value)}
                className="w-full resize-none rounded-xl border border-[#e5e7eb] px-4 py-3 text-[14px] leading-[1.5] text-[#0d0d14] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/20"
              />
            </div>
          </div>

          <footer className="flex items-center justify-end gap-3 border-t border-[#edf0f3] px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#0d0d14] transition hover:bg-[#f9fafb]"
            >
              {t('gallery.reportModal.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#333bb0]"
            >
              {t('gallery.reportModal.submit', { defaultValue: 'Submit Report' })}
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
});

ReportPhotoModal.displayName = 'ReportPhotoModal';

export default ReportPhotoModal;
