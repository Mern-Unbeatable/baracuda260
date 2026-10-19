import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  CONTACT_SUPPORT_ASSETS,
} from '@/portals/member/data/contactSupportData';
import {
  formatSupportTicketTime,
  getMySupportTicketDetailsApi,
  USER_SUPPORT_DETAIL_QUERY_KEY,
} from '@/shared/api/support.api';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const raw = String(status || '').toUpperCase();
  const isPending = raw === 'PENDING';

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
      {isPending
        ? t('contactSupport.status.pending', 'Pending')
        : t('contactSupport.status.answered', {
            defaultValue: t('contactSupport.status.replied', 'Answered'),
          })}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const UserMessage = memo(({ body, time, read }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-full items-start gap-3">
        <div className="flex min-w-0 max-w-[448px] flex-col items-end">
          <div className="whitespace-pre-wrap rounded-bl-[16px] rounded-br-[16px] rounded-tl-[16px] rounded-tr-none bg-[#2563eb] py-4 pl-5 pr-[33px] text-[14px] font-normal leading-[22.75px] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {body}
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-normal leading-[16.5px] text-[#94a3b8]">
            <span>{time}</span>
            {read ? (
              <>
                <span aria-hidden="true">•</span>
                <span className="inline-flex items-center gap-0.5">
                  <Image
                    src={CONTACT_SUPPORT_ASSETS.readCheck}
                    alt=""
                    width={12}
                    height={12}
                    className="size-3"
                  />
                  {t('contactSupport.modal.read', 'Read')}
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
          <span className="relative">{t('contactSupport.modal.you', 'YOU')}</span>
        </span>
      </div>
    </div>
  );
});

UserMessage.displayName = 'UserMessage';

const SupportMessage = memo(({ body, time, attachments }) => {
  const { t } = useTranslation();
  const isHtml = typeof body === 'string' && /<[a-z][\s\S]*>/i.test(body);

  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-full items-start gap-3">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1e293b] text-[12px] font-bold leading-4 text-white">
          <span
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_2px_white]"
            aria-hidden="true"
          />
          <span className="relative">
            {t('contactSupport.modal.supportInitial', 'S')}
          </span>
        </span>
        <div className="flex min-w-0 max-w-[448px] flex-col items-start">
          <div className="flex w-full flex-col gap-4 rounded-bl-[16px] rounded-br-[16px] rounded-tl-none rounded-tr-[16px] border border-[#f3f4f6] bg-white px-[21px] py-4 text-[14px] font-normal leading-[22.75px] text-[#334155] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
            {isHtml ? (
              <div
                className="prose prose-sm max-w-none text-[#334155]"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p className="whitespace-pre-wrap">{body}</p>
            )}
            {Array.isArray(attachments) && attachments.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                {attachments.map((att, idx) => {
                  const name =
                    typeof att === 'string'
                      ? att.split('/').pop()
                      : att.name || `attachment-${idx + 1}`;
                  const url = typeof att === 'string' ? att : att.url;
                  return (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-[#f1f5f9] p-[13px] transition hover:bg-[#e2e8f0]"
                    >
                      <span className="flex shrink-0 rounded-lg bg-[rgba(203,213,225,0.5)] p-2">
                        <Image
                          src={CONTACT_SUPPORT_ASSETS.paperclip}
                          alt=""
                          width={16}
                          height={16}
                          className="size-4"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] font-bold leading-4 text-[#334155]">
                          {name}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
          <p className="pt-1 text-[11px] font-normal leading-[16.5px] text-[#94a3b8]">
            {time}
          </p>
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

  const {
    data: ticketDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: USER_SUPPORT_DETAIL_QUERY_KEY(thread?.id),
    queryFn: () => getMySupportTicketDetailsApi(thread?.id),
    enabled: Boolean(open && thread?.id),
    staleTime: 30 * 1000,
  });

  const ticket = ticketDetails || thread;

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
                {ticket.title}
              </h2>
              <StatusBadge status={ticket.status} />
            </div>
            <p className="text-[14px] leading-5 text-[#64748b]">
              {ticket.answeredAt
                ? `${t('contactSupport.modal.answered', 'Answered')} ${formatSupportTicketTime(ticket.answeredAt)}`
                : `${t('contactSupport.modal.created', 'Created')} ${formatSupportTicketTime(ticket.createdAt)}`}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            aria-label={t('contactSupport.modal.close', 'Close conversation')}
            className="inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded transition hover:bg-black/5"
          >
            <Image
              src={CONTACT_SUPPORT_ASSETS.modalClose}
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          </Button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto bg-[#f9fafb] p-6">
          {isLoading && !ticketDetails ? (
            <div className="flex min-h-48 items-center justify-center">
              <RefreshCw size={24} className="animate-spin text-[#2563eb]" />
            </div>
          ) : isError && !ticketDetails ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
              <p className="text-[14px] text-red-500">
                {error?.message || t('common.error', 'Failed to load details')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex w-full items-center py-2">
                <div
                  className="h-px min-w-0 flex-1 border-t border-[#e5e7eb]"
                  aria-hidden="true"
                />
                <div className="px-4">
                  <span className="block rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-normal leading-4 text-[#9ca3af]">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : t('contactSupport.modal.today', 'Today')}
                  </span>
                </div>
                <div
                  className="h-px min-w-0 flex-1 border-t border-[#e5e7eb]"
                  aria-hidden="true"
                />
              </div>

              {/* User message */}
              <UserMessage
                body={ticket.message}
                time={formatSupportTicketTime(ticket.createdAt)}
                read={
                  String(ticket.status).toUpperCase() === 'ANSWERED' ||
                  Boolean(ticket.answer)
                }
              />

              {/* Support reply if available */}
              {ticket.answer ? (
                <SupportMessage
                  body={ticket.answer}
                  time={formatSupportTicketTime(ticket.answeredAt || ticket.updatedAt)}
                  attachments={ticket.attachments}
                />
              ) : null}
            </>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#f3f4f6] bg-white px-5 pb-6 pt-[25px] sm:px-6">
          {ticket.answer ? (
            <div className="flex items-center gap-3 rounded-[16px] border border-[#dcfce7] bg-[#f0fdf4] p-4 text-[14px] text-[#15803d]">
              <CheckCircle2 size={18} className="shrink-0 text-[#16a34a]" />
              <p>
                {t(
                  'contactSupport.modal.resolvedNotice',
                  'This ticket has been responded to by our support team.',
                )}
              </p>
            </div>
          ) : (
            <div className="flex gap-4 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-[#f9fafb] p-[22px]">
              <Image
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
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
});

ConversationMessageModal.displayName = 'ConversationMessageModal';

export default ConversationMessageModal;
