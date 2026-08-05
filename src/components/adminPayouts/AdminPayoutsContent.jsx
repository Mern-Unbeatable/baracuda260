import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_PAYOUTS_ASSETS,
  ACTION_STATUS_OPTIONS,
  AVATAR_SIZE,
  AVATAR_STYLES,
  CHEVRON_ICON_SIZE,
  MORE_ICON_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from './adminPayoutsData';
import useAdminPayouts from './useAdminPayouts';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 132;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;

/**
 * @param {{ status: string }} props
 */
const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex h-[30px] items-center gap-[5px] rounded-[8px] px-[9px] py-[5px] ${style.bg}`}
    >
      <span className={`size-[6px] shrink-0 rounded-[3px] ${style.dot}`} aria-hidden="true" />
      <span className={`text-[13px] font-bold leading-[19px] whitespace-nowrap ${style.text}`}>
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

/**
 * @param {{
 *   initials: string,
 *   avatarTone: string,
 * }} props
 */
const WinnerAvatar = memo(({ initials, avatarTone }) => {
  const tone = AVATAR_STYLES[avatarTone] || AVATAR_STYLES.indigo;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[12px] text-[13px] font-extrabold leading-[19px] ${tone.bg} ${tone.text}`}
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
});

WinnerAvatar.displayName = 'WinnerAvatar';

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
  const activeFilter =
    STATUS_FILTERS.find((filter) => filter.id === statusFilter) || STATUS_FILTERS[0];

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
      <p className="text-[14px] leading-normal text-[#373737]">{t('adminPayouts.sortBy')}</p>
      <div className="relative">
        <button
          type="button"
          aria-expanded={sortOpen}
          aria-haspopup="listbox"
          aria-label={t('adminPayouts.filters.aria')}
          onClick={onToggle}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[8px] border border-[#e4e4e4] bg-white p-3 text-left"
        >
          <span className="text-[16px] leading-normal whitespace-nowrap text-[#373737]">
            {t(activeFilter.labelKey)}
          </span>
          <img
            src={ADMIN_PAYOUTS_ASSETS.chevronDown}
            alt=""
            width={CHEVRON_ICON_SIZE}
            height={CHEVRON_ICON_SIZE}
            className={`size-6 shrink-0 transition ${sortOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {sortOpen ? (
          <ul
            role="listbox"
            aria-label={t('adminPayouts.filters.aria')}
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
 * Row Action menu (table column 7). Portaled so table overflow does not clip it.
 * @param {{
 *   row: object,
 *   isOpen: boolean,
 *   onToggle: (rowId: string) => void,
 *   onClose: () => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const PayoutActionMenu = memo(({ row, isOpen, onToggle, onClose, onSelectStatus }) => {
  const { t } = useTranslation();
  const buttonWrapRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [placement, setPlacement] = useState(null);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) {
      setPlacement(null);
      return undefined;
    }

    // Drop down by default; flip up only for rows without room below (last row).
    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight || ACTION_MENU_FALLBACK_HEIGHT_PX;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + ACTION_MENU_OFFSET_PX;

      setPlacement({
        right: Math.max(ACTION_MENU_VIEWPORT_MARGIN_PX, window.innerWidth - rect.right),
        ...(openUpward
          ? { bottom: window.innerHeight - rect.top + ACTION_MENU_OFFSET_PX }
          : { top: rect.bottom + ACTION_MENU_OFFSET_PX }),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      const inButton = buttonWrapRef.current?.contains(event.target);
      const inMenu = menuRef.current?.contains(event.target);
      if (!inButton && !inMenu) onClose();
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

  const menu = isOpen
    ? createPortal(
        <ul
          ref={menuRef}
          role="listbox"
          aria-label={t('adminPayouts.actions.menuAria', { name: t(row.nameKey) })}
          style={{
            position: 'fixed',
            zIndex: 50,
            visibility: placement ? 'visible' : 'hidden',
            ...placement,
          }}
          className="min-w-[160px] overflow-hidden rounded-[10px] border border-[#e8ebf1] bg-white py-1 shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
        >
          {ACTION_STATUS_OPTIONS.map((option) => {
            const selected = option.id === row.status;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectStatus(row.id, option.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[14px] font-medium leading-5 transition hover:bg-[#f6fbff] ${
                    selected ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                  }`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${
                      STATUS_STYLES[option.id]?.dot || 'bg-[#8b95a5]'
                    }`}
                    aria-hidden="true"
                  />
                  {t(option.labelKey)}
                </button>
              </li>
            );
          })}
        </ul>,
        document.body,
      )
    : null;

  return (
    <div className="relative inline-flex" ref={buttonWrapRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('adminPayouts.actions.menu', { name: t(row.nameKey) })}
        onClick={() => onToggle(row.id)}
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-[8px] transition ${
          isOpen ? 'bg-[#f0f2f5]' : 'hover:bg-[#f6f7f9]'
        }`}
      >
        <img
          src={ADMIN_PAYOUTS_ASSETS.more}
          alt=""
          width={MORE_ICON_SIZE}
          height={MORE_ICON_SIZE}
          className="size-5"
        />
      </button>
      {menu}
    </div>
  );
});

