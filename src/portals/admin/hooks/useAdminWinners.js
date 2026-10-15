import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  DEFAULT_ALBUM_FORMAT,
  DEFAULT_MONTH_ID,
  getMonthOption,
  getPodiumWinners,
  getWinnersForFormat,
} from '@/portals/admin/data/adminWinnersData';
import {
  COMPETITIONS_QUERY_KEY,
  getCompetitionWinnersApi,
} from '@/shared/api/competitions.api';

/**
 * Admin Winners filters + standings derived state connected to /v1/competitions.
 */
export default function useAdminWinners() {
  const [albumFormat, setAlbumFormat] = useState(DEFAULT_ALBUM_FORMAT);
  const [monthId, setMonthId] = useState(DEFAULT_MONTH_ID);
  const [monthOpen, setMonthOpen] = useState(false);

  const selectedMonth = getMonthOption(monthId);

  const year =
    selectedMonth?.year || parseInt(monthId.split('-')[0], 10) || 2026;
  const month = parseInt(monthId.split('-')[1], 10) || 9;
  const kind = albumFormat.toUpperCase();

  const query = useQuery({
    queryKey: [...COMPETITIONS_QUERY_KEY, 'winners', kind, year, month],
    queryFn: () =>
      getCompetitionWinnersApi({ kind, year, month, page: 1, limit: 10 }),
    staleTime: 60 * 1000,
  });

  const fallbackWinners = getWinnersForFormat(albumFormat);
  const winners =
    query.data && query.data.length > 0
      ? query.data
      : query.isLoading
        ? []
        : query.isError
          ? fallbackWinners
          : (query.data?.length === 0 ? [] : fallbackWinners);

  const podium = getPodiumWinners(winners);

  const handleSelectFormat = (formatId) => {
    setAlbumFormat(formatId);
  };

  const handleToggleMonth = () => {
    setMonthOpen((current) => !current);
  };

  const handleCloseMonth = () => {
    setMonthOpen(false);
  };

  const handleSelectMonth = (nextMonthId) => {
    setMonthId(nextMonthId);
    setMonthOpen(false);
  };

  return {
    albumFormat,
    monthId,
    monthOpen,
    selectedMonth,
    winners,
    podium,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    handleSelectFormat,
    handleToggleMonth,
    handleCloseMonth,
    handleSelectMonth,
  };
}
