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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/data-display/Table';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ACTION_STATUS_OPTIONS,
  ADMIN_PAYOUTS_ASSETS,
  MORE_ICON_SIZE,
  PAYOUT_TABS,
  STATUS_LABEL_KEYS,
  STATUS_STYLES,
} from '@/portals/admin/data/adminPayoutsData';
import useAdminPayouts from '@/portals/admin/hooks/useAdminPayouts';

const ACTION_MENU_OFFSET_PX = 6;
const ACTION_MENU_FALLBACK_HEIGHT_PX = 80;
const ACTION_MENU_VIEWPORT_MARGIN_PX = 8;

const StatusText = memo(({ status }) => {
  const { t } = useTranslation();
  const normalized = String(status || '').toLowerCase();
  const style = STATUS_STYLES[normalized] || STATUS_STYLES.approved;
  const label = STATUS_LABEL_KEYS[normalized]
    ? t(STATUS_LABEL_KEYS[normalized])
    : normalized.toUpperCase();

  return (
    <span className={`text-[14px] font-semibold leading-5 ${style.text}`}>
      {label}
    </span>
  );
});
StatusText.displayName = 'StatusText';

const PayoutTabs = memo(({ activeTab, onChange }) => {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('adminPayouts.tabs.aria')}>
      <div
        role="tablist"
        className="inline-flex max-w-full overflow-x-auto rounded-[12px] border border-[#e5e7eb] bg-[#f3f4f6] p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PAYOUT_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Button
              unstyled
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.id)}
              className={`shrink-0 cursor-pointer rounded-[10px] px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap transition sm:px-5 sm:text-[15px] ${
                active
                  ? 'bg-[#4048cd] text-white shadow-sm'
                  : 'text-[#374151] hover:text-[#111827]'
              }`}
            >
              {t(tab.labelKey)}
            </Button>
          );
        })}
      </div>
    </nav>
  );
});
PayoutTabs.displayName = 'PayoutTabs';

