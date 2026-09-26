import {
  ArrowUpDown,
  Banknote,
  MoreVertical,
  Percent,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import React, { memo, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import PortalDropdown from '@/components/common/PortalDropdown/PortalDropdown';
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
  countStoreOrdersByStatus,
  filterStoreOrders,
  STORE_ORDER_ACTION_STATUSES,
  STORE_ORDER_DATE_FILTERS,
  STORE_ORDER_STATUS_FILTERS,
  STORE_ORDER_STATUS_LABEL_KEYS,
  STORE_ORDER_STATUS_STYLES,
  STORE_ORDERS,
  STORE_ORDERS_PAGE_SIZE,
  STORE_ORDERS_STAT_CARDS,
  STORE_ORDERS_SUMMARY,
} from '@/portals/member/data/storeOrdersData';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const STAT_ICONS = {
  ShoppingBag,
  Banknote,
  Percent,
  Wallet,
};

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const style = STORE_ORDER_STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold ${style.badge}`}
    >
      <span
        className={`size-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {t(STORE_ORDER_STATUS_LABEL_KEYS[status])}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';

const StatCards = memo(() => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('storeOrders.stats.aria')}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {STORE_ORDERS_STAT_CARDS.map((card) => {
        let iconBg = card.iconBg;
        let iconColor = 'text-current';
        
        // Extract icon color from iconBg string if it's there (e.g. 'bg-[#eef2ff] text-[#4048cd]')
        if (iconBg && iconBg.includes('text-')) {
          const parts = iconBg.split(' ');
          iconBg = parts.find(p => p.startsWith('bg-')) || iconBg;
          iconColor = parts.find(p => p.startsWith('text-')) || iconColor;
        }

        return (
          <DashboardStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={STORE_ORDERS_SUMMARY[card.id]}
            icon={card.icon}
            iconBg={iconBg}
            iconColor={iconColor}
          />
        );
      })}
    </div>
  );
});
StatCards.displayName = 'StatCards';

const FilterChip = memo(({ active, children, onClick }) => (
  <Button
    unstyled
    type="button"
    onClick={onClick}
    className={`inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition ${
      active
        ? 'bg-[#4048cd] text-white'
        : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
    }`}
  >
    {children}
  </Button>
));
FilterChip.displayName = 'FilterChip';