PayoutActionMenu.displayName = 'PayoutActionMenu';

/**
 * @param {{
 *   row: object,
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const PayoutTableRow = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <tr className="border-t border-[#f0f2f5]">
        <td className="px-[18px] py-[15px]">
          <div className="flex items-center gap-3">
            <WinnerAvatar initials={row.initials} avatarTone={row.avatarTone} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold leading-[21px] text-[#263147]">
                {t(row.nameKey)}
              </p>
              <p className="truncate text-[13px] leading-[19px] text-[#929bab]">{row.email}</p>
            </div>
          </div>
        </td>
        <td className="px-[18px] py-[26px] text-[14px] leading-[21px] text-[#59657a]">
          {row.totalEarn}
        </td>
        <td className="px-[18px] py-[26px] text-[14px] leading-[21px] text-[#59657a]">
          {row.withdrawAmount}
        </td>
        <td className="px-[18px] py-[26px] text-[14px] leading-[21px] whitespace-nowrap text-[#59657a]">
          {row.paypalNumber}
        </td>
        <td className="px-[18px] py-[26px] text-[14px] leading-[21px] whitespace-nowrap text-[#59657a]">
          {t(row.requestedKey)}
        </td>
        <td className="px-[18px] py-[22px]">
          <StatusBadge status={row.status} />
        </td>
        <td className="px-[18px] py-[23px]">
          <PayoutActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onSelectStatus={onSelectStatus}
          />
        </td>
      </tr>
    );
  },
);

PayoutTableRow.displayName = 'PayoutTableRow';

/**
 * @param {{
 *   rows: object[],
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const PayoutsTable = memo(
  ({ rows, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="bg-[#fbfcfd]">
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.winner')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.totalEarn')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.withdrawAmount')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.paypalNumber')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.requested')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.status')}
              </th>
              <th className="px-[18px] py-3 text-[13px] font-bold leading-[19px] text-[#8b95a5]">
                {t('adminPayouts.columns.action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <PayoutTableRow
                key={row.id}
                row={row}
                openActionId={openActionId}
                onToggleAction={onToggleAction}
                onCloseAction={onCloseAction}
                onSelectStatus={onSelectStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

PayoutsTable.displayName = 'PayoutsTable';

/**
 * @param {{
 *   rows: object[],
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const PayoutsMobileCards = memo(
  ({ rows, openActionId, onToggleAction, onCloseAction, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-col md:hidden" data-testid="payouts-mobile-cards">
        {rows.map((row) => (
          <article
            key={row.id}
            className="flex flex-col gap-3 border-b border-[#f0f2f5] px-4 py-4 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <WinnerAvatar initials={row.initials} avatarTone={row.avatarTone} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold leading-[21px] text-[#263147]">
                    {t(row.nameKey)}
                  </p>
                  <p className="truncate text-[13px] leading-[19px] text-[#929bab]">{row.email}</p>
                </div>
              </div>
              <PayoutActionMenu
                row={row}
                isOpen={openActionId === row.id}
                onToggle={onToggleAction}
                onClose={onCloseAction}
                onSelectStatus={onSelectStatus}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div>
                <p className="text-[#8b95a5]">{t('adminPayouts.columns.totalEarn')}</p>
                <p className="text-[#59657a]">{row.totalEarn}</p>
              </div>
              <div>
                <p className="text-[#8b95a5]">{t('adminPayouts.columns.withdrawAmount')}</p>
                <p className="text-[#59657a]">{row.withdrawAmount}</p>
              </div>
              <div>
                <p className="text-[#8b95a5]">{t('adminPayouts.columns.paypalNumber')}</p>
                <p className="text-[#59657a]">{row.paypalNumber}</p>
              </div>
              <div>
                <p className="text-[#8b95a5]">{t('adminPayouts.columns.requested')}</p>
                <p className="text-[#59657a]">{t(row.requestedKey)}</p>
              </div>
            </div>
            <StatusBadge status={row.status} />
          </article>
        ))}
      </div>
    );
  },
);

PayoutsMobileCards.displayName = 'PayoutsMobileCards';

/**
 * @param {{
 *   count: number,
 *   total: number,
 *   page: number,
 *   pageNumbers: number[],
 *   isFirstPage: boolean,
 *   isLastPage: boolean,
 *   onPrevious: () => void,
 *   onNext: () => void,
 *   onSelectPage: (page: number) => void,
 * }} props
 */
