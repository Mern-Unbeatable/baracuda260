import { useQuery } from '@tanstack/react-query';
import {
  ADMIN_DASHBOARD_QUERY_KEY,
  getAdminDashboardApi,
} from '@/shared/api/adminDashboard.api';

export default function useAdminDashboard() {
  const query = useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: getAdminDashboardApi,
    staleTime: 60 * 1000,
  });

  return {
    dashboardData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
