import {
  Bell,
  CheckCircle2,
  Clock,
  MoreVertical,
  PauseCircle,
  Plus,
  Square,
  X,
  XCircle,
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
import AnnouncementFormModal from '@/portals/admin/components/admin-announcements/AnnouncementFormModal';
import {
  ACTION_MENU_OPTIONS,
  ANNOUNCEMENT_STAT_CARDS,
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_TYPE,
  formatScheduleDate,
  getAnnouncementStatus,
  getAnnouncementTypeLabel,
  MORE_ICON_SIZE,
  PRIORITY_DOT_STYLES,
  PRIORITY_LABEL_KEYS,
  STATUS_STYLES,
  TYPE_STYLES,
} from '@/portals/admin/data/adminAnnouncementsData';
import useAdminAnnouncements from '@/portals/admin/hooks/useAdminAnnouncements';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';
const SKELETON_ROW_COUNT = 5;

const TH_CLASS =
  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748b] lg:px-4';
const TD_CLASS = 'px-3 py-2.5 text-[13px] leading-4 text-[#0f172a] lg:px-4';

const STAT_ICONS = {
  total: Bell,
  active: CheckCircle2,
  scheduled: Clock,
  expired: XCircle,
  inactive: PauseCircle,
};

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

const AnnouncementStatCards = memo(({ stats, isLoading }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
    {ANNOUNCEMENT_STAT_CARDS.map((card) => {
      const Icon = STAT_ICONS[card.id] || Bell;
      return (
        <AdminBasicStatCard
          key={card.id}
          labelKey={card.labelKey}
          value={isLoading ? '—' : (stats?.[card.id] ?? 0)}
          icon={<Icon size={16} strokeWidth={2.25} />}
          iconBg={card.iconBg}
          hintKey={card.hintKey}
          hintClass={card.hintClass}
          borderClass="border-[#f3f4f6]"
          cardClass="px-3 py-3.5 sm:px-5 sm:py-4.5"
          valueClass="pt-2 text-[22px] leading-7 text-[#111827] sm:pt-2.5 sm:text-[26px]"
        />
      );
    })}
  </div>
));
AnnouncementStatCards.displayName = 'AnnouncementStatCards';

