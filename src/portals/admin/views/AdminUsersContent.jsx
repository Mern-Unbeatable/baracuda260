import { ChevronDown, MoreVertical } from 'lucide-react';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import PortalDropdown from '@/components/common/PortalDropdown/PortalDropdown';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table';
import Button from '@/components/ui/Button';
import SuspendUserModal from '@/portals/admin/components/admin-users/SuspendUserModal';
import UserAvatar from '@/portals/admin/components/admin-users/UserAvatar';
import UserDetailsModal from '@/portals/admin/components/admin-users/UserDetailsModal';
import UserStatusBadge from '@/portals/admin/components/admin-users/UserStatusBadge';
import {
  formatUserDate,
  STATUS_FILTERS,
  USER_STATUS,
} from '@/portals/admin/data/adminUsersData';
import useAdminUsers from '@/portals/admin/hooks/useAdminUsers';

const SKELETON_ROW_COUNT = 10;

const TH_CLASS =
  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748b] lg:px-4';
const TD_CLASS = 'px-3 py-2.5 text-[13px] leading-4 text-[#0f172a] lg:px-4';

/**
 * @typedef {{
 *   openActionMenuId: string | null,
 *   updatingId: string | null,
 *   onToggleActionMenu: (id: string) => void,
 *   onCloseActionMenu: () => void,
 *   onViewDetails: (id: string) => void,
 *   onActivate: (id: string) => void,
 *   onSuspend: (id: string) => void,
 * }} UserRowActions
 */

/**
 * @param {{
 *   statusFilter: string,
 *   sortOpen: boolean,
 *   onToggle: () => void,
 *   onClose: () => void,
 *   onSelect: (filterId: string) => void,
 * }} props
 */
