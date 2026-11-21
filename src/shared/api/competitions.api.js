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
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ''
  ).replace(/\/+$/, '');
  const uploadIndex = url.indexOf('uploads');
  const cleanPath =
    uploadIndex !== -1
      ? `/${url.slice(uploadIndex).replace(/\\/g, '/')}`
      : url.startsWith('/')
        ? url
        : `/${url}`;
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

const formatCompetitionItem = (comp) => {
  if (!comp || typeof comp !== 'object') return null;
  const endsAt = comp.endsAt || comp.endDate || null;
  const prizeRaw = comp.prizePool ?? comp.prize ?? comp.totalPrize;
  const prize =
    prizeRaw == null || prizeRaw === ''
      ? null
      : typeof prizeRaw === 'number'
        ? `$${Number(prizeRaw).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        : String(prizeRaw);

  let endsAtLabel = endsAt;
  if (endsAt) {
    try {
      const d = new Date(endsAt);
      if (!Number.isNaN(d.getTime())) {
        endsAtLabel = d.toISOString().slice(0, 10);
      }
    } catch {
      endsAtLabel = String(endsAt);
    }
  }

  const monthName =
    comp.month && comp.year
      ? new Date(comp.year, Number(comp.month) - 1, 1).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : null;

  return {
    id: comp.id,
    title:
      comp.title ||
      comp.name ||
      (monthName ? `${monthName} Competition` : 'Current Monthly Competition'),
    status: comp.status || 'OPEN',
    prize,
    endsAt: endsAtLabel,
    year: comp.year,
    month: comp.month,
    raw: comp,
  };
};

/**
 * Fetches the OPEN competition currently underway (monthly).
 * Endpoint: GET /v1/competitions  (returns a single competition when kind is omitted)
 * @returns {Promise<Array<{ id: string, title: string, status: string, prize?: string, endsAt?: string }>>}
 */
export const getActiveCompetitionsApi = async (params = {}) => {
  try {
    // Omitting year/month lets the API return (or auto-create) the current OPEN month
    const response = await apiClient.get('/v1/competitions', {
      params: { ...params },
    });
    const payload = response?.data !== undefined ? response.data : response;
    const raw = payload?.data !== undefined ? payload.data : payload;

    if (Array.isArray(raw)) {
      return raw
        .map(formatCompetitionItem)
        .filter((item) => item && (!item.status || item.status === 'OPEN'));
    }

    const item = formatCompetitionItem(raw);
    if (!item) return [];
    // Backend auto-starts the current month when none is open
    return !item.status || item.status === 'OPEN' ? [item] : [];
  } catch {
    return [];
  }
};