const TypeBadge = memo(({ type }) => {
  const { t } = useTranslation();
  const style =
    TYPE_STYLES[type] || TYPE_STYLES[ANNOUNCEMENT_TYPE.GENERAL_ANNOUNCEMENT];

  return (
    <span
      className={`inline-flex h-7 max-w-full items-center truncate rounded-md px-2.5 text-[11px] font-semibold leading-4 whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {getAnnouncementTypeLabel(t, type)}
    </span>
  );
});
TypeBadge.displayName = 'TypeBadge';

const PriorityIndicator = memo(({ priority }) => {
  const { t } = useTranslation();
  const dots = PRIORITY_DOT_STYLES[priority] || PRIORITY_DOT_STYLES.low;

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {dots.map((dotClass, index) => (
          <span
            key={`${priority}-${index}`}
            className={`size-2 rounded-full ${dotClass}`}
          />
        ))}
      </span>
      <span className="text-[12px] font-medium leading-4 text-[#374151]">
        {PRIORITY_LABEL_KEYS[priority]
          ? t(PRIORITY_LABEL_KEYS[priority])
          : priority}
      </span>
    </div>
  );
});
PriorityIndicator.displayName = 'PriorityIndicator';

const StatusIcon = memo(({ icon, className }) => {
  if (icon === 'clock')
    return (
      <Clock
        size={12}
        strokeWidth={2.5}
        className={className}
        aria-hidden="true"
      />
    );
  if (icon === 'x')
    return (
      <X size={12} strokeWidth={2.5} className={className} aria-hidden="true" />
    );
  if (icon === 'square')
    return (
      <Square
        size={10}
        strokeWidth={2.5}
        className={className}
        aria-hidden="true"
      />
    );
  return (
    <span className={`size-1.5 rounded-full ${className}`} aria-hidden="true" />
  );
});
StatusIcon.displayName = 'StatusIcon';

const StatusBadge = memo(({ announcement }) => {
  const { t } = useTranslation();
  const status = getAnnouncementStatus(announcement);
  const style =
    STATUS_STYLES[status] || STATUS_STYLES[ANNOUNCEMENT_STATUS.EXPIRED];

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 py-1 ${style.bg}`}
    >
      <StatusIcon icon={style.icon} className={style.text} />
      <span
        className={`text-[12px] font-semibold leading-4 whitespace-nowrap ${style.text}`}
      >
        {t(`adminAnnouncements.status.${status}`, {
          defaultValue: announcement.displayStatus || status,
        })}
      </span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const AnnouncementSchedule = memo(({ row, className = '' }) => {
  const { t, i18n } = useTranslation();
  const start = formatScheduleDate(row.startDate, row.startTime, i18n.language);
  const end = row.noEndDate
    ? t('adminAnnouncements.schedule.manual')
    : formatScheduleDate(row.endDate, row.endTime, i18n.language) || '—';

  return (
    <div className={`text-[12px] leading-[18px] text-[#9ca3af] ${className}`}>
      <p>
        <span className="text-[#6b7280]">
          {t('adminAnnouncements.schedule.start')}
        </span>{' '}
        {start || '—'}
      </p>
      <p className="pt-0.5">
        <span className="text-[#6b7280]">
          {t('adminAnnouncements.schedule.end')}
        </span>{' '}
        {end}
      </p>
    </div>
  );
});
AnnouncementSchedule.displayName = 'AnnouncementSchedule';

const AnnouncementSummary = memo(({ row, wrap = false }) => {
  const link = row?.link;
  const linkText =
    typeof link === 'string'
      ? link
      : typeof link === 'object' && link !== null
        ? link.buttonName || link.text || link.url || ''
        : '';
  const linkHref =
    typeof link === 'string'
      ? link
      : typeof link === 'object' && link !== null
        ? link.url || link.text || link.buttonName || ''
        : '';

  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc] text-[16px] leading-none"
        aria-hidden="true"
      >
        {typeof row.icon === 'string' && row.icon ? row.icon : '📢'}
      </span>
      <div className="min-w-0">
        <p
          className={`text-[13px] font-semibold leading-5 text-[#111827] ${
            wrap ? '' : 'truncate'
          }`}
          title={typeof row.message === 'string' ? row.message : ''}
        >
          {typeof row.message === 'string'
            ? row.message
            : String(row.message ?? '')}
        </p>
        {linkText ? (
          linkHref ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block truncate text-[11px] font-medium leading-4 text-[#4048cd] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {linkText}
            </a>
          ) : (
            <p className="mt-0.5 truncate text-[11px] font-medium leading-4 text-[#4048cd]">
              {linkText}
            </p>
          )
        ) : null}
      </div>
    </div>
  );
});
AnnouncementSummary.displayName = 'AnnouncementSummary';

const AnnouncementActionMenu = memo(
  ({ row, isOpen, isBusy, onToggle, onClose, onSelectAction }) => {
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

    const menuLabel = t('adminAnnouncements.actions.menu', {
      title: row.message,
    });

    const menu = isOpen
      ? createPortal(
          <ul
            ref={menuRef}
            role="menu"
            aria-label={menuLabel}
            style={{
              position: 'fixed',
              zIndex: 60,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
          >
            {ACTION_MENU_OPTIONS.map((option) => (
              <li key={option.id}>
                <Button
                  unstyled
                  type="button"
                  role="menuitem"
                  disabled={option.id === row.activeState}
                  onClick={() => onSelectAction(row, option.id)}
                  className="flex w-full cursor-pointer items-center bg-white px-3 py-2 text-left text-[13px] leading-5 text-[#222] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
                >
                  {t(option.labelKey)}
                </Button>
              </li>
            ))}
          </ul>,
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
          aria-label={menuLabel}
          disabled={isBusy}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#373737] transition disabled:cursor-wait disabled:opacity-50 ${
            isOpen ? 'bg-[#f6fbff]' : 'hover:bg-[#f6fbff]'
          }`}
        >
          <MoreVertical size={MORE_ICON_SIZE} aria-hidden="true" />
        </Button>
        {menu}
      </div>
    );
  },
);
AnnouncementActionMenu.displayName = 'AnnouncementActionMenu';

const RowActionMenu = ({ row, actions }) => (
  <AnnouncementActionMenu
    row={row}
    isOpen={actions.openActionId === row.id}
    isBusy={actions.busyId === row.id}
    onToggle={actions.onToggleAction}
    onClose={actions.onCloseAction}
    onSelectAction={actions.onSelectAction}
  />
);

const AnnouncementTableRow = memo(({ row, actions }) => (
  <TableRow
    className={`border-b border-[#f1f5f9] transition-opacity ${
      actions.busyId === row.id ? 'opacity-60' : ''
    }`}
  >
    <TableCell className={`${TD_CLASS} max-w-[360px]`}>
      <AnnouncementSummary row={row} />
    </TableCell>
    <TableCell className={TD_CLASS}>
      <TypeBadge type={row.type} />
    </TableCell>
    <TableCell className={TD_CLASS}>
      <AnnouncementSchedule row={row} />
    </TableCell>
    <TableCell className={TD_CLASS}>
      <PriorityIndicator priority={row.priority} />
    </TableCell>
    <TableCell className={TD_CLASS}>
      <StatusBadge announcement={row} />
    </TableCell>
    <TableCell className={`${TD_CLASS} text-right`}>
      <RowActionMenu row={row} actions={actions} />
    </TableCell>
  </TableRow>
));
AnnouncementTableRow.displayName = 'AnnouncementTableRow';

const AnnouncementsTable = memo(({ rows, actions }) => {
  const { t } = useTranslation();

  return (
    <Table className="w-full min-w-[980px]" wrapperClassName="overflow-x-auto">
      <TableHeader>
        <TableRow isHeader className="border-b border-[#f1f5f9] bg-[#fafbfc]">
          {[
            'announcement',
            'type',
            'schedule',
            'priority',
            'status',
            'action',
          ].map((column) => (
            <TableHead
              key={column}
              className={`${TH_CLASS} ${column === 'action' ? 'text-right' : ''}`}
            >
              {t(`adminAnnouncements.columns.${column}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <AnnouncementTableRow key={row.id} row={row} actions={actions} />
        ))}
      </TableBody>
    </Table>
  );
});
AnnouncementsTable.displayName = 'AnnouncementsTable';