const StatusSortSelect = memo(
  ({ statusFilter, sortOpen, onToggle, onClose, onSelect }) => {
    const { t } = useTranslation();
    const rootRef = useRef(null);
    const activeFilter =
      STATUS_FILTERS.find((filter) => filter.id === statusFilter) ||
      STATUS_FILTERS[0];

    useEffect(() => {
      if (!sortOpen) return undefined;

      const handlePointerDown = (event) => {
        if (rootRef.current && !rootRef.current.contains(event.target)) {
          onClose();
        }
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [sortOpen, onClose]);

    return (
      <div className="flex flex-wrap items-center gap-2.5" ref={rootRef}>
        <p className="text-[13px] font-medium text-[#64748b]">
          {t('adminUsers.sortBy')}
        </p>
        <div className="relative">
          <Button
            unstyled
            type="button"
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
            aria-label={t('adminUsers.filters.aria')}
            onClick={onToggle}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3.5 text-left shadow-sm transition hover:border-[#c7cbf2] hover:bg-[#f8fafc]"
          >
            <span className="text-[14px] font-medium whitespace-nowrap text-[#0f172a]">
              {t(activeFilter.labelKey)}
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`shrink-0 text-[#64748b] transition ${
                sortOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {sortOpen ? (
            <ul
              role="listbox"
              aria-label={t('adminUsers.filters.aria')}
              className="absolute right-0 top-full z-20 mt-1.5 min-w-full overflow-hidden rounded-xl border border-[#e2e8f0] bg-white py-1 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            >
              {STATUS_FILTERS.map((filter) => {
                const selected = filter.id === statusFilter;
                return (
                  <li key={filter.id}>
                    <Button
                      unstyled
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => onSelect(filter.id)}
                      className={`w-full cursor-pointer px-3.5 py-2.5 text-left text-[14px] font-medium whitespace-nowrap transition hover:bg-[#f1f5f9] ${
                        selected
                          ? 'bg-[#eff1fe] text-[#4048cd]'
                          : 'text-[#0f172a]'
                      }`}
                    >
                      {t(filter.labelKey)}
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    );
  },
);

StatusSortSelect.displayName = 'StatusSortSelect';

const MENU_ITEM_CLASS =
  'w-full cursor-pointer px-4 py-2.5 text-left text-[14px] font-medium leading-5 text-[#0f172a] transition hover:bg-[#eff1fe] hover:text-[#4048cd] disabled:cursor-default disabled:opacity-50';

/**
 * @param {{ user: object, actions: UserRowActions, variant: 'table' | 'card' }} props
 */
const UserActionMenu = memo(({ user, actions, variant }) => {
  const { t } = useTranslation();
  const buttonWrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuKey = `${variant}:${user.id}`;
  const isOpen = actions.openActionMenuId === menuKey;
  const isUpdating = actions.updatingId === user.id;
  const menuLabel = t('adminUsers.actions.menu', {
    name: user.name || user.email,
  });

  return (
    <div className="relative inline-flex" ref={buttonWrapRef}>
      <Button
        unstyled
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={menuLabel}
        disabled={isUpdating}
        onClick={() => actions.onToggleActionMenu(menuKey)}
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#475569] shadow-sm transition hover:border-[#c7cbf2] hover:bg-[#f8fafc] hover:text-[#4048cd] disabled:cursor-wait disabled:opacity-50 ${
          isOpen ? 'border-[#c7cbf2] bg-[#eff1fe] text-[#4048cd]' : ''
        }`}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </Button>

      <PortalDropdown
        open={isOpen}
        onClose={actions.onCloseActionMenu}
        buttonRef={buttonRef}
        buttonWrapRef={buttonWrapRef}
        width={168}
        aria-label={menuLabel}
        className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white py-1 shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
      >
        <Button
          unstyled
          type="button"
          role="menuitem"
          onClick={() => actions.onViewDetails(user.id)}
          className={MENU_ITEM_CLASS}
        >
          {t('adminUsers.actions.viewDetails')}
        </Button>
        <Button
          unstyled
          type="button"
          role="menuitem"
          disabled={user.status === USER_STATUS.ACTIVE}
          onClick={() => actions.onActivate(user.id)}
          className={MENU_ITEM_CLASS}
        >
          {t('adminUsers.actions.active')}
        </Button>
        <Button
          unstyled
          type="button"
          role="menuitem"
          disabled={user.status === USER_STATUS.SUSPENDED}
          onClick={() => actions.onSuspend(user.id)}
          className={`${MENU_ITEM_CLASS} text-[#ee1c25] hover:bg-[#fef2f2] hover:text-[#ee1c25]`}
        >
          {t('adminUsers.actions.suspendOption')}
        </Button>
      </PortalDropdown>
    </div>
  );
});

UserActionMenu.displayName = 'UserActionMenu';

/**
 * @param {{ user: object, actions: UserRowActions }} props
 */
const UserTableRow = memo(({ user, actions }) => {
  const { i18n } = useTranslation();

  return (
    <TableRow className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc]">
      <TableCell className={TD_CLASS}>
        <div className="flex min-w-0 items-center gap-2.5">
          <UserAvatar
            src={user.avatar}
            name={user.name || user.email}
            className="size-8 text-[11px]"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#0f172a]">
              {user.name || '—'}
            </p>
            {user.username ? (
              <p className="truncate text-[11px] text-[#94a3b8]">
                @{user.username}
              </p>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className={`${TD_CLASS} text-[#475569]`}>
        <span className="block truncate" title={user.email || undefined}>
          {user.email || '—'}
        </span>
      </TableCell>
      <TableCell
        className={`${TD_CLASS} hidden text-[#475569] xl:table-cell`}
      >
        <span className="block truncate" title={user.phone || undefined}>
          {user.phone || '—'}
        </span>
      </TableCell>
      <TableCell className={`${TD_CLASS} whitespace-nowrap text-[#475569]`}>
        {formatUserDate(user.createdAt, i18n.language)}
      </TableCell>
      <TableCell className={TD_CLASS}>
        <UserStatusBadge status={user.status} />
      </TableCell>
      <TableCell className={TD_CLASS} align="right">
        <UserActionMenu user={user} actions={actions} variant="table" />
      </TableCell>
    </TableRow>
  );
});

UserTableRow.displayName = 'UserTableRow';

/**
 * @param {{ user: object, actions: UserRowActions }} props
 */
const UserMobileCard = memo(({ user, actions }) => {
  const { t, i18n } = useTranslation();

  return (
    <article className="border-b border-[#f1f5f9] px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <UserAvatar
            src={user.avatar}
            name={user.name || user.email}
            className="size-10 text-[12px]"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-5 text-[#0f172a]">
              {user.name || '—'}
            </p>
            <p className="mt-0.5 break-all text-[13px] leading-5 text-[#64748b]">
              {user.email}
            </p>
          </div>
        </div>
        <UserActionMenu user={user} actions={actions} variant="card" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl bg-[#f8fafc] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
            {t('adminUsers.columns.phone')}
          </span>
          <span className="text-right text-[13px] font-medium text-[#0f172a]">
            {user.phone || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
            {t('adminUsers.columns.registeredDate')}
          </span>
          <span className="text-right text-[13px] font-medium text-[#0f172a]">
            {formatUserDate(user.createdAt, i18n.language)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-medium uppercase tracking-wide text-[#94a3b8]">
            {t('adminUsers.columns.status')}
          </span>
          <UserStatusBadge status={user.status} />
        </div>
      </div>
    </article>
  );
});

UserMobileCard.displayName = 'UserMobileCard';

/**
 * @param {{ users: object[], actions: UserRowActions }} props
 */
const UsersTable = memo(({ users, actions }) => {
  const { t } = useTranslation();

  return (
    <Table
      className="w-full table-fixed"
      wrapperClassName="hidden overflow-hidden md:block"
    >
      <TableHeader>
        <TableRow
          isHeader
          className="border-b border-[#e2e8f0] bg-[#f8fafc]"
        >
          <TableHead className={`${TH_CLASS} rounded-tl-2xl`}>
            {t('adminUsers.columns.name')}
          </TableHead>
          <TableHead className={TH_CLASS}>
            {t('adminUsers.columns.email')}
          </TableHead>
          <TableHead className={`${TH_CLASS} hidden xl:table-cell`}>
            {t('adminUsers.columns.phone')}
          </TableHead>
          <TableHead className={TH_CLASS}>
            {t('adminUsers.columns.registeredDate')}
          </TableHead>
          <TableHead className={TH_CLASS}>
            {t('adminUsers.columns.status')}
          </TableHead>
          <TableHead className={`${TH_CLASS} rounded-tr-2xl text-right`}>
            {t('adminUsers.columns.action')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserTableRow key={user.id} user={user} actions={actions} />
        ))}
      </TableBody>
    </Table>
  );
});

UsersTable.displayName = 'UsersTable';

const UsersTableSkeleton = () => (
  <div className="flex flex-col gap-0" aria-busy="true">
    <div className="hidden h-11 animate-pulse bg-[#f1f5f9] md:block" />
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 border-b border-[#f1f5f9] px-4 py-4 last:border-b-0 sm:px-5"
      >
        <div className="size-9 shrink-0 animate-pulse rounded-full bg-[#e2e8f0]" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-3.5 w-1/3 animate-pulse rounded bg-[#e2e8f0]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#f1f5f9]" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Admin Users Management — polished tabular layout.
 */
const AdminUsersContent = memo(() => {
  const { t } = useTranslation();
  const {
    statusFilter,
    sortOpen,
    users,
    isLoading,
    isError,
    isFetching,
    loadErrorMessage,
    refetch,
    range,
    isFirstPage,
    isLastPage,
    updatingId,
    isSuspending,
    isSuspendModalOpen,
    openActionMenuId,
    isDetailsOpen,
    detailsUser,
    isDetailsLoading,
    isDetailsError,
    detailsErrorMessage,
    refetchDetails,
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
    handleOpenDetails,
    handleCloseDetails,
  } = useAdminUsers();

  /** @type {UserRowActions} */
  const actions = {
    openActionMenuId,
    updatingId,
    onToggleActionMenu: handleToggleActionMenu,
    onCloseActionMenu: handleCloseActionMenu,
    onViewDetails: handleOpenDetails,
    onActivate: handleActivateUser,
    onSuspend: handleRequestSuspend,
  };

  let body;
  if (isLoading) {
    body = <UsersTableSkeleton />;
  } else if (isError) {
    body = (
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-[15px] font-medium text-[#ee1c25]">
          {loadErrorMessage}
        </p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#eff1fe]"
        >
          {t('adminUsers.retry')}
        </Button>
      </div>
    );
  } else if (users.length === 0) {
    body = (
      <p className="px-6 py-12 text-center text-[15px] text-[#64748b]">
        {t('adminUsers.empty')}
      </p>
    );
  } else {
    body = (
      <>
        <div
          className="flex flex-col md:hidden"
          data-testid="users-mobile-cards"
        >
          {users.map((user) => (
            <UserMobileCard key={user.id} user={user} actions={actions} />
          ))}
        </div>
        <UsersTable users={users} actions={actions} />
      </>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          eyebrow={t('adminUsers.eyebrow')}
          title={t('adminUsers.title')}
          description={t('adminUsers.subtitle')}
        />

        <StatusSortSelect
          statusFilter={statusFilter}
          sortOpen={sortOpen}
          onToggle={handleToggleSort}
          onClose={handleCloseSort}
          onSelect={handleStatusFilterChange}
        />
      </div>

      <section
        aria-label={t('adminUsers.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError ? (
          <div className="border-t border-[#e2e8f0] bg-[#f8fafc]/60">
            <AdminPagination
              variant="users"
              from={range.from}
              to={range.to}
              total={range.total}
              isFirstPage={isFirstPage || isFetching}
              isLastPage={isLastPage || isFetching}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              showingText={t('adminUsers.pagination.showing', {
                from: range.from,
                to: range.to,
                total: range.total,
              })}
              previousLabel={t('adminUsers.pagination.previous')}
              nextLabel={t('adminUsers.pagination.next')}
            />
          </div>
        ) : null}
      </section>

      <SuspendUserModal
        open={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onConfirm={handleConfirmSuspend}
        isSubmitting={isSuspending}
      />

      <UserDetailsModal
        open={isDetailsOpen}
        user={detailsUser}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
        errorMessage={detailsErrorMessage}
        onRetry={() => refetchDetails()}
        onClose={handleCloseDetails}
      />
    </div>
  );
});

AdminUsersContent.displayName = 'AdminUsersContent';

export default AdminUsersContent;
