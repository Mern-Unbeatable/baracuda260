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

const mapLeaderboardRows = (list = []) =>
  (Array.isArray(list) ? list : []).map((item, idx) => ({
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

/**
 * Live leaderboard for the currently OPEN (running) monthly competition.
 * Endpoint: GET /v1/competitions?kind=SINGLE  (omit year/month → OPEN competition)
 *
 * @param {{ kind?: string, limit?: number }} [params]
 */
export const getLiveLeaderboardApi = async ({
  kind = 'SINGLE',
  limit = 10,
} = {}) => {
  const response = await apiClient.get('/v1/competitions', {
    params: {
      kind: String(kind).toUpperCase(),
      page: 1,
      limit,
    },
  });

  // When kind is set, backend returns the leaderboard array directly in `data`
  const list = Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response)
      ? response
      : [];

  return mapLeaderboardRows(list);
};

/**
 * Leaderboard for a specific month (OPEN = live votes, CLOSED = finalized winners).
 * Endpoint: GET /v1/competitions?kind=&year=&month=
 *
 * @param {{ kind?: string, year?: number, month?: number, page?: number, limit?: number }} params
 */
export const getCompetitionWinnersApi = async ({
  kind = 'SINGLE',
  year,
  month,
  page = 1,
  limit = 10,
} = {}) => {
  // No year/month → running OPEN competition (same as getLiveLeaderboardApi)
  if (!year || !month) {
    return getLiveLeaderboardApi({ kind, limit });
  }

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

  return mapLeaderboardRows(list);
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

const DEFAULT_RANK_PRIZES = {
  1: '$300',
  2: '$150',
  3: '$50',
};

const winnerAlbumPath = (submissionId, kind) => {
  if (!submissionId) return '/winners';
  const k = String(kind || '').toUpperCase();
  if (k === 'TWELVE') return `/gallery/zodiac/${submissionId}`;
  if (k === 'SIX') return `/gallery/story/${submissionId}`;
  return `/gallery/${submissionId}`;
};

const RANK_LABELS = {
  1: '1st PLACE',
  2: '2nd PLACE',
  3: '3rd PLACE',
};

const KIND_TO_BADGE = {
  SINGLE: 'Single Photo',
  SIX: '6 Photos Story',
  TWELVE: '12 photos - full Zodiac Story',
};

/**
 * Winners Archive page.
 * Endpoint: GET /v1/competitions/winners?year=&month=&kind=&page=&limit=
 *
 * @param {{
 *   year?: number,
 *   month?: number,
 *   kind?: string,
 *   page?: number,
 *   limit?: number,
 * }} [params]
 */
export const getWinnersArchiveApi = async ({
  year,
  month,
  kind = 'ALL',
  page = 1,
  limit = 12,
} = {}) => {
  const params = {
    page,
    limit,
    kind: String(kind || 'ALL').toUpperCase(),
  };
  if (year) params.year = year;
  if (month) params.month = month;

  const response = await apiClient.get('/v1/competitions/winners', { params });
  const payload = response?.data !== undefined ? response.data : response;
  const nested = payload?.data !== undefined ? payload.data : payload;
  const list = Array.isArray(nested?.data)
    ? nested.data
    : Array.isArray(nested)
      ? nested
      : Array.isArray(payload)
        ? payload
        : [];
  const rawMeta = nested?.meta || payload?.meta || {};

  const data = list.map((item, idx) => {
    const rank = Number(item.rank || idx + 1);
    const kindValue = String(item.kind || 'SINGLE').toUpperCase();
    const submissionId = item.submissionId || item.submission?.id || item.id;
    const imageRaw =
      item.submission?.featuredImage ||
      item.submission?.media?.[0]?.url ||
      item.user?.avatar ||
      '';
    const monthNum = Number(item.competition?.month || month || 0);
    const yearNum = Number(item.competition?.year || year || 0);
    const monthName =
      monthNum >= 1 && monthNum <= 12
        ? new Date(2000, monthNum - 1, 1).toLocaleString('en-US', {
            month: 'long',
          })
        : '';
    let dateLabel = '';
    if (item.createdAt) {
      try {
        const d = new Date(item.createdAt);
        if (!Number.isNaN(d.getTime())) {
          dateLabel = d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        }
      } catch {
        dateLabel = '';
      }
    }

    const albumBadge = KIND_TO_BADGE[kindValue] || 'Single Photo';

    return {
      id: item.id || submissionId || `winner-${idx}`,
      submissionId,
      title: item.submission?.title || item.user?.name || 'Winning entry',
      description: item.user?.name
        ? `Winner — ${item.user.name}`
        : 'Competition winner',
      votes: Number(item.votes ?? 0).toLocaleString('en-US'),
      views: null,
      date: dateLabel,
      month: monthName,
      year: yearNum || null,
      rank: RANK_LABELS[rank] || `${rank}`,
      rankNumber: rank,
      album: albumBadge,
      albumBadge,
      extraPhotoCount:
        kindValue === 'TWELVE' ? 11 : kindValue === 'SIX' ? 5 : null,
      image: imageRaw ? resolveMediaUrl(imageRaw) : null,
      photographer: item.user?.name || 'Photographer',
      userId: item.userId || item.user?.id || null,
      kind: kindValue,
      href: winnerAlbumPath(submissionId, kindValue),
    };
  });

  return {
    data,
    meta: {
      currentPage: Number(rawMeta.currentPage ?? page),
      totalPages: Math.max(1, Number(rawMeta.totalPages ?? 1)),
      totalRecords: Number(rawMeta.totalRecords ?? data.length),
      hasNext: Boolean(rawMeta.hasNext),
      hasPrevious: Boolean(rawMeta.hasPrevious),
    },
  };
};

/**
 * Previous-month (or latest closed) top winners for home "Monthly Winners".
 * Endpoint: GET /v1/competitions/winners
 * — prefers the previous calendar month; falls back to newest CLOSED winners.
 *
 * @param {{ kind?: string, limit?: number }} [params]
 */
export const getLatestMonthlyWinnersApi = async ({
  kind = 'SINGLE',
  limit = 3,
} = {}) => {
  const fetchWinners = async (params) => {
    const response = await apiClient.get('/v1/competitions/winners', {
      params: {
        kind: String(params.kind || kind).toUpperCase(),
        page: 1,
        limit: params.limit ?? limit,
        ...(params.year ? { year: params.year } : {}),
        ...(params.month ? { month: params.month } : {}),
      },
    });

    const payload = response?.data !== undefined ? response.data : response;
    const list = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];
    return list;
  };

  const now = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYear = prev.getFullYear();
  const prevMonth = prev.getMonth() + 1;

  // 1) Prefer previous calendar month winners
  let list = await fetchWinners({
    kind,
    year: prevYear,
    month: prevMonth,
    limit,
  });

  // 2) Fall back to newest closed winners for this kind
  if (list.length === 0) {
    list = await fetchWinners({ kind, limit });
  }

  // 3) Fall back across album kinds if needed
  if (list.length === 0 && String(kind).toUpperCase() !== 'ALL') {
    list = await fetchWinners({
      kind: 'ALL',
      limit: Math.max(limit * 3, 9),
    });
  }

  // Keep only one competition month's top ranks
  const newest = list[0]?.competition;
  const newestKey = newest
    ? `${newest.year}-${newest.month}-${newest.id || ''}`
    : null;
  let scoped = newestKey
    ? list.filter((item) => {
        const c = item.competition;
        if (!c) return false;
        return `${c.year}-${c.month}-${c.id || ''}` === newestKey;
      })
    : list;

  // Prefer a single album kind for the home cards
  if (scoped.length > 0) {
    const preferredKind = scoped[0]?.kind;
    const sameKind = scoped.filter((item) => item.kind === preferredKind);
    if (sameKind.length > 0) scoped = sameKind;
  }

  return scoped.slice(0, limit).map((item, idx) => {
    const rank = Number(item.rank || idx + 1);
    const submissionId = item.submissionId || item.submission?.id || item.id;
    const avatarRaw =
      item.user?.avatar ||
      item.submission?.featuredImage ||
      item.submission?.media?.[0]?.url ||
      null;
    const prizeMoney = item.submission?.prizeMoney ?? item.prizeMoney;
    const prize =
      prizeMoney != null && prizeMoney !== ''
        ? `$${Number(prizeMoney).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}`
        : DEFAULT_RANK_PRIZES[rank] || '';

    return {
      id: item.id || `winner-${idx}`,
      rank,
      medal: rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`,
      name: item.user?.name || 'Photographer',
      work: item.submission?.title || item.title || 'Winning entry',
      votesCount: Number(item.votes ?? 0).toLocaleString('en-US'),
      votes: Number(item.votes ?? 0),
      prize,
      image: avatarRaw ? resolveMediaUrl(avatarRaw) : null,
      initial: item.user?.name ? item.user.name.charAt(0).toUpperCase() : '?',
      kind: item.kind,
      submissionId,
      href: winnerAlbumPath(submissionId, item.kind),
      year: item.competition?.year ?? null,
      month: item.competition?.month ?? null,
      competitionTitle: item.competition?.title || null,
    };
  });
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
