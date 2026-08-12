import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AnswerPublishModal from '@/portals/admin/components/admin-support/AnswerPublishModal';
import AdminPageHeader from '@/portals/admin/components/ui/AdminPageHeader';
import {
  ADMIN_SUPPORT_ASSETS,
  AVATAR_SIZE,
  EYE_ICON_SIZE,
  MESSAGE_ICON_SIZE,
  QUESTION_ICON_SIZE,
} from '@/portals/admin/data/adminSupportData';
import useAdminSupport from '@/portals/admin/hooks/useAdminSupport';

/**
 * @param {{
 *   ticket: object,
 *   onAnswer?: (ticketId: string) => void,
 *   onView?: (ticketId: string) => void,
 *   variant: 'pending' | 'answered',
 * }} props
 */
const SupportTicketRow = memo(({ ticket, onAnswer, onView, variant }) => {
  const { t } = useTranslation();
  const isPending = variant === 'pending';

  return (
    <article className="flex gap-4 p-4 sm:gap-6 sm:p-6">
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-[#ecedfa]"
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      >
        <img
          src={ADMIN_SUPPORT_ASSETS.question}
          alt=""
          width={QUESTION_ICON_SIZE}
          height={QUESTION_ICON_SIZE}
          className="size-[18px]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-manrope text-[15px] font-semibold leading-[22.5px] text-[#111827]">
          {t(ticket.titleKey)}
        </h3>
        <p className="text-[15px] italic leading-6 text-[#4a454f] sm:text-[16px]">
          &ldquo;{t(ticket.previewKey)}&rdquo;
        </p>
        <p className="text-[12px] font-bold leading-4 tracking-[0.6px] text-[#4a454f]">
          {t(ticket.timeKey)}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-5">
          {isPending ? (
            <button
              type="button"
              onClick={() => onAnswer?.(ticket.id)}
              className="inline-flex cursor-pointer items-center gap-1 rounded-[8px] bg-[#ee1c25] px-4 py-2 text-[16px] leading-6 text-white transition hover:bg-[#d41820]"
            >
              <img
                src={ADMIN_SUPPORT_ASSETS.message}
                alt=""
                width={MESSAGE_ICON_SIZE}
                height={MESSAGE_ICON_SIZE}
                className="size-[12px]"
              />
              {t('adminSupport.actions.answer')}
            </button>
          ) : (
            <>
              <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#9f9f9f] px-4 py-2 text-[16px] leading-6 text-white">
                <img
                  src={ADMIN_SUPPORT_ASSETS.message}
                  alt=""
                  width={MESSAGE_ICON_SIZE}
                  height={MESSAGE_ICON_SIZE}
                  className="size-[12px]"
                />
                {t('adminSupport.actions.answered')}
              </span>
              <button
                type="button"
                onClick={() => onView?.(ticket.id)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-[8px] border border-[#ee1c25] bg-white px-4 py-2 text-[16px] leading-6 text-[#222] transition hover:bg-[#fde8e9]"
              >
                <img
                  src={ADMIN_SUPPORT_ASSETS.eye}
                  alt=""
                  width={EYE_ICON_SIZE}
                  height={EYE_ICON_SIZE}
                  className="size-5"
                />
                {t('adminSupport.actions.viewMessage')}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
});

SupportTicketRow.displayName = 'SupportTicketRow';

/**
 * @param {{
 *   title: string,
 *   tickets: object[],
 *   emptyLabel: string,
 *   variant: 'pending' | 'answered',
 *   onAnswer?: (ticketId: string) => void,
 *   onView?: (ticketId: string) => void,
 * }} props
 */
const SupportQueueCard = memo(({ title, tickets, emptyLabel, variant, onAnswer, onView }) => (
  <section className="overflow-hidden rounded-[12px] border border-[#eeeef0] bg-white shadow-[0px_4px_10px_rgba(123,94,167,0.08)]">
    <div className="border-b border-[#eeeef0] px-4 pb-[25px] pt-6 sm:px-6">
      <h2 className="font-manrope text-[20px] font-semibold leading-8 text-[#1a1c1d] sm:text-[24px]">
        {title}
      </h2>
    </div>

    {tickets.length > 0 ? (
      <ul className="flex flex-col">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="border-b border-[#eeeef0] last:border-b-0">
            <SupportTicketRow
              ticket={ticket}
              variant={variant}
              onAnswer={onAnswer}
              onView={onView}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="px-6 py-10 text-center text-[16px] text-[#687186]">{emptyLabel}</p>
    )}
  </section>
));

SupportQueueCard.displayName = 'SupportQueueCard';

/**
 * Admin Support — Figma node 339:4651 (main area; sidebar from Layout).
 */
const AdminSupportContent = memo(() => {
  const { t } = useTranslation();
  const {
    pendingTickets,
    answeredTickets,
    activeTicket,
    modalMode,
    isModalOpen,
    handleOpenCompose,
    handleOpenPublished,
    handleCloseModal,
    handlePublish,
  } = useAdminSupport();

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <AdminPageHeader
        eyebrow={t('adminSupport.eyebrow')}
        title={t('adminSupport.title')}
        description={t('adminSupport.subtitle')}
      />

      <div className="flex flex-col gap-4">
        <SupportQueueCard
          title={t('adminSupport.pendingTitle')}
          tickets={pendingTickets}
          emptyLabel={t('adminSupport.emptyPending')}
          variant="pending"
          onAnswer={handleOpenCompose}
        />
        <SupportQueueCard
          title={t('adminSupport.answeredTitle')}
          tickets={answeredTickets}
          emptyLabel={t('adminSupport.emptyAnswered')}
          variant="answered"
          onView={handleOpenPublished}
        />
      </div>

      <AnswerPublishModal
        open={isModalOpen}
        mode={modalMode}
        ticket={activeTicket}
        onClose={handleCloseModal}
        onPublish={handlePublish}
      />
    </div>
  );
});

AdminSupportContent.displayName = 'AdminSupportContent';

export default AdminSupportContent;
