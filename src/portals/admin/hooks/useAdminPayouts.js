import { useMemo, useState } from 'react';
import { PAYOUT_SECTIONS } from '@/portals/admin/data/adminPayoutsData';

export default function useAdminPayouts(initialSections = PAYOUT_SECTIONS) {
  const [sections, setSections] = useState(initialSections);
  const [activeTab, setActiveTab] = useState(initialSections[0]?.id || 'prize');
  const [openActionId, setOpenActionId] = useState(null);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeTab) || sections[0],
    [activeTab, sections],
  );

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setOpenActionId(null);
  };

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
    activeTab,
    activeSection,
    openActionId,
    handleTabChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
  };
}
