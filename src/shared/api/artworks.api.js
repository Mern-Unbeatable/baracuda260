import { apiClient } from './client';

export const ARTWORKS_QUERY_KEY = ['artworks'];
export const ADMIN_ARTWORKS_QUERY_KEY = ['admin-artworks'];

export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const baseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ''
  ).replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Fetches admin competition artworks list.
 * Endpoint: GET /v1/admin/artworks?competitionState=IN_COMPETITION&page=1&limit=10
 *
 * @param {{
 *   competitionState?: string,
 *   page?: number,
 *   limit?: number,
 * }} [params]
 */
export const getAdminArtworksApi = async ({
  competitionState = 'IN_COMPETITION',
  page = 1,
  limit = 10,
} = {}) => {
  const response = await apiClient.get('/v1/admin/artworks', {
    params: {
      competitionState,
      page,
      limit,
    },
  });

  const payload = response?.data !== undefined ? response.data : response;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const rawMeta = payload?.meta || response?.meta;
  const meta = {
    currentPage: rawMeta?.currentPage ?? page,
    totalPages: rawMeta?.totalPages ?? 1,
    totalRecords: rawMeta?.totalRecords ?? rawList.length,
    hasNext: Boolean(rawMeta?.hasNext),
    hasPrevious: Boolean(rawMeta?.hasPrevious),
  };

  const normalizedData = rawList.map((item) => {
    const kind = String(item.kind || 'SINGLE').toUpperCase();
    const type =
      kind === 'TWELVE' ? 'zodiac' : kind === 'SIX' ? 'six' : 'single';

    let formattedDate = '';
    if (item.createdAt) {
      try {
        const d = new Date(item.createdAt);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        }
      } catch {
        formattedDate = String(item.createdAt);
      }
    }

    const coverUrl = resolveMediaUrl(item.coverImage) || '';

    return {
      id: item.id,
      kind,
      type,
      title: item.title || '',
      story: item.story || '',
      description: item.story || '',
      image: coverUrl,
      coverImage: coverUrl,
      views: Number(item.viewsCount ?? 0).toLocaleString(),
      viewsCount: item.viewsCount ?? 0,
      likes: Number(item.likesCount ?? item.votesCount ?? 0).toLocaleString(),
      likesCount: Number(item.likesCount ?? item.votesCount ?? 0),
      votesCount: Number(item.votesCount ?? item.likesCount ?? 0),
      extraPhotos:
        Number(item.additionalPhotos) > 0 ? Number(item.additionalPhotos) : null,
      additionalPhotos: Number(item.additionalPhotos ?? 0),
      competitionState: item.competitionState || competitionState,
      createdAt: item.createdAt,
      formattedDate,
    };
  });

  return {
    data: normalizedData,
    meta,
  };
};

/**
 * Fetches single artwork / competition submission details by ID.
 * @param {string} submissionId
 */
export const getArtworkDetailsApi = async (submissionId) => {
  if (!submissionId) return null;
  const response = await apiClient.get(`/v1/artworks/${submissionId}`);
  const data = response?.data || response;
  if (!data) return null;

  const rawImages = data.images;
  let normalizedImages = {};
  if (rawImages && typeof rawImages === 'object') {
    Object.entries(rawImages).forEach(([key, img]) => {
      if (img && typeof img === 'object') {
        normalizedImages[key] = {
          ...img,
          url: resolveMediaUrl(img.url),
          thumbnailUrl: resolveMediaUrl(img.thumbnailUrl || img.url),
        };
      }
    });
  }

  return {
    ...data,
    featuredImage: resolveMediaUrl(data.featuredImage),
    images: normalizedImages,
    user: data.user
      ? {
          ...data.user,
          avatar: resolveMediaUrl(data.user.avatar),
        }
      : null,
    video: data.video
      ? {
          ...data.video,
          url: resolveMediaUrl(data.video.url),
          thumbnailUrl: resolveMediaUrl(data.video.thumbnailUrl),
        }
      : null,
  };
};

/**
 * Fetches single admin artwork details by ID.
 * Endpoint: GET /v1/admin/artworks/:id
 *
 * @param {string} artworkId
 */
export const getAdminArtworkDetailsApi = async (artworkId) => {
  if (!artworkId) return null;
  const response = await apiClient.get(`/v1/admin/artworks/${artworkId}`);
  const data = response?.data !== undefined ? response.data : response;
  if (!data) return null;

  const rawMedia = Array.isArray(data.media) ? data.media : [];
  const normalizedMedia = rawMedia.map((m) => ({
    ...m,
    url: resolveMediaUrl(m.url),
    thumbnailUrl: resolveMediaUrl(m.thumbnailUrl || m.url),
  }));

  const normalizedUser = data.user
    ? {
        ...data.user,
        avatar: resolveMediaUrl(data.user.avatar),
      }
    : null;

  const rawComments = Array.isArray(data.comments) ? data.comments : [];
  const normalizedComments = rawComments.map((c) => ({
    ...c,
    user: c.user
      ? {
          ...c.user,
          avatar: resolveMediaUrl(c.user.avatar),
        }
      : null,
  }));

  const rawRankings = Array.isArray(data.globalRankings)
    ? data.globalRankings
    : [];
  const normalizedRankings = rawRankings.map((r, idx) => ({
    id: r.id || `rank-${r.rank || idx}`,
    rank: r.rank ?? idx + 1,
    photographer: r.photographer || 'Photographer',
    name: r.photographer || 'Photographer',
    totalVotes: r.totalVotes,
    votes: Number(r.totalVotes ?? r.votes ?? 0).toLocaleString(),
    avatar: resolveMediaUrl(r.avatar),
    isCurrentArtwork: Boolean(r.isCurrentArtwork),
    highlighted: Boolean(r.isCurrentArtwork),
  }));

  return {
    ...data,
    featuredImage: resolveMediaUrl(data.featuredImage),
    media: normalizedMedia,
    user: normalizedUser,
    comments: normalizedComments,
    globalRankings: normalizedRankings,
  };
};

/**
 * Deletes an artwork by ID (Admin).
 * Endpoint: DELETE /v1/admin/artworks/:id
 *
 * @param {string} artworkId
 */
export const deleteAdminArtworkApi = async (artworkId) => {
  if (!artworkId) throw new Error('Artwork ID is required');
  const response = await apiClient.delete(`/v1/admin/artworks/${artworkId}`);
  return response?.data !== undefined ? response.data : response;
};
