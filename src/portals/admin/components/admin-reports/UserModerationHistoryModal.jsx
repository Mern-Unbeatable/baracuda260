import {
  History,
  Mail,
  MapPin,
  TriangleAlert,
  X,
} from 'lucide-react';
import React, { memo, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { formatReportDate } from '@/portals/admin/data/adminReportsData';
import {
  getUserAuditHistoryApi,
  getUserProfileApi,
  resolveMediaUrl,
} from '@/shared/api/reports.api';

/**
 * @param {{ open: boolean, onClose: () => void, user?: object }} props
 */
const UserModerationHistoryModal = memo(({ open, onClose, user }) => {
  const { t } = useTranslation();
  const titleId = useId();

  const { data: auditData, isLoading: isAuditLoading } = useQuery({
    queryKey: ['admin-user-audit-history', user?.id],
    queryFn: () => getUserAuditHistoryApi(user?.id),
    enabled: Boolean(open && user?.id),
    staleTime: 30 * 1000,
  });

  const { data: profileData } = useQuery({
    queryKey: ['user-profile', user?.username],
    queryFn: () => getUserProfileApi(user?.username),
    enabled: Boolean(open && user?.username),
    staleTime: 60 * 1000,
  });

  const displayName =
    profileData?.name ||
    user?.name ||
    profileData?.username ||
    user?.username ||
    'User';

  const displayAvatar =
    resolveMediaUrl(profileData?.avatar || user?.avatar) ||
    '/assets/competition-details/avatar-3.webp';

  const displayLocation =
    [profileData?.city || user?.city, profileData?.country || user?.country]
      .filter(Boolean)
      .join(', ') || '';

  const displayEmail = user?.email || profileData?.email || '';

  const memberSince = profileData?.createdAt
    ? formatReportDate(profileData.createdAt)
    : user?.createdAt
      ? formatReportDate(user.createdAt)
      : '';

  const totalReports =
    auditData?.totalReports ?? user?.reportsCount ?? 0;
  const warnings =
    auditData?.warnings ?? user?.warningsCount ?? 0;
  const suspensions =
    auditData?.suspensions ?? 0;
  const bans =
    auditData?.bans ?? 0;

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
    {
      id: 'totalReports',
      value: totalReports,
      valueClass: 'text-[#ee1c25]',
    },
    {
      id: 'warnings',
      value: warnings,
      valueClass: 'text-[#d97706]',
    },
    {
      id: 'suspensions',
      value: suspensions,
      valueClass: 'text-[#111827]',
    },
    { id: 'bans', value: bans, valueClass: 'text-[#111827]' },
  ];

  const historyList = Array.isArray(auditData?.history) ? auditData.history : [];
  const casesInvolvedList = Array.isArray(auditData?.casesInvolved)
    ? auditData.casesInvolved
    : [];

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
          <Button
            unstyled
            type="button"
            onClick={onClose}
            aria-label={t('adminReports.history.close')}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10"
          >
            <X size={18} aria-hidden="true" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Image
              src={displayAvatar}
              alt=""
              width={72}
              height={72}
              className="size-18 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-[22px] font-bold leading-8 text-[#111827]">
                {displayName}
              </h3>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#6b7280]">
                {displayLocation ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} aria-hidden="true" />
                    {displayLocation}
                  </span>
                ) : null}
                {displayEmail ? (
                  <span className="inline-flex items-center gap-1">
                    <Mail size={14} aria-hidden="true" />
                    {displayEmail}
                  </span>
                ) : null}
                {memberSince ? (
                  <span>
                    {t('adminReports.history.memberSince', {
                      date: memberSince,
                    })}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 py-1 text-[12px] font-semibold text-[#991b1b]">
                <TriangleAlert size={14} aria-hidden="true" />
                {t('adminReports.reportCount', { count: totalReports })}
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
                <p
                  className={`pt-2 text-[28px] font-extrabold leading-8 ${card.valueClass}`}
                >
                  {card.value}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.6px] text-[#6b7280]">
            {t('adminReports.history.casesTitle', { name: displayName })}
          </p>

          {isAuditLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-[#687186]">
              <div className="size-6 animate-spin rounded-full border-2 border-[#4048cd] border-t-transparent" />
              <span className="text-[13px] font-medium">Loading history...</span>
            </div>
          ) : historyList.length > 0 || casesInvolvedList.length > 0 ? (
            <div className="mt-3 flex flex-col gap-4">
              {historyList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#e5e7eb] px-4 py-3.5 sm:flex sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold leading-5 text-[#111827]">
                      <span className="rounded bg-[#fee2e2] px-2 py-0.5 text-[11px] font-bold text-[#991b1b]">
                        {item.action}
                      </span>
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-[#4b5563]">
                      {item.reason}
                    </p>
                    <p className="mt-1 text-[12px] text-[#9ca3af] sm:hidden">
                      {formatReportDate(item.createdAt)}
                    </p>
                  </div>
                  <span className="hidden text-[12px] text-[#9ca3af] sm:inline">
                    {formatReportDate(item.createdAt)}
                  </span>
                </div>
              ))}

              {casesInvolvedList.length > 0 ? (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#6b7280]">
                    Cases Involved
                  </p>
                  {casesInvolvedList.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#111827]">
                          {c.reason}
                        </span>
                        <span className="rounded-md bg-[#e0e7ff] px-2 py-0.5 text-[11px] font-bold text-[#3730a3]">
                          {c.status}
                        </span>
                      </div>
                      {c.details ? (
                        <p className="mt-1 text-[12px] text-[#6b7280]">
                          {c.details}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="py-6 text-center text-[14px] text-[#9ca3af]">
              No moderation history or cases found for this user.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
});

UserModerationHistoryModal.displayName = 'UserModerationHistoryModal';

export default UserModerationHistoryModal;
