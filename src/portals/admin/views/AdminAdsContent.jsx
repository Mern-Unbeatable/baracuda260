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
            className="overflow-hidden rounded-lg border border-[#e4e4e4] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.12)]"
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
          aria-label={t('adminAds.actions.menu', { name: row.name })}
          aria-busy={isUpdating}
          disabled={isUpdating}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#64748b] transition disabled:cursor-wait disabled:opacity-50 ${
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

AdsActionMenu.displayName = 'AdsActionMenu';

/**
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

/**
 * @param {{ rows: object[], actions: AdsRowActions }} props
 */
const AdsTable = memo(({ rows, actions }) => {
  const { t, i18n } = useTranslation();

  return (
    <Table className="w-full min-w-[980px]" wrapperClassName="overflow-x-auto">
      <TableHeader>
        <TableRow isHeader className="border-b border-[#f1f5f9] bg-[#fafbfc]">
          <TableHead className={TH_CLASS}>{t('adminAds.columns.name')}</TableHead>
          <TableHead className={`${TH_CLASS} hidden xl:table-cell`}>
            {t('adminAds.columns.email')}
          </TableHead>
          <TableHead className={`${TH_CLASS} hidden lg:table-cell`}>
            {t('adminAds.columns.phone')}
          </TableHead>
          <TableHead className={`${TH_CLASS} hidden lg:table-cell`}>
            {t('adminAds.columns.businessType')}
          </TableHead>
          <TableHead className={TH_CLASS}>{t('adminAds.columns.pageName')}</TableHead>
          <TableHead className={TH_CLASS}>{t('adminAds.columns.price')}</TableHead>
          <TableHead className={TH_CLASS}>{t('adminAds.columns.status')}</TableHead>
          <TableHead className={`${TH_CLASS} hidden sm:table-cell`}>
            {t('adminAds.columns.uploadedDate')}
          </TableHead>
          <TableHead className={`${TH_CLASS} text-right`}>
            {t('adminAds.columns.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            className={`border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] ${
              row.status === ADS_STATUS.REJECTED ? 'opacity-50' : ''
            }`}
          >
            <TableCell className={TD_CLASS}>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0f172a]">
                  {row.name || '—'}
                </p>
                <p
                  className="mt-0.5 truncate text-[11px] text-[#94a3b8] xl:hidden"
                  title={row.email || undefined}
                >
                  {row.email || '—'}
                </p>
              </div>
            </TableCell>
            <TableCell className={`${TD_CLASS} hidden text-[#475569] xl:table-cell`}>
              <span className="block truncate" title={row.email || undefined}>
                {row.email || '—'}
              </span>
            </TableCell>
            <TableCell
              className={`${TD_CLASS} hidden whitespace-nowrap text-[#475569] lg:table-cell`}
            >
              {row.phone || '—'}
            </TableCell>
            <TableCell className={`${TD_CLASS} hidden text-[#475569] lg:table-cell`}>
              {getBusinessTypeLabel(t, row.businessType)}
            </TableCell>
            <TableCell className={`${TD_CLASS} text-[#475569]`}>
              {getPageNameLabel(t, row.selectPage)}
            </TableCell>
            <TableCell className={`${TD_CLASS} whitespace-nowrap text-[#475569]`}>
              {formatAdAmount(row.amount, i18n.language, {
                durationDays: row.durationDays,
              })}
            </TableCell>
            <TableCell className={TD_CLASS}>
              <AdsStatusBadge status={row.status} />
            </TableCell>
            <TableCell
              className={`${TD_CLASS} hidden whitespace-nowrap text-[#475569] sm:table-cell`}
            >
              {formatAdDate(row.createdAt, i18n.language)}
            </TableCell>
            <TableCell className={TD_CLASS} align="right">
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
    <div className="flex flex-col gap-3 bg-[#f8fafc] p-3 sm:p-4">
      {rows.map((row) => {
        const pageLabel = getPageNameLabel(t, row.selectPage);
        const businessLabel = getBusinessTypeLabel(t, row.businessType);
        const priceLabel = formatAdAmount(row.amount, i18n.language, {
          durationDays: row.durationDays,
        });
        const dateLabel = formatAdDate(row.createdAt, i18n.language);

        return (
          <article
            key={row.id}
            className={`rounded-xl border border-[#edf0f5] bg-white p-3.5 shadow-[0px_1px_2px_rgba(15,23,42,0.04)] ${
              row.status === ADS_STATUS.REJECTED ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p
                  className="line-clamp-2 text-[15px] font-semibold leading-5 text-[#0f172a]"
                  title={row.name || undefined}
                >
                  {row.name || '—'}
                </p>
                <p
                  className="mt-0.5 truncate text-[12px] leading-4 text-[#64748b]"
                  title={row.email || undefined}
                >
                  {row.email || '—'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <AdsStatusBadge status={row.status} />
                <AdsRowActionMenu row={row} actions={actions} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex max-w-full truncate rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
                {pageLabel}
              </span>
              <span className="inline-flex max-w-full truncate rounded-md bg-[#f1f5f9] px-2 py-1 text-[11px] font-semibold text-[#475569]">
                {businessLabel}
              </span>
              <span className="inline-flex rounded-md bg-[#eef2ff] px-2 py-1 text-[11px] font-semibold text-[#4048cd]">
                {priceLabel}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-[#f1f5f9] pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#94a3b8]">
                  {t('adminAds.columns.phone')}
                </span>
                <span className="truncate text-right text-[13px] font-medium text-[#0f172a]">
                  {row.phone || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] text-[#94a3b8]">
                  {t('adminAds.columns.uploadedDate')}
                </span>
                <span className="text-right text-[13px] font-medium text-[#0f172a]">
                  {dateLabel}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
});

AdsMobileCards.displayName = 'AdsMobileCards';

const AdsTableSkeleton = () => (
  <div className="flex flex-col gap-3 px-4 py-5 sm:px-5" aria-busy="true">
    {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
      <div
        key={index}
        className="h-11 w-full animate-pulse rounded-lg bg-[#f1f5f9]"
      />
    ))}
  </div>
);

/**
 * Admin Ads Management — polished list with shared numbered pagination.
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
    page,
    totalPages,
    total,
    from,
    to,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handleOpenDetails,
    handleCloseDetails,
    handlePageChange,
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
        <p className="text-[14px] text-[#ee1c25]">{loadErrorMessage}</p>
        <Button
          unstyled
          type="button"
          onClick={() => refetch()}
          className="cursor-pointer rounded-lg border border-[#4048cd] px-4 py-2 text-[14px] font-semibold text-[#4048cd] transition hover:bg-[#f6fbff]"
        >
          {t('adminAds.retry')}
        </Button>
      </div>
    );
  } else if (rows.length === 0) {
    body = (
      <p className="px-6 py-10 text-center text-[15px] text-[#687186]">
        {t('adminAds.empty')}
      </p>
    );
  } else if (isMdUp) {
    body = <AdsTable rows={rows} actions={actions} />;
  } else {
    body = <AdsMobileCards rows={rows} actions={actions} />;
  }

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:gap-6 sm:py-4">
      <AdminPageHeader
        title={t('adminAds.title')}
        description={t('adminAds.subtitle')}
        titleClassName="text-[24px] tracking-tight sm:text-[28px] lg:text-[30px] lg:leading-9"
        descriptionClassName="text-[13px] leading-5 sm:text-[14px]"
      />

      <section
        aria-label={t('adminAds.tableAria')}
        aria-busy={isFetching}
        className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.06)]"
      >
        <div className="border-b border-[#f3f4f6] px-4 py-3.5 sm:px-5">
          <p className="text-[13px] font-bold leading-5 text-[#111827] sm:text-[14px]">
            {t('adminAds.tableTitle', 'All Ads')}{' '}
            <span className="text-[12px] font-medium text-[#9ca3af] sm:text-[13px]">
              ({total})
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

        {!isLoading && !isError ? (
          <div className="flex flex-col items-center gap-3 border-t border-[#f3f4f6] px-4 py-4 sm:flex-row sm:justify-between sm:px-5">
            <p className="text-center text-[13px] leading-5 text-[#687186] sm:text-left">
              {t('adminAds.pagination.showing', {
                from,
                to,
                total,
              })}
            </p>
            <AdminPagination
              variant="competitions"
              page={page}
              totalPages={Math.max(1, totalPages)}
              onPageChange={handlePageChange}
              navAriaLabel={t('adminAds.pagination.aria')}
              firstLabel={t('adminAds.pagination.first')}
              prevLabel={t('adminAds.pagination.prev')}
              nextLabel={t('adminAds.pagination.next')}
              lastLabel={t('adminAds.pagination.last')}
              pageLabel={(pageNumber) =>
                t('adminAds.pagination.page', { page: pageNumber })
              }
            />
          </div>
        ) : null}
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
