import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import {
  ACTION_MENU_OPTIONS,
  ADS_STATUS,
  MORE_ICON_SIZE,
} from '@/portals/admin/data/adminAdsData';
import useAdminAds from '@/portals/admin/hooks/useAdminAds';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import AdminPagination from '@/components/common/AdminPagination/AdminPagination';
import AdvertiseDetailsDrawer from '@/components/data-display/AdvertiseDetailsDrawer/AdvertiseDetailsDrawer';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 120;
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
const AdsActionMenu = memo(
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
          <div
            ref={menuRef}
            role="menu"
            aria-label={t('adminAds.actions.menuAria', { name: t(row.nameKey) })}
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
                  if (option.kind === 'details') onSeeDetails(row.id);
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
          aria-label={t('adminAds.actions.menu', { name: t(row.nameKey) })}
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

AdsActionMenu.displayName = 'AdsActionMenu';

/**
 * @param {{
 *   row: object,
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const AdsTableRow = memo(
  ({ row, openActionId, onToggleAction, onCloseAction, onSeeDetails, onSelectStatus }) => {
    const { t } = useTranslation();
    const hidden = row.status === ADS_STATUS.HIDDEN;

    return (
      <tr className={`border-b border-[#e4e4e4] ${hidden ? 'opacity-50' : ''}`}>
        <td className="min-w-[160px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(row.nameKey)}
        </td>
        <td className="min-w-[180px] px-[26px] py-6 text-[16px] leading-6 break-all text-[#0c0c0c]">
          {row.email}
        </td>
        <td className="min-w-[160px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
          {row.phone}
        </td>
        <td className="min-w-[160px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(row.businessTypeKey)}
        </td>
        <td className="min-w-[140px] px-[26px] py-6 text-[16px] leading-6 text-[#0c0c0c]">
          {t(row.pageNameKey)}
        </td>
        <td className="min-w-[100px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
          {row.price}
        </td>
        <td className="min-w-[140px] px-[26px] py-6 text-[16px] leading-6 whitespace-nowrap text-[#0c0c0c]">
          {row.uploadDate}
        </td>
        <td className="min-w-[100px] px-[26px] py-6">
          <AdsActionMenu
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

AdsTableRow.displayName = 'AdsTableRow';

/**
 * @param {{
 *   rows: object[],
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const ADS_TABLE_COLUMNS = [
  'name',
  'email',
  'phone',
  'businessType',
  'pageName',
  'price',
  'uploadedDate',
  'actions',
];

const AdsTable = memo(
  ({ rows, openActionId, onToggleAction, onCloseAction, onSeeDetails, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="bg-[#f6fbff]">
              {ADS_TABLE_COLUMNS.map((column, index) => (
                <th
                  key={column}
                  className={`px-[26px] py-3 text-[16px] font-normal leading-6 text-black ${
                    index === 0 ? 'rounded-tl-[12px]' : ''
                  } ${index === ADS_TABLE_COLUMNS.length - 1 ? 'rounded-tr-[12px]' : ''}`}
                >
                  {t(`adminAds.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <AdsTableRow
                key={row.id}
                row={row}
                openActionId={openActionId}
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

AdsTable.displayName = 'AdsTable';

/**
 * @param {{
 *   rows: object[],
 *   openActionId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const AdsMobileCards = memo(
  ({ rows, openActionId, onToggleAction, onCloseAction, onSeeDetails, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-col">
        {rows.map((row) => (
          <article
            key={row.id}
            className={`flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0 ${
              row.status === ADS_STATUS.HIDDEN ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">
                  {t(row.nameKey)}
                </p>
                <p className="mt-1 text-[14px] leading-5 text-[#687186]">{row.email}</p>
              </div>
              <AdsActionMenu
                row={row}
                isOpen={openActionId === row.id}
                onToggle={onToggleAction}
                onClose={onCloseAction}
                onSeeDetails={onSeeDetails}
                onSelectStatus={onSelectStatus}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] leading-5 text-[#7f8ba1]">
                  {t('adminAds.columns.phone')}
                </span>
                <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{row.phone}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] leading-5 text-[#7f8ba1]">
                  {t('adminAds.columns.businessType')}
                </span>
                <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
                  {t(row.businessTypeKey)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] leading-5 text-[#7f8ba1]">
                  {t('adminAds.columns.pageName')}
                </span>
                <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
                  {t(row.pageNameKey)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] leading-5 text-[#7f8ba1]">
                  {t('adminAds.columns.price')}
                </span>
                <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">{row.price}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] leading-5 text-[#7f8ba1]">
                  {t('adminAds.columns.uploadedDate')}
                </span>
                <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
                  {row.uploadDate}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  },
);

AdsMobileCards.displayName = 'AdsMobileCards';

/**
 * Admin Ads Management — table with sidebar details drawer.
 */
const AdminAdsContent = memo(() => {
  const { t } = useTranslation();
  const isMdUp = useIsMdUp();
  const {
    openActionId,
    detailsRow,
    visibleRows,
    resultsTotal,
    from,
    to,
    isFirstPage,
    isLastPage,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handlePreviousPage,
    handleNextPage,
  } = useAdminAds();

  return (
    <div className="flex w-full flex-col gap-5">
      <AdminPageHeader title={t('adminAds.title')} description={t('adminAds.subtitle')} />

      <section
        aria-label={t('adminAds.tableAria')}
        className="overflow-hidden rounded-[12px] bg-white"
      >
        {visibleRows.length > 0 ? (
          isMdUp ? (
            <AdsTable
              rows={visibleRows}
              openActionId={openActionId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSeeDetails={handleOpenDetails}
              onSelectStatus={handleRowStatusChange}
            />
          ) : (
            <AdsMobileCards
              rows={visibleRows}
              openActionId={openActionId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSeeDetails={handleOpenDetails}
              onSelectStatus={handleRowStatusChange}
            />
          )
        ) : (
          <p className="px-6 py-10 text-center text-[16px] text-[#687186]">{t('adminAds.empty')}</p>
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
          showingText={t('adminAds.pagination.showing', { from, to, total: resultsTotal })}
          previousLabel={t('adminAds.pagination.previous')}
          nextLabel={t('adminAds.pagination.next')}
        />
      </section>

      <AdvertiseDetailsDrawer row={detailsRow} onClose={handleCloseDetails} />
    </div>
  );
});

AdminAdsContent.displayName = 'AdminAdsContent';

export default AdminAdsContent;
