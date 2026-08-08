import { useState } from 'react';
import {
  DEFAULT_ALBUM_FORMAT,
  DEFAULT_MONTH_ID,
  getMonthOption,
  getPodiumWinners,
  getWinnersForFormat,
} from '@/modules/admin/data/adminWinnersData';

/**
 * Admin Winners filters + standings derived state.
 */
export default function useAdminWinners() {
  const [albumFormat, setAlbumFormat] = useState(DEFAULT_ALBUM_FORMAT);
  const [monthId, setMonthId] = useState(DEFAULT_MONTH_ID);
  const [monthOpen, setMonthOpen] = useState(false);

  const winners = getWinnersForFormat(albumFormat);
  const podium = getPodiumWinners(winners);
  const selectedMonth = getMonthOption(monthId);

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
    handleSelectFormat,
    handleToggleMonth,
    handleCloseMonth,
    handleSelectMonth,
  };
}
