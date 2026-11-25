import {
  CircleCheck,
  Hourglass,
  MoreVertical,
  Search,
  Shield,
} from 'lucide-react';
import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import AdminBasicStatCard from '@/components/data-display/AdminBasicStatCard/AdminBasicStatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import Button from '@/components/ui/Button';
import {
  ACTION_MENU_OPTIONS,
  formatReportDate,
  MORE_ICON_SIZE,
  REASON_LABEL_KEYS,
  REPORT_STAT_CARDS,
  REPORT_STATUS,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  TYPE_LABEL_KEYS,
} from '@/portals/admin/data/adminReportsData';
import useAdminReports from '@/portals/admin/hooks/useAdminReports';
import { ROUTES } from '@/shared/config';

const REPORT_STAT_ICONS = {
  total: Shield,
  pending: Hourglass,
  underReview: Search,
  resolved: CircleCheck,
};

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';

const TH_CLASS =
  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748b] lg:px-4';
const TD_CLASS = 'px-3 py-2.5 text-[13px] leading-4 text-[#0f172a] lg:px-4';

const useIsMdUp = () => {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MD_MEDIA_QUERY).matches
      : false,
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

const ReportStatCards = memo(({ stats }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
    {REPORT_STAT_CARDS.map((card) => {
      const Icon = REPORT_STAT_ICONS[card.id];
      return (
        <AdminBasicStatCard
          key={card.id}
          labelKey={card.labelKey}
          value={stats[card.id] ?? 0}
          icon={Icon ? <Icon size={16} strokeWidth={2.25} /> : null}
          iconBg={card.iconBg}
          hintKey={card.hintKey}
          borderClass={card.border || 'border-[#f3f4f6]'}
          cardClass="px-3 py-3.5 sm:px-5 sm:py-4.5"
          valueClass={`pt-2 text-[22px] leading-7 sm:pt-2.5 sm:text-[26px] ${card.valueClass || 'text-[#111827]'}`}
        />
      );
    })}
  </div>
));
ReportStatCards.displayName = 'ReportStatCards';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES[REPORT_STATUS.PENDING];
  const labelKey =
    STATUS_LABEL_KEYS[status] || STATUS_LABEL_KEYS[REPORT_STATUS.PENDING];

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 py-1 ${style.bg}`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      <span
        className={`text-[12px] font-semibold leading-4 whitespace-nowrap ${style.text}`}
      >
        {t(labelKey)}
      </span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatusFilterTabs = memo(({ statusFilter, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={t('adminReports.filters.aria')}
    >
      <div className="flex w-max flex-nowrap items-center gap-1.5 sm:w-auto sm:flex-wrap">
        {STATUS_FILTERS.map((filter) => {
          const active = filter.id === statusFilter;
          return (
            <Button
              unstyled
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(filter.id)}
              className={`inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-[7px] border px-3 py-1 text-[12px] font-semibold leading-4.5 transition ${
                active
                  ? 'border-[#4048cd] bg-[#4048cd] text-white'
                  : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb]'
              }`}
            >
              {t(filter.labelKey)}
            </Button>
          );
        })}
      </div>
    </div>
  );
});
StatusFilterTabs.displayName = 'StatusFilterTabs';

const getReportedBy = (row, t) =>
  row.reportedBy || (row.reportedByKey ? t(row.reportedByKey) : '') || '—';

const getReportedItem = (row, t) =>
  row.reportedItem || (row.reportedItemKey ? t(row.reportedItemKey) : '') || '—';

const getReportType = (row, t) =>
  row.type && TYPE_LABEL_KEYS[row.type]
    ? t(TYPE_LABEL_KEYS[row.type])
    : row.type || '—';

const getReportReason = (row, t) =>
  row.reason && REASON_LABEL_KEYS[row.reason]
    ? t(REASON_LABEL_KEYS[row.reason])
    : row.reason || '—';

const getReportedUserName = (row, t) =>
  row.reportedUser?.name ||
  row.reportedUser?.username ||
  (row.reportedUserKey ? t(row.reportedUserKey) : '') ||
  '—';

const getReportedUserCount = (row) =>
  row.reportedUser?.reportsCount ?? row.reportedUserReportCount ?? 0;

const ReportActionMenu = memo(
  ({ row, isOpen, onToggle, onClose, onViewReport, onSelectStatus }) => {
    const { t } = useTranslation();
    const buttonWrapRef = useRef(null);
    const buttonRef = useRef(null);
    const menuRef = useRef(null);
    const [placement, setPlacement] = useState(null);
    const reportedBy = getReportedBy(row, t);

    useLayoutEffect(() => {
      if (!isOpen || !buttonRef.current) {
        setPlacement(null);
        return undefined;
      }

      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuHeight =
          menuRef.current?.offsetHeight || ACTION_MENU_FALLBACK_HEIGHT_PX;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < menuHeight + ACTION_MENU_OFFSET_PX;

        setPlacement({
          right: Math.max(
            ACTION_MENU_VIEWPORT_MARGIN_PX,
            window.innerWidth - rect.right,
          ),
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
            aria-label={t('adminReports.actions.menu', { name: reportedBy })}
            style={{
              position: 'fixed',
              zIndex: 50,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <span
              className="block h-[3px] w-full bg-[#4048cd]"
              aria-hidden="true"
            />
            {ACTION_MENU_OPTIONS.map((option) => (
              <Button
                unstyled
                key={option.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  if (option.kind === 'navigate') onViewReport(row.id);
                  else onSelectStatus(row.id, option.id);
                }}
                className="w-full cursor-pointer px-4 py-2.5 text-left text-[14px] leading-normal text-[#373737] transition hover:bg-[#f6fbff]"
              >
                {t(option.labelKey)}
              </Button>
            ))}
          </div>,
          document.body,
        )
      : null;

    return (
      <div className="relative inline-flex" ref={buttonWrapRef}>
        <Button
          unstyled
          ref={buttonRef}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label={t('adminReports.actions.menu', { name: reportedBy })}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#64748b] transition ${
            isOpen ? 'bg-[#f1f5f9] text-[#0f172a]' : 'hover:bg-[#f1f5f9]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </Button>
        {menu}
      </div>
    );
  },
);
ReportActionMenu.displayName = 'ReportActionMenu';

const ReportTableRow = memo(
  ({
    row,
    openActionId,
    onToggleAction,
    onCloseAction,
    onViewReport,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();
    const reportCount = getReportedUserCount(row);

    return (
      <TableRow className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc]">
        <TableCell className={TD_CLASS}>
          <p className="truncate font-semibold text-[#0f172a]">
            {getReportedBy(row, t)}
          </p>
        </TableCell>
        <TableCell className={`${TD_CLASS} text-[#475569]`}>
          <span className="line-clamp-2" title={getReportedItem(row, t)}>
            {getReportedItem(row, t)}
          </span>
        </TableCell>
        <TableCell className={`${TD_CLASS} hidden text-[#475569] xl:table-cell`}>
          {getReportType(row, t)}
        </TableCell>
        <TableCell className={`${TD_CLASS} hidden text-[#475569] lg:table-cell`}>
          <span className="line-clamp-2" title={getReportReason(row, t)}>
            {getReportReason(row, t)}
          </span>
        </TableCell>
        <TableCell className={TD_CLASS}>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="truncate font-medium text-[#0f172a]">
              {getReportedUserName(row, t)}
            </span>
            {reportCount > 0 ? (
              <span className="shrink-0 rounded-md bg-[#fee2e2] px-1.5 py-0.5 text-[10px] font-bold text-[#991b1b]">
                {t('adminReports.reportCount', { count: reportCount })}
              </span>
            ) : null}
          </div>
        </TableCell>
        <TableCell
          className={`${TD_CLASS} hidden whitespace-nowrap text-[#475569] sm:table-cell`}
        >
          {formatReportDate(row.reportedDate)}
        </TableCell>
        <TableCell className={TD_CLASS}>
          <StatusBadge status={row.status} />
        </TableCell>
        <TableCell className={TD_CLASS} align="right">
          <ReportActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onViewReport={onViewReport}
            onSelectStatus={onSelectStatus}
          />
        </TableCell>
      </TableRow>
    );
  },
);
ReportTableRow.displayName = 'ReportTableRow';

