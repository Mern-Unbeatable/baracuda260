import { useState } from 'react';
import {
  ADMIN_USERS,
  USER_STATUS,
  USERS_PAGE_SIZE,
  filterUsersByStatus,
  getUsersPageRange,
  paginateUsers,
} from '@/portals/admin/data/adminUsersData';

/**
 * Status filter, pagination, and suspend/reactivate for Admin Users.
 */
export default function useAdminUsers(
  initialUsers = ADMIN_USERS,
  pageSize = USERS_PAGE_SIZE,
) {
  const [users, setUsers] = useState(initialUsers);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [suspendTargetId, setSuspendTargetId] = useState(null);

  const filteredUsers = filterUsersByStatus(users, statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleUsers = paginateUsers(filteredUsers, safePage, pageSize);
  const range = getUsersPageRange(safePage, pageSize, filteredUsers.length);
  const suspendTarget = users.find((user) => user.id === suspendTargetId) || null;

  const handleStatusFilterChange = (nextFilter) => {
    setStatusFilter(nextFilter || 'all');
    setPage(1);
    setSortOpen(false);
  };

  const handleToggleSort = () => {
    setSortOpen((open) => !open);
  };

  const handleCloseSort = () => {
    setSortOpen(false);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  const handleToggleActionMenu = (userId) => {
    setOpenActionMenuId((current) => (current === userId ? null : userId));
  };

  const handleCloseActionMenu = () => {
    setOpenActionMenuId(null);
  };

  const handleActivateUser = (userId) => {
    const target = users.find((user) => user.id === userId);
    if (!target || target.status === USER_STATUS.ACTIVE) {
      setOpenActionMenuId(null);
      return;
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, status: USER_STATUS.ACTIVE, suspendReason: undefined } : user,
      ),
    );
    setOpenActionMenuId(null);
  };

  const handleRequestSuspend = (userId) => {
    const target = users.find((user) => user.id === userId);
    if (!target || target.status === USER_STATUS.SUSPENDED) {
      setOpenActionMenuId(null);
      return;
    }

    setSuspendTargetId(userId);
    setOpenActionMenuId(null);
  };

  const handleCloseSuspendModal = () => {
    setSuspendTargetId(null);
  };

  const handleConfirmSuspend = (reason) => {
    if (!suspendTargetId || !reason) return;

    setUsers((current) =>
      current.map((user) =>
        user.id === suspendTargetId
          ? { ...user, status: USER_STATUS.SUSPENDED, suspendReason: reason }
          : user,
      ),
    );
    setSuspendTargetId(null);
  };

  return {
    statusFilter,
    sortOpen,
    visibleUsers,
    range,
    page: safePage,
    totalPages,
    isFirstPage: safePage <= 1,
    isLastPage: safePage >= totalPages,
    suspendTarget,
    openActionMenuId,
    isSuspendModalOpen: Boolean(suspendTarget),
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handlePreviousPage,
    handleNextPage,
    handleToggleActionMenu,
    handleCloseActionMenu,
    handleActivateUser,
    handleRequestSuspend,
    handleCloseSuspendModal,
    handleConfirmSuspend,
  };
}
