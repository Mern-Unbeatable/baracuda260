import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import {
  getUserDashboardApi,
  USER_DASHBOARD_QUERY_KEY,
} from '@/shared/api/userDashboard.api';

const formatTimeRemaining = (endsAt, t) => {
  if (!endsAt) return '';
  const now = new Date();
  const end = new Date(endsAt);
  const diffMs = end.getTime() - now.getTime();

  if (Number.isNaN(diffMs)) return '';

  if (diffMs <= 0) {
    return t('dashboard.competitions.ended', 'Ended');
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return t('dashboard.competitions.daysLeft', {
      count: diffDays,
      defaultValue: `${diffDays} days left`,
    });
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours > 0) {
    return t('dashboard.competitions.hoursLeft', {
      count: diffHours,
      defaultValue: `${diffHours} hours left`,
    });
  }

  return t('dashboard.competitions.endingSoon', 'Ending soon');
};

const getBadgeTone = (tag = '') => {
  const lower = String(tag).toLowerCase();
  if (
    lower.includes('top') ||
    lower.includes('winner') ||
    lower.includes('first') ||
    lower.includes('#1')
  ) {
    return 'gold';
  }
  if (lower.includes('review') || lower.includes('pending')) {
    return 'blue';
  }
  return 'blue';
};

const getStatusTone = (rankStr = '') => {
  const lower = String(rankStr).toLowerCase();
  if (
    lower.includes('#1') ||
    lower.includes('1st') ||
    lower.includes('winner')
  ) {
    return 'gold';
  }
  if (lower.includes('pending') || lower.includes('review')) {
    return 'muted';
  }
  return 'purple';
};

/**
 * Hook to fetch member user dashboard statistics and participating competitions.
 */
export default function useUserDashboard() {
  const { t } = useTranslation();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: USER_DASHBOARD_QUERY_KEY,
    queryFn: getUserDashboardApi,
    staleTime: 60 * 1000,
  });

  const stats = useMemo(() => {
    return [
      {
        id: 'rank',
        labelKey: 'dashboard.stats.rank',
        value: data?.currentRank ? `#${data.currentRank}` : '—',
        iconBg: 'bg-[#ffddb8]',
        iconColor: 'text-[#855300]',
        icon: 'trophy',
      },
      {
        id: 'photos',
        labelKey: 'dashboard.stats.photos',
        value:
          data?.totalPhotos != null
            ? Number(data.totalPhotos).toLocaleString()
            : '0',
        iconBg: 'bg-[#ede9fe]',
        iconColor: 'text-[#7c3aed]',
        icon: 'camera',
      },
      {
        id: 'votes',
        labelKey: 'dashboard.stats.votes',
        value:
          data?.totalVotes != null
            ? Number(data.totalVotes).toLocaleString()
            : '0',
        iconBg: 'bg-[#f3e8ff]',
        iconColor: 'text-[#9333ea]',
        icon: 'heart',
      },
      {
        id: 'prizes',
        labelKey: 'dashboard.stats.prizes',
        value:
          data?.prizesWon != null
            ? `$${Number(data.prizesWon).toLocaleString()}`
            : '$0',
        iconBg: 'bg-[#fef3c7]',
        iconColor: 'text-[#b45309]',
        icon: 'wallet',
      },
      {
        id: 'competitions',
        labelKey: 'dashboard.stats.competitions',
        value:
          data?.competitionsCount != null
            ? Number(data.competitionsCount).toLocaleString()
            : '0',
        iconBg: 'bg-[#dbeafe]',
        iconColor: 'text-[#2563eb]',
        icon: 'compass',
      },
    ];
  }, [data]);

  const participatingCompetitions = useMemo(() => {
    if (!data?.participatingCompetitions || !Array.isArray(data.participatingCompetitions)) {
      return [];
    }

    return data.participatingCompetitions.map((comp) => {
      const isWinner =
        comp.rankStr?.includes('#1') ||
        comp.rankStr?.toLowerCase().includes('winner');

      return {
        id: comp.id,
        title: comp.title,
        tag: comp.tag,
        badgeTone: getBadgeTone(comp.tag),
        participantsCount: comp.participantsCount,
        timingText: formatTimeRemaining(comp.endsAt, t),
        statusLabelKey: 'dashboard.competitions.yourSubmission',
        rankStr: comp.rankStr || '—',
        statusTone: getStatusTone(comp.rankStr),
        showTrophy: isWinner,
        image: comp.coverImage || DASHBOARD_ASSETS.competitions.celestial,
      };
    });
  }, [data?.participatingCompetitions, t]);

  return {
    raw: data,
    stats,
    participatingCompetitions,
    isLoading,
    isError,
    error,
    refetch,
  };
}
