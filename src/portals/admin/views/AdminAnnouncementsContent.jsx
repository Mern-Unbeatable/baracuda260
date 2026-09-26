import { Clock, Plus, Square, X } from 'lucide-react';
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
import Image from '@/components/ui/Image';
import AnnouncementFormModal from '@/portals/admin/components/admin-announcements/AnnouncementFormModal';
import {
  ACTION_MENU_OPTIONS,
  ADMIN_ANNOUNCEMENTS_ASSETS,
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
const LG_MEDIA_QUERY = '(min-width: 1024px)';
const SKELETON_ROW_COUNT = 5;

const useIsLgUp = () => {
  const [isLgUp, setIsLgUp] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(LG_MEDIA_QUERY).matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia(LG_MEDIA_QUERY);
    const onChange = () => setIsLgUp(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isLgUp;
};

const AnnouncementStatCards = memo(({ stats, isLoading }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
    {ANNOUNCEMENT_STAT_CARDS.map((card) => (
      <AdminBasicStatCard
        key={card.id}
        labelKey={card.labelKey}
        value={isLoading ? '—' : (stats?.[card.id] ?? 0)}
        icon={card.icon}
        iconBg={card.iconBg}
        hintKey={card.hintKey}
        hintClass={card.hintClass}
        borderClass="border-[#f3f4f6]"
        valueClass="text-[#111827]"
      />
    ))}
  </div>
));
AnnouncementStatCards.displayName = 'AnnouncementStatCards';

const TypeBadge = memo(({ type }) => {
  const { t } = useTranslation();
  const style =
    TYPE_STYLES[type] || TYPE_STYLES[ANNOUNCEMENT_TYPE.GENERAL_ANNOUNCEMENT];

  return (
    <span
      className={`inline-flex h-6 items-center rounded-[99px] px-2.5 text-[11px] font-semibold leading-[16.5px] whitespace-nowrap ${style.bg} ${style.text}`}
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
      <span className="text-[12px] font-medium leading-4.5 text-[#374151]">
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
      className={`inline-flex h-[22.5px] items-center gap-1.25 rounded-[99px] px-2.25 py-0.75 ${style.bg}`}
    >
      <StatusIcon icon={style.icon} className={style.text} />
      <span
        className={`text-[11px] font-semibold leading-[16.5px] whitespace-nowrap ${style.text}`}
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

const AnnouncementSummary = memo(({ row, wrap = false }) => (
  <div className="flex min-w-0 items-start gap-2.5">
    <span className="text-[18px] leading-none" aria-hidden="true">
      {row.icon || '📢'}
    </span>
    <div className="min-w-0">
      <p
        className={`text-[13px] font-semibold leading-[19.5px] text-[#111827] ${
          wrap ? '' : 'truncate'
        }`}
        title={row.message}
      >
        {row.message}
      </p>
      {row.link ? (
        <p className="truncate pt-0.5 text-[11px] font-medium leading-[16.5px] text-[#4048cd]">
          {row.link}
        </p>
      ) : null}
    </div>
  </div>
));
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
            className="overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
          >
            {ACTION_MENU_OPTIONS.map((option) => (
              <li key={option.id}>
                <Button
                  unstyled
                  type="button"
                  role="menuitem"
                  disabled={option.id === row.activeState}
                  onClick={() => onSelectAction(row, option.id)}
                  className="flex w-full cursor-pointer items-center bg-white px-2.5 py-1.25 text-left text-[16px] leading-6 text-[#222] transition hover:bg-[#f6fbff] disabled:cursor-default disabled:opacity-50"
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
          className={`inline-flex size-7 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] bg-white transition disabled:cursor-wait disabled:opacity-50 ${
            isOpen ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
          }`}
        >
          <Image
            src={ADMIN_ANNOUNCEMENTS_ASSETS.more}
            alt=""
            width={MORE_ICON_SIZE}
            height={MORE_ICON_SIZE}
            className="size-5"
          />
        </Button>
        {menu}
      </div>
    );
  },
);
AnnouncementActionMenu.displayName = 'AnnouncementActionMenu';

/**
 * @typedef {{
 *   openActionId: string | null,
 *   busyId: string | null,
 *   onToggleAction: (id: string) => void,
 *   onCloseAction: () => void,
 *   onSelectAction: (row: object, actionId: string) => void,
 * }} AnnouncementRowActions
 */

/** @param {{ row: object, actions: AnnouncementRowActions }} props */
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

/** @param {{ row: object, actions: AnnouncementRowActions }} props */
const AnnouncementTableRow = memo(({ row, actions }) => (
  <TableRow
    className={`border-b border-[#f3f4f6] transition-opacity ${
      actions.busyId === row.id ? 'opacity-60' : ''
    }`}
  >
    <TableCell className="max-w-[360px] px-5">
      <AnnouncementSummary row={row} />
    </TableCell>
    <TableCell>
      <TypeBadge type={row.type} />
    </TableCell>
    <TableCell>
      <AnnouncementSchedule row={row} />
    </TableCell>
    <TableCell>
      <PriorityIndicator priority={row.priority} />
    </TableCell>
    <TableCell>
      <StatusBadge announcement={row} />
    </TableCell>
    <TableCell className="px-5">
      <RowActionMenu row={row} actions={actions} />
    </TableCell>
  </TableRow>
));
AnnouncementTableRow.displayName = 'AnnouncementTableRow';

/** @param {{ rows: object[], actions: AnnouncementRowActions }} props */
const AnnouncementsTable = memo(({ rows, actions }) => {
  const { t } = useTranslation();

  return (
    <Table className="min-w-[980px]">
      <TableHeader>
        <TableRow isHeader className="border-b border-[#f3f4f6]">
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
              className="text-[11px] font-bold leading-[16.5px] tracking-[0.55px] uppercase text-[#9ca3af] first:px-5 last:px-5"
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

/** @param {{ row: object, actions: AnnouncementRowActions }} props */
const AnnouncementMobileCard = memo(({ row, actions }) => (
  <article
    className={`flex flex-col gap-3 border-b border-[#f3f4f6] px-4 py-4 transition-opacity last:border-b-0 ${
      actions.busyId === row.id ? 'opacity-60' : ''
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <AnnouncementSummary row={row} wrap />
      <RowActionMenu row={row} actions={actions} />
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <TypeBadge type={row.type} />
      <StatusBadge announcement={row} />
    </div>
    <PriorityIndicator priority={row.priority} />
    <AnnouncementSchedule row={row} />
  </article>
));
AnnouncementMobileCard.displayName = 'AnnouncementMobileCard';

const AnnouncementsSkeleton = () => (
  <div className="flex flex-col gap-3 px-5 py-6" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-14 w-full animate-pulse rounded-lg bg-[#f3f4f6]"
      />
    ))}
  </div>
);

const AdminAnnouncementsContent = memo(() => {
  const { t } = useTranslation();
  const isLgUp = useIsLgUp();
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
    pageNumbers,
    range,
    isFirstPage,
    isLastPage,
    busyId,
    openActionId,
    handleToggleAction,
    handleCloseAction,
    handleSelectAction,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
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

  /** @type {AnnouncementRowActions} */
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
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <p className="text-[16px] text-[#ee1c25]">{loadErrorMessage}</p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
        >
          {t('adminAnnouncements.retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-10 text-center text-[16px] text-[#6b7280]">
        {t('adminAnnouncements.empty')}
      </p>
    );
  } else if (isLgUp) {
    body = <AnnouncementsTable rows={rows} actions={actions} />;
  } else {
    body = (
      <div className="flex flex-col" data-testid="announcements-mobile-cards">
        {rows.map((row) => (
          <AnnouncementMobileCard key={row.id} row={row} actions={actions} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <AdminPageHeader
          title={t('adminAnnouncements.title')}
          description={t('adminAnnouncements.subtitle')}
        />
        <Button
          unstyled
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[16px] font-bold leading-normal text-white transition hover:bg-[#d41921]"
        >
          <Plus size={20} aria-hidden="true" />
          {t('adminAnnouncements.createButton')}
        </Button>
      </div>

      <AnnouncementStatCards stats={stats} isLoading={isStatsLoading} />

      <section
        aria-label={t('adminAnnouncements.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError && range.total > 0 ? (
          <AdminPagination
            variant="comment"
            count={range.count}
            total={range.total}
            page={page}
            pageNumbers={pageNumbers}
            isFirstPage={isFirstPage || isFetching}
            isLastPage={isLastPage || isFetching}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            onSelectPage={handleSelectPage}
            showingText={t('adminAnnouncements.pagination.showing', {
              from: range.from,
              to: range.to,
              total: range.total,
            })}
            navAriaLabel={t('adminAnnouncements.pagination.aria')}
            previousAriaLabel={t('adminAnnouncements.pagination.previous')}
            nextAriaLabel={t('adminAnnouncements.pagination.next')}
            pageAriaLabel={(pageNumber) =>
              t('adminAnnouncements.pagination.page', { page: pageNumber })
            }
          />
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
