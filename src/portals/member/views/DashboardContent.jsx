import {
  Calendar,
  Camera,
  Clock,
  Compass,
  Heart,
  Trophy,
  Users,
  Wallet,
} from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';
import CreateSlideshowButton from '@/components/data-display/Slideshow/CreateSlideshowButton';
import Image from '@/components/ui/Image';
import AdminOverviewContent from '@/portals/admin/views/AdminOverviewContent';
import useUserDashboard from '@/portals/member/hooks/useUserDashboard';
import { ROUTES } from '@/shared/config';
import { isAdminRole } from '@/shared/utils/roles';

const BADGE_TONES = {
  gold: 'bg-[#ffddb8] text-[#2a1700]',
  blue: 'bg-[#dde2f3] text-[#494453]',
  winner: 'bg-[#fef3c7] text-[#92400e]',
};

const STATUS_TONES = {
  purple: 'text-[#532aa8]',
  muted: 'text-[#494453]',
  gold: 'text-[#855300]',
};

const CompetitionRow = memo(({ item }) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-4.25">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-32">
        <Image
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-[16px] font-semibold leading-7 text-[#161c27] sm:text-[18px]">
            {item.title || (item.titleKey ? t(item.titleKey) : '')}
          </h3>
          {item.tag || item.badgeKey ? (
            <span
              className={`rounded-full px-3 py-0.5 text-[12px] font-bold tracking-[0.6px] ${
                BADGE_TONES[item.badgeTone] || BADGE_TONES.blue
              }`}
            >
              {item.tag || t(item.badgeKey)}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
          {item.participantsCount != null || item.participantsKey ? (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
              <Users
                size={14}
                aria-hidden="true"
                className="shrink-0 opacity-70"
              />
              {item.participantsCount != null
                ? t('dashboard.competitions.participantsCount', {
                    count: item.participantsCount.toLocaleString(),
                    defaultValue: `${item.participantsCount.toLocaleString()} participants`,
                  })
                : t(item.participantsKey)}
            </span>
          ) : null}
          {item.timingText || item.timingKey ? (
            <span className="inline-flex items-center gap-1 text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
              {item.id === 'portrait' ? (
                <Calendar
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 opacity-70"
                />
              ) : (
                <Clock
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 opacity-70"
                />
              )}
              {item.timingText || t(item.timingKey)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-48 sm:shrink-0 sm:flex-col sm:items-end sm:justify-center sm:gap-1 sm:px-6">
        <div className="sm:w-full sm:text-right">
          <p className="text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
            {t(item.statusLabelKey || 'dashboard.competitions.yourSubmission')}
          </p>
          <p
            className={`mt-0.5 inline-flex items-center gap-1 text-[15px] font-bold sm:text-[16px] sm:leading-6 ${
              STATUS_TONES[item.statusTone] || STATUS_TONES.purple
            }`}
          >
            {item.showTrophy ? (
              <Trophy size={14} aria-hidden="true" className="text-[#855300]" />
            ) : null}
            {item.rankStr || (item.statusValueKey ? t(item.statusValueKey) : '')}
          </p>
        </div>
      </div>
    </article>
  );
});

CompetitionRow.displayName = 'CompetitionRow';

const UserDashboardView = memo(() => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const {
    stats,
    participatingCompetitions,
    isLoading,
    isError,
    refetch,
  } = useUserDashboard();

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    t('dashboard.defaultName');

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <section className="relative flex min-h-50 items-center overflow-hidden rounded-2xl bg-[#2a303d] px-5 py-8 sm:min-h-55 sm:rounded-3xl sm:px-8 sm:py-10 lg:min-h-64 lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#2a303d] via-[#2a303d]/80 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex max-w-3xl flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.96px] text-white sm:text-[36px] lg:text-[48px] lg:leading-14">
            {t('dashboard.welcome', { name: displayName })}
          </h1>
          <p className="max-w-xl text-[15px] leading-normal text-white/70 sm:text-[18px] lg:text-[20px]">
            {t('dashboard.welcomeBody')}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3 sm:pt-4">
            <Link
              to={ROUTES.USER_MY_ARTWORK_UPLOAD}
              className="inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-6 py-3 text-[13px] font-semibold tracking-[0.28px] text-white transition hover:bg-[#d41921] sm:px-8 sm:text-[14px]"
            >
              <Camera size={18} aria-hidden="true" />
              {t('dashboard.uploadCta')}
            </Link>
            <CreateSlideshowButton className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-[13px] font-semibold tracking-[0.28px] text-white backdrop-blur-sm hover:bg-white/20 sm:px-8 sm:text-[14px]" />
          </div>
        </div>
      </section>

      <section
        aria-label={t('dashboard.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5"
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex animate-pulse flex-col rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="mb-4 size-10 rounded-lg bg-[#e2e8f0]" />
                <div className="h-4 w-24 rounded bg-[#e2e8f0]" />
                <div className="mt-3 h-8 w-16 rounded bg-[#e2e8f0]" />
              </div>
            ))
          : stats.map((stat) => (
              <DashboardStatCard key={stat.id} {...stat} />
            ))}
      </section>

      <section className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[20px] font-semibold leading-8 text-[#161c27] sm:text-[24px]">
              {t('dashboard.competitions.title')}
            </h2>
            <p className="text-[14px] leading-6 text-[#494453] sm:text-[16px]">
              {t('dashboard.competitions.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="flex animate-pulse flex-col gap-4 rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-4.25"
              >
                <div className="h-40 w-full rounded-xl bg-[#e2e8f0] sm:h-20 sm:w-32" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 rounded bg-[#e2e8f0]" />
                  <div className="h-4 w-32 rounded bg-[#e2e8f0]" />
                </div>
                <div className="h-10 w-24 rounded bg-[#e2e8f0]" />
              </div>
            ))
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#fee2e2] bg-[#fef2f2] p-8 text-center">
              <p className="text-[14px] font-medium text-[#b91c1c]">
                {t(
                  'dashboard.competitions.loadError',
                  'Could not load your participating competitions.',
                )}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer rounded-full bg-[#ee1c25] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#d41921]"
              >
                {t('common.retry', 'Retry')}
              </button>
            </div>
          ) : participatingCompetitions.length > 0 ? (
            participatingCompetitions.map((item) => (
              <CompetitionRow key={item.id} item={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-8 text-center sm:p-12">
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#eef2ff] text-[#4048cd]">
                <Compass size={24} aria-hidden="true" />
              </div>
              <p className="text-[16px] font-semibold text-[#161c27]">
                {t(
                  'dashboard.competitions.emptyTitle',
                  'No active competition entries',
                )}
              </p>
              <p className="mt-1 max-w-sm text-[14px] text-[#494453]">
                {t(
                  'dashboard.competitions.emptySubtitle',
                  'Submit your photos to our monthly themed competitions to climb the leaderboard and win prizes.',
                )}
              </p>
              <Link
                to={ROUTES.COMPETITIONS}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4048cd] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#353cb0]"
              >
                {t(
                  'dashboard.competitions.browseCompetitions',
                  'Explore Competitions',
                )}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
});

UserDashboardView.displayName = 'UserDashboardView';

/**
 * Role-based dashboard shell:
 * - user login → user dashboard (Figma 111:1064)
 * - admin login → admin Overview (Figma 339:1136)
 */
const DashboardContent = memo(() => {
  const user = useSelector(selectUser);

  if (isAdminRole(user?.role)) {
    return <AdminOverviewContent />;
  }

  return <UserDashboardView />;
});

DashboardContent.displayName = 'DashboardContent';

export default DashboardContent;
