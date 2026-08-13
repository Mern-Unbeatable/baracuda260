import { useState } from 'react';
import { PAYOUT_SECTIONS } from '@/portals/admin/data/adminPayoutsData';

export default function useAdminPayouts(initialSections = PAYOUT_SECTIONS) {
  const [sections, setSections] = useState(initialSections);
  const [openActionId, setOpenActionId] = useState(null);

  const handleToggleAction = (rowId) => {
    setOpenActionId((current) => (current === rowId ? null : rowId));
  };

  const handleCloseAction = () => {
    setOpenActionId(null);
  };

  const handleRowStatusChange = (rowId, nextStatus) => {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        rows: section.rows.map((row) =>
          row.id === rowId ? { ...row, status: nextStatus } : row,
        ),
      })),
    );
    setOpenActionId(null);
  };

  return {
    sections,
    openActionId,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
  };
}
