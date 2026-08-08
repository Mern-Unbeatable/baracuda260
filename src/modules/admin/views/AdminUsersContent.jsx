import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ACTION_ICON_SIZE,
  ADMIN_USERS_ASSETS,
  CHEVRON_ICON_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  USER_STATUS,
} from '@/modules/admin/data/adminUsersData';
import useAdminUsers from '@/modules/admin/hooks/useAdminUsers';
import SuspendUserModal from '@/modules/admin/components/admin-users/SuspendUserModal';

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
 *     email: string,
 *     phone: string,
 *     registeredDate: string,
 *     status: string,
 *   },
 * }} props
 */
const getUserActionLabel = (t, user) => {
  const isActive = user.status === USER_STATUS.ACTIVE;
  return isActive
    ? t('adminUsers.actions.suspend', { name: t(user.nameKey) })
    : t('adminUsers.actions.reactivate', { name: t(user.nameKey) });
};

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
 *   onUserAction: (id: string) => void,
 * }} props
 */
const UserActionButton = memo(({ user, onUserAction }) => {
  const { t } = useTranslation();
  const isActive = user.status === USER_STATUS.ACTIVE;

  return (
    <button
      type="button"
      aria-label={getUserActionLabel(t, user)}
      onClick={() => onUserAction(user.id)}
      className="inline-flex size-6 cursor-pointer items-center justify-center"
    >
      <img
        src={isActive ? ADMIN_USERS_ASSETS.trash : ADMIN_USERS_ASSETS.reactivate}
        alt=""
        width={ACTION_ICON_SIZE}
        height={ACTION_ICON_SIZE}
        className="size-6"
      />
    </button>
  );
});

UserActionButton.displayName = 'UserActionButton';

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
 *   onUserAction: (id: string) => void,
 * }} props
 */
const UserTableRow = memo(({ user, onUserAction }) => {
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
        <UserActionButton user={user} onUserAction={onUserAction} />
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
 *   onUserAction: (id: string) => void,
 * }} props
 */
const UserMobileCard = memo(({ user, onUserAction }) => {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">{t(user.nameKey)}</p>
          <p className="mt-1 break-all text-[14px] leading-5 text-[#687186]">{user.email}</p>
        </div>
        <UserActionButton user={user} onUserAction={onUserAction} />
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
 *   onUserAction: (id: string) => void,
 * }} props
 */
const UsersMobileCards = memo(({ users, onUserAction }) => (
  <div className="flex flex-col md:hidden" data-testid="users-mobile-cards">
    {users.map((user) => (
      <UserMobileCard key={user.id} user={user} onUserAction={onUserAction} />
    ))}
  </div>
));

UsersMobileCards.displayName = 'UsersMobileCards';

/**
 * @param {{
 *   users: Array<{ id: string, status: string }>,
 *   onUserAction: (id: string) => void,
 * }} props
 */
const UsersTable = memo(({ users, onUserAction }) => {
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
            <UserTableRow key={user.id} user={user} onUserAction={onUserAction} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

UsersTable.displayName = 'UsersTable';

/**
 * @param {{
 *   from: number,
 *   to: number,
 *   total: number,
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 * }} props
 */
const UsersPagination = memo(({ from, to, total, isFirstPage, isLastPage, onPrevious, onNext }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-4 text-center md:h-[67px] md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
      <p className="px-2.5 text-[16px] leading-normal text-[#4048cd]">
        {t('adminUsers.pagination.showing', { from, to, total })}
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={isFirstPage}
          onClick={onPrevious}
          className="cursor-pointer rounded-[12px] border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('adminUsers.pagination.previous')}
        </button>
        <button
          type="button"
          disabled={isLastPage}
          onClick={onNext}
          className="cursor-pointer rounded-[12px] border border-[#4048cd] px-4 py-2 text-[16px] font-medium capitalize text-[#4048cd] transition hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('adminUsers.pagination.next')}
        </button>
      </div>
    </div>
  );
});

UsersPagination.displayName = 'UsersPagination';

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
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handlePreviousPage,
    handleNextPage,
    handleUserAction,
    handleCloseSuspendModal,
    handleConfirmSuspend,
  } = useAdminUsers();

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <header className="flex flex-col gap-1">
          <p className="text-[14px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]">
            {t('adminUsers.eyebrow')}
          </p>
          <h1 className="font-manrope pt-3 text-[36px] font-normal leading-[42px] tracking-[-1.67px] text-[#151e31]">
            {t('adminUsers.title')}
          </h1>
          <p className="pt-3 text-[16px] leading-[25px] text-[#687186]">{t('adminUsers.subtitle')}</p>
        </header>

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
            <UsersMobileCards users={visibleUsers} onUserAction={handleUserAction} />
            <UsersTable users={visibleUsers} onUserAction={handleUserAction} />
          </>
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">{t('adminUsers.empty')}</p>
        )}

        <UsersPagination
          from={range.from}
          to={range.to}
          total={range.total}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
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
