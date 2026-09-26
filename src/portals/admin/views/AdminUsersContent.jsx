import { MoreVertical } from 'lucide-react';
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
import Image from '@/components/ui/Image';
import SuspendUserModal from '@/portals/admin/components/admin-users/SuspendUserModal';
import UserDetailsModal from '@/portals/admin/components/admin-users/UserDetailsModal';
import UserStatusBadge from '@/portals/admin/components/admin-users/UserStatusBadge';
import {
  ADMIN_USERS_ASSETS,
  CHEVRON_ICON_SIZE,
  formatUserDate,
  STATUS_FILTERS,
  USER_STATUS,
} from '@/portals/admin/data/adminUsersData';
import useAdminUsers from '@/portals/admin/hooks/useAdminUsers';

const SKELETON_ROW_COUNT = 6;

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
      <div className="flex flex-wrap items-center gap-5" ref={rootRef}>
        <p className="text-[14px] leading-normal text-[#373737]">
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
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-lg border border-[#e4e4e4] bg-white p-3 text-left"
          >
            <span className="text-[16px] leading-normal whitespace-nowrap text-[#373737]">
              {t(activeFilter.labelKey)}
            </span>
            <Image
              src={ADMIN_USERS_ASSETS.chevronDown}
              alt=""
              width={CHEVRON_ICON_SIZE}
              height={CHEVRON_ICON_SIZE}
              className={`size-6 shrink-0 transition ${sortOpen ? 'rotate-180' : ''}`}
            />
          </Button>

          {sortOpen ? (
            <ul
              role="listbox"
              aria-label={t('adminUsers.filters.aria')}
              className="absolute right-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-lg"
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
                      className={`w-full cursor-pointer px-3 py-2.5 text-left text-[16px] whitespace-nowrap transition hover:bg-[#f6fbff] ${
                        selected
                          ? 'bg-[#f6fbff] text-[#4048cd]'
                          : 'text-[#373737]'
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
  'w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50';

/**
 * The table row and the mobile card both render a menu for the same user, so
 * each needs its own key: the hidden copy's portal would otherwise treat clicks
 * on the visible menu as outside clicks and close it.
 *
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
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-wait disabled:opacity-50 ${
          isOpen ? 'bg-[#f6fbff]' : ''
        }`}
      >
        <MoreVertical size={20} aria-hidden="true" />
      </Button>

      <PortalDropdown
        open={isOpen}
        onClose={actions.onCloseActionMenu}
        buttonRef={buttonRef}
        buttonWrapRef={buttonWrapRef}
        width={160}
        aria-label={menuLabel}
        className="overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
      >
        <span className="block h-0.75 w-full bg-[#4048cd]" aria-hidden="true" />
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
          className={MENU_ITEM_CLASS}
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
    <TableRow>
      <TableCell className="min-w-40">{user.name || '—'}</TableCell>
      <TableCell className="min-w-45 break-all">{user.email}</TableCell>
      <TableCell className="min-w-45">{user.phone || '—'}</TableCell>
      <TableCell className="min-w-45">
        {formatUserDate(user.createdAt, i18n.language)}
      </TableCell>
      <TableCell className="min-w-45">
        <UserStatusBadge status={user.status} />
      </TableCell>
      <TableCell className="min-w-25">
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
    <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">
            {user.name || '—'}
          </p>
          <p className="mt-1 break-all text-[14px] leading-5 text-[#687186]">
            {user.email}
          </p>
        </div>
        <UserActionMenu user={user} actions={actions} variant="card" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">
            {t('adminUsers.columns.phone')}
          </span>
          <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
            {user.phone || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">
            {t('adminUsers.columns.registeredDate')}
          </span>
          <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
            {formatUserDate(user.createdAt, i18n.language)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">
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
    <Table className="min-w-245" wrapperClassName="hidden md:block">
      <TableHeader>
        <TableRow isHeader>
          <TableHead className="rounded-tl-xl">
            {t('adminUsers.columns.name')}
          </TableHead>
          <TableHead>{t('adminUsers.columns.email')}</TableHead>
          <TableHead>{t('adminUsers.columns.phone')}</TableHead>
          <TableHead>{t('adminUsers.columns.registeredDate')}</TableHead>
          <TableHead>{t('adminUsers.columns.status')}</TableHead>
          <TableHead className="rounded-tr-xl">
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
  <div className="flex flex-col gap-3 px-5 py-6" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-12 w-full animate-pulse rounded-lg bg-[#f3f4f6]"
      />
    ))}
  </div>
);

/**
 * Admin Users Management — Figma node 339:2960.
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
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="text-[16px] text-[#ee1c25]">{loadErrorMessage}</p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
        >
          {t('adminUsers.retry')}
        </Button>
      </div>
    );
  } else if (users.length === 0) {
    body = (
      <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
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
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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
        className="overflow-hidden rounded-xl bg-white"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError && (
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
        )}
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
