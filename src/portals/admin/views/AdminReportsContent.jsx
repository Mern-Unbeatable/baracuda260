import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  ACTION_MENU_OPTIONS,
  MORE_ICON_SIZE,
  REASON_LABEL_KEYS,
  REPORT_STAT_CARDS,
  REPORT_STATUS,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  TYPE_LABEL_KEYS,
} from '@/portals/admin/data/adminReportsData';
import {
  ADMIN_DEMO_PROFILES_ASSETS,
  CHEVRON_ICON_SIZE,
} from '@/portals/admin/data/adminDemoProfilesData';
import useAdminReports from '@/portals/admin/hooks/useAdminReports';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';

const useIsMdUp = () => {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MD_MEDIA_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(MD_MEDIA_QUERY);
    const onChange = () => setIsMdUp(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMdUp;
};

const ReportStatCards = memo(({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {REPORT_STAT_CARDS.map((card) => (
        <article
          key={card.id}
          className={`rounded-[14px] border bg-white px-5.75 py-5.25 shadow-[0px_1px_2px_rgba(0,0,0,0.06)] ${card.border}`}
        >
          <div className="flex items-start justify-between">
            <p className="text-[12px] font-semibold leading-4.5 tracking-[0.24px] text-[#6b7280]">
              {t(card.labelKey)}
            </p>
            <span
              className={`inline-flex size-8.5 items-center justify-center rounded-[9px] text-[16px] leading-6 ${card.iconBg}`}
              aria-hidden="true"
            >
              {card.icon}
            </span>
          </div>
          <p className={`pt-3.5 text-[32px] font-extrabold leading-8 ${card.valueClass}`}>
            {stats[card.id]}
          </p>
          <p className="pt-2 text-[11px] font-semibold leading-[16.5px] text-[#9ca3af]">
            {t(card.hintKey)}
          </p>
        </article>
      ))}
    </div>
  );
});

ReportStatCards.displayName = 'ReportStatCards';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES[REPORT_STATUS.PENDING];

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

const StatusSortSelect = memo(({ statusFilter, sortOpen, onToggle, onClose, onSelect }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);
  const activeFilter = STATUS_FILTERS.find((filter) => filter.id === statusFilter) || STATUS_FILTERS[0];

  useEffect(() => {
    if (!sortOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onClose();
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
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={sortOpen}
        aria-haspopup="listbox"
        aria-label={t('adminReports.filters.aria')}
        onClick={onToggle}
        className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-[8px] border border-[#e4e4e4] bg-white p-3 text-left"
      >
        <span className="text-[16px] leading-normal whitespace-nowrap text-[#373737]">
          {t(activeFilter.labelKey)}
        </span>
        <img
          src={ADMIN_DEMO_PROFILES_ASSETS.chevronDown}
          alt=""
          width={CHEVRON_ICON_SIZE}
          height={CHEVRON_ICON_SIZE}
          className={`size-6 shrink-0 transition ${sortOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {sortOpen ? (
        <ul
          role="listbox"
          aria-label={t('adminReports.filters.aria')}
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
  );
});

StatusSortSelect.displayName = 'StatusSortSelect';

const ReportActionMenu = memo(
  ({ row, isOpen, onToggle, onClose, onViewReport, onSelectStatus }) => {
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
          <div
            ref={menuRef}
            role="menu"
            aria-label={t('adminReports.actions.menu', { name: t(row.reportedByKey) })}
            style={{
              position: 'fixed',
              zIndex: 50,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <span className="block h-[3px] w-full bg-[#4048cd]" aria-hidden="true" />
            {ACTION_MENU_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  if (option.kind === 'navigate') onViewReport(row.id);
                  else onSelectStatus(row.id, option.id);
                }}
                className="w-full cursor-pointer px-4 py-2.5 text-left text-[16px] leading-normal text-[#373737] transition hover:bg-[#f6fbff]"
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>,
          document.body,
        )
      : null;

    return (
      <div className="relative inline-flex" ref={buttonWrapRef}>
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={t('adminReports.actions.menu', { name: t(row.reportedByKey) })}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#373737] transition ${
            isOpen ? 'bg-[#f6fbff]' : 'hover:bg-[#f6fbff]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </button>
        {menu}
      </div>
    );
  },
);

ReportActionMenu.displayName = 'ReportActionMenu';

const TABLE_COLUMNS = [
  'reportedBy',
  'reportedItem',
  'type',
  'reason',
  'reportedUser',
  'reportedDate',
  'status',
  'action',
];

const ReportTableRow = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onViewReport, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <tr className="border-b border-[#e4e4e4]">
        <td className="min-w-[140px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(row.reportedByKey)}
        </td>
        <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(row.reportedItemKey)}
        </td>
        <td className="min-w-[140px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(TYPE_LABEL_KEYS[row.type])}
        </td>
        <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(REASON_LABEL_KEYS[row.reason])}
        </td>
        <td className="min-w-[180px] px-[26px] py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[16px] leading-6 text-[#0c0c0c]">{t(row.reportedUserKey)}</span>
            <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[11px] font-bold text-[#991b1b]">
              {t('adminReports.reportCount', { count: row.reportedUserReportCount })}
            </span>
          </div>
        </td>
        <td className="min-w-[120px] px-[26px] py-6 whitespace-nowrap text-[16px] leading-6 text-[#0c0c0c]">
          {row.reportedDate}
        </td>
        <td className="min-w-[140px] px-[26px] py-6">
          <StatusBadge status={row.status} />
        </td>
        <td className="min-w-[100px] px-[26px] py-6">
          <ReportActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onViewReport={onViewReport}
            onSelectStatus={onSelectStatus}
          />
        </td>
      </tr>
    );
  },
);

ReportTableRow.displayName = 'ReportTableRow';

const ReportMobileCard = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onViewReport, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <article className="flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">
              {t(row.reportedByKey)}
            </p>
            <p className="mt-1 text-[14px] leading-5 text-[#687186]">{t(row.reportedItemKey)}</p>
          </div>
          <ReportActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={() => onToggleAction(row.id)}
            onClose={onCloseAction}
            onViewReport={onViewReport}
            onSelectStatus={onSelectStatus}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">{t('adminReports.columns.type')}</span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
              {t(TYPE_LABEL_KEYS[row.type])}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">{t('adminReports.columns.reason')}</span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
              {t(REASON_LABEL_KEYS[row.reason])}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">
              {t('adminReports.columns.reportedUser')}
            </span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
              {t(row.reportedUserKey)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">
              {t('adminReports.columns.reportedDate')}
            </span>
            <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{row.reportedDate}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] leading-5 text-[#7f8ba1]">{t('adminReports.columns.status')}</span>
            <StatusBadge status={row.status} />
          </div>
        </div>
      </article>
    );
  },
);

ReportMobileCard.displayName = 'ReportMobileCard';

const AdminReportsContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMdUp = useIsMdUp();
  const {
    statusFilter,
    sortOpen,
    openActionId,
    stats,
    visibleRows,
    from,
    to,
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
  } = useAdminReports();

  const handleViewReport = (reportId) => {
    handleCloseAction();
    navigate(`${ROUTES.ADMIN_REPORTS}/${reportId}`);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader title={t('adminReports.title')} description={t('adminReports.subtitle')} />
        <StatusSortSelect
          statusFilter={statusFilter}
          sortOpen={sortOpen}
          onToggle={handleToggleSort}
          onClose={handleCloseSort}
          onSelect={handleStatusFilterChange}
        />
      </div>

      <ReportStatCards stats={stats} />

      <section aria-label={t('adminReports.tableAria')} className="overflow-hidden rounded-[12px] bg-white">
        {visibleRows.length > 0 ? (
          isMdUp ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1280px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f6fbff]">
                    {TABLE_COLUMNS.map((column, index) => (
                      <th
                        key={column}
                        className={`px-[26px] py-3 text-[16px] font-normal leading-6 text-black ${
                          index === 0 ? 'rounded-tl-[12px]' : ''
                        } ${index === TABLE_COLUMNS.length - 1 ? 'rounded-tr-[12px]' : ''}`}
                      >
                        {t(`adminReports.columns.${column}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <ReportTableRow
                      key={row.id}
                      row={row}
                      openActionId={openActionId}
                      onToggleAction={handleToggleAction}
                      onCloseAction={handleCloseAction}
                      onViewReport={handleViewReport}
                      onSelectStatus={handleRowStatusChange}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col">
              {visibleRows.map((row) => (
                <ReportMobileCard
                  key={row.id}
                  row={row}
                  openActionId={openActionId}
                  onToggleAction={handleToggleAction}
                  onCloseAction={handleCloseAction}
                  onViewReport={handleViewReport}
                  onSelectStatus={handleRowStatusChange}
                />
              ))}
            </div>
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">{t('adminReports.empty')}</p>
        )}

        <AdminPagination
          variant="users"
          from={from}
          to={to}
          total={resultsTotal}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          showingText={t('adminReports.pagination.showing', { from, to, total: resultsTotal })}
          previousLabel={t('adminReports.pagination.previous')}
          nextLabel={t('adminReports.pagination.next')}
        />
      </section>
    </div>
  );
});

AdminReportsContent.displayName = 'AdminReportsContent';

export default AdminReportsContent;