const PayoutActionMenu = memo(
  ({ row, isOpen, isUpdating, onToggle, onClose, onSelectStatus }) => {
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
        const inButton =
          buttonWrapRef.current?.contains(event.target) ||
          event.target.closest?.('[data-payout-button="true"]');
        const inMenu =
          menuRef.current?.contains(event.target) ||
          event.target.closest?.('[data-payout-menu="true"]');
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
            data-payout-menu="true"
            aria-label={t('adminPayouts.actions.menuAria')}
            style={{
              position: 'fixed',
              zIndex: 9999,
              visibility: placement ? 'visible' : 'hidden',
              ...placement,
            }}
            className="min-w-36 overflow-hidden rounded-[10px] border border-[#e8ebf1] bg-white py-1 shadow-[0_10px_30px_rgba(27,39,69,0.12)]"
          >
            {ACTION_STATUS_OPTIONS.map((option) => {
              const rowStatus = String(row.status || '').toLowerCase();
              const optId = option.id.toLowerCase();
              const selected = optId === rowStatus;
              const isPaid = rowStatus === 'paid';
              const isOptionBlocked = isPaid && optId !== 'paid';
              const optStyle = STATUS_STYLES[optId] || STATUS_STYLES.approved;
              return (
                <li key={option.id}>
                  <Button
                    unstyled
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStatus(row.id, option.id);
                    }}
                    className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-[14px] font-medium leading-5 transition ${
                      isOptionBlocked
                        ? 'cursor-not-allowed opacity-40 hover:bg-[#fff1f2]'
                        : selected
                          ? 'cursor-pointer bg-[#f6fbff] text-[#4048cd]'
                          : 'cursor-pointer text-[#373737] hover:bg-[#f6fbff]'
                    }`}
                  >
                    <span
                      className={`size-1.5 shrink-0 rounded-full ${optStyle.dot}`}
                      aria-hidden="true"
                    />
                    {t(option.labelKey, { defaultValue: option.labelFallback || option.id })}
                  </Button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

    return (
      <div className="relative inline-flex" ref={buttonWrapRef} data-payout-button="true">
        <Button
          unstyled
          ref={buttonRef}
          type="button"
          disabled={isUpdating}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={t('adminPayouts.actions.menu')}
          onClick={() => onToggle(row.id)}
          className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition ${
            isOpen ? 'bg-[#f0f2f5]' : 'hover:bg-[#f6f7f9]'
          } ${isUpdating ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {isUpdating ? (
            <div className="size-4 animate-spin rounded-full border-2 border-[#4048cd] border-t-transparent" />
          ) : (
            <Image
              src={ADMIN_PAYOUTS_ASSETS.more}
              alt=""
              width={MORE_ICON_SIZE}
              height={MORE_ICON_SIZE}
              className="size-5"
            />
          )}
        </Button>
        {menu}
      </div>
    );
  },
);
PayoutActionMenu.displayName = 'PayoutActionMenu';

const PayoutTableRow = memo(
  ({
    row,
    isEven,
    openActionId,
    updatingRowId,
    onToggleAction,
    onCloseAction,
    onSelectStatus,
  }) => {
    const { t } = useTranslation();

    return (
      <TableRow
        className={
          isEven
            ? 'border-b-0 bg-[#fff5f5] hover:bg-[#fff5f5]'
            : 'border-b-0 bg-white hover:bg-white'
        }
      >
        <TableCell className="px-4 py-4 text-[14px] leading-5 text-[#263147] sm:px-5">
          {row.dateFormatted || (row.dateKey ? t(row.dateKey) : row.date)}
        </TableCell>
        <TableCell className="px-4 py-4 text-[14px] leading-5 text-[#59657a] sm:px-5">
          {row.type || (row.typeKey ? t(row.typeKey) : 'Withdrawal')}
        </TableCell>
        <TableCell className="px-4 py-4 text-[14px] leading-5 text-[#59657a] sm:px-5">
          {row.accountType || (row.accountTypeKey ? t(row.accountTypeKey) : 'PayPal')}
        </TableCell>
        <TableCell className="whitespace-nowrap px-4 py-4 text-[14px] leading-5 text-[#59657a] sm:px-5">
          {row.accountNumber}
        </TableCell>
        <TableCell className="px-4 py-4 text-[14px] font-semibold leading-5 text-[#263147] sm:px-5">
          {row.amount}
        </TableCell>
        <TableCell className="px-4 py-4 sm:px-5">
          <StatusText status={row.status} />
        </TableCell>
        <TableCell className="px-4 py-4 sm:px-5">
          <PayoutActionMenu
            row={row}
            isOpen={openActionId === `desktop-${row.id}`}
            isUpdating={updatingRowId === row.id}
            onToggle={() => onToggleAction(`desktop-${row.id}`)}
            onClose={onCloseAction}
            onSelectStatus={onSelectStatus}
          />
        </TableCell>
      </TableRow>
    );
  },
);
PayoutTableRow.displayName = 'PayoutTableRow';

const PayoutTable = memo(
  ({ rows, openActionId, updatingRowId, onToggleAction, onCloseAction, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <Table
        className="min-w-175"
        wrapperClassName="w-full overflow-x-auto rounded-none bg-transparent"
      >
        <TableHeader>
          <TableRow className="border-b border-[#e8ebf1] bg-[#f7f8fa] hover:bg-[#f7f8fa]">
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.date')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.type')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.accountType')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.accountNumber')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.amount')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.status')}
            </TableHead>
            <TableHead className="px-4 py-3.5 text-[13px] font-bold leading-4 text-[#263147] sm:px-5">
              {t('adminPayouts.columns.action')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <PayoutTableRow
              key={row.id}
              row={row}
              isEven={index % 2 === 0}
              openActionId={openActionId}
              updatingRowId={updatingRowId}
              onToggleAction={onToggleAction}
              onCloseAction={onCloseAction}
              onSelectStatus={onSelectStatus}
            />
          ))}
        </TableBody>
      </Table>
    );
  },
);
PayoutTable.displayName = 'PayoutTable';

const PayoutMobileCards = memo(
  ({ rows, openActionId, updatingRowId, onToggleAction, onCloseAction, onSelectStatus }) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-col md:hidden">
        {rows.map((row) => (
          <article
            key={row.id}
            className="flex flex-col gap-2 border-b border-[#f0f2f5] px-4 py-4 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#263147]">
                {row.dateFormatted || (row.dateKey ? t(row.dateKey) : row.date)}
              </span>
              <PayoutActionMenu
                row={row}
                isOpen={openActionId === `mobile-${row.id}`}
                isUpdating={updatingRowId === row.id}
                onToggle={() => onToggleAction(`mobile-${row.id}`)}
                onClose={onCloseAction}
                onSelectStatus={onSelectStatus}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div>
                <p className="text-[#8b95a5]">
                  {t('adminPayouts.columns.type')}
                </p>
                <p className="text-[#59657a]">
                  {row.type || (row.typeKey ? t(row.typeKey) : 'Withdrawal')}
                </p>
              </div>
              <div>
                <p className="text-[#8b95a5]">
                  {t('adminPayouts.columns.accountType')}
                </p>
                <p className="text-[#59657a]">
                  {row.accountType || (row.accountTypeKey ? t(row.accountTypeKey) : 'PayPal')}
                </p>
              </div>
              <div>
                <p className="text-[#8b95a5]">
                  {t('adminPayouts.columns.accountNumber')}
                </p>
                <p className="text-[#59657a]">{row.accountNumber}</p>
              </div>
              <div>
                <p className="text-[#8b95a5]">
                  {t('adminPayouts.columns.amount')}
                </p>
                <p className="font-semibold text-[#263147]">{row.amount}</p>
              </div>
            </div>
            <StatusText status={row.status} />
          </article>
        ))}
      </div>
    );
  },
);
PayoutMobileCards.displayName = 'PayoutMobileCards';

const SectionFooter = memo(
  ({
    from = 1,
    to = 0,
    total = 0,
    isFirstPage = true,
    isLastPage = true,
    onPrevious,
    onNext,
  }) => {
    const { t } = useTranslation();

    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f2f5] px-4 py-4 sm:px-5">
        <p className="text-[13px] font-medium text-[#c9922a]">
          {t('adminPayouts.pagination.showing', {
            from: total === 0 ? 0 : from,
            to,
            total,
          })}
        </p>
        <div className="flex items-center gap-2">
          <Button
            unstyled
            type="button"
            disabled={isFirstPage}
            onClick={onPrevious}
            className={`rounded-md border border-[#e0b35a] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#c9922a] transition hover:bg-[#fff8eb] ${
              isFirstPage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            {t('adminPayouts.pagination.previous')}
          </Button>
          <Button
            unstyled
            type="button"
            disabled={isLastPage}
            onClick={onNext}
            className={`rounded-md border border-[#e0b35a] bg-[#e0b35a] px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#d4a64a] ${
              isLastPage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            {t('adminPayouts.pagination.next')}
          </Button>
        </div>
      </div>
    );
  },
);
SectionFooter.displayName = 'SectionFooter';

const AdminPayoutsContent = memo(() => {
  const { t } = useTranslation();
  const {
    activeTab,
    activeSection,
    openActionId,
    isLoading,
    updatingRowId,
    resultsFrom,
    resultsTo,
    totalRecords,
    isFirstPage,
    isLastPage,
    handleTabChange,
    handleToggleAction,
    handleCloseAction,
    handleRowStatusChange,
    handlePreviousPage,
    handleNextPage,
  } = useAdminPayouts();

  if (!activeSection) return null;

  return (
    <div className="flex w-full flex-col gap-5 py-2 sm:gap-6 sm:py-4">
      <AdminPageHeader
        eyebrow={t('adminPayouts.eyebrow')}
        title={t(activeSection.titleKey)}
        description={t(activeSection.subtitleKey)}
      />

      <PayoutTabs activeTab={activeTab} onChange={handleTabChange} />

      <div className="overflow-hidden rounded-2xl border border-[#e8ebf1] bg-white shadow-[0px_4px_15px_0px_rgba(27,39,69,0.02)]">
        {isLoading && activeSection.rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-[#6b7280]">
            <div className="size-8 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
            <span className="text-sm font-medium">Loading payout requests...</span>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <PayoutTable
                rows={activeSection.rows}
                openActionId={openActionId}
                updatingRowId={updatingRowId}
                onToggleAction={handleToggleAction}
                onCloseAction={handleCloseAction}
                onSelectStatus={handleRowStatusChange}
              />
            </div>
            <PayoutMobileCards
              rows={activeSection.rows}
              openActionId={openActionId}
              updatingRowId={updatingRowId}
              onToggleAction={handleToggleAction}
              onCloseAction={handleCloseAction}
              onSelectStatus={handleRowStatusChange}
            />
          </>
        )}
        <SectionFooter
          from={resultsFrom}
          to={resultsTo}
          total={totalRecords}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
});

AdminPayoutsContent.displayName = 'AdminPayoutsContent';

export default AdminPayoutsContent;

