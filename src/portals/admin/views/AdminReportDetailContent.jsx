import {
  ArrowLeft,
  Ban,
  CircleCheck,
  MapPin,
  ShieldAlert,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
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
import { optimizeImageUrl } from '@/shared/utils/media';

const MODERATION_ACTIONS_BASE = [
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
];

const SUSPEND_ACTION = {
  id: 'suspend',
  action: REPORT_ACTION_TYPES.SUSPEND,
  labelKey: 'adminReports.detail.actions.suspend',
  className: 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#fed7aa]',
};

const UNSUSPEND_ACTION = {
  id: 'unsuspend',
  action: REPORT_ACTION_TYPES.UNSUSPEND,
  labelKey: 'adminReports.detail.actions.unsuspend',
  className: 'bg-[#ffedd5] text-[#9a3412] hover:bg-[#fed7aa]',
};

const BLOCK_ACTION = {
  id: 'block',
  action: REPORT_ACTION_TYPES.BAN,
  labelKey: 'adminReports.detail.actions.block',
  className: 'bg-[#f3e8ff] text-[#6b21a8] hover:bg-[#e9d5ff]',
};

const UNBLOCK_ACTION = {
  id: 'unblock',
  action: REPORT_ACTION_TYPES.UNBAN,
  labelKey: 'adminReports.detail.actions.unblock',
  className: 'bg-[#f3e8ff] text-[#6b21a8] hover:bg-[#e9d5ff]',
};

const RESOLVE_ACTION = {
  id: 'resolve',
  action: REPORT_ACTION_TYPES.MARK_RESOLVED,
  labelKey: 'adminReports.detail.actions.resolve',
  className: 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]',
};

const getModerationActions = (userStatus) => {
  const status = String(userStatus || '').toUpperCase();
  return [
    ...MODERATION_ACTIONS_BASE,
    status === 'SUSPENDED' ? UNSUSPEND_ACTION : SUSPEND_ACTION,
    status === 'BANNED' ? UNBLOCK_ACTION : BLOCK_ACTION,
    RESOLVE_ACTION,
  ];
};

const displayValue = (value) => {
  if (value == null || value === '') return '—';
  return value;
};

