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

/**
 * Delete an artwork by ID (User/Member).
 * Endpoint: DELETE /v1/artworks/:id
 *
 * @param {string} artworkId
 */
export const deleteArtworkApi = async (artworkId) => {
  if (!artworkId) throw new Error('Artwork ID is required');
  const response = await apiClient.delete(`/v1/artworks/${artworkId}`);
  return response?.data !== undefined ? response.data : response;
};

/**
 * Update an artwork by ID (User/Member).
 * Endpoint: PUT /v1/artworks/:id
 * Supports both JSON payload or FormData (if media is updated).
 *
 * @param {string} artworkId
 * @param {object | FormData} payload
 */
export const updateArtworkApi = async (artworkId, payload) => {
  if (!artworkId) throw new Error('Artwork ID is required');

  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const config = isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined;

  const response = await apiClient.put(
    `/v1/artworks/${artworkId}`,
    payload,
    config,
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Switch an artwork to enter a competition.
 * Endpoint: POST /v1/artworks/:id/switch-to-competition
 *
 * @param {string} artworkId
 * @param {{ competitionId: string } | string} payload
 */
export const switchArtworkToCompetitionApi = async (artworkId, payload) => {
  if (!artworkId) throw new Error('Artwork ID is required');
  const body =
    typeof payload === 'string' ? { competitionId: payload } : payload;
  const response = await apiClient.post(
    `/v1/artworks/${artworkId}/switch-to-competition`,
    body,
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Resubmit an ended artwork into a new competition.
 * Endpoint: POST /v1/artworks/:id/resubmit
 *
 * @param {string} artworkId
 * @param {{ newCompetitionId: string } | string} payload
 */
export const resubmitArtworkApi = async (artworkId, payload) => {
  if (!artworkId) throw new Error('Artwork ID is required');
  const body =
    typeof payload === 'string'
      ? { newCompetitionId: payload }
      : payload.newCompetitionId
        ? payload
        : { newCompetitionId: payload.competitionId };
  const response = await apiClient.post(
    `/v1/artworks/${artworkId}/resubmit`,
    body,
  );
  return response?.data !== undefined ? response.data : response;
};

/**
 * Promote an artwork by generating a PayPal checkout URL.
 * Endpoint: POST /v1/artworks/:id/promote
 *
 * @param {string} artworkId
 * @param {{ durationDays: number } | number} payload
 * @returns {Promise<{
 *   success: boolean,
 *   data: { paymentId: string, checkoutUrl: string },
 *   message?: string
 * }>}
 */
export const promoteArtworkApi = async (artworkId, payload) => {
  const body =
    typeof payload === 'number'
      ? { durationDays: payload }
      : { durationDays: Number(payload?.durationDays || 7) };

  const response = await apiClient.post(
    `/v1/artworks/${artworkId}/promote`,
    body,
  );
  if (response?.success === false) {
    const errorMsg =
      response?.error || response?.message || 'Failed to generate checkout URL';
    throw new Error(errorMsg);
  }
  return response;
};

/**
 * Capture PayPal payment for artwork promotion.
 * Endpoint: POST /v1/artworks/promote/capture
 *
 * @param {{ paymentId: string } | string} payload
 */
export const captureArtworkPromotionPaymentApi = async (payload) => {
  const paymentId =
    typeof payload === 'string'
      ? payload
      : payload?.paymentId ||
        payload?.sessionId ||
        payload?.session_id ||
        payload?.id;

  const body = { paymentId };
  const response = await apiClient.post('/v1/artworks/promote/capture', body);
  if (response?.success === false) {
    const errorMsg =
      response?.error ||
      response?.message ||
      'The requested action could not be performed, semantically incorrect, or failed business validation.';
    throw new Error(errorMsg);
  }
  return response?.data !== undefined ? response.data : response;
};


/**
 * Create a new artwork (SINGLE, SIX, or TWELVE).
 * Endpoint: POST /v1/artworks
 * Content-Type: multipart/form-data
 *
 * @param {{
 *   kind: 'SINGLE' | 'SIX' | 'TWELVE',
 *   title: string,
 *   story: string,
 *   competitionState?: string,
 *   isAiGenerated?: boolean | string,
 *   copyrightConfirmed?: boolean | string,
 *   resolution?: string,
 *   quality?: string,
 *   categoryId?: string,
 *   subcategoryId?: string,
 *   zodiacSign?: string, // SINGLE
 *   zodiacSigns?: string[] | string, // TWELVE
 *   theme?: string, // SIX: 'RED'|'BLUE', TWELVE: 'FULL'
 *   images: File[] | File, // single file or array of files
 *   video?: File,
 * }} payload
 */
export const createArtworkApi = async (payload) => {
  const formData = new FormData();

  formData.append('kind', payload.kind || 'SINGLE');
  formData.append('title', payload.title || '');
  formData.append('story', payload.story || '');
  formData.append('competitionState', payload.competitionState || 'all');
  formData.append(
    'isAiGenerated',
    String(Boolean(payload.isAiGenerated === true || payload.isAiGenerated === 'true' || payload.isAiGenerated === 'yes')),
  );
  formData.append(
    'copyrightConfirmed',
    String(Boolean(payload.copyrightConfirmed !== false && payload.copyrightConfirmed !== 'false')),
  );

  if (payload.resolution) formData.append('resolution', payload.resolution);
  if (payload.quality) formData.append('quality', payload.quality);
  if (payload.categoryId) formData.append('categoryId', payload.categoryId);
  if (payload.subcategoryId) formData.append('subcategoryId', payload.subcategoryId);

  // SINGLE: zodiacSign
  if (payload.zodiacSign) {
    formData.append('zodiacSign', String(payload.zodiacSign).toUpperCase());
  }

  // SIX: theme
  if (payload.theme) {
    formData.append('theme', String(payload.theme).toUpperCase());
  }

  // TWELVE: zodiacSigns (JSON array string)
  if (payload.zodiacSigns) {
    const signsVal = Array.isArray(payload.zodiacSigns)
      ? JSON.stringify(payload.zodiacSigns.map((s) => String(s).toUpperCase()))
      : typeof payload.zodiacSigns === 'string'
        ? payload.zodiacSigns
        : JSON.stringify(payload.zodiacSigns);
    formData.append('zodiacSigns', signsVal);
  }

  // Append images
  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      if (file) formData.append('images', file);
    });
  } else if (payload.images) {
    formData.append('images', payload.images);
  }

  // Optional video
  if (payload.video) {
    formData.append('video', payload.video);
  }

  const response = await apiClient.post('/v1/artworks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data ?? response;
};


/**
 * Upload an artwork video comment / update.
 * Endpoint: POST /v1/artworks/video-comment
 *
 * @param {{
 *   title: string,
 *   story: string,
 *   isAiGenerated?: boolean | string,
 *   video: File,
 * }} payload
 */
export const createArtworkVideoCommentApi = async ({
  title,
  story,
  isAiGenerated = false,
  video,
}) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('story', story);
  formData.append('isAiGenerated', String(Boolean(isAiGenerated)));
  if (video) {
    formData.append('video', video);
  }

  const response = await apiClient.post('/v1/artworks/video-comment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data ?? response;
};

export const VIDEO_COMMENTS_QUERY_KEY = ['artwork-video-comments'];

/**
 * Fetch list of video comments / updates.
 * Endpoint: GET /v1/artworks/video-comments?page=1&limit=10
 *
 * @param {{
 *   page?: number,
 *   limit?: number,
 * }} [params]
 */
export const getVideoCommentsApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/artworks/video-comments', {
    params: { page, limit },
  });

  const payload = response?.data !== undefined ? response.data : response;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const rawMeta = payload?.meta || response?.meta || {};
  const meta = {
    currentPage: Number(rawMeta.currentPage ?? page),
    totalPages: Math.max(1, Number(rawMeta.totalPages ?? 1)),
    totalRecords: Number(rawMeta.totalRecords ?? rawList.length),
    hasNext: Boolean(rawMeta.hasNext),
    hasPrevious: Boolean(rawMeta.hasPrevious),
  };

  const normalized = rawList.map((item) => ({
    id: item.id,
    userId: item.userId,
    title: item.title,
    story: item.story,
    isAiGenerated: Boolean(item.isAiGenerated),
    viewsCount: item.viewsCount ?? 0,
    likesCount: item.likesCount ?? 0,
    commentsCount: item.commentsCount ?? 0,
    featuredImage: resolveMediaUrl(item.featuredImage),
    createdAt: item.createdAt,
    user: item.user
      ? {
          id: item.user.id,
          name: item.user.name,
          username: item.user.username,
          avatar: resolveMediaUrl(item.user.avatar),
        }
      : null,
    video: item.video
      ? {
          id: item.video.id,
          url: resolveMediaUrl(item.video.url),
          duration: item.video.duration,
          format: item.video.format,
        }
      : null,
  }));

  return {
    items: normalized,
    data: normalized,
    meta,
  };
};

