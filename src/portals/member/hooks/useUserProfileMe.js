import { useQuery } from '@tanstack/react-query';
import {
  getUserProfileMeApi,
  USER_PROFILE_ME_QUERY_KEY,
} from '@/shared/api/userProfile.api';

/**
 * Hook to retrieve member's current profile settings and details.
 */
export default function useUserProfileMe() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: USER_PROFILE_ME_QUERY_KEY,
    queryFn: getUserProfileMeApi,
    staleTime: 60 * 1000,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
