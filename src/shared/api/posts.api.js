import { DASHBOARD_ASSETS } from '@/portals/member/data/dashboardAssets';
import { apiClient } from '@/shared/api/client';
import { resolveMediaUrl } from '@/shared/utils/media';

export const USER_POSTS_QUERY_KEY = (params) => ['user-posts', params];
export const USER_POST_DETAIL_QUERY_KEY = (id) => ['user-post-detail', id];

/**
 * Format timestamp into human-readable date and time strings.
 * @param {string} dateStr
 */
export const formatPostDateTime = (dateStr) => {
  if (!dateStr) return { postedDate: '', postedTime: '', relativeTime: '' };
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return { postedDate: dateStr, postedTime: '', relativeTime: '' };
  }

  const postedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  const postedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let relativeTime = `${postedDate} • ${postedTime}`;
  if (diffMins < 1) relativeTime = 'Just now';
  else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
  else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
  else if (diffDays < 7) relativeTime = `${diffDays}d ago`;

  return { postedDate, postedTime, relativeTime };
};

/**
 * Normalize a single post item from backend.
 * @param {object} item
 */
export const normalizePost = (item) => {
  if (!item) return null;

  const { postedDate, postedTime, relativeTime } = formatPostDateTime(
    item.createdAt || item.updatedAt,
  );

  const mediaUrl = resolveMediaUrl(item.mediaUrl) || item.image || '';

  return {
    id: item.id,
    userId: item.userId || item.user?.id,
    body: item.body || '',
    bodyKey: item.bodyKey || null,
    image: mediaUrl,
    mediaUrl,
    mediaType: String(item.mediaType || 'IMAGE').toUpperCase(),
    copyrightConfirmed: Boolean(item.copyrightConfirmed),
    likes: item.likesCount ?? item.likes ?? 0,
    likesCount: item.likesCount ?? item.likes ?? 0,
    authorName: item.user?.name || item.authorName || 'User',
    authorAvatar:
      resolveMediaUrl(item.user?.avatar) ||
      item.authorAvatar ||
      DASHBOARD_ASSETS.avatar,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    postedDate: item.postedDate || postedDate,
    postedTime: item.postedTime || postedTime,
    relativeTime,
    user: item.user,
  };
};

/**
 * Fetch member posts list.
 * GET /api/v1/posts?page=1&limit=10
 *
 * @param {{ page?: number, limit?: number }} [params]
 */
export const getPostsApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/posts', {
    params: { page, limit },
  });

  const payload = response?.data;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : Array.isArray(response)
        ? response
        : [];

  const meta = payload?.meta || response?.meta || {
    total: rawList.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(rawList.length / limit)),
  };

  return {
    items: rawList.map(normalizePost).filter(Boolean),
    meta: {
      total: meta.total ?? rawList.length,
      page: meta.page ?? page,
      limit: meta.limit ?? limit,
      totalPages: meta.totalPages ?? 1,
    },
    message: response?.message || '',
  };
};

/**
 * Fetch single post details.
 * GET /api/v1/posts/{{postId}}
 *
 * @param {string} postId
 */
export const getPostDetailsApi = async (postId) => {
  if (!postId) return null;
  const response = await apiClient.get(`/v1/posts/${postId}`);
  const data = response?.data || response;
  return normalizePost(data);
};

/**
 * Create a new post.
 * POST /api/v1/posts
 * Receives multipart/form-data:
 * - body (text)
 * - copyrightConfirmed (text: "true")
 * - media (file)
 *
 * @param {FormData | { body: string, copyrightConfirmed: boolean|string, media?: File }} input
 */
export const createPostApi = async (input) => {
  let formData;
  if (input instanceof FormData) {
    formData = input;
  } else {
    formData = new FormData();
    if (input.body !== undefined) {
      formData.append('body', input.body);
    }
    if (input.copyrightConfirmed !== undefined) {
      formData.append('copyrightConfirmed', String(input.copyrightConfirmed));
    }
    if (input.media) {
      formData.append('media', input.media);
    }
  }

  const response = await apiClient.post('/v1/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data || response;
};

/**
 * Delete a post by ID.
 * DELETE /api/v1/posts/{{postId}}
 *
 * @param {string} postId
 */
export const deletePostApi = async (postId) => {
  if (!postId) return null;
  const response = await apiClient.delete(`/v1/posts/${postId}`);
  return response?.data || response;
};

/**
 * Update an existing post.
 * PUT /api/v1/posts/{{postId}}
 * Receives multipart/form-data:
 * - body (text)
 * - copyrightConfirmed (text: "true")
 * - media (file, optional)
 *
 * @param {string | { postId: string, body?: string, copyrightConfirmed?: boolean|string, media?: File }} postIdOrPayload
 * @param {FormData | { body?: string, copyrightConfirmed?: boolean|string, media?: File }} [maybeInput]
 */
export const updatePostApi = async (postIdOrPayload, maybeInput) => {
  let postId;
  let input;

  if (typeof postIdOrPayload === 'string') {
    postId = postIdOrPayload;
    input = maybeInput || {};
  } else if (postIdOrPayload && typeof postIdOrPayload === 'object') {
    postId = postIdOrPayload.postId || postIdOrPayload.id;
    input = postIdOrPayload;
  }

  if (!postId) return null;

  let formData;
  if (input instanceof FormData) {
    formData = input;
  } else {
    formData = new FormData();
    if (input.body !== undefined) {
      formData.append('body', input.body);
    }
    if (input.copyrightConfirmed !== undefined) {
      formData.append('copyrightConfirmed', String(input.copyrightConfirmed));
    } else {
      formData.append('copyrightConfirmed', 'true');
    }
    if (input.media instanceof File || input.media instanceof Blob) {
      formData.append('media', input.media);
    }
  }

  const response = await apiClient.put(`/v1/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response?.data || response;
};

