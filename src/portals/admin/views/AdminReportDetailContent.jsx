import { useTranslation } from 'react-i18next';
import React, { memo, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Ban,
  CircleCheck,
  MapPin,
  Play,
  ShieldAlert,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  ADMIN_REPORTS_ROWS,
  REASON_LABEL_KEYS,
  REPORT_STATUS,
  getReportById,
  updateReportStatus,
} from '@/portals/admin/data/adminReportsData';
import UserModerationHistoryModal from '@/portals/admin/components/admin-reports/UserModerationHistoryModal';
import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip';

const MODERATION_ACTIONS = [
  { id: 'remove', labelKey: 'adminReports.detail.actions.remove', className: 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]' },
  { id: 'warn', labelKey: 'adminReports.detail.actions.warn', className: 'bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]' },
  { id: 'suspend', labelKey: 'adminReports.detail.actions.suspend', className: 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#fed7aa]' },
  { id: 'block', labelKey: 'adminReports.detail.actions.block', className: 'bg-[#f3e8ff] text-[#6b21a8] hover:bg-[#e9d5ff]' },
  { id: 'resolve', labelKey: 'adminReports.detail.actions.resolve', className: 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]' },
];

const AdminReportDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [rows, setRows] = useState(ADMIN_REPORTS_ROWS);
  const [activeSlide, setActiveSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);

  const report = useMemo(() => getReportById(rows, id), [rows, id]);

  if (!report) {
    return (
      <div className="flex flex-col gap-4 py-8">
        <Link
          to={ROUTES.ADMIN_REPORTS}
          className="inline-flex w-fit items-center gap-2 text-[16px] font-semibold text-[#4048cd] hover:underline"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {t('adminReports.detail.back')}
        </Link>
        <p className="text-[16px] text-[#687186]">{t('adminReports.detail.notFound')}</p>
      </div>
    );
  }

  const handleModerationAction = (actionId) => {
    if (actionId === 'resolve') {
      setRows((current) => updateReportStatus(current, report.id, REPORT_STATUS.RESOLVED));
    }
    toast.success(t(`adminReports.detail.actions.${actionId}Success`));
  };

  const media = report.media;
  const slides = media.slides || [];

  return (
    <div className="flex w-full flex-col gap-5">
      <Link
        to={ROUTES.ADMIN_REPORTS}
        className="inline-flex w-fit items-center gap-2 text-[16px] font-semibold text-[#4048cd] hover:underline"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        {t('adminReports.detail.back')}
      </Link>

      <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-5 py-4">
        <div className="flex items-start gap-3">
          <TriangleAlert size={22} className="mt-0.5 shrink-0 text-[#d97706]" aria-hidden="true" />
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#92400e]">
              {t('adminReports.detail.reportReason')}: {t(REASON_LABEL_KEYS[report.reason])}
            </p>
            <p className="mt-2 text-[15px] leading-6 text-[#374151]">{t(report.reasonCommentKey)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
            {t('adminReports.detail.reporterInfo')}
          </p>
          <div className="mt-4 flex items-start gap-3">
            <img
              src={report.reporter.avatar}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[18px] font-bold leading-7 text-[#111827]">
                {t(report.reporter.nameKey)}
              </p>
              <p className="text-[14px] leading-5 text-[#6b7280]">{t(report.reporter.roleKey)}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[#6b7280]">
                <MapPin size={14} aria-hidden="true" />
                {t(report.reporter.locationKey)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-[#f9fafb]"
          >
            <UserRound size={16} aria-hidden="true" />
            {t('adminReports.detail.viewReporterProfile')}
          </button>
        </article>

        <article className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
            {t('adminReports.detail.reportedUser')}
          </p>
          <div className="mt-4 flex items-start gap-3">
            <img
              src={report.reportedUser.avatar}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[18px] font-bold leading-7 text-[#111827]">
                {t(report.reportedUser.nameKey)}
              </p>
              <p className="text-[14px] leading-5 text-[#6b7280]">
                {t(report.reportedUser.roleKey)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[#6b7280]">
                <MapPin size={14} aria-hidden="true" />
                {t(report.reportedUser.locationKey)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-[13px]">
            <span className="rounded-lg bg-[#fee2e2] px-3 py-1.5 font-bold text-[#991b1b]">
              {t('adminReports.detail.userReports', { count: report.reportedUser.reportCount })}
            </span>
            <span className="rounded-lg bg-[#fef3c7] px-3 py-1.5 font-bold text-[#92400e]">
              {t('adminReports.detail.userWarnings', { count: report.reportedUser.warnings })}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-[#f9fafb]"
            >
              <UserRound size={16} aria-hidden="true" />
              {t('adminReports.detail.userProfile')}
            </button>
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#fde8e9] px-4 py-2 text-[14px] font-semibold text-[#ee1c25] hover:bg-[#fcd4d6]"
            >
              <ShieldAlert size={16} aria-hidden="true" />
              {t('adminReports.detail.auditHistory')}
            </button>
          </div>
        </article>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="relative">
          <img src={media.hero} alt="" className="aspect-21/9 w-full object-cover" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-md bg-[#ee1c25] px-2.5 py-1 text-[12px] font-bold text-white">
            {slides[activeSlide]?.sign || 'Aries'}
          </span>
        </div>

        {slides.length > 0 ? (
          <div className="px-4 pb-2 pt-4 sm:px-6">
            <SixStoryStrip slides={slides} activeIndex={activeSlide} onSelect={setActiveSlide} />
          </div>
        ) : null}

        <div className="relative mx-4 mb-4 overflow-hidden rounded-xl sm:mx-6">
          <img src={media.preview} alt="" className="aspect-video w-full object-cover" />
          <button
            type="button"
            aria-label={t('adminReports.detail.playPreview')}
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20"
          >
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/90 text-[#111827]">
              <Play size={24} aria-hidden="true" />
            </span>
          </button>
        </div>

        <div className="px-4 pb-6 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-bold uppercase text-[#374151]">
              {t(media.albumLabelKey)}
            </span>
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-bold uppercase text-[#374151]">
              {t('adminReports.detail.natureTag')}
            </span>
          </div>
          <h2 className="mt-4 text-[24px] font-bold leading-8 text-[#111827]">
            {t(media.titleKey)}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#4b5563]">{t(media.descriptionKey)}</p>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-[#f9fafb] p-4 sm:grid-cols-2">
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.credit')}</dt>
                <dd className="font-medium text-[#111827]">{media.credit}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.creativeNumber')}</dt>
                <dd className="font-medium text-[#111827]">{media.creativeNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.resolution')}</dt>
                <dd className="font-medium text-[#111827]">{media.resolution}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.quality')}</dt>
                <dd className="font-medium text-[#111827]">{media.quality}</dd>
              </div>
            </dl>
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.format')}</dt>
                <dd className="font-medium text-[#111827]">{media.format}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.fileSize')}</dt>
                <dd className="font-medium text-[#111827]">{media.fileSize}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.uploadDate')}</dt>
                <dd className="font-medium text-[#111827]">{media.uploadDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{t('adminReports.detail.categories')}</dt>
                <dd className="text-right font-medium text-[#111827]">{media.categories.join(', ')}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e5e7eb] px-4 py-3 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
                {t('adminReports.detail.votesReceived')}
              </p>
              <p className="text-[24px] font-extrabold text-[#111827]">{media.votes}</p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] px-4 py-3 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
                {t('adminReports.detail.viewsCounted')}
              </p>
              <p className="text-[24px] font-extrabold text-[#111827]">{media.views}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#9ca3af]">
          {t('adminReports.detail.moderationTitle')}
        </p>
        <p className="mt-1 text-[14px] text-[#6b7280]">{t('adminReports.detail.moderationHint')}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {MODERATION_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleModerationAction(action.id)}
              className={`inline-flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 text-[13px] font-bold transition ${action.className}`}
            >
              {action.id === 'block' ? (
                <Ban size={18} aria-hidden="true" />
              ) : action.id === 'resolve' ? (
                <CircleCheck size={18} aria-hidden="true" />
              ) : (
                <ShieldAlert size={18} aria-hidden="true" />
              )}
              {t(action.labelKey)}
            </button>
          ))}
        </div>
      </section>

      <UserModerationHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
});

AdminReportDetailContent.displayName = 'AdminReportDetailContent';

export default AdminReportDetailContent;