export const USER_ARTWORKS_QUERY_KEY = ['user-artworks'];

/**
 * Helper to extract primary cover image from artwork item.
 */
export const getArtworkPrimaryImage = (item) => {
  if (!item) return '';
  if (item.featuredImage) return resolveMediaUrl(item.featuredImage);

  // If item.images is an object (e.g. { LEO: { url, ... } })
  if (item.images && typeof item.images === 'object' && !Array.isArray(item.images)) {
    const firstKey = Object.keys(item.images)[0];
    if (firstKey && item.images[firstKey]?.url) {
      return resolveMediaUrl(item.images[firstKey].url);
    }
  }

  // If item.images is an array
  if (Array.isArray(item.images) && item.images[0]) {
    const first = item.images[0];
    return resolveMediaUrl(first.url || first);
  }

  // Video poster / fallback
  if (item.video?.thumbnailUrl) {
    return resolveMediaUrl(item.video.thumbnailUrl);
  }

  return '/assets/home/photo-wings.webp';
};

/**
 * Normalizes an artwork item for user dashboard listing.
 */
export const normalizeUserArtwork = (item) => {
  if (!item) return null;

  const kind = String(item.kind || 'SINGLE').toUpperCase();
  let albumBadge = 'Single Photo';
  let extraPhotoCount = null;

  if (kind === 'TWELVE') {
    albumBadge = '12 photos - full Zodiac Story';
    extraPhotoCount = 11;
  } else if (kind === 'SIX') {
    albumBadge = '6 Photos Story';
    extraPhotoCount = 5;
  } else if (kind === 'VIDEO') {
    albumBadge = 'Video Update';
  }

  const primaryImage = getArtworkPrimaryImage(item);
  const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
  const uploadedDate = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const uploadedTime = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  // Competition & status mapping
  const compState = String(item.competitionState || '').toUpperCase();
  let footerState = 'profileOnly';
  if (compState === 'IN_COMPETITION' || item.competition) {
    footerState = 'active';
  } else if (compState === 'ENDED' || item.competition?.status === 'ENDED') {
    footerState = 'ended';
  }

  const isPromoted = Boolean(item.promotion && item.promotion.isActive !== false);

  return {
    id: item.id,
    title: item.title || 'Untitled Artwork',
    description: item.story || '',
    category: item.categoryName || item.category?.name || 'General',
    image: primaryImage,
    albumBadge,
    kind,
    competitionState: item.competitionState,
    uploadedDate,
    uploadedTime,
    views: Number(item.viewsCount ?? 0).toLocaleString(),
    hearts: Number(item.likesCount ?? item.votesCount ?? 0).toLocaleString(),
    promoted: isPromoted,
    extraPhotoCount,
    footerState,
    competitionName: item.competition?.title || 'Active Competition',
    votes: String(item.votesCount ?? 0),
    rank: item.rank ? `#${item.rank}` : null,
    votingEnds: item.competition?.endsAt || '',
    isAiGenerated: Boolean(item.isAiGenerated),
    zodiacSign: item.zodiacSign,
    video: item.video
      ? {
          url: resolveMediaUrl(item.video.url),
          thumbnailUrl: resolveMediaUrl(item.video.thumbnailUrl),
          duration: item.video.duration,
        }
      : null,
    raw: item,
  };
};

