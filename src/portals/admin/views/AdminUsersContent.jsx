import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import {
  ADMIN_USERS_ASSETS,
  CHEVRON_ICON_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  USER_STATUS,
} from '@/portals/admin/data/adminUsersData';
import useAdminUsers from '@/portals/admin/hooks/useAdminUsers';
import SuspendUserModal from '@/portals/admin/components/admin-users/SuspendUserModal';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';

/**
 * @param {{ status: string }} props
 */
const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const isActive = status === USER_STATUS.ACTIVE;

  return (
    <span
      className={`inline-flex h-[30px] items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] ${
        isActive ? 'bg-[#eef7f3]' : 'bg-[#f2f1f8]'
      }`}
    >
      <span
        className={`size-[6px] shrink-0 rounded-[3px] ${
          isActive ? 'bg-[#268262]' : 'bg-[#766f9a]'
        }`}
        aria-hidden="true"
      />
      <span
        className={`text-[13px] font-bold leading-[19px] whitespace-nowrap ${
          isActive ? 'text-[#268262]' : 'text-[#766f9a]'
        }`}
      >
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

/**
 * @param {{
 *   statusFilter: string,
 *   sortOpen: boolean,
 *   onToggle: () => void,
 *   onClose: () => void,
 *   onSelect: (filterId: string) => void,
 * }} props
 */
const StatusSortSelect = memo(({ statusFilter, sortOpen, onToggle, onClose, onSelect }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const activeFilter = STATUS_FILTERS.find((filter) => filter.id === statusFilter) || STATUS_FILTERS[0];

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
      <p className="text-[14px] leading-normal text-[#373737]">{t('adminUsers.sortBy')}</p>
      <div className="relative">
        <button
          type="button"
          aria-expanded={sortOpen}
          aria-haspopup="listbox"
          aria-label={t('adminUsers.filters.aria')}
          onClick={onToggle}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[8px] border border-[#e4e4e4] bg-white p-3 text-left"
        >
          <span className="text-[16px] leading-normal whitespace-nowrap text-[#373737]">
            {t(activeFilter.labelKey)}
          </span>
          <img
            src={ADMIN_USERS_ASSETS.chevronDown}
            alt=""
            width={CHEVRON_ICON_SIZE}
            height={CHEVRON_ICON_SIZE}
            className={`size-6 shrink-0 transition ${sortOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {sortOpen ? (
          <ul
            role="listbox"
            aria-label={t('adminUsers.filters.aria')}
            className="absolute right-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-lg"
          >
            {STATUS_FILTERS.map((filter) => {
              const selected = filter.id === statusFilter;
              return (
                <li key={filter.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => onSelect(filter.id)}
                    className={`w-full cursor-pointer px-3 py-2.5 text-left text-[16px] transition hover:bg-[#f6fbff] ${
                      selected ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                    }`}
                  >
                    {t(filter.labelKey)}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
});

StatusSortSelect.displayName = 'StatusSortSelect';

/**
 * @param {{
 *   user: {
 *     id: string,
 *     nameKey: string,
 *     status: string,
 *   },
 *   isOpen: boolean,
 *   onToggle: () => void,
 *   onClose: () => void,
 *   onActivate: () => void,
 *   onSuspend: () => void,
 * }} props
 */
const UserActionMenu = memo(({ user, isOpen, onToggle, onClose, onActivate, onSuspend }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const isActive = user.status === USER_STATUS.ACTIVE;
  const menuLabel = t('adminUsers.actions.menu', { name: t(user.nameKey) });

  useEffect(() => {
    if (!isOpen) return undefined;

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
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={menuLabel}
        onClick={onToggle}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#373737] transition hover:bg-[#f6fbff]"
      >
        <MoreVertical size={20} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={menuLabel}
          className="absolute right-0 top-full z-30 mt-1 min-w-[140px] overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
        >
          <span className="block h-[3px] w-full bg-[#4048cd]" aria-hidden="true" />
          <button
            type="button"
            role="menuitem"
            disabled={isActive}
            onClick={onActivate}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
          >
            {t('adminUsers.actions.active')}
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={!isActive}
            onClick={onSuspend}
            className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
          >
            {t('adminUsers.actions.suspendOption')}
          </button>
        </div>
      ) : null}
    </div>
  );
});

UserActionMenu.displayName = 'UserActionMenu';

/**
 * @param {{
 *   user: {
 *     id: string,
 *     nameKey: string,
 *     email: string,
 *     phone: string,
 *     registeredDate: string,
 *     status: string,
 *   },
 *   onActivate: (id: string) => void,
 *   onSuspend: (id: string) => void,
 *   openActionMenuId: string | null,
 *   onToggleActionMenu: (id: string) => void,
 *   onCloseActionMenu: () => void,
 * }} props
 */
const UserTableRow = memo(({ user, onActivate, onSuspend, openActionMenuId, onToggleActionMenu, onCloseActionMenu }) => {
  const { t } = useTranslation();

  return (
    <tr className="border-b border-[#e4e4e4]">
      <td className="min-w-[160px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
        {t(user.nameKey)}
      </td>
      <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 break-all text-[#0c0c0c]">
        {user.email}
      </td>
      <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {user.phone}
      </td>
      <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
        {user.registeredDate}
      </td>
      <td className="min-w-[180px] px-[26px] py-6">
        <StatusBadge status={user.status} />
      </td>
      <td className="min-w-[100px] px-[26px] py-6">
        <UserActionMenu
          user={user}
          isOpen={openActionMenuId === user.id}
          onToggle={() => onToggleActionMenu(user.id)}
          onClose={onCloseActionMenu}
          onActivate={() => onActivate(user.id)}
          onSuspend={() => onSuspend(user.id)}
        />
      </td>
    </tr>
  );
});

UserTableRow.displayName = 'UserTableRow';

/**
 * Mobile card for a single user row.
 * @param {{
 *   user: {
 *     id: string,
 *     nameKey: string,
 *     email: string,
 *     phone: string,
 *     registeredDate: string,
 *     status: string,
 *   },
 *   onActivate: (id: string) => void,
 *   onSuspend: (id: string) => void,
 *   openActionMenuId: string | null,
 *   onToggleActionMenu: (id: string) => void,
 *   onCloseActionMenu: () => void,
 * }} props
 */
const UserMobileCard = memo(({ user, onActivate, onSuspend, openActionMenuId, onToggleActionMenu, onCloseActionMenu }) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">{t(user.nameKey)}</p>
          <p className="mt-1 break-all text-[14px] leading-5 text-[#687186]">{user.email}</p>
        </div>
        <UserActionMenu
          user={user}
          isOpen={openActionMenuId === user.id}
          onToggle={() => onToggleActionMenu(user.id)}
          onClose={onCloseActionMenu}
          onActivate={() => onActivate(user.id)}
          onSuspend={() => onSuspend(user.id)}
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">{t('adminUsers.columns.phone')}</span>
          <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{user.phone}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">
            {t('adminUsers.columns.registeredDate')}
          </span>
          <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{user.registeredDate}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] leading-5 text-[#7f8ba1]">{t('adminUsers.columns.status')}</span>
          <StatusBadge status={user.status} />
        </div>
      </div>
    </article>
  );
});

UserMobileCard.displayName = 'UserMobileCard';

/**
 * @param {{
 *   users: Array<{ id: string, status: string }>,
 *   onActivate: (id: string) => void,
 *   onSuspend: (id: string) => void,
 *   openActionMenuId: string | null,
 *   onToggleActionMenu: (id: string) => void,
 *   onCloseActionMenu: () => void,
 * }} props
 */
const UsersMobileCards = memo(({ users, onActivate, onSuspend, openActionMenuId, onToggleActionMenu, onCloseActionMenu }) => (
  <div className="flex flex-col md:hidden" data-testid="users-mobile-cards">
    {users.map((user) => (
      <UserMobileCard
        key={user.id}
        user={user}
        onActivate={onActivate}
        onSuspend={onSuspend}
        openActionMenuId={openActionMenuId}
        onToggleActionMenu={onToggleActionMenu}
        onCloseActionMenu={onCloseActionMenu}
      />
    ))}
  </div>
));

UsersMobileCards.displayName = 'UsersMobileCards';

/**
 * @param {{
 *   users: Array<{ id: string, status: string }>,
 *   onActivate: (id: string) => void,
 *   onSuspend: (id: string) => void,
 *   openActionMenuId: string | null,
 *   onToggleActionMenu: (id: string) => void,
 *   onCloseActionMenu: () => void,
 * }} props
 */
const UsersTable = memo(({ users, onActivate, onSuspend, openActionMenuId, onToggleActionMenu, onCloseActionMenu }) => {
  const { t } = useTranslation();

  return (
    <div className="hidden w-full overflow-x-auto rounded-[12px] bg-white md:block">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead>
          <tr className="bg-[#f6fbff]">
            <th className="rounded-tl-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.name')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.email')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.phone')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.registeredDate')}
            </th>
            <th className="px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.status')}
            </th>
            <th className="rounded-tr-[12px] px-[26px] py-3 text-[16px] font-normal leading-6 text-black">
              {t('adminUsers.columns.action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onActivate={onActivate}
              onSuspend={onSuspend}
              openActionMenuId={openActionMenuId}
              onToggleActionMenu={onToggleActionMenu}
              onCloseActionMenu={onCloseActionMenu}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

UsersTable.displayName = 'UsersTable';

/**
 * Admin Users Management — Figma node 339:2960.
 */
const AdminUsersContent = memo(() => {
  const { t } = useTranslation();
  const {
    statusFilter,
    sortOpen,
    visibleUsers,
    range,
    isFirstPage,
    isLastPage,
    isSuspendModalOpen,
    openActionMenuId,
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
  } = useAdminUsers();

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
        className="overflow-hidden rounded-[12px] bg-white"
      >
        {visibleUsers.length > 0 ? (
          <>
            <UsersMobileCards
              users={visibleUsers}
              onActivate={handleActivateUser}
              onSuspend={handleRequestSuspend}
              openActionMenuId={openActionMenuId}
              onToggleActionMenu={handleToggleActionMenu}
              onCloseActionMenu={handleCloseActionMenu}
            />
            <UsersTable
              users={visibleUsers}
              onActivate={handleActivateUser}
              onSuspend={handleRequestSuspend}
              openActionMenuId={openActionMenuId}
              onToggleActionMenu={handleToggleActionMenu}
              onCloseActionMenu={handleCloseActionMenu}
            />
          </>
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">{t('adminUsers.empty')}</p>
        )}

        <AdminPagination
          variant="users"
          from={range.from}
          to={range.to}
          total={range.total}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
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
      </section>

      <SuspendUserModal
        open={isSuspendModalOpen}
        onClose={handleCloseSuspendModal}
        onConfirm={handleConfirmSuspend}
      />
    </div>
  );
});

AdminUsersContent.displayName = 'AdminUsersContent';

export default AdminUsersContent;
