import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_USERS_ASSETS,
  CLOSE_ICON_SIZE,
  isSuspendReasonValid,
} from './adminUsersData';

/**
 * Suspend User confirmation popup — Figma node 339:5286.
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: (reason: string) => void,
 * }} props
 */
const SuspendUserModal = memo(({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const reasonId = useId();
  const [reason, setReason] = useState('');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    setReason('');
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

  const reasonValid = isSuspendReasonValid(reason);
  const showReasonError = attempted && !reasonValid;

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!reasonValid) return;
    onConfirm(reason.trim());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4 backdrop-blur-[6px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[470px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-[#edf0f3] px-6 pb-[21px] pt-5">
          <h2
            id={titleId}
            className="font-manrope pt-1 text-[20px] font-bold leading-7 tracking-[-0.5px] text-[#202838]"
          >
            {t('adminUsers.suspendModal.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminUsers.suspendModal.close')}
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-1 transition hover:bg-black/5"
          >
            <img
              src={ADMIN_USERS_ASSETS.close}
              alt=""
              width={CLOSE_ICON_SIZE}
              height={CLOSE_ICON_SIZE}
              className="size-[18px]"
            />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col px-6 py-5">
          <div className="flex w-full flex-col">
            <label htmlFor={reasonId} className="text-[12px] leading-4 text-[#455163]">
              {t('adminUsers.suspendModal.reason')}
              <span className="text-[#f31d2c]" aria-hidden="true">
                {' '}
                *
              </span>
            </label>
            <div className="pt-1.5">
              <textarea
                id={reasonId}
                name="reason"
                rows={4}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t('adminUsers.suspendModal.reasonPlaceholder')}
                aria-invalid={showReasonError}
                aria-describedby={showReasonError ? `${reasonId}-error` : undefined}
                className={`h-[92px] w-full resize-none rounded-[6px] border bg-white px-[7px] py-[7px] text-[12px] leading-4 text-[#455163] outline-none placeholder:text-[#9aa3b2] focus:border-[#4048cd] ${
                  showReasonError ? 'border-[#f31d2c]' : 'border-[#dfe4ea]'
                }`}
              />
            </div>
            {showReasonError ? (
              <p id={`${reasonId}-error`} className="pt-1 text-[12px] leading-4 text-[#f31d2c]">
                {t('adminUsers.suspendModal.reasonRequired')}
              </p>
            ) : null}
          </div>

          <div className="flex items-start justify-end gap-2 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-[6px] border border-[#dfe4ea] px-[17px] py-[9px] text-[12px] leading-4 text-[#536070] transition hover:bg-[#f9fafb]"
            >
              {t('adminUsers.suspendModal.cancel')}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-[6px] bg-[#f31d2c] px-4 py-2 text-[12px] leading-4 text-white shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)] transition hover:bg-[#d41921]"
            >
              {t('adminUsers.suspendModal.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
});

SuspendUserModal.displayName = 'SuspendUserModal';

export default SuspendUserModal;
