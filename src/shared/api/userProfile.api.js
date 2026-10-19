import { apiClient } from './client';

export const USER_PROFILE_ME_QUERY_KEY = ['user-profile-me'];

/**
 * Fetch member user's own profile settings & metadata.
 * GET /api/v1/users/profile/me
 *
 * @returns {Promise<{
 *   id: string,
 *   username: string,
 *   name: string,
 *   avatar: string | null,
 *   coverPhoto: string | null,
 *   introVideo: string | null,
 *   bio: string | null,
 *   city: string | null,
 *   country: string | null,
 *   socialLinks: string[],
 *   profileViews: number,
 *   createdAt: string,
 *   isFollowing: boolean,
 *   stats: {
 *     followers: number,
 *     following: number,
 *     profileVisitors: number,
 *     totalArtwork: number,
 *     totalVideos: number,
 *     competitionEntries: number,
 *     totalHearts: number
 *   },
 *   standaloneVideos: Array<{
 *     id: string,
 *     title: string,
 *     story: string,
 *     isAiGenerated: boolean,
 *     aiBadge: boolean,
 *     videoUrl: string,
 *     thumbnailUrl: string,
 *     duration: number,
 *     viewsCount: number,
 *     likesCount: number,
 *     commentsCount: number,
 *     createdAt: string
 *   }>,
 *   appreciation: {
 *     gold: number,
 *     silver: number,
 *     bronze: number,
 *     total: number,
 *     hasAwardedThisWeek: boolean,
 *     myAward: string | null,
 *     canAward: boolean,
 *     resetInDays: number
 *   },
 *   email: string,
 *   phone: string
 * }>}
 */
export const getUserProfileMeApi = async () => {
  const response = await apiClient.get('/v1/users/profile/me');
  return response?.data ?? response;
};

/**
 * Update member user profile.
 * PUT /api/v1/users/profile
 * Multipart/form-data:
 * - name: string
 * - username: string
 * - email: string
 * - phone: string
 * - bio: string
 * - city: string
 * - country: string
 * - socialLinks: string (JSON string of { website, facebook, instagram, twitter, linkedin, youtube, tiktok })
 * - avatar: File (optional)
 * - coverPhoto: File (optional)
 * - introVideo: File (optional)
 *
 * @param {FormData} formData
 */
export const updateUserProfileApi = async (formData) => {
  const response = await apiClient.put('/v1/users/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data ?? response;
};

export const USER_FOLLOWING_QUERY_KEY = ['user-following'];
export const USER_PROFILE_USERNAME_QUERY_KEY = (username) => [
  'user-profile',
  String(username || '').replace(/^@/, ''),
];

/**
 * Fetch list of photographers the user follows (favourite profiles).
 * GET /api/v1/users/following?page=1&limit=10
 *
 * @param {{ page?: number, limit?: number }} params
 */
export const getUserFollowingApi = async ({ page = 1, limit = 12 } = {}) => {
  const response = await apiClient.get('/v1/users/following', {
    params: { page, limit },
  });
  return response;
};

/**
 * Toggle follow/unfollow a user by username.
 * POST /api/v1/users/follow/{{username}}
 *
 * @param {string} username
 */
export const toggleFollowUserApi = async (username) => {
  const cleanUsername = String(username || '').replace(/^@/, '');
  const response = await apiClient.post(
    `/v1/users/follow/${encodeURIComponent(cleanUsername)}`,
  );
  return response;
};

/**
 * Fetch a user profile by username.
 * GET /api/v1/users/profile/{{username}}
 *
 * @param {string} username
 */
export const getUserProfileByUsernameApi = async (username) => {
  const cleanUsername = String(username || '').replace(/^@/, '');
  const response = await apiClient.get(
    `/v1/users/profile/${encodeURIComponent(cleanUsername)}`,
  );
  return response;
};