const PayoutsPagination = memo(
  ({
    count,
    total,
    page,
    pageNumbers,
    isFirstPage,
    isLastPage,
    onPrevious,
    onNext,
    onSelectPage,
  }) => {
    const { t } = useTranslation();
    // Figma 339:4637 — text arrows, soft blue active chip, muted inactive pages.
    const pageBtnBase =
      'inline-flex cursor-pointer items-center justify-center rounded-[6px] px-[9px] py-[5px] text-[13px] leading-[19px] transition';

    return (
      <div className="flex flex-col gap-3 border-t border-[#e8ebf1] px-[18px] pb-[15.5px] pt-[17px] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] font-normal leading-[19px] text-[#8b95a5]">
          {t('adminPayouts.pagination.showing', {
            count,
            total: total.toLocaleString('en-US'),
          })}
        </p>
        <div
          className="flex items-center gap-[4px]"
          role="navigation"
          aria-label={t('adminPayouts.pagination.aria')}
        >
          <button
            type="button"
            disabled={isFirstPage}
            aria-label={t('adminPayouts.pagination.previous')}
            onClick={onPrevious}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ←
          </button>
          {pageNumbers.map((pageNumber) => {
            const active = pageNumber === page;
            return (
              <button
                key={pageNumber}
                type="button"
                aria-label={t('adminPayouts.pagination.page', { page: pageNumber })}
                aria-current={active ? 'page' : undefined}
                onClick={() => onSelectPage(pageNumber)}
                className={`${pageBtnBase} ${
                  active
                    ? 'bg-[#edf3ff] font-extrabold text-[#2b65d1]'
                    : 'font-normal text-[#7b8596] hover:bg-[#f6fbff]'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            disabled={isLastPage}
            aria-label={t('adminPayouts.pagination.next')}
            onClick={onNext}
            className={`${pageBtnBase} text-[#7b8596] hover:bg-[#f6fbff] disabled:cursor-not-allowed disabled:opacity-40`}
          >
            →
          </button>
        </div>
      </div>
    );
  },
);

PayoutsPagination.displayName = 'PayoutsPagination';

/**
 * Admin Payouts — Figma node 339:4423.
 */
const AdminPayoutsContent = memo(() => {
  const { t } = useTranslation();
  const {
    statusFilter,
    sortOpen,
    openActionId,
    visibleRows,
    page,
    pageNumbers,
    resultsCount,
    resultsTotal,
    isFirstPage,
    isLastPage,
    handleStatusFilterChange,
    handleToggleSort,
    handleCloseSort,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
  } = useAdminPayouts();

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <header className="flex flex-col gap-1">
          <p className="text-[14px] font-extrabold uppercase leading-[19px] tracking-[1.55px] text-[#7f8ba1]">
            {t('adminPayouts.eyebrow')}
          </p>
          <h1 className="font-manrope pt-3 text-[32px] font-normal leading-[40px] tracking-[-1.67px] text-[#151e31] sm:text-[36px] sm:leading-[42px]">
            {t('adminPayouts.title')}
          </h1>
          <p className="pt-3 text-[16px] leading-[25px] text-[#687186]">
            {t('adminPayouts.subtitle')}
          </p>
        </header>
      </div>

      <section
        aria-label={t('adminPayouts.tableAria')}
        className="overflow-hidden rounded-[18px] border border-[#e8ebf1] bg-white shadow-[0px_4px_15px_0px_rgba(27,39,69,0.02)]"
      >
        <div className="flex justify-end border-b border-[#e8ebf1] px-4 py-5 sm:px-5">
          <StatusSortSelect
            statusFilter={statusFilter}
            sortOpen={sortOpen}
            onToggle={handleToggleSort}
            onClose={handleCloseSort}
            onSelect={handleStatusFilterChange}
          />
        </div>

        {visibleRows.length > 0 ? (
          <>
            <PayoutsMobileCards
              rows={visibleRows}
              openActionId={openActionId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSelectStatus={handleRowStatusChange}
            />
            <PayoutsTable
              rows={visibleRows}
              openActionId={openActionId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSelectStatus={handleRowStatusChange}
            />
          </>
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
            {t('adminPayouts.empty')}
          </p>
        )}

        <PayoutsPagination
          count={resultsCount}
          total={resultsTotal}
          page={page}
          pageNumbers={pageNumbers}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          onSelectPage={handleSelectPage}
        />
      </section>
    </div>
  );
});

AdminPayoutsContent.displayName = 'AdminPayoutsContent';

export default AdminPayoutsContent;