/**
 * Fetch member artworks with filtering and sorting.
 * Endpoint: GET /v1/artworks?kind=TWELVE&status=all&sort=newest&page=1&limit=10
 *
 * @param {{
 *   kind?: string, // 'ALL' | 'SINGLE' | 'SIX' | 'TWELVE'
 *   status?: string, // 'all' | 'inCompetition' | 'profileOnly' | 'ended'
 *   sort?: string, // 'newest' | 'oldest'
 *   page?: number,
 *   limit?: number,
 * }} [params]
 */
export const getUserArtworksApi = async ({
  kind,
  status = 'all',
  sort = 'newest',
  page = 1,
  limit = 10,
} = {}) => {
  const params = {
    page,
    limit,
  };

  if (kind && kind !== 'ALL' && kind !== 'All') {
    params.kind = String(kind).toUpperCase();
  }
  if (status && status !== 'all') {
    params.status = status;
  }
  if (sort) {
    params.sort = sort;
  }

  const response = await apiClient.get('/v1/artworks', { params });
  const payload = response?.data !== undefined ? response.data : response;

  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const rawMeta = payload?.meta || response?.meta || {};
  const meta = {
    currentPage: Number(rawMeta.currentPage ?? page),
    totalPages: Math.max(1, Number(rawMeta.totalPages ?? 1)),
    totalRecords: Number(rawMeta.totalRecords ?? rawList.length),
    hasNext: Boolean(rawMeta.hasNext),
    hasPrevious: Boolean(rawMeta.hasPrevious),
  };

  const normalized = rawList.map(normalizeUserArtwork).filter(Boolean);

  return {
    items: normalized,
    data: normalized,
    meta,
  };
};