const AnnouncementMobileCard = memo(({ row, actions }) => {
  const link = row?.link;
  const linkText =
    typeof link === 'string'
      ? link
      : typeof link === 'object' && link !== null
        ? link.buttonName || link.text || link.url || ''
        : '';
  const linkHref =
    typeof link === 'string'
      ? link
      : typeof link === 'object' && link !== null
        ? link.url || ''
        : '';
  const message =
    typeof row.message === 'string'
      ? row.message
      : String(row.message ?? '');
  const icon = typeof row.icon === 'string' && row.icon ? row.icon : '📢';

  return (
    <article
      className={`rounded-xl border border-[#edf0f5] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] transition-opacity ${
        actions.busyId === row.id ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8fafc] text-[18px] leading-none"
          aria-hidden="true"
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p className="min-w-0 flex-1 text-[14px] font-semibold leading-5 text-[#111827]">
              {message}
            </p>
            <RowActionMenu row={row} actions={actions} />
          </div>

          {linkText ? (
            linkHref ? (
              <a
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block max-w-full truncate text-[12px] font-medium leading-4 text-[#4048cd] hover:underline"
                onClick={(e) => e.stopPropagation()}
                title={linkText}
              >
                {linkText}
              </a>
            ) : (
              <p
                className="mt-1 truncate text-[12px] font-medium leading-4 text-[#4048cd]"
                title={linkText}
              >
                {linkText}
              </p>
            )
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge announcement={row} />
        <TypeBadge type={row.type} />
        <PriorityIndicator priority={row.priority} />
      </div>

      <div className="mt-3 border-t border-[#f1f5f9] pt-3">
        <AnnouncementSchedule row={row} />
      </div>
    </article>
  );
});
AnnouncementMobileCard.displayName = 'AnnouncementMobileCard';

const AnnouncementsSkeleton = () => (
  <div className="flex flex-col gap-3 p-3 sm:p-4" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-20 w-full animate-pulse rounded-xl bg-[#f3f4f6] sm:h-14"
      />
    ))}
  </div>
);

const AdminAnnouncementsContent = memo(() => {
  const { t } = useTranslation();
  const isMdUp = useIsMdUp();
  const {
    rows,
    isLoading,
    isError,
    isFetching,
    loadErrorMessage,
    refetch,
    stats,
    isStatsLoading,
    page,
    totalPages,
    range,
    busyId,
    openActionId,
    handleToggleAction,
    handleCloseAction,
    handleSelectAction,
    handlePageChange,
    isModalOpen,
    isEditMode,
    editingAnnouncement,
    isDetailLoading,
    isDetailError,
    detailErrorMessage,
    refetchDetail,
    isSaving,
    handleOpenCreateModal,
    handleCloseModal,
    handleSubmitAnnouncement,
  } = useAdminAnnouncements();

  const actions = {
    openActionId,
    busyId,
    onToggleAction: handleToggleAction,
    onCloseAction: handleCloseAction,
    onSelectAction: handleSelectAction,
  };

  let body;
  if (isLoading) {
    body = <AnnouncementsSkeleton />;
  } else if (isError) {
    body = (
      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <p className="text-[15px] font-medium text-[#ee1c25]">
          {loadErrorMessage}
        </p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#d41921]"
        >
          {t('adminAnnouncements.retry', 'Retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-12 text-center text-[15px] text-[#6b7280]">
        {t('adminAnnouncements.empty')}
      </p>
    );
  } else if (isMdUp) {
    body = <AnnouncementsTable rows={rows} actions={actions} />;
  } else {
    body = (
      <div
        className="flex flex-col gap-3 bg-[#f8fafc] p-3"
        data-testid="announcements-mobile-cards"
      >
        {rows.map((row) => (
          <AnnouncementMobileCard key={row.id} row={row} actions={actions} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:gap-6 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <AdminPageHeader
          title={t('adminAnnouncements.title')}
          description={t('adminAnnouncements.subtitle')}
          titleClassName="text-[24px] tracking-tight sm:text-[28px] lg:text-[30px] lg:leading-9"
          descriptionClassName="max-w-3xl text-[13px] leading-5 sm:text-[14px]"
        />
        <Button
          unstyled
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 self-end rounded-full bg-[#ee1c25] px-5 text-[14px] font-bold text-white transition hover:bg-[#d41921] sm:h-11 sm:w-auto sm:px-6 sm:text-[15px]"
        >
          <Plus size={18} aria-hidden="true" />
          {t('adminAnnouncements.createButton')}
        </Button>
      </div>

      <AnnouncementStatCards stats={stats} isLoading={isStatsLoading} />

      <section
        aria-label={t('adminAnnouncements.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="border-b border-[#f3f4f6] px-3 py-3.5 sm:px-5">
          <p className="text-[13px] font-bold leading-5 text-[#111827] sm:text-[14px]">
            {t('adminAnnouncements.tableTitle', 'All Announcements')}{' '}
            <span className="text-[12px] font-medium text-[#9ca3af] sm:text-[13px]">
              ({range.total})
            </span>
          </p>
        </div>

        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError && range.total > 0 ? (
          <div className="flex flex-col items-center gap-3 border-t border-[#f3f4f6] px-3 py-4 sm:flex-row sm:justify-between sm:px-5">
            <p className="text-center text-[13px] leading-5 text-[#687186] sm:text-left">
              {t('adminAnnouncements.pagination.showing', {
                from: range.from,
                to: range.to,
                total: range.total,
              })}
            </p>
            <AdminPagination
              variant="competitions"
              page={page}
              totalPages={Math.max(1, totalPages)}
              onPageChange={handlePageChange}
              navAriaLabel={t('adminAnnouncements.pagination.aria')}
              firstLabel={t('adminAnnouncements.pagination.first')}
              prevLabel={t('adminAnnouncements.pagination.prev')}
              nextLabel={t('adminAnnouncements.pagination.next')}
              lastLabel={t('adminAnnouncements.pagination.last')}
              pageLabel={(pageNumber) =>
                t('adminAnnouncements.pagination.page', { page: pageNumber })
              }
            />
          </div>
        ) : null}
      </section>

      <AnnouncementFormModal
        open={isModalOpen}
        isEdit={isEditMode}
        announcement={editingAnnouncement}
        isLoading={isDetailLoading}
        isError={isDetailError}
        errorMessage={detailErrorMessage}
        onRetry={() => refetchDetail()}
        isSaving={isSaving}
        onClose={handleCloseModal}
        onSubmit={handleSubmitAnnouncement}
      />
    </div>
  );
});

AdminAnnouncementsContent.displayName = 'AdminAnnouncementsContent';

export default AdminAnnouncementsContent;
