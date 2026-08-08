import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { CONTACT_SUPPORT_ASSETS, THREAD_DETAILS } from '@/modules/member/data/contactSupportData';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-normal leading-4 ${
        isPending
          ? 'border border-[#ffedd5] bg-[#fff7ed] text-[#c2410c]'
          : 'bg-[#dcfce7] text-[#15803d] shadow-[inset_0_0_0_1px_rgba(22,163,74,0.2)]'
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${isPending ? 'bg-[#f97316]' : 'bg-[#22c55e]'}`}
        aria-hidden="true"
      />
      {t(`contactSupport.status.${status}`)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const UserMessage = memo(({ body, time, read }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-end">
      {/* Figma 231:556 — bubble+meta column, then YOU avatar (tops aligned) */}
      <div className="flex max-w-full items-start gap-3">
        <div className="flex min-w-0 max-w-[448px] flex-col items-end">
          <div className="rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-none bg-[#2563eb] py-4 pl-5 pr-[33px] text-[14px] font-normal leading-[22.75px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {body}
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-normal leading-[16.5px] text-[#94a3b8]">
            <span>{time}</span>
            {read ? (
              <>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-0.5">
                  <img
                    src={CONTACT_SUPPORT_ASSETS.readCheck}
                    alt=""
                    width={12}
                    height={12}
                    className="size-3"
                  />
                  {t('contactSupport.modal.read')}
                </span>
              </>
            ) : null}
          </div>
        </div>
        <span className="relative mt-0 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-[10px] font-bold leading-[15px] text-white">
          <span
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_2px_white]"
            aria-hidden="true"
          />
          <span className="relative">{t('contactSupport.modal.you')}</span>
        </span>
      </div>
    </div>
  );
});

UserMessage.displayName = 'UserMessage';

const SupportMessage = memo(({ body, time, attachment }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-start">
      {/* Figma 231:574 / 231:583 — S avatar, then bubble+meta column */}
      <div className="flex max-w-full items-start gap-3">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[12px] font-bold leading-4 text-white">
          <span
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_2px_white]"
            aria-hidden="true"
          />
          <span className="relative">{t('contactSupport.modal.supportInitial')}</span>
        </span>
        <div className="flex min-w-0 max-w-[448px] flex-col items-start">
          <div className="flex w-full flex-col gap-4 rounded-bl-[16px] rounded-br-[16px] rounded-tl-none rounded-tr-[16px] border border-[#f3f4f6] bg-white px-[21px] py-4 text-[14px] font-normal leading-[22.75px] text-[#334155] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            <p className="whitespace-pre-wrap">{body}</p>
            {attachment ? (
              <div className="flex w-full items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-[#f1f5f9] p-[13px]">
                <span className="flex shrink-0 rounded-lg bg-[rgba(203,213,225,0.5)] p-2">
                  <img
                    src={CONTACT_SUPPORT_ASSETS.paperclip}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-bold leading-4 text-[#334155]">
                    {t(attachment.nameKey)}
                  </span>
                  <span className="block text-[10px] font-normal uppercase leading-[16.25px] text-[#64748b]">
                    {t(attachment.sizeKey)}
                  </span>
                </span>
              </div>
            ) : null}
          </div>
          <p className="pt-1 text-[11px] font-normal leading-[16.5px] text-[#94a3b8]">{time}</p>
        </div>
      </div>
    </div>
  );
});

SupportMessage.displayName = 'SupportMessage';

/**
 * Support ticket message popup — Figma node 230:329 / 231:529.
 */
const ConversationMessageModal = memo(({ open, thread, onClose }) => {
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

  if (!open || !thread) return null;

  const detail = THREAD_DETAILS[thread.detailKey] || THREAD_DETAILS.export;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-support-thread-title"
        className="flex max-h-[min(90vh,900px)] w-full max-w-[672px] flex-col overflow-hidden rounded-[24px] border border-[#f3f4f6] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between border-b border-[#f3f4f6] px-5 pb-[21px] pt-5 sm:px-6">
          <div className="flex min-w-0 flex-col gap-1 pr-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="contact-support-thread-title"
                className="text-[18px] font-bold leading-7 text-[#1e293b] sm:text-[20px]"
              >
                {t(thread.titleKey)}
              </h2>
              <StatusBadge status={thread.status} />
            </div>
            <p className="text-[14px] leading-5 text-[#64748b]">{t(detail.lastUpdatedKey)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('contactSupport.modal.close')}
            className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded transition hover:bg-black/5"
          >
            <img
              src={CONTACT_SUPPORT_ASSETS.modalClose}
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto bg-[#f9fafb] p-6">
          <div className="flex w-full items-center py-2">
            <div className="h-px min-w-0 flex-1 border-t border-[#e5e7eb]" aria-hidden="true" />
            <div className="px-4">
              <span className="block rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-normal leading-4 text-[#9ca3af]">
                {t(detail.dayKey)}
              </span>
            </div>
            <div className="h-px min-w-0 flex-1 border-t border-[#e5e7eb]" aria-hidden="true" />
          </div>

          {detail.messages.map((message) =>
            message.role === 'user' ? (
              <UserMessage
                key={message.id}
                body={t(message.bodyKey)}
                time={t(message.timeKey)}
                read={Boolean(message.read)}
              />
            ) : (
              <SupportMessage
                key={message.id}
                body={t(message.bodyKey)}
                time={t(message.timeKey)}
                attachment={message.attachment}
              />
            ),
          )}
        </div>

        <footer className="shrink-0 border-t border-[#f3f4f6] bg-white px-5 pb-6 pt-[25px] sm:px-6">
          <div className="flex gap-4 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] p-[22px]">
            <img
              src={CONTACT_SUPPORT_ASSETS.lock}
              alt=""
              width={18}
              height={18}
              className="mt-0.5 size-[18px] shrink-0"
            />
            <p className="text-[14px] leading-[22.75px] text-[#64748b]">
              {t('contactSupport.modal.waitReply')}
            </p>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
});

ConversationMessageModal.displayName = 'ConversationMessageModal';

export default ConversationMessageModal;
