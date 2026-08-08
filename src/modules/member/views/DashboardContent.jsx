import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Camera,
  Compass,
  Heart,
  Trophy,
  Users,
  Clock,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Wallet,
} from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { selectUser } from '@/app/store/slices/authSlice';
import AdminOverviewContent from '@/modules/admin/views/AdminOverviewContent';
import {
  DASHBOARD_COMPETITIONS,
  DASHBOARD_STATS,
} from '@/modules/member/data/dashboardAssets';

const STAT_ICONS = {
  trophy: Trophy,
  camera: Camera,
  heart: Heart,
  wallet: Wallet,
  compass: Compass,
};

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

const StatCard = memo(({ labelKey, value, iconBg, iconColor, icon }) => {
  const { t } = useTranslation();
  const Icon = STAT_ICONS[icon] ?? Trophy;

  return (
    <article className="flex flex-col rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-5 shadow-sm sm:p-6">
      <div className={`mb-4 flex size-10 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon size={22} className={iconColor} aria-hidden="true" />
      </div>
      <p className="text-[13px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[16px] sm:leading-4">
        {t(labelKey)}
      </p>
      <p className="mt-2 text-[28px] font-bold tracking-[-0.64px] text-[#161c27] sm:text-[32px] sm:leading-10">
        {value}
      </p>
    </article>
  );
});

StatCard.displayName = 'StatCard';

const CompetitionRow = memo(({ item }) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-[17px]">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-32">
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-[16px] font-semibold leading-7 text-[#161c27] sm:text-[18px]">
            {t(item.titleKey)}
          </h3>
          <span
            className={`rounded-full px-3 py-0.5 text-[12px] font-bold tracking-[0.6px] ${BADGE_TONES[item.badgeTone]}`}
          >
            {t(item.badgeKey)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-1 text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
            <Users size={14} aria-hidden="true" className="shrink-0 opacity-70" />
            {t(item.participantsKey)}
          </span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
            {item.id === 'portrait' ? (
              <Calendar size={14} aria-hidden="true" className="shrink-0 opacity-70" />
            ) : (
              <Clock size={14} aria-hidden="true" className="shrink-0 opacity-70" />
            )}
            {t(item.timingKey)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:w-48 sm:shrink-0 sm:flex-col sm:items-end sm:justify-center sm:gap-1 sm:px-6">
        <div className="sm:w-full sm:text-right">
          <p className="text-[13px] font-medium tracking-[0.6px] text-[#494453] sm:text-[14px]">
            {t(item.statusLabelKey)}
          </p>
          <p
            className={`mt-0.5 inline-flex items-center gap-1 text-[15px] font-bold sm:text-[16px] sm:leading-6 ${STATUS_TONES[item.statusTone]}`}
          >
            {item.showTrophy ? (
              <Trophy size={14} aria-hidden="true" className="text-[#855300]" />
            ) : null}
            {t(item.statusValueKey)}
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_MY_COMPETITIONS}
          aria-label={t('dashboard.competitions.openItem')}
          className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e8eeff] text-[#532aa8] transition hover:bg-[#d9e2ff]"
        >
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
});

CompetitionRow.displayName = 'CompetitionRow';

const UserDashboardView = memo(() => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const displayName =
    user?.fullName || user?.name || user?.username || t('dashboard.defaultName');

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <section className="relative flex min-h-[200px] items-center overflow-hidden rounded-2xl bg-[#2a303d] px-5 py-8 sm:min-h-[220px] sm:rounded-3xl sm:px-8 sm:py-10 lg:min-h-[256px] lg:px-12">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#2a303d] via-[#2a303d]/80 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex max-w-3xl flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.96px] text-white sm:text-[36px] lg:text-[48px] lg:leading-[56px]">
            {t('dashboard.welcome', { name: displayName })}
          </h1>
          <p className="max-w-xl text-[15px] leading-normal text-white/70 sm:text-[18px] lg:text-[20px]">
            {t('dashboard.welcomeBody')}
          </p>
          <div className="pt-3 sm:pt-4">
            <Link
              to={ROUTES.ADMIN_UPLOAD_PHOTOS}
              className="inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-6 py-3 text-[13px] font-semibold tracking-[0.28px] text-white transition hover:bg-[#d41921] sm:px-8 sm:text-[14px]"
            >
              <Camera size={18} aria-hidden="true" />
              {t('dashboard.uploadCta')}
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label={t('dashboard.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5"
      >
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
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
          <Link
            to={ROUTES.ADMIN_MY_COMPETITIONS}
            className="inline-flex items-center gap-1 text-[14px] font-bold text-[#532aa8] transition hover:text-[#432089] sm:text-[16px]"
          >
            {t('dashboard.competitions.viewAll')}
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {DASHBOARD_COMPETITIONS.map((item) => (
            <CompetitionRow key={item.id} item={item} />
          ))}
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

  if (user?.role === 'admin') {
    return <AdminOverviewContent />;
  }

  return <UserDashboardView />;
});

DashboardContent.displayName = 'DashboardContent';

export default DashboardContent;