const formatBytes = (bytes) => {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${Math.round((size / 1024 / 1024) * 10) / 10} MB`;
};

const DetailRow = memo(({ label, value }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="shrink-0 text-[12px] text-[#6b7280]">{label}</dt>
    <dd className="min-w-0 break-words text-right text-[13px] font-medium text-[#111827]">
      {displayValue(value)}
    </dd>
  </div>
));
DetailRow.displayName = 'DetailRow';

const PersonCard = memo(
  ({
    title,
    avatar,
    name,
    role,
    location,
    badges,
    primaryAction,
    secondaryAction,
  }) => (
    <article className="rounded-xl border border-[#f3f4f6] bg-white p-4 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">
        {title}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <Image
          src={avatar}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold leading-5 text-[#111827]">
            {name}
          </p>
          {role ? (
            <p className="mt-0.5 truncate text-[13px] text-[#6b7280]">{role}</p>
          ) : null}
          {location ? (
            <p className="mt-1 inline-flex max-w-full items-center gap-1 text-[12px] text-[#6b7280]">
              <MapPin size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          ) : null}
        </div>
      </div>
      {badges?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">{badges}</div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {primaryAction}
        {secondaryAction}
      </div>
    </article>
  ),
);
PersonCard.displayName = 'PersonCard';

const AdminReportDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeSlide, setActiveSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [submittingActionId, setSubmittingActionId] = useState(null);

  const { data: report, isLoading, isError } = useQuery({
    queryKey: [...REPORTS_QUERY_KEY, 'detail', id],
    queryFn: () => getAdminReportDetailsApi(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    setActiveSlide(0);
  }, [id]);

  const handleModerationAction = async (actionObj) => {
    if (!report?.id) return;
    setSubmittingActionId(actionObj.id);
    try {
      await takeAdminReportActionApi(report.id, actionObj.action);
      await queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: REPORTS_STATS_QUERY_KEY });
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

  const derived = useMemo(() => {
    if (!report) return null;

    const reporter = report.reporter || {};
    const reportedUser = report.reportedUser || {};
    const reportedItem = report.reportedItem || {};
    const mediaList = Array.isArray(reportedItem.media)
      ? reportedItem.media
      : [];

    const slides =
      mediaList.length > 0
        ? mediaList.map((m, idx) => {
            const thumbSrc = resolveMediaUrl(m.thumbnailUrl || m.url);
            return {
              id: m.id || `slide-${idx}`,
              number:
                m.slotIndex != null
                  ? String(m.slotIndex + 1).padStart(2, '0')
                  : String(idx + 1).padStart(2, '0'),
              sign: m.zodiacSign || (m.kind === 'VIDEO' ? 'Video' : 'Photo'),
              thumb: optimizeImageUrl(thumbSrc, 240) || thumbSrc,
              url: resolveMediaUrl(m.url),
              isVideo: m.kind === 'VIDEO' || m.url?.endsWith?.('.mp4'),
            };
          })
        : [];

    const safeIndex = Math.min(activeSlide, Math.max(slides.length - 1, 0));
    const activeMedia = mediaList[safeIndex] || mediaList[0] || null;
    const fullUrl = resolveMediaUrl(activeMedia?.url) || '';
    const thumbUrl = resolveMediaUrl(activeMedia?.thumbnailUrl) || '';
    const isVideo =
      activeMedia?.kind === 'VIDEO' ||
      /\.(mp4|webm|mov)(\?|$)/i.test(fullUrl);

    // Prefer resized/thumbnail for images (avoids decoding huge RAW/JPEG).
    // Always use the real media URL for video playback.
    const heroUrl = isVideo
      ? fullUrl
      : optimizeImageUrl(thumbUrl || fullUrl, 1200) ||
        thumbUrl ||
        fullUrl;

    const itemTitle =
      reportedItem.title ||
      reportedItem.body ||
      t('adminReports.detail.untitled', 'Untitled content');
    const itemDescription = reportedItem.body || '';
    const itemKind = reportedItem.kind || report.type || '—';
    const itemCategories = reportedItem.category
      ? [reportedItem.category]
      : [];

    const resolution =
      reportedItem.resolution ||
      (activeMedia?.width && activeMedia?.height
        ? `${activeMedia.width} × ${activeMedia.height}`
        : null);
    const fileSize =
      formatBytes(activeMedia?.bytes) ||
      (reportedItem.fileSize ? String(reportedItem.fileSize) : null);

    const formatFromUrl = (() => {
      const match = String(fullUrl || '').match(
        /\.([a-z0-9]+)(?:\?|$)/i,
      );
      return match ? match[1].toUpperCase() : null;
    })();

    return {
      reporter,
      reportedUser,
      reportedItem,
      slides,
      safeIndex,
      heroUrl,
      isVideo,
      itemTitle,
      itemDescription,
      itemKind,
      itemCategories,
      resolution,
      fileSize,
      quality: reportedItem.quality || null,
      format:
        reportedItem.format ||
        activeMedia?.format ||
        formatFromUrl ||
        null,
      uploadDate: reportedItem.createdAt
        ? formatReportDate(reportedItem.createdAt)
        : null,
      votes: reportedItem.votes ?? 0,
      views: reportedItem.views ?? 0,
      creativeNumber: reportedItem.id
        ? String(reportedItem.id).slice(0, 8).toUpperCase()
        : null,
    };
  }, [report, activeSlide, t]);

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

  if (isError || !report || !derived) {
    return (
      <div className="flex flex-col gap-4 py-8">
        <Link
          to={ROUTES.ADMIN_REPORTS}
          className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#687186] transition hover:text-[#ee1c25]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {t('adminReports.detail.back')}
        </Link>
        <p className="text-[15px] text-[#687186]">
          {t('adminReports.detail.notFound')}
        </p>
      </div>
    );
  }

  const {
    reporter,
    reportedUser,
    slides,
    safeIndex,
    heroUrl,
    isVideo,
    itemTitle,
    itemDescription,
    itemKind,
    itemCategories,
    resolution,
    fileSize,
    quality,
    format,
    uploadDate,
    votes,
    views,
    creativeNumber,
  } = derived;

  const reporterAvatar =
    resolveMediaUrl(reporter.avatar) ||
    '/assets/competition-details/avatar-1.webp';
  const reporterName =
    reporter.name || reporter.username || t('adminReports.detail.anonymousReporter', 'Anonymous Reporter');
  const reporterLocation = [reporter.city, reporter.country]
    .filter(Boolean)
    .join(', ');

  const reportedUserAvatar =
    resolveMediaUrl(reportedUser.avatar) ||
    '/assets/competition-details/avatar-3.webp';
  const reportedUserName =
    reportedUser.name ||
    reportedUser.username ||
    t('adminReports.detail.reportedUserFallback', 'Reported User');
  const reportedUserLocation = [reportedUser.city, reportedUser.country]
    .filter(Boolean)
    .join(', ');
  const reportedUserReportCount = reportedUser.reportsCount ?? 0;
  const reportedUserWarnings = reportedUser.warningsCount ?? 0;

  const reasonLabel = report.reason
    ? REASON_LABEL_KEYS[report.reason]
      ? t(REASON_LABEL_KEYS[report.reason])
      : report.reason
    : '—';

  return (
    <div className="flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
      <Link
        to={ROUTES.ADMIN_REPORTS}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#687186] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t('adminReports.detail.back')}
      </Link>

      <div className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex items-start gap-3">
          <TriangleAlert
            size={20}
            className="mt-0.5 shrink-0 text-[#d97706]"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#92400e]">
              {t('adminReports.detail.reportReason')}: {reasonLabel}
            </p>
            <p className="mt-1.5 text-[14px] leading-6 text-[#374151]">
              {report.details ||
                t(
                  'adminReports.detail.noDetails',
                  'No additional details provided.',
                )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <PersonCard
          title={t('adminReports.detail.reporterInfo')}
          avatar={optimizeImageUrl(reporterAvatar, 96) || reporterAvatar}
          name={reporterName}
          role={reporter.role || 'User'}
          location={reporterLocation}
          primaryAction={
            <Button
              unstyled
              type="button"
              onClick={() => {
                if (reporter?.username) {
                  navigate(
                    `${ROUTES.PHOTOGRAPHER_PROFILE}?username=${encodeURIComponent(reporter.username)}`,
                  );
                }
              }}
              disabled={!reporter?.username}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRound size={15} aria-hidden="true" />
              {t('adminReports.detail.viewReporterProfile')}
            </Button>
          }
        />

        <PersonCard
          title={t('adminReports.detail.reportedUser')}
          avatar={
            optimizeImageUrl(reportedUserAvatar, 96) || reportedUserAvatar
          }
          name={reportedUserName}
          role={reportedUser.role || 'Photographer'}
          location={reportedUserLocation}
          badges={[
            <span
              key="reports"
              className="rounded-md bg-[#fee2e2] px-2.5 py-1 text-[12px] font-bold text-[#991b1b]"
            >
              {t('adminReports.detail.userReports', {
                count: reportedUserReportCount,
              })}
            </span>,
            <span
              key="warnings"
              className="rounded-md bg-[#fef3c7] px-2.5 py-1 text-[12px] font-bold text-[#92400e]"
            >
              {t('adminReports.detail.userWarnings', {
                count: reportedUserWarnings,
              })}
            </span>,
          ]}
          primaryAction={
            <Button
              unstyled
              type="button"
              onClick={() => {
                if (reportedUser?.username) {
                  navigate(
                    `${ROUTES.PHOTOGRAPHER_PROFILE}?username=${encodeURIComponent(reportedUser.username)}`,
                  );
                }
              }}
              disabled={!reportedUser?.username}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRound size={15} aria-hidden="true" />
              {t('adminReports.detail.userProfile')}
            </Button>
          }
          secondaryAction={
            <Button
              unstyled
              type="button"
              onClick={() => setHistoryOpen(true)}
              disabled={!reportedUser?.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#fde8e9] px-3 py-2 text-[13px] font-semibold text-[#ee1c25] transition hover:bg-[#fcd4d6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldAlert size={15} aria-hidden="true" />
              {t('adminReports.detail.auditHistory')}
            </Button>
          }
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
        <div className="relative overflow-hidden bg-[#f1f5f9]">
          {heroUrl ? (
            isVideo ? (
              <video
                key={heroUrl}
                src={heroUrl}
                controls
                preload="metadata"
                className="aspect-video w-full object-cover"
              />
            ) : (
              <Image
                src={heroUrl}
                alt=""
                priority
                className="aspect-video w-full object-cover"
              />
            )
          ) : (
            <div className="flex aspect-video items-center justify-center text-[13px] text-[#94a3b8]">
              {t('adminReports.detail.noMedia', 'No media available')}
            </div>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-[#ee1c25] px-2 py-1 text-[11px] font-bold text-white">
            {slides[safeIndex]?.sign || itemKind || 'Media'}
          </span>
        </div>

        {slides.length > 1 ? (
          <div className="border-b border-[#f1f5f9] px-3 py-3 sm:px-5">
            <SixStoryStrip
              slides={slides}
              activeIndex={safeIndex}
              onSelect={setActiveSlide}
            />
          </div>
        ) : null}

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold uppercase text-[#475569]">
              {itemKind}
            </span>
            {itemCategories.map((cat) => (
              <span
                key={cat}
                className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold uppercase text-[#475569]"
              >
                {cat}
              </span>
            ))}
          </div>

          <h2 className="mt-3 text-[20px] font-bold leading-7 text-[#111827] sm:text-[22px]">
            {itemTitle}
          </h2>
          {itemDescription && itemDescription !== itemTitle ? (
            <p className="mt-2 text-[14px] leading-6 text-[#4b5563]">
              {itemDescription}
            </p>
          ) : null}

          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 rounded-xl bg-[#f8fafc] p-3.5 sm:grid-cols-2 sm:p-4">
            <DetailRow
              label={t('adminReports.detail.credit')}
              value={reportedUserName}
            />
            <DetailRow
              label={t('adminReports.detail.creativeNumber')}
              value={creativeNumber}
            />
            <DetailRow
              label={t('adminReports.detail.resolution')}
              value={resolution}
            />
            <DetailRow
              label={t('adminReports.detail.quality')}
              value={quality}
            />
            <DetailRow
              label={t('adminReports.detail.format')}
              value={format}
            />
            <DetailRow
              label={t('adminReports.detail.fileSize')}
              value={fileSize}
            />
            <DetailRow
              label={t('adminReports.detail.uploadDate')}
              value={uploadDate}
            />
            <DetailRow
              label={t('adminReports.detail.categories')}
              value={itemCategories.length ? itemCategories.join(', ') : null}
            />
          </dl>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#f1f5f9] px-3 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">
                {t('adminReports.detail.votesReceived')}
              </p>
              <p className="mt-1 text-[22px] font-extrabold text-[#111827]">
                {votes}
              </p>
            </div>
            <div className="rounded-xl border border-[#f1f5f9] px-3 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">
                {t('adminReports.detail.viewsCounted')}
              </p>
              <p className="mt-1 text-[22px] font-extrabold text-[#111827]">
                {views}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#f3f4f6] bg-white p-4 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#9ca3af]">
          {t('adminReports.detail.moderationTitle')}
        </p>
        <p className="mt-1 text-[13px] text-[#6b7280]">
          {t('adminReports.detail.moderationHint')}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {getModerationActions(reportedUser.status).map((action) => {
            const isSubmitting = submittingActionId === action.id;
            return (
              <Button
                unstyled
                key={action.id}
                type="button"
                disabled={Boolean(submittingActionId)}
                onClick={() => handleModerationAction(action)}
                className={`inline-flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-[12px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-[13px] ${action.className}`}
              >
                {isSubmitting ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : action.id === 'block' || action.id === 'unblock' ? (
                  <Ban size={16} aria-hidden="true" />
                ) : action.id === 'resolve' ? (
                  <CircleCheck size={16} aria-hidden="true" />
                ) : (
                  <ShieldAlert size={16} aria-hidden="true" />
                )}
                <span className="text-center leading-4">{t(action.labelKey)}</span>
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
