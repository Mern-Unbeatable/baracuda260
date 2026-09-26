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
import CreateAnnouncementModal from '@/portals/admin/components/admin-announcements/CreateAnnouncementModal';
import {
  ACTION_MENU_OPTIONS,
  ADMIN_ANNOUNCEMENTS_ASSETS,
  ANNOUNCEMENT_STAT_CARDS,
  ANNOUNCEMENT_STATUS,
  ANNOUNCEMENT_TYPE,
  getAnnouncementScheduleEnd,
  getAnnouncementScheduleStart,
  getAnnouncementTitle,
  MORE_ICON_SIZE,
  PRIORITY_DOT_STYLES,
  PRIORITY_LABEL_KEYS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  TYPE_LABEL_KEYS,
  TYPE_STYLES,
} from '@/portals/admin/data/adminAnnouncementsData';
import useAdminAnnouncements from '@/portals/admin/hooks/useAdminAnnouncements';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const LG_MEDIA_QUERY = '(min-width: 1024px)';

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

import AdminBasicStatCard from '@/components/data-display/AdminBasicStatCard/AdminBasicStatCard';

const AnnouncementStatCards = memo(() => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ANNOUNCEMENT_STAT_CARDS.map((card) => (
        <AdminBasicStatCard
          key={card.id}
          labelKey={card.labelKey}
          value={card.value}
          icon={card.icon}
          iconBg={card.iconBg}
          hintKey={card.hintKey}
          hintClass={card.hintClass}
          borderClass="border-[#f3f4f6]"
          valueClass="text-[#111827]"
        />
      ))}
    </div>
  );
});
AnnouncementStatCards.displayName = 'AnnouncementStatCards';

