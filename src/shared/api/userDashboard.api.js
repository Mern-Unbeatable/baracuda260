import { apiClient } from './client';

export const USER_DASHBOARD_QUERY_KEY = ['user-dashboard'];

/**
 * Fetch member user dashboard stats and participating competitions.
 * GET /api/v1/users/dashboard
 *
 * @returns {Promise<{
 *   currentRank: number | null,
 *   totalPhotos: number,
 *   totalVotes: number,
 *   prizesWon: number,
 *   competitionsCount: number,
 *   participatingCompetitions: Array<{
 *     id: string,
 *     title: string,
 *     status: string,
 *     endsAt: string,
 *     coverImage: string,
 *     tag: string,
 *     rankStr: string,
 *     participantsCount: number
 *   }>
 * }>}
 */
export const getUserDashboardApi = async () => {
  const response = await apiClient.get('/v1/users/dashboard');
  return response?.data ?? response;
};