const RowActions = memo(({ order, onStatusChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonWrapRef = useRef(null);
  const buttonRef = useRef(null);

  const detailHref = ROUTES.USER_ORDERS_DETAIL.replace(':id', order.id);
  const menuLabel = t('storeOrders.actions.menu', {
    number: order.orderNumber,
  });

  return (
    <div className="relative flex justify-end" ref={buttonWrapRef}>
      <Button
        unstyled
        ref={buttonRef}
        type="button"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827] ${
          open ? 'bg-[#f3f4f6] text-[#111827]' : ''
        }`}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </Button>
      <PortalDropdown
        open={open}
        onClose={() => setOpen(false)}
        buttonRef={buttonRef}
        buttonWrapRef={buttonWrapRef}
        width={168}
        aria-label={menuLabel}
        className="overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
      >
        <Button
          unstyled
          type="button"
          role="menuitem"
          onClick={() => {
            setOpen(false);
            navigate(detailHref);
          }}
          className="flex w-full cursor-pointer items-center bg-[#4048cd] px-3 py-2 text-left text-[13px] font-semibold text-white"
        >
          {t('storeOrders.actions.viewDetails')}
        </Button>
        {STORE_ORDER_ACTION_STATUSES.map((status) => (
          <Button
            unstyled
            key={status}
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onStatusChange(order.id, status);
            }}
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
          >
            {t(STORE_ORDER_STATUS_LABEL_KEYS[status])}
          </Button>
        ))}
      </PortalDropdown>
    </div>
  );
});
RowActions.displayName = 'RowActions';

const OrdersContent = memo(() => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState(STORE_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('month');

  const statusCounts = useMemo(
    () => countStoreOrdersByStatus(orders),
    [orders],
  );
  const filtered = useMemo(
    () => filterStoreOrders(orders, statusFilter),
    [orders, statusFilter],
  );
  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    filtered,
    STORE_ORDERS_PAGE_SIZE,
    [statusFilter, dateFilter],
  );

  const showingCount = pagedItems.length;

  const handleStatusChange = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
    toast.success(
      t('storeOrders.statusUpdated', {
        status: t(STORE_ORDER_STATUS_LABEL_KEYS[nextStatus]),
      }),
    );
  };

  const headCell =
    'whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#9aa3b5]';

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-7">
      <header className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
          {t('storeOrders.title')}
        </h1>
        <p className="max-w-190 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('storeOrders.subtitle')}
        </p>
      </header>

      <StatCards />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-semibold text-[#6b7280]">
            {t('storeOrders.filters.statusLabel')}
          </span>
          {STORE_ORDER_STATUS_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={statusFilter === filter.id}
              onClick={() => setStatusFilter(filter.id)}
            >
              {t(filter.labelKey, { count: statusCounts[filter.id] })}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-semibold text-[#6b7280]">
            {t('storeOrders.date.label')}
          </span>
          {STORE_ORDER_DATE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={dateFilter === filter.id}
              onClick={() => setDateFilter(filter.id)}
            >
              {t(filter.labelKey)}
            </FilterChip>
          ))}
        </div>
      </div>

      <Table
        className="min-w-275"
        wrapperClassName="border-[#e8eaef] shadow-[0px_1px_2px_rgba(15,23,42,0.03)]"
      >
        <TableHeader>
          <TableRow className="border-b border-[#eef0f4] bg-transparent hover:bg-transparent">
            <TableHead className={headCell}>
              <span className="inline-flex items-center gap-1">
                {t('storeOrders.columns.orderId')}
                <ArrowUpDown size={12} aria-hidden="true" />
              </span>
            </TableHead>
            <TableHead className={headCell}>
              {t('storeOrders.columns.customer')}
            </TableHead>
            <TableHead className={headCell}>
              {t('storeOrders.columns.product')}
            </TableHead>
            <TableHead className={headCell}>
              <span className="inline-flex items-center gap-1">
                {t('storeOrders.columns.date')}
                <ArrowUpDown size={12} aria-hidden="true" />
              </span>
            </TableHead>
            <TableHead className={headCell}>
              <span className="inline-flex items-center gap-1">
                {t('storeOrders.columns.total')}
                <ArrowUpDown size={12} aria-hidden="true" />
              </span>
            </TableHead>
            <TableHead className={headCell}>
              {t('storeOrders.columns.admin')}
            </TableHead>
            <TableHead className={headCell}>
              {t('storeOrders.columns.earnings')}
            </TableHead>
            <TableHead className={headCell}>
              {t('storeOrders.columns.status')}
            </TableHead>
            <TableHead className={`${headCell} text-right`}>
              {t('storeOrders.columns.action')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedItems.length === 0 ? (
            <TableRow className="border-b-0 hover:bg-transparent">
              <TableCell
                colSpan={9}
                className="px-4 py-12 text-center text-[14px] text-[#6b7280]"
              >
                {t('storeOrders.empty')}
              </TableCell>
            </TableRow>
          ) : (
            pagedItems.map((order) => (
              <TableRow
                key={order.id}
                className="border-[#f1f3f7] last:border-b-0"
              >
                <TableCell className="px-3 py-4">
                  <Link
                    to={ROUTES.USER_ORDERS_DETAIL.replace(':id', order.id)}
                    className="text-[13px] font-bold text-[#111827] transition hover:text-[#4048cd]"
                  >
                    #{order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${order.avatarClass}`}
                    >
                      {order.customerInitials}
                    </span>
                    <span className="text-[13px] font-semibold text-[#111827]">
                      {order.customerName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-4">
                  <div className="flex max-w-65 items-center gap-2.5">
                    <Image
                      src={order.image}
                      alt=""
                      className="size-10 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#111827]">
                        {order.productTitle}
                      </p>
                      <p className="text-[11px] text-[#9aa3b5]">
                        {t('storeOrders.qty', { count: order.quantity })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-4 text-[13px] text-[#6b7280]">
                  {order.date}
                </TableCell>
                <TableCell className="px-3 py-4 text-[13px] font-bold text-[#111827]">
                  {order.total}
                </TableCell>
                <TableCell className="px-3 py-4 text-[12px] text-[#9aa3b5]">
                  {order.commission}
                </TableCell>
                <TableCell className="px-3 py-4 text-[13px] font-bold text-[#059669]">
                  {order.earnings}
                </TableCell>
                <TableCell className="px-3 py-4">
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="px-3 py-4">
                  <RowActions
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {filtered.length > 0 ? (
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.4px] text-[#494453]">
            {t('storeOrders.showing', {
              showing: showingCount,
              total: filtered.length,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('storeOrders.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

OrdersContent.displayName = 'OrdersContent';

export default OrdersContent;