const TypeBadge = memo(({ type }) => {
  const { t } = useTranslation();
  const style = TYPE_STYLES[type] || TYPE_STYLES[ANNOUNCEMENT_TYPE.GENERAL];

  return (
    <span
      className={`inline-flex h-6 items-center rounded-[99px] px-2.5 text-[11px] font-semibold leading-[16.5px] whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {t(TYPE_LABEL_KEYS[type])}
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
        {t(PRIORITY_LABEL_KEYS[priority])}
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

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
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
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const AnnouncementActionMenu = memo(
  ({ row, isOpen, onToggle, onClose, onSelectAction }) => {
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

    const rowTitle = getAnnouncementTitle(row, t);

    const menu = isOpen
      ? createPortal(
          <ul
            ref={menuRef}
            role="menu"
            aria-label={t('adminAnnouncements.actions.menu', {
              title: rowTitle,
            })}
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
                  disabled={option.id === row.status}
                  onClick={() => onSelectAction(row.id, option.id)}
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
          aria-label={t('adminAnnouncements.actions.menu', { title: rowTitle })}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-7 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] bg-white transition ${
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

const AnnouncementTableRow = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onSelectAction }) => {
    const { t } = useTranslation();
    const title = getAnnouncementTitle(row, t);
    const scheduleStart = getAnnouncementScheduleStart(row, t);
    const scheduleEnd = getAnnouncementScheduleEnd(row, t);

    return (
      <TableRow className="border-b border-[#f3f4f6]">
        <TableCell className="px-5">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="text-[18px] leading-none" aria-hidden="true">
              {row.emoji}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-[19.5px] text-[#111827]">
                {title}
              </p>
              <p className="pt-0.5 text-[11px] font-medium leading-[16.5px] text-[#9ca3af]">
                {row.code}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <TypeBadge type={row.type} />
        </TableCell>
        <TableCell>
          <div className="text-[12px] leading-[18px] text-[#9ca3af]">
            <p>
              <span className="text-[#6b7280]">
                {t('adminAnnouncements.schedule.start')}
              </span>{' '}
              {scheduleStart}
            </p>
            <p className="pt-0.5">
              <span className="text-[#6b7280]">
                {t('adminAnnouncements.schedule.end')}
              </span>{' '}
              {scheduleEnd}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <PriorityIndicator priority={row.priority} />
        </TableCell>
        <TableCell>
          <StatusBadge status={row.status} />
        </TableCell>
        <TableCell className="px-5">
          <AnnouncementActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onSelectAction={onSelectAction}
          />
        </TableCell>
      </TableRow>
    );
  },
);
AnnouncementTableRow.displayName = 'AnnouncementTableRow';

const AnnouncementsTable = memo(
  ({ rows, openActionId, onToggleAction, onCloseAction, onSelectAction }) => {
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
            <AnnouncementTableRow
              key={row.id}
              row={row}
              openActionId={openActionId}
              onToggleAction={onToggleAction}
              onCloseAction={onCloseAction}
              onSelectAction={onSelectAction}
            />
          ))}
        </TableBody>
      </Table>
    );
  },
);
AnnouncementsTable.displayName = 'AnnouncementsTable';

const AnnouncementMobileCard = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onSelectAction }) => {
    const { t } = useTranslation();
    const title = getAnnouncementTitle(row, t);
    const scheduleStart = getAnnouncementScheduleStart(row, t);
    const scheduleEnd = getAnnouncementScheduleEnd(row, t);

    return (
      <article className="flex flex-col gap-3 border-b border-[#f3f4f6] px-4 py-4 last:border-b-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="text-[18px] leading-none" aria-hidden="true">
              {row.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-5 text-[#111827]">
                {title}
              </p>
              <p className="pt-0.5 text-[11px] text-[#9ca3af]">{row.code}</p>
            </div>
          </div>
          <AnnouncementActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onSelectAction={onSelectAction}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={row.type} />
          <StatusBadge status={row.status} />
        </div>
        <PriorityIndicator priority={row.priority} />
        <div className="text-[12px] leading-[18px] text-[#9ca3af]">
          <p>
            <span className="text-[#6b7280]">
              {t('adminAnnouncements.schedule.start')}
            </span>{' '}
            {scheduleStart}
          </p>
          <p>
            <span className="text-[#6b7280]">
              {t('adminAnnouncements.schedule.end')}
            </span>{' '}
            {scheduleEnd}
          </p>
        </div>
      </article>
    );
  },
);
AnnouncementMobileCard.displayName = 'AnnouncementMobileCard';

const AdminAnnouncementsContent = memo(() => {
  const { t } = useTranslation();
  const isLgUp = useIsLgUp();
  const {
    visibleRows,
    page,
    pageNumbers,
    resultsFrom,
    resultsTo,
    resultsTotal,
    resultsCount,
    isFirstPage,
    isLastPage,
    openActionId,
    isCreateModalOpen,
    handleToggleAction,
    handleCloseAction,
    handleSelectAction,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCreateAnnouncement,
  } = useAdminAnnouncements();

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

      <AnnouncementStatCards />

      <section
        aria-label={t('adminAnnouncements.tableAria')}
        className="overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        {visibleRows.length > 0 ? (
          isLgUp ? (
            <AnnouncementsTable
              rows={visibleRows}
              openActionId={openActionId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSelectAction={handleSelectAction}
            />
          ) : (
            <div
              className="flex flex-col"
              data-testid="announcements-mobile-cards"
            >
              {visibleRows.map((row) => (
                <AnnouncementMobileCard
                  key={row.id}
                  row={row}
                  openActionId={openActionId}
                  onToggleAction={handleToggleAction}
                  onCloseAction={handleCloseAction}
                  onSelectAction={handleSelectAction}
                />
              ))}
            </div>
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#6b7280]">
            {t('adminAnnouncements.empty')}
          </p>
        )}

        <AdminPagination
          variant="comment"
          count={resultsCount}
          total={resultsTotal}
          page={page}
          pageNumbers={pageNumbers}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          onSelectPage={handleSelectPage}
          showingText={t('adminAnnouncements.pagination.showing', {
            from: resultsFrom,
            to: resultsTo,
            total: resultsTotal,
          })}
          navAriaLabel={t('adminAnnouncements.pagination.aria')}
          previousAriaLabel={t('adminAnnouncements.pagination.previous')}
          nextAriaLabel={t('adminAnnouncements.pagination.next')}
          pageAriaLabel={(pageNumber) =>
            t('adminAnnouncements.pagination.page', { page: pageNumber })
          }
        />
      </section>

      <CreateAnnouncementModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateAnnouncement}
      />
    </div>
  );
});

AdminAnnouncementsContent.displayName = 'AdminAnnouncementsContent';

export default AdminAnnouncementsContent;
