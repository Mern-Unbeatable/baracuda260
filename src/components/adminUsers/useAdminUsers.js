import { useState } from 'react';
import {
  ADMIN_USERS,
  USERS_PAGE_SIZE,
  filterUsersByStatus,
  getUsersPageRange,
  paginateUsers,
  toggleUserStatus,
} from './adminUsersData';

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

  const filteredUsers = filterUsersByStatus(users, statusFilter);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleUsers = paginateUsers(filteredUsers, safePage, pageSize);
  const range = getUsersPageRange(safePage, pageSize, filteredUsers.length);

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

  const handleToggleUserStatus = (userId) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, status: toggleUserStatus(user.status) } : user,
      ),
    );
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
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handlePreviousPage,
    handleNextPage,
    handleToggleUserStatus,
  };
}
