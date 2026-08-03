import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config';
import { SINGLE_PHOTO_ASSETS } from './singlePhotoAssets';

/**
 * Post-submit success modal — Figma nodes 338:574 (Single) / 367:884 (6 Photo).
 * Backdrop blur 6px; card 672×409, radius 24; CTAs red #ee1c25 + blue #4048cd.
 */
const PhotoSubmitSuccessModal = memo(({ open, onClose }) => {
  const { t } = useTranslation();

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4 backdrop-blur-[6px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="photo-submit-success-title"
        aria-describedby="photo-submit-success-desc"
        className="relative flex w-full max-w-[672px] flex-col items-center overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white px-6 pb-10 pt-12 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:px-12"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('singlePhoto.successModal.close')}
          className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full p-2 transition hover:bg-black/5 sm:right-6 sm:top-6"
        >
          <img
            src={SINGLE_PHOTO_ASSETS.modal.close}
            alt=""
            width={14}
            height={14}
            className="size-[14px] shrink-0"
          />
        </button>

        <div className="relative mb-7 flex size-20 shrink-0 items-center justify-center rounded-full">
          <span
            className="absolute inset-0 rounded-full bg-[#c4c6f0] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            aria-hidden="true"
          />
          <img
            src={SINGLE_PHOTO_ASSETS.modal.check}
            alt=""
            width={40}
            height={40}
            className="relative size-10 shrink-0"
          />
        </div>

        <h2
          id="photo-submit-success-title"
          className="mb-4 text-center text-[28px] font-normal leading-6 text-black sm:text-[32px]"
        >
          {t('singlePhoto.successModal.title')}
        </h2>

        <p
          id="photo-submit-success-desc"
          className="mb-8 max-w-[512px] text-center text-[16px] font-normal leading-[26px] text-black/90"
        >
          {t('singlePhoto.successModal.body')}
        </p>

        <div className="flex w-full flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-start sm:justify-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center justify-center rounded-lg bg-[#ee1c25] px-8 py-[17px] text-center text-[16px] font-normal leading-6 text-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-[#d41921]"
          >
            {t('singlePhoto.successModal.goHome')}
          </Link>
          <Link
            to={ROUTES.ADMIN_UPLOAD_PHOTOS}
            className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#4048cd] px-8 py-[17px] text-center text-[16px] font-normal leading-6 text-white transition hover:bg-[#363db5]"
          >
            {t('singlePhoto.successModal.uploadAnother')}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
});

PhotoSubmitSuccessModal.displayName = 'PhotoSubmitSuccessModal';

export default PhotoSubmitSuccessModal;
