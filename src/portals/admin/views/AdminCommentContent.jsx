import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ACTION_MENU_OPTIONS,
  ADMIN_COMMENT_ASSETS,
  AVATAR_SIZE,
  COMMENT_STAT_CARDS,
  COMMENT_STATUS,
  MORE_ICON_SIZE,
  PHOTO_THUMB_SIZE,
  STATUS_FILTERS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
  TYPE_LABEL_KEYS,
  TYPE_STYLES,
} from '@/portals/admin/data/adminCommentData';
import useAdminComment from '@/portals/admin/hooks/useAdminComment';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 148;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const LG_MEDIA_QUERY = '(min-width: 1024px)';

/**
 * Desktop table vs mobile cards — mount only one to avoid duplicate action portals.
 */
const useIsLgUp = () => {
  const [isLgUp, setIsLgUp] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(LG_MEDIA_QUERY).matches : false,
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

/**
 * @param {{ status: string }} props
 */
const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || STATUS_STYLES[COMMENT_STATUS.PENDING];

  return (
    <span
      className={`inline-flex h-[22.5px] items-center gap-1.25 rounded-[99px] px-2.25 py-0.75 ${style.bg}`}
    >
      <span className={`size-1.25 shrink-0 rounded-[2.5px] ${style.dot}`} aria-hidden="true" />
      <span
        className={`text-[11px] font-semibold leading-[16.5px] tracking-[0.11px] whitespace-nowrap ${style.text}`}
      >
        {t(STATUS_LABEL_KEYS[status])}
      </span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

/**
 * @param {{ type: string }} props
 */
const TypeBadge = memo(({ type }) => {
  const { t } = useTranslation();
  const style = TYPE_STYLES[type] || TYPE_STYLES.single;

  return (
    <span
      className={`inline-flex h-5 items-center rounded-md px-2 text-[11px] font-semibold leading-[16.5px] whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {t(TYPE_LABEL_KEYS[type])}
    </span>
  );
});

TypeBadge.displayName = 'TypeBadge';

/**
 * @param {{
 *   statusFilter: string,
 *   onSelect: (filterId: string) => void,
 * }} props
 */
const StatusFilterTabs = memo(({ statusFilter, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="tablist"
      aria-label={t('adminComment.filters.aria')}
    >
      {STATUS_FILTERS.map((filter) => {
        const active = filter.id === statusFilter;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(filter.id)}
            className={`inline-flex h-7 cursor-pointer items-center justify-center rounded-[7px] border px-3.25 py-1.25 text-[12px] font-semibold leading-4.5 transition ${
              active
                ? 'border-[#4048cd] bg-[#4048cd] text-white'
                : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb]'
            }`}
          >
            {t(filter.labelKey)}
          </button>
        );
      })}
    </div>
  );
});

StatusFilterTabs.displayName = 'StatusFilterTabs';

/**
 * @param {{
 *   row: object,
 *   isOpen: boolean,
 *   onToggle: (rowId: string) => void,
 *   onClose: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const CommentActionMenu = memo(
  ({ row, isOpen, onToggle, onClose, onSeeDetails, onSelectStatus }) => {
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
          <ul
            ref={menuRef}
            role="menu"
            aria-label={t('adminComment.actions.menuAria', { name: t(row.nameKey) })}
            style={{
              position: 'fixed',
              zIndex: 60,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-lg bg-white shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
          >
            {ACTION_MENU_OPTIONS.map((option) => {
              const isDetails = option.kind === 'details';
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (isDetails) onSeeDetails(row.id);
                      else onSelectStatus(row.id, option.id);
                    }}
                    className="flex w-full cursor-pointer items-center bg-white px-2.5 py-1.25 text-left text-[16px] leading-6 text-[#222] transition hover:bg-[#f6fbff] focus-visible:bg-[#f6fbff]"
                  >
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
          aria-haspopup="menu"
          aria-label={t('adminComment.actions.menu', { name: t(row.nameKey) })}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-7 cursor-pointer items-center justify-center rounded-[7px] border border-[#e5e7eb] bg-white transition ${
            isOpen ? 'bg-[#f3f4f6]' : 'hover:bg-[#f9fafb]'
          }`}
        >
          <img
            src={ADMIN_COMMENT_ASSETS.more}
            alt=""
            width={MORE_ICON_SIZE}
            height={MORE_ICON_SIZE}
            className="size-5"
          />
        </button>
        {menu}
      </div>
    );
  },
);

CommentActionMenu.displayName = 'CommentActionMenu';

/**
 * @param {{
 *   row: object | null,
 *   onClose: () => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const CommentDetailsDrawer = memo(({ row, onClose, onSelectStatus }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!row) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [row, onClose]);

  if (!row) return null;

  return createPortal(
    <div className="fixed inset-0 z-70" role="dialog" aria-modal="true" aria-labelledby="comment-details-title">
      <button
        type="button"
        aria-label={t('adminComment.drawer.close')}
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-full flex-col bg-white shadow-[-8px_0_30px_rgba(15,23,42,0.12)] sm:w-120 sm:max-w-120">
        <div className="flex items-start justify-between border-b border-[#f3f4f6] px-6 py-5">
          <div>
            <h2
              id="comment-details-title"
              className="text-[16px] font-semibold leading-6 text-[#111827]"
            >
              {t('adminComment.drawer.title')}
            </h2>
            <p className="text-[12px] leading-4.5 text-[#6b7280]">{row.code}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={row.status} />
            <button
              type="button"
              aria-label={t('adminComment.drawer.close')}
              onClick={onClose}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[16px] text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="relative h-45 overflow-hidden rounded-xl">
            <img
              src={row.photo}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-10">
              <p className="text-[16px] font-semibold leading-5.75 text-white">
                {t(row.photoTitleKey)}
              </p>
              <p className="text-[12px] leading-4.5 text-white/85">{t(row.categoryKey)}</p>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminComment.drawer.commentLabel')}
            </p>
            <div className="mt-2 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4.75 py-3.5">
              <p className="text-[14px] leading-6 text-[#374151]">{t(row.commentKey)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#f3f4f6] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminComment.drawer.photographerProfile')}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <img
                src={row.avatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold leading-5.75 text-[#111827]">
                  {t(row.nameKey)}
                </p>
                <p className="truncate text-[12px] leading-4.5 text-[#6b7280]">{row.email}</p>
                <p className="text-[12px] leading-4.5 text-[#6b7280]">
                  📍 {t(row.countryKey)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#f3f4f6] pt-3.5">
              <div className="text-center">
                <p className="text-[16px] font-bold leading-6 text-[#111827]">{row.followers}</p>
                <p className="text-[11px] leading-4.25 text-[#9ca3af]">
                  {t('adminComment.drawer.followers')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold leading-6 text-[#111827]">{row.uploads}</p>
                <p className="text-[11px] leading-4.25 text-[#9ca3af]">
                  {t('adminComment.drawer.uploads')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold leading-6 text-[#111827]">{row.visits}</p>
                <p className="text-[11px] leading-4.25 text-[#9ca3af]">
                  {t('adminComment.drawer.visits')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#9ca3af]">
              {t('adminComment.drawer.adminActions')}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectStatus(row.id, COMMENT_STATUS.APPROVED)}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#bbf7d0] bg-[#dcfce7] px-3 text-[14px] font-semibold text-[#166534] hover:bg-[#bbf7d0]"
              >
                {t('adminComment.drawer.approve')}
              </button>
              <button
                type="button"
                onClick={() => onSelectStatus(row.id, COMMENT_STATUS.HIDDEN)}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] px-3 text-[14px] font-semibold text-[#4b5563] hover:bg-[#e5e7eb]"
              >
                {t('adminComment.drawer.hide')}
              </button>
            </div>
            <button
              type="button"
              onClick={() => onSelectStatus(row.id, COMMENT_STATUS.DELETED)}
              className="mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-3 text-[14px] font-semibold text-[#991b1b] hover:bg-[#fee2e2]"
            >
              {t('adminComment.drawer.delete')}
            </button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
});

CommentDetailsDrawer.displayName = 'CommentDetailsDrawer';

/**
 * @param {{
 *   row: object,
 *   selected: boolean,
 *   openActionId: string | null,
 *   onToggleSelected: (rowId: string) => void,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const CommentTableRow = memo(
  ({
    row,
    selected,
    openActionId,
    onToggleSelected,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();

    return (
      <tr className="border-b border-[#f9fafb]">
        <td className="px-5 py-4.5">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelected(row.id)}
            aria-label={t('adminComment.selectRow', { code: row.code })}
            className="size-3.75 cursor-pointer rounded-xs border border-[#767676]"
          />
        </td>
        <td className="px-2 py-4.5">
          <div className="flex items-center gap-1.5">
            {row.pinned ? (
              <span className="text-[11px] leading-[16.5px]" aria-hidden="true">
                📌
              </span>
            ) : null}
            <span className="text-[12px] font-medium leading-4.5 whitespace-nowrap text-[#6b7280]">
              {row.code}
            </span>
          </div>
        </td>
        <td className="px-2 py-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={row.avatar}
              alt=""
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              className="size-7.5 shrink-0 rounded-full border-2 border-[#f3f4f6] object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-[19.5px] text-[#111827]">
                {t(row.nameKey)}
              </p>
              <p className="truncate text-[11px] leading-[16.5px] text-[#9ca3af]">
                {t(row.countryKey)}
              </p>
            </div>
          </div>
        </td>
        <td className="px-2 py-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={row.photo}
              alt=""
              width={PHOTO_THUMB_SIZE}
              height={PHOTO_THUMB_SIZE}
              className="size-9 shrink-0 rounded-[7px] object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold leading-4.5 text-[#111827]">
                {t(row.photoTitleKey)}
              </p>
              <p className="truncate text-[11px] leading-[16.5px] text-[#9ca3af]">
                {t(row.categoryKey)}
              </p>
            </div>
          </div>
        </td>
        <td className="px-2 py-5.5">
          <TypeBadge type={row.type} />
        </td>
        <td className="max-w-60 px-2 py-5.5">
          <p className="truncate text-[13px] leading-[19.5px] text-[#374151]">{t(row.commentKey)}</p>
        </td>
        <td className="px-2 py-5.5 text-[12px] leading-4.5 whitespace-nowrap text-[#9ca3af]">
          {row.date}
        </td>
        <td className="px-2 py-5.5">
          <StatusBadge status={row.status} />
        </td>
        <td className="px-5 py-4.5">
          <CommentActionMenu
            row={row}
            isOpen={openActionId === row.id}
            onToggle={onToggleAction}
            onClose={onCloseAction}
            onSeeDetails={onSeeDetails}
            onSelectStatus={onSelectStatus}
          />
        </td>
      </tr>
    );
  },
);

CommentTableRow.displayName = 'CommentTableRow';

/**
 * @param {{
 *   rows: object[],
 *   selectedIds: Set<string>,
 *   allVisibleSelected: boolean,
 *   openActionId: string | null,
 *   onToggleSelectAll: () => void,
 *   onToggleSelected: (rowId: string) => void,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const CommentsTable = memo(
  ({
    rows,
    selectedIds,
    allVisibleSelected,
    openActionId,
    onToggleSelectAll,
    onToggleSelected,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-300 border-collapse text-left">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              <th className="px-5 py-3.75">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={onToggleSelectAll}
                  aria-label={t('adminComment.selectAll')}
                  className="size-3.75 cursor-pointer rounded-xs border border-[#767676]"
                />
              </th>
              {[
                'commentId',
                'user',
                'photo',
                'type',
                'comment',
                'date',
                'status',
                'actions',
              ].map((column) => (
                <th
                  key={column}
                  className="px-2 py-3.75 text-[11px] font-bold leading-[16.5px] tracking-[0.55px] uppercase text-[#9ca3af]"
                >
                  {t(`adminComment.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <CommentTableRow
                key={row.id}
                row={row}
                selected={selectedIds.has(row.id)}
                openActionId={openActionId}
                onToggleSelected={onToggleSelected}
                onToggleAction={onToggleAction}
                onCloseAction={onCloseAction}
                onSeeDetails={onSeeDetails}
                onSelectStatus={onSelectStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

CommentsTable.displayName = 'CommentsTable';

/**
 * @param {{
 *   rows: object[],
 *   selectedIds: Set<string>,
 *   openActionId: string | null,
 *   onToggleSelected: (rowId: string) => void,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const CommentsMobileCards = memo(
  ({
    rows,
    selectedIds,
    openActionId,
    onToggleSelected,
    onToggleAction,
    onCloseAction,
    onSeeDetails,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-col" data-testid="comments-mobile-cards">
        {rows.map((row) => (
          <article
            key={row.id}
            className="flex flex-col gap-3 border-b border-[#f9fafb] px-4 py-4 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(row.id)}
                  onChange={() => onToggleSelected(row.id)}
                  aria-label={t('adminComment.selectRow', { code: row.code })}
                  className="mt-1 size-3.75 cursor-pointer rounded-xs border border-[#767676]"
                />
                <img
                  src={row.avatar}
                  alt=""
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  className="size-7.5 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#111827]">
                    {t(row.nameKey)}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-[#9ca3af]">
                    {row.pinned ? <span aria-hidden="true">📌</span> : null}
                    <span>{row.code}</span>
                  </p>
                </div>
              </div>
              <CommentActionMenu
                row={row}
                isOpen={openActionId === row.id}
                onToggle={onToggleAction}
                onClose={onCloseAction}
                onSeeDetails={onSeeDetails}
                onSelectStatus={onSelectStatus}
              />
            </div>
            <div className="flex items-center gap-2">
              <img
                src={row.photo}
                alt=""
                width={PHOTO_THUMB_SIZE}
                height={PHOTO_THUMB_SIZE}
                className="size-9 rounded-[7px] object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-[#111827]">
                  {t(row.photoTitleKey)}
                </p>
                <p className="text-[11px] text-[#9ca3af]">{t(row.categoryKey)}</p>
              </div>
            </div>
            <p className="line-clamp-2 text-[13px] leading-[19.5px] text-[#374151]">
              {t(row.commentKey)}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={row.type} />
              <StatusBadge status={row.status} />
              <span className="text-[12px] text-[#9ca3af]">{row.date}</span>
            </div>
          </article>
        ))}
      </div>
    );
  },
);

CommentsMobileCards.displayName = 'CommentsMobileCards';

const CommentStatCards = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {COMMENT_STAT_CARDS.map((card) => (
        <article
          key={card.id}
          className="rounded-[14px] border border-[#f3f4f6] bg-white px-5.75 py-5.25 shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
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
          <p className="pt-3.5 text-[32px] font-extrabold leading-8 text-[#111827]">{card.value}</p>
          <p className={`pt-2 text-[11px] font-semibold leading-[16.5px] ${card.hintClass}`}>
            {t(card.hintKey)}
          </p>
        </article>
      ))}
    </div>
  );
});

CommentStatCards.displayName = 'CommentStatCards';

/**
 * Admin Comment Management — Figma 390:2248 / 2071:1495 / 390:3272.
 */
const AdminCommentContent = memo(() => {
  const { t } = useTranslation();
  const isLgUp = useIsLgUp();
  const {
    statusFilter,
    openActionId,
    selectedIds,
    detailsRow,
    visibleRows,
    page,
    pageNumbers,
    resultsCount,
    resultsTotal,
    isFirstPage,
    isLastPage,
    allVisibleSelected,
    handleStatusFilterChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handleToggleRowSelected,
    handleToggleSelectAllVisible,
    handlePreviousPage,
    handleNextPage,
    handleSelectPage,
  } = useAdminComment();

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:py-4">
      <AdminPageHeader
        title={t('adminComment.title')}
        description={t('adminComment.subtitle')}
      />

      <CommentStatCards />

      <section
        aria-label={t('adminComment.tableAria')}
        className="overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-col gap-4 border-b border-[#f3f4f6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] font-bold leading-5.25 text-[#111827]">
            {t('adminComment.tableTitle')}{' '}
            <span className="text-[13px] font-medium leading-[19.5px] text-[#9ca3af]">
              ({resultsTotal})
            </span>
          </p>
          <StatusFilterTabs statusFilter={statusFilter} onSelect={handleStatusFilterChange} />
        </div>

        {visibleRows.length > 0 ? (
          isLgUp ? (
            <CommentsTable
              rows={visibleRows}
              selectedIds={selectedIds}
              allVisibleSelected={allVisibleSelected}
              openActionId={openActionId}
              onToggleSelectAll={handleToggleSelectAllVisible}
              onToggleSelected={handleToggleRowSelected}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSeeDetails={handleOpenDetails}
              onSelectStatus={handleRowStatusChange}
            />
          ) : (
            <CommentsMobileCards
              rows={visibleRows}
              selectedIds={selectedIds}
              openActionId={openActionId}
              onToggleSelected={handleToggleRowSelected}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSeeDetails={handleOpenDetails}
              onSelectStatus={handleRowStatusChange}
            />
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#6b7280]">
            {t('adminComment.empty')}
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
          showingText={t('adminComment.pagination.showing', {
            count: resultsCount,
            total: resultsTotal,
          })}
          navAriaLabel={t('adminComment.pagination.aria')}
          previousAriaLabel={t('adminComment.pagination.previous')}
          nextAriaLabel={t('adminComment.pagination.next')}
          pageAriaLabel={(pageNumber) => t('adminComment.pagination.page', { page: pageNumber })}
        />
      </section>

      <CommentDetailsDrawer
        row={detailsRow}
        onClose={handleCloseDetails}
        onSelectStatus={handleRowStatusChange}
      />
    </div>
  );
});

AdminCommentContent.displayName = 'AdminCommentContent';

export default AdminCommentContent;
