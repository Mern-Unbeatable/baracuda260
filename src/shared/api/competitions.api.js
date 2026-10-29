import { apiClient } from './client';

export {
  ARTWORKS_QUERY_KEY,
  awardArtworkAppreciationApi,
  createArtworkCommentApi,
  downloadPublicArtworkApi,
  getArtworkDetailsApi,
  getPublicArtworksApi,
  PUBLIC_ARTWORKS_QUERY_KEY,
  reportArtworkApi,
  toggleSaveArtworkApi,
  triggerArtworkDownload,
  voteArtworkApi,
} from './artworks.api';

export const COMPETITIONS_QUERY_KEY = ['competitions'];

const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

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
    submissionId: item.submissionId || item.submission?.id || item.id,
    userId: item.userId || item.user?.id,
    kind: item.kind,
    place: item.place,
    rank: item.rank ?? idx + 1,
    isWinner: Boolean(item.isWinner),
    name: item.user?.name || 'Photographer',
    firstName: item.user?.name ? item.user.name.split(' ')[0] : '',
    city: item.user?.country || '',
    avatar: item.user?.avatar ? resolveMediaUrl(item.user.avatar) : null,
    initial: item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?',
    votes: item.votes ?? 0,
    points: item.points ?? 0,
    photoId: item.submissionId || item.id,
    submission: item.submission
      ? {
          ...item.submission,
          featuredImage: resolveMediaUrl(item.submission.featuredImage),
        }
      : null,
  }));
};

/**
 * Fetches list of active/open competitions for artwork submission or switching.
 * Endpoint: GET /v1/competitions
 */
export const getActiveCompetitionsApi = async (params = {}) => {
  try {
    const response = await apiClient.get('/v1/competitions', {
      params: { status: 'OPEN', ...params },
    });
    const payload = response?.data !== undefined ? response.data : response;
    const list = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];
    return list;
  } catch {
    return [];
  }
};
