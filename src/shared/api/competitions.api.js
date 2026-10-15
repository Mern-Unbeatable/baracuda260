import { apiClient } from './client';

export const COMPETITIONS_QUERY_KEY = ['competitions'];

/**
 * Fetches finalized leaderboard / winners for a past competition.
 * @param {{ kind: string, year: number, month: number, page?: number, limit?: number }} params
 */
export const getCompetitionWinnersApi = async ({
  kind = 'SINGLE',
  year = 2026,
  month = 9,
  page = 1,
  limit = 10,
}) => {
  const response = await apiClient.get('/v1/competitions', {
    params: {
      kind: String(kind).toUpperCase(),
      year,
      month,
      page,
      limit,
    },
  });

  const list = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return list.map((item, idx) => ({
    id: item.id || item.submissionId || `winner-${idx}`,
    competitionId: item.competitionId,
    submissionId: item.submissionId || item.submission?.id,
    userId: item.userId || item.user?.id,
    kind: item.kind,
    place: item.place,
    rank: item.rank ?? idx + 1,
    isWinner: Boolean(item.isWinner),
    name: item.user?.name || 'Photographer',
    firstName: item.user?.name ? item.user.name.split(' ')[0] : '',
    city: item.user?.country || '',
    avatar: item.user?.avatar || null,
    initial: item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?',
    votes: item.votes ?? 0,
    points: item.points ?? 0,
    photoId: item.submissionId || item.id,
    submission: item.submission,
  }));
};