const ReportMobileCard = memo(
  ({
    row,
    openActionId,
    onToggleAction,
    onCloseAction,
    onViewReport,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();
    const reportCount = getReportedUserCount(row);
    const typeLabel = getReportType(row, t);
    const reasonLabel = getReportReason(row, t);

    return (
      <article className="rounded-xl border border-[#edf0f5] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold leading-5 text-[#0f172a]">
              {getReportedBy(row, t)}
            </p>
            <p
              className="mt-0.5 line-clamp-2 text-[12px] leading-4 text-[#64748b]"
              title={getReportedItem(row, t)}
            >
              {getReportedItem(row, t)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <StatusBadge status={row.status} />
            <ReportActionMenu
              row={row}
              isOpen={openActionId === row.id}
              onToggle={onToggleAction}
              onClose={onCloseAction}
              onViewReport={onViewReport}
              onSelectStatus={onSelectStatus}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex max-w-full truncate rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
            {typeLabel}
          </span>
          <span className="inline-flex max-w-full truncate rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
            {reasonLabel}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 border-t border-[#f1f5f9] pt-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#94a3b8]">
              {t('adminReports.columns.reportedUser')}
            </span>
            <div className="flex min-w-0 max-w-[65%] items-center justify-end gap-1.5">
              <span className="truncate text-right text-[13px] font-medium text-[#0f172a]">
                {getReportedUserName(row, t)}
              </span>
              {reportCount > 0 ? (
                <span className="shrink-0 rounded-md bg-[#fee2e2] px-1.5 py-0.5 text-[10px] font-bold text-[#991b1b]">
                  {reportCount}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#94a3b8]">
              {t('adminReports.columns.reportedDate')}
            </span>
            <span className="text-right text-[13px] font-medium text-[#0f172a]">
              {formatReportDate(row.reportedDate)}
            </span>
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
    openActionId,
    stats,
    visibleRows,
    page,
    totalPages,
    from,
    to,
    resultsTotal,
    isLoading,
    handleStatusFilterChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handlePageChange,
  } = useAdminReports();

  const handleViewReport = (reportId) => {
    handleCloseAction();
    navigate(`${ROUTES.ADMIN_REPORTS}/${reportId}`);
  };

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:gap-6 sm:py-4">
      <AdminPageHeader
        title={t('adminReports.title')}
        description={t('adminReports.subtitle')}
        titleClassName="text-[24px] tracking-tight sm:text-[28px] lg:text-[30px] lg:leading-9"
        descriptionClassName="max-w-3xl text-[13px] leading-5 sm:text-[14px]"
      />

      <ReportStatCards stats={stats} />

      <section
        aria-label={t('adminReports.tableAria')}
        className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-col gap-3 border-b border-[#f3f4f6] px-4 py-3.5 sm:px-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[13px] font-bold leading-5 text-[#111827] sm:text-[14px]">
            {t('adminReports.tableTitle', 'All Reports')}{' '}
            <span className="text-[12px] font-medium text-[#9ca3af] sm:text-[13px]">
              ({resultsTotal})
            </span>
          </p>
          <StatusFilterTabs
            statusFilter={statusFilter}
            onSelect={handleStatusFilterChange}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
            <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
            <span className="text-[14px] font-medium">
              {t('adminReports.loading', 'Loading reports...')}
            </span>
          </div>
        ) : visibleRows.length > 0 ? (
          isMdUp ? (
            <Table
              className="w-full min-w-[900px]"
              wrapperClassName="overflow-x-auto"
            >
              <TableHeader>
                <TableRow
                  isHeader
                  className="border-b border-[#f1f5f9] bg-[#fafbfc]"
                >
                  <TableHead className={TH_CLASS}>
                    {t('adminReports.columns.reportedBy')}
                  </TableHead>
                  <TableHead className={TH_CLASS}>
                    {t('adminReports.columns.reportedItem')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} hidden xl:table-cell`}>
                    {t('adminReports.columns.type')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} hidden lg:table-cell`}>
                    {t('adminReports.columns.reason')}
                  </TableHead>
                  <TableHead className={TH_CLASS}>
                    {t('adminReports.columns.reportedUser')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} hidden sm:table-cell`}>
                    {t('adminReports.columns.reportedDate')}
                  </TableHead>
                  <TableHead className={TH_CLASS}>
                    {t('adminReports.columns.status')}
                  </TableHead>
                  <TableHead className={`${TH_CLASS} text-right`}>
                    {t('adminReports.columns.action')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col gap-3 bg-[#f8fafc] p-3 sm:p-4">
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
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#687186]">
            <p className="text-[15px] text-[#687186]">{t('adminReports.empty')}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-[#f3f4f6] px-4 py-4 sm:flex-row sm:justify-between sm:px-5">
          <p className="text-center text-[13px] leading-5 text-[#687186] sm:text-left">
            {t('adminReports.pagination.showing', {
              from,
              to,
              total: resultsTotal,
            })}
          </p>
          <AdminPagination
            variant="competitions"
            page={page}
            totalPages={Math.max(1, totalPages)}
            onPageChange={handlePageChange}
            navAriaLabel={t('adminReports.pagination.aria')}
            firstLabel={t('adminReports.pagination.first')}
            prevLabel={t('adminReports.pagination.prev')}
            nextLabel={t('adminReports.pagination.next')}
            lastLabel={t('adminReports.pagination.last')}
            pageLabel={(pageNumber) =>
              t('adminReports.pagination.page', { page: pageNumber })
            }
          />
        </div>
      </section>
    </div>
  );
});

AdminReportsContent.displayName = 'AdminReportsContent';

export default AdminReportsContent;
