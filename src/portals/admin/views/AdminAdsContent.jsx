import { MoreVertical } from 'lucide-react';
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
import AdvertiseDetailsDrawer from '@/components/data-display/AdvertiseDetailsDrawer/AdvertiseDetailsDrawer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table/Table';
import Button from '@/components/ui/Button';
import AdsStatusBadge from '@/portals/admin/components/admin-ads/AdsStatusBadge';
import {
  ADS_STATUS,
  formatAdAmount,
  formatAdDate,
  getActionMenuOptions,
  getBusinessTypeLabel,
  getPageNameLabel,
  MORE_ICON_SIZE,
} from '@/portals/admin/data/adminAdsData';
import useAdminAds from '@/portals/admin/hooks/useAdminAds';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 120;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;
const ACTION_MENU_WIDTH_PX = 176;
const MD_MEDIA_QUERY = '(min-width: 768px)';
const SKELETON_ROW_COUNT = 5;

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

/**
 * @param {{
 *   row: object,
 *   isOpen: boolean,
 *   isUpdating: boolean,
 *   onToggle: (rowId: string) => void,
 *   onClose: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} props
 */
const AdsActionMenu = memo(
  ({
    row,
    isOpen,
    isUpdating,
    onToggle,
    onClose,
    onSeeDetails,
    onSelectStatus,
  }) => {
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

    const menu = isOpen
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={t('adminAds.actions.menuAria', {
              name: row.name,
            })}
            style={{
              position: 'fixed',
              zIndex: 50,
              width: ACTION_MENU_WIDTH_PX,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="overflow-hidden rounded-[8px] border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
          >
            <span
              className="block h-[3px] w-full bg-[#4048cd]"
              aria-hidden="true"
            />
            {getActionMenuOptions(row.status).map((option) => (
              <Button
                unstyled
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
          aria-label={t('adminAds.actions.menu', { name: row.name })}
          aria-busy={isUpdating}
          disabled={isUpdating}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] text-[#373737] transition disabled:cursor-wait disabled:opacity-50 ${
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

AdsActionMenu.displayName = 'AdsActionMenu';

/**
 * Shared row props for the desktop table and the mobile cards.
 * @typedef {{
 *   openActionId: string | null,
 *   updatingId: string | null,
 *   onToggleAction: (rowId: string) => void,
 *   onCloseAction: () => void,
 *   onSeeDetails: (rowId: string) => void,
 *   onSelectStatus: (rowId: string, status: string) => void,
 * }} AdsRowActions
 */

/**
 * @param {{ row: object, actions: AdsRowActions }} props
 */
const AdsRowActionMenu = ({ row, actions }) => (
  <AdsActionMenu
    row={row}
    isOpen={actions.openActionId === row.id}
    isUpdating={actions.updatingId === row.id}
    onToggle={actions.onToggleAction}
    onClose={actions.onCloseAction}
    onSeeDetails={actions.onSeeDetails}
    onSelectStatus={actions.onSelectStatus}
  />
);

const ADS_TABLE_COLUMNS = [
  'name',
  'email',
  'phone',
  'businessType',
  'pageName',
  'price',
  'status',
  'uploadedDate',
  'actions',
];

/**
 * @param {{ rows: object[], actions: AdsRowActions }} props
 */
const AdsTable = memo(({ rows, actions }) => {
  const { t, i18n } = useTranslation();

  return (
    <Table className="min-w-[1180px]">
      <TableHeader>
        <TableRow isHeader>
          {ADS_TABLE_COLUMNS.map((column, index) => (
            <TableHead
              key={column}
              className={`text-[16px] font-normal leading-6 text-black ${
                index === 0 ? 'rounded-tl-[12px]' : ''
              } ${index === ADS_TABLE_COLUMNS.length - 1 ? 'rounded-tr-[12px]' : ''}`}
            >
              {t(`adminAds.columns.${column}`)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            className={row.status === ADS_STATUS.REJECTED ? 'opacity-50' : ''}
          >
            <TableCell className="min-w-[160px]">{row.name}</TableCell>
            <TableCell className="min-w-[180px] break-all">
              {row.email}
            </TableCell>
            <TableCell className="min-w-[160px] whitespace-nowrap">
              {row.phone}
            </TableCell>
            <TableCell className="min-w-[160px]">
              {getBusinessTypeLabel(t, row.businessType)}
            </TableCell>
            <TableCell className="min-w-[140px]">
              {getPageNameLabel(t, row.selectPage)}
            </TableCell>
            <TableCell className="min-w-[100px] whitespace-nowrap">
              {formatAdAmount(row.amount, i18n.language)}
            </TableCell>
            <TableCell className="min-w-[110px]">
              <AdsStatusBadge status={row.status} />
            </TableCell>
            <TableCell className="min-w-[140px] whitespace-nowrap">
              {formatAdDate(row.createdAt, i18n.language)}
            </TableCell>
            <TableCell className="min-w-[100px]">
              <AdsRowActionMenu row={row} actions={actions} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

AdsTable.displayName = 'AdsTable';

/**
 * @param {{ rows: object[], actions: AdsRowActions }} props
 */
const AdsMobileCards = memo(({ rows, actions }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col">
      {rows.map((row) => {
        const details = [
          { key: 'phone', value: row.phone },
          {
            key: 'businessType',
            value: getBusinessTypeLabel(t, row.businessType),
          },
          { key: 'pageName', value: getPageNameLabel(t, row.selectPage) },
          { key: 'price', value: formatAdAmount(row.amount, i18n.language) },
          {
            key: 'status',
            value: <AdsStatusBadge status={row.status} />,
          },
          {
            key: 'uploadedDate',
            value: formatAdDate(row.createdAt, i18n.language),
          },
        ];

        return (
          <article
            key={row.id}
            className={`flex flex-col gap-3 border-b border-[#e4e4e4] px-4 py-4 last:border-b-0 ${
              row.status === ADS_STATUS.REJECTED ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold leading-6 text-[#0c0c0c]">
                  {row.name}
                </p>
                <p className="mt-1 break-all text-[14px] leading-5 text-[#687186]">
                  {row.email}
                </p>
              </div>
              <AdsRowActionMenu row={row} actions={actions} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {details.map(({ key, value }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-[13px] leading-5 text-[#7f8ba1]">
                    {t(`adminAds.columns.${key}`)}
                  </span>
                  <span className="text-right text-[14px] leading-5 text-[#0c0c0c]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
});

AdsMobileCards.displayName = 'AdsMobileCards';

const AdsTableSkeleton = () => (
  <div className="flex flex-col gap-3 px-5 py-6" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-12 w-full animate-pulse rounded-lg bg-[#f3f4f6]"
      />
    ))}
  </div>
);

/**
 * Admin Ads Management — server-paginated table with sidebar details drawer.
 */
const AdminAdsContent = memo(() => {
  const { t } = useTranslation();
  const isMdUp = useIsMdUp();
  const {
    rows,
    isLoading,
    isError,
    isFetching,
    loadErrorMessage,
    refetch,
    updatingId,
    openActionId,
    isDetailsOpen,
    detailsAd,
    isDetailsLoading,
    isDetailsError,
    detailsErrorMessage,
    refetchDetails,
    total,
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

  /** @type {AdsRowActions} */
  const actions = {
    openActionId,
    updatingId,
    onToggleAction: handleToggleAction,
    onCloseAction: handleCloseAction,
    onSeeDetails: handleOpenDetails,
    onSelectStatus: handleRowStatusChange,
  };

  let body;
  if (isLoading) {
    body = <AdsTableSkeleton />;
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
          {t('adminAds.retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-10 text-center text-[16px] text-[#687186]">
        {t('adminAds.empty')}
      </p>
    );
  } else if (isMdUp) {
    body = <AdsTable rows={rows} actions={actions} />;
  } else {
    body = <AdsMobileCards rows={rows} actions={actions} />;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <AdminPageHeader
        title={t('adminAds.title')}
        description={t('adminAds.subtitle')}
      />

      <section
        aria-label={t('adminAds.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-[12px] bg-white"
      >
        <div
          className={`transition-opacity ${
            isFetching && !isLoading ? 'opacity-60' : ''
          }`}
        >
          {body}
        </div>

        {!isLoading && !isError && (
          <AdminPagination
            variant="users"
            from={from}
            to={to}
            total={total}
            isFirstPage={isFirstPage || isFetching}
            isLastPage={isLastPage || isFetching}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            showingText={t('adminAds.pagination.showing', {
              from,
              to,
              total,
            })}
            previousLabel={t('adminAds.pagination.previous')}
            nextLabel={t('adminAds.pagination.next')}
          />
        )}
      </section>

      <AdvertiseDetailsDrawer
        open={isDetailsOpen}
        ad={detailsAd}
        isLoading={isDetailsLoading}
        isError={isDetailsError}
        errorMessage={detailsErrorMessage}
        onRetry={refetchDetails}
        onClose={handleCloseDetails}
      />
    </div>
  );
});

AdminAdsContent.displayName = 'AdminAdsContent';

export default AdminAdsContent;
