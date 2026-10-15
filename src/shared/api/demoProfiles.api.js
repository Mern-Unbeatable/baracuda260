import { apiClient } from './client';

export const DEMO_PROFILES_QUERY_KEY = ['admin-demo-profiles'];
export const DEMO_PROFILES_STATS_QUERY_KEY = ['admin-demo-profiles-stats'];

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
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * GET /v1/admin/demo-profiles/stats
 */
export const getDemoProfilesStatsApi = async () => {
  const response = await apiClient.get('/v1/admin/demo-profiles/stats');
  const data = response?.data || response;
  return {
    total: data?.totalProfiles ?? 0,
    active: data?.activeProfiles ?? 0,
    inactive: data?.inactiveProfiles ?? 0,
  };
};

/**
 * GET /v1/admin/demo-profiles?isActive=true&page=1&limit=10
 * @param {{ page?: number, limit?: number, isActive?: boolean }} params
 */
export const getDemoProfilesApi = async ({ page = 1, limit = 10, isActive } = {}) => {
  const params = { page, limit };
  if (typeof isActive === 'boolean') {
    params.isActive = isActive;
  }
  const response = await apiClient.get('/v1/admin/demo-profiles', { params });
  const rawData = response?.data || [];
  const meta = response?.meta || {};

  const items = (Array.isArray(rawData) ? rawData : []).map((item) => {
    const isProfileActive =
      typeof item.status === 'string'
        ? item.status.toLowerCase() === 'active'
        : Boolean(item.isActive);

    return {
      id: item.id,
      name: item.profile || item.name || '',
      username: item.username || '',
      phone: item.phoneNumber || item.phone || '',
      email: item.email || '',
      status: isProfileActive ? 'active' : 'inactive',
      raw: item,
    };
  });

  return {
    items,
    meta: {
      currentPage: meta.currentPage ?? page,
      totalPages: meta.totalPages ?? 1,
      totalRecords: meta.totalRecords ?? items.length,
      hasNext: Boolean(meta.hasNext),
      hasPrevious: Boolean(meta.hasPrevious),
    },
  };
};

/**
 * GET /v1/admin/demo-profiles/:profile_id
 * @param {string} profileId
 */
export const getDemoProfileDetailsApi = async (profileId) => {
  if (!profileId) return null;
  const response = await apiClient.get(`/v1/admin/demo-profiles/${profileId}`);
  const data = response?.data || response;
  if (!data) return null;

  const isProfileActive =
    typeof data.status === 'string'
      ? data.status.toLowerCase() === 'active'
      : Boolean(data.isActive);

  const phone =
    data.contactInformation?.phoneNumber ||
    data.phoneNumber ||
    data.phone ||
    '';
  const email =
    data.contactInformation?.email ||
    data.email ||
    '';

  const socialLinks = Array.isArray(data.socialMedia)
    ? data.socialMedia
    : data.socialMedia
      ? [data.socialMedia]
      : [];

  return {
    id: data.id,
    name: data.name || data.profile || '',
    username: data.username || '',
    status: isProfileActive ? 'active' : 'inactive',
    phone,
    email,
    about: data.about || '',
    socialMedia: socialLinks,
    socialLinks,
    socialUrl: socialLinks[0]?.replace(/^https?:\/\//i, '') || '',
    avatar: resolveMediaUrl(data.profilePhoto) || null,
    banner: resolveMediaUrl(data.coverPhoto) || null,
    password: data.password || null,
    raw: data,
  };
};

/**
 * Update demo profile status: PATCH /v1/admin/demo-profiles/:profile_id/status
 * @param {string} profileId
 * @param {boolean | string} statusOrIsActive
 */
export const updateDemoProfileStatusApi = async (profileId, statusOrIsActive) => {
  const isActive =
    typeof statusOrIsActive === 'boolean'
      ? statusOrIsActive
      : statusOrIsActive === 'active' || statusOrIsActive === 'Active';

  const response = await apiClient.patch(
    `/v1/admin/demo-profiles/${profileId}/status`,
    {
      isActive,
    },
  );
  return response?.data || response;
};

/**
 * Create new demo profile: POST /v1/admin/demo-profiles
 * Handles multipart/form-data with fields:
 * - fullName
 * - username
 * - phone
 * - email
 * - bio
 * - socialLinks
 * - password
 * - isActive
 * - profilePhoto (File)
 * - coverPhoto (File)
 */
export const createDemoProfileApi = async (payload) => {
  let body = payload;
  const headers = {};

  if (!(payload instanceof FormData) && payload && typeof payload === 'object') {
    const formData = new FormData();
    if (payload.fullName) formData.append('fullName', payload.fullName);
    if (payload.username) formData.append('username', payload.username);
    if (payload.phone) formData.append('phone', payload.phone);
    if (payload.email) formData.append('email', payload.email);
    if (payload.bio != null) formData.append('bio', payload.bio);

    if (payload.socialLinks) {
      if (Array.isArray(payload.socialLinks)) {
        payload.socialLinks.forEach((link) => {
          if (link) formData.append('socialLinks', link);
        });
      } else {
        formData.append('socialLinks', payload.socialLinks);
      }
    }

    formData.append('password', payload.password || 'password123');
    formData.append('isActive', String(payload.isActive ?? true));

    if (payload.profilePhoto instanceof File) {
      formData.append('profilePhoto', payload.profilePhoto);
    }
    if (payload.coverPhoto instanceof File) {
      formData.append('coverPhoto', payload.coverPhoto);
    }
    body = formData;
  }

  if (body instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  const response = await apiClient.post('/v1/admin/demo-profiles', body, {
    headers,
  });
  return response?.data || response;
};


