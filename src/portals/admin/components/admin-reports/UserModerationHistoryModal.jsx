import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, History, MapPin, Mail, TriangleAlert, X } from 'lucide-react';
import { MODERATION_HISTORY } from '@/portals/admin/data/adminReportsData';

/**
 * @param {{ open: boolean, onClose: () => void }} props
 */
const UserModerationHistoryModal = memo(({ open, onClose }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const history = MODERATION_HISTORY;

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

  const statCards = [
    { id: 'totalReports', value: history.stats.totalReports, valueClass: 'text-[#ee1c25]' },
    { id: 'warnings', value: history.stats.warnings, valueClass: 'text-[#d97706]' },
    { id: 'suspensions', value: history.stats.suspensions, valueClass: 'text-[#111827]' },
    { id: 'bans', value: history.stats.bans, valueClass: 'text-[#111827]' },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(24,32,51,0.45)] p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between bg-[#0f172a] px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#2563eb]">
              <History size={20} aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id={titleId} className="text-[18px] font-bold leading-7">
                  {t('adminReports.history.title')}
                </h2>
                <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[12px] font-semibold text-[#166534]">
                  {t('adminReports.history.active')}
                </span>
              </div>
              <p className="text-[13px] leading-5 text-white/75">
                {t('adminReports.history.subtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('adminReports.history.close')}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <img
              src={history.avatar}
              alt=""
              width={72}
              height={72}
              className="size-18 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-[22px] font-bold leading-8 text-[#111827]">
                {t(history.nameKey)}
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#6b7280]">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} aria-hidden="true" />
                  {t(history.locationKey)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail size={14} aria-hidden="true" />
                  {history.email}
                </span>
                <span>{t('adminReports.history.memberSince', { date: history.memberSince })}</span>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 py-1 text-[12px] font-semibold text-[#991b1b]">
                <TriangleAlert size={14} aria-hidden="true" />
                {t(history.recentReportsLabelKey)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((card) => (
              <article
                key={card.id}
                className="rounded-xl border border-[#e5e7eb] px-4 py-3 text-center"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
                  {t(`adminReports.history.stats.${card.id}`)}
                </p>
                <p className={`pt-2 text-[28px] font-extrabold leading-8 ${card.valueClass}`}>
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.6px] text-[#6b7280]">
            {t('adminReports.history.casesTitle', { name: t(history.nameKey) })}
          </p>

          <ul className="mt-3 space-y-3">
            {history.cases.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[#e5e7eb] px-4 py-3.5 sm:flex sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold leading-5 text-[#111827]">
                    <span className="text-[#2563eb]">#{item.code}</span>{' '}
                    {t(item.typeKey)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#6b7280]">
                    {t(item.previewKey)}
                  </p>
                  <p className="mt-1 text-[12px] text-[#9ca3af] sm:hidden">{item.date}</p>
                </div>
                <div className="mt-3 flex shrink-0 items-center gap-4 sm:mt-0">
                  <span className="hidden text-[12px] text-[#9ca3af] sm:inline">{item.date}</span>
                  <button
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-semibold text-[#2563eb] hover:underline"
                  >
                    {t('adminReports.history.open')}
                    <ExternalLink size={14} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
});

UserModerationHistoryModal.displayName = 'UserModerationHistoryModal';

export default UserModerationHistoryModal;
