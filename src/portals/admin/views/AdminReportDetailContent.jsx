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
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SixStoryStrip from '@/components/data-display/SixStoryStrip/SixStoryStrip';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import UserModerationHistoryModal from '@/portals/admin/components/admin-reports/UserModerationHistoryModal';
import {
  formatReportDate,
  REASON_LABEL_KEYS,
} from '@/portals/admin/data/adminReportsData';
import {
  getAdminReportDetailsApi,
  REPORT_ACTION_TYPES,
  REPORTS_QUERY_KEY,
  REPORTS_STATS_QUERY_KEY,
  resolveMediaUrl,
  takeAdminReportActionApi,
} from '@/shared/api/reports.api';
import { ROUTES } from '@/shared/config';

const MODERATION_ACTIONS = [
  {
    id: 'remove',
    action: REPORT_ACTION_TYPES.CONTENT_REMOVED,
    labelKey: 'adminReports.detail.actions.remove',
    className: 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]',
  },
  {
    id: 'warn',
    action: REPORT_ACTION_TYPES.WARN,
    labelKey: 'adminReports.detail.actions.warn',
    className: 'bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]',
  },
  {
    id: 'suspend',
    action: REPORT_ACTION_TYPES.SUSPEND,
    labelKey: 'adminReports.detail.actions.suspend',
    className: 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#fed7aa]',
  },
  {
    id: 'block',
    action: REPORT_ACTION_TYPES.BAN,
    labelKey: 'adminReports.detail.actions.block',
    className: 'bg-[#f3e8ff] text-[#6b21a8] hover:bg-[#e9d5ff]',
  },
  {
    id: 'resolve',
    action: REPORT_ACTION_TYPES.MARK_RESOLVED,
    labelKey: 'adminReports.detail.actions.resolve',
    className: 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]',
  },
];

const AdminReportDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeSlide, setActiveSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const {
    data: report,
    isLoading,
  } = useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'detail', id],
    queryFn: () => getAdminReportDetailsApi(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center text-[#687186]">
        <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
        <span className="text-[14px] font-medium">
          {t('adminReports.loadingDetail', 'Loading report details...')}
        </span>
      </div>
    );
  }

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
        <p className="text-[16px] text-[#687186]">
          {t('adminReports.detail.notFound')}
        </p>
      </div>
    );
  }

  const [submittingActionId, setSubmittingActionId] = useState(null);

  const handleModerationAction = async (actionObj) => {
    setSubmittingActionId(actionObj.id);
    try {
      await takeAdminReportActionApi(report.id, actionObj.action);
      queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REPORTS_STATS_QUERY_KEY });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: REPORTS_STATS_QUERY_KEY });
      }, 500);
      toast.success(t(`adminReports.detail.actions.${actionObj.id}Success`));
    } catch (err) {
      console.error('Moderation action failed:', err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to apply moderation action',
      );
    } finally {
      setSubmittingActionId(null);
    }
  };

  const reporter = report.reporter || {};
  const reporterAvatar =
    resolveMediaUrl(reporter.avatar) ||
    '/assets/competition-details/avatar-1.webp';
  const reporterName =
    reporter.name ||
    reporter.username ||
    (reporter.nameKey ? t(reporter.nameKey) : 'Anonymous Reporter');
  const reporterRole =
    reporter.role || (reporter.roleKey ? t(reporter.roleKey) : 'User');
  const reporterLocation =
    [reporter.city, reporter.country].filter(Boolean).join(', ') ||
    (reporter.locationKey ? t(reporter.locationKey) : '');

  const reportedUser = report.reportedUser || {};
  const reportedUserAvatar =
    resolveMediaUrl(reportedUser.avatar) ||
    '/assets/competition-details/avatar-3.webp';
  const reportedUserName =
    reportedUser.name ||
    reportedUser.username ||
    (reportedUser.nameKey ? t(reportedUser.nameKey) : 'Reported User');
  const reportedUserRole =
    reportedUser.role ||
    (reportedUser.roleKey ? t(reportedUser.roleKey) : 'Photographer');
  const reportedUserLocation =
    [reportedUser.city, reportedUser.country].filter(Boolean).join(', ') ||
    (reportedUser.locationKey ? t(reportedUser.locationKey) : '');
  const reportedUserReportCount =
    reportedUser.reportsCount ?? reportedUser.reportCount ?? 1;
  const reportedUserWarnings =
    reportedUser.warningsCount ?? reportedUser.warnings ?? 0;

  const reportedItem = report.reportedItem || {};
  const mediaList = Array.isArray(reportedItem.media) ? reportedItem.media : [];

  const slides =
    mediaList.length > 0
      ? mediaList.map((m, idx) => ({
          id: m.id || `slide-${idx}`,
          number:
            m.slotIndex != null
              ? String(m.slotIndex + 1).padStart(2, '0')
              : String(idx + 1).padStart(2, '0'),
          sign: m.zodiacSign || (m.kind === 'VIDEO' ? 'Video' : 'Photo'),
          thumb: resolveMediaUrl(m.thumbnailUrl || m.url),
          url: resolveMediaUrl(m.url),
          isVideo: m.kind === 'VIDEO' || m.url?.endsWith('.mp4'),
        }))
      : report.media?.slides || [];

  const activeMedia = mediaList[activeSlide] || mediaList[0];
  const heroUrl = resolveMediaUrl(
    activeMedia?.url ||
      activeMedia?.thumbnailUrl ||
      report.media?.hero ||
      '/assets/competition-details/hero.webp',
  );
  const isVideo = activeMedia?.kind === 'VIDEO' || heroUrl?.endsWith('.mp4');

  const itemTitle =
    reportedItem.title ||
    (report.media?.titleKey ? t(report.media.titleKey) : '');
  const itemDescription =
    reportedItem.body ||
    (report.media?.descriptionKey ? t(report.media.descriptionKey) : '');
  const itemKind =
    reportedItem.kind || report.type || t('adminReports.detail.singlePhoto');
  const itemCategories = reportedItem.category
    ? [reportedItem.category]
    : report.media?.categories || ['Stock Photos'];
  const itemCredit = reportedUserName || report.media?.credit || 'Creator';
  const creativeNumber =
    reportedItem.id?.slice(0, 10) || report.media?.creativeNumber || '1234567890';
  const resolution =
    reportedItem.resolution ||
    (activeMedia?.width && activeMedia?.height
      ? `${activeMedia.width}x${activeMedia.height}`
      : report.media?.resolution || '1920x1080');
  const quality = reportedItem.quality || report.media?.quality || '4K';
  const format =
    reportedItem.format ||
    activeMedia?.format ||
    report.media?.format ||
    'JPEG';
  const fileSize = activeMedia?.bytes
    ? `${Math.round((activeMedia.bytes / 1024 / 1024) * 10) / 10} MB`
    : report.media?.fileSize || '15 MB';
  const uploadDate = reportedItem.createdAt
    ? formatReportDate(reportedItem.createdAt)
    : report.media?.uploadDate || '';
  const votes = reportedItem.votes ?? report.media?.votes ?? 0;
  const views = reportedItem.views ?? report.media?.views ?? 0;

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
          <TriangleAlert
            size={22}
            className="mt-0.5 shrink-0 text-[#d97706]"
            aria-hidden="true"
          />
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#92400e]">
              {t('adminReports.detail.reportReason')}:{' '}
              {report.reason
                ? REASON_LABEL_KEYS[report.reason]
                  ? t(REASON_LABEL_KEYS[report.reason])
                  : report.reason
                : ''}
            </p>
            <p className="mt-2 text-[15px] leading-6 text-[#374151]">
              {report.details ||
                (report.reasonCommentKey ? t(report.reasonCommentKey) : '')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
            {t('adminReports.detail.reporterInfo')}
          </p>
          <div className="mt-4 flex items-start gap-3">
            <Image
              src={reporterAvatar}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[18px] font-bold leading-7 text-[#111827]">
                {reporterName}
              </p>
              <p className="text-[14px] leading-5 text-[#6b7280]">
                {reporterRole}
              </p>
              {reporterLocation ? (
                <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[#6b7280]">
                  <MapPin size={14} aria-hidden="true" />
                  {reporterLocation}
                </p>
              ) : null}
            </div>
          </div>
          <Button
            unstyled
            type="button"
            onClick={() => {
              if (reporter?.username) {
                navigate(`${ROUTES.PHOTOGRAPHER_PROFILE}?username=${encodeURIComponent(reporter.username)}`);
              } else {
                navigate(ROUTES.PHOTOGRAPHER_PROFILE);
              }
            }}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-[#f9fafb]"
          >
            <UserRound size={16} aria-hidden="true" />
            {t('adminReports.detail.viewReporterProfile')}
          </Button>
        </article>

        <article className="rounded-xl border border-[#e5e7eb] bg-white p-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
            {t('adminReports.detail.reportedUser')}
          </p>
          <div className="mt-4 flex items-start gap-3">
            <Image
              src={reportedUserAvatar}
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[18px] font-bold leading-7 text-[#111827]">
                {reportedUserName}
              </p>
              <p className="text-[14px] leading-5 text-[#6b7280]">
                {reportedUserRole}
              </p>
              {reportedUserLocation ? (
                <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[#6b7280]">
                  <MapPin size={14} aria-hidden="true" />
                  {reportedUserLocation}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-[13px]">
            <span className="rounded-lg bg-[#fee2e2] px-3 py-1.5 font-bold text-[#991b1b]">
              {t('adminReports.detail.userReports', {
                count: reportedUserReportCount,
              })}
            </span>
            <span className="rounded-lg bg-[#fef3c7] px-3 py-1.5 font-bold text-[#92400e]">
              {t('adminReports.detail.userWarnings', {
                count: reportedUserWarnings,
              })}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              unstyled
              type="button"
              onClick={() => {
                if (reportedUser?.username) {
                  navigate(`${ROUTES.PHOTOGRAPHER_PROFILE}?username=${encodeURIComponent(reportedUser.username)}`);
                } else {
                  navigate(ROUTES.PHOTOGRAPHER_PROFILE);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-[#f9fafb]"
            >
              <UserRound size={16} aria-hidden="true" />
              {t('adminReports.detail.userProfile')}
            </Button>
            <Button
              unstyled
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#fde8e9] px-4 py-2 text-[14px] font-semibold text-[#ee1c25] hover:bg-[#fcd4d6]"
            >
              <ShieldAlert size={16} aria-hidden="true" />
              {t('adminReports.detail.auditHistory')}
            </Button>
          </div>
        </article>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="relative">
          {isVideo ? (
            <video
              src={heroUrl}
              controls
              className="aspect-21/9 w-full object-cover bg-black"
            />
          ) : (
            <Image
              src={heroUrl}
              alt=""
              className="aspect-21/9 w-full object-cover"
            />
          )}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-md bg-[#ee1c25] px-2.5 py-1 text-[12px] font-bold text-white">
            {slides[activeSlide]?.sign || 'Photo'}
          </span>
        </div>

        {slides.length > 1 ? (
          <div className="px-4 pb-2 pt-4 sm:px-6">
            <SixStoryStrip
              slides={slides}
              activeIndex={activeSlide}
              onSelect={setActiveSlide}
            />
          </div>
        ) : null}

        {isVideo && !isPlayingVideo ? (
          <div className="relative mx-4 mb-4 overflow-hidden rounded-xl sm:mx-6">
            <video
              src={heroUrl}
              controls
              className="aspect-video w-full object-cover bg-black"
            />
          </div>
        ) : null}

        <div className="px-4 pb-6 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-bold uppercase text-[#374151]">
              {itemKind}
            </span>
            {itemCategories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-bold uppercase text-[#374151]"
              >
                {cat}
              </span>
            ))}
          </div>
          <h2 className="mt-4 text-[24px] font-bold leading-8 text-[#111827]">
            {itemTitle}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#4b5563]">
            {itemDescription}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-[#f9fafb] p-4 sm:grid-cols-2">
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.credit')}
                </dt>
                <dd className="font-medium text-[#111827]">{itemCredit}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.creativeNumber')}
                </dt>
                <dd className="font-medium text-[#111827]">{creativeNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.resolution')}
                </dt>
                <dd className="font-medium text-[#111827]">{resolution}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.quality')}
                </dt>
                <dd className="font-medium text-[#111827]">{quality}</dd>
              </div>
            </dl>
            <dl className="space-y-2 text-[14px]">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.format')}
                </dt>
                <dd className="font-medium text-[#111827]">{format}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.fileSize')}
                </dt>
                <dd className="font-medium text-[#111827]">{fileSize}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.uploadDate')}
                </dt>
                <dd className="font-medium text-[#111827]">{uploadDate}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">
                  {t('adminReports.detail.categories')}
                </dt>
                <dd className="text-right font-medium text-[#111827]">
                  {itemCategories.join(', ')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e5e7eb] px-4 py-3 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
                {t('adminReports.detail.votesReceived')}
              </p>
              <p className="text-[24px] font-extrabold text-[#111827]">
                {votes}
              </p>
            </div>
            <div className="rounded-xl border border-[#e5e7eb] px-4 py-3 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
                {t('adminReports.detail.viewsCounted')}
              </p>
              <p className="text-[24px] font-extrabold text-[#111827]">
                {views}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#9ca3af]">
          {t('adminReports.detail.moderationTitle')}
        </p>
        <p className="mt-1 text-[14px] text-[#6b7280]">
          {t('adminReports.detail.moderationHint')}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {MODERATION_ACTIONS.map((action) => {
            const isSubmitting = submittingActionId === action.id;
            return (
              <Button
                unstyled
                key={action.id}
                type="button"
                disabled={Boolean(submittingActionId)}
                onClick={() => handleModerationAction(action)}
                className={`inline-flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-3 text-[13px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
              >
                {isSubmitting ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : action.id === 'block' ? (
                  <Ban size={18} aria-hidden="true" />
                ) : action.id === 'resolve' ? (
                  <CircleCheck size={18} aria-hidden="true" />
                ) : (
                  <ShieldAlert size={18} aria-hidden="true" />
                )}
                {t(action.labelKey)}
              </Button>
            );
          })}
        </div>
      </section>

      <UserModerationHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        user={reportedUser}
      />
    </div>
  );
});

AdminReportDetailContent.displayName = 'AdminReportDetailContent';

export default AdminReportDetailContent;
