import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowUpDown,
  Banknote,
  MoreVertical,
  Percent,
  RefreshCw,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import React, { memo, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import PortalDropdown from '@/components/common/PortalDropdown/PortalDropdown';
import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';
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
  STORE_ORDER_ACTION_STATUSES,
  STORE_ORDER_DATE_FILTERS,
  STORE_ORDER_STATUS_FILTERS,
  STORE_ORDER_STATUS_LABEL_KEYS,
  STORE_ORDER_STATUS_STYLES,
  STORE_ORDERS_PAGE_SIZE,
  STORE_ORDERS_STAT_CARDS,
} from '@/portals/member/data/storeOrdersData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  formatOrderCurrency,
  getSellerOrdersApi,
  getSellerOrderStatusCardApi,
  SELLER_ORDERS_QUERY_KEY,
  SELLER_ORDER_STATUS_CARD_QUERY_KEY,
  updateSellerOrderStatusApi,
} from '@/shared/api/orders.api';
import { ROUTES } from '@/shared/config';

const STATUS_API_MAP = {
  all: 'All',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const DATE_API_MAP = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  custom: 'All',
};

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const normalizedStatus = String(status || 'processing').toLowerCase();
  const style = STORE_ORDER_STATUS_STYLES[normalizedStatus] || STORE_ORDER_STATUS_STYLES.processing;

  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-semibold ${style.badge}`}
    >
      <span
        className={`size-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {t(STORE_ORDER_STATUS_LABEL_KEYS[normalizedStatus] || 'storeOrders.status.processing')}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatCards = memo(({ stats, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('storeOrders.stats.aria')}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {STORE_ORDERS_STAT_CARDS.map((card) => {
        let iconBg = card.iconBg;
        let iconColor = 'text-current';

        if (iconBg && iconBg.includes('text-')) {
          const parts = iconBg.split(' ');
          iconBg = parts.find((p) => p.startsWith('bg-')) || iconBg;
          iconColor = parts.find((p) => p.startsWith('text-')) || iconColor;
        }

        let val = '—';
        if (isLoading) {
          val = '...';
        } else if (stats) {
          if (card.id === 'totalOrders') {
            val = stats.totalOrders ?? 0;
          } else if (card.id === 'totalSales') {
            val = formatOrderCurrency(stats.totalSales);
          } else if (card.id === 'commission') {
            val = formatOrderCurrency(stats.platformCommission ?? stats.commission);
          } else if (card.id === 'earnings') {
            val = formatOrderCurrency(stats.sellerEarnings ?? stats.earnings);
          }
        }

        return (
          <DashboardStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={val}
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
        ? 'bg-[#4048cd] text-white shadow-xs'
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const [localStatusOverrides, setLocalStatusOverrides] = useState({});

  // Status card summary query
  const {
    data: statsData,
    isLoading: isStatsLoading,
  } = useQuery({
    queryKey: SELLER_ORDER_STATUS_CARD_QUERY_KEY,
    queryFn: getSellerOrderStatusCardApi,
  });

  const statusParam = STATUS_API_MAP[statusFilter] || 'All';
  const dateParam = DATE_API_MAP[dateFilter] || 'This Month';

  // Seller orders list query
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: SELLER_ORDERS_QUERY_KEY({
      page: currentPage,
      limit: STORE_ORDERS_PAGE_SIZE,
      status: statusParam,
      date: dateParam,
    }),
    queryFn: () =>
      getSellerOrdersApi({
        page: currentPage,
        limit: STORE_ORDERS_PAGE_SIZE,
        status: statusParam,
        date: dateParam,
      }),
    keepPreviousData: true,
  });

  const rawOrders = ordersResponse?.items || [];
  const counts = ordersResponse?.counts || {};
  const totalPages = ordersResponse?.meta?.totalPages || 1;
  const totalRecords = ordersResponse?.meta?.totalRecords || rawOrders.length;

  const orders = useMemo(
    () =>
      rawOrders.map((order) => {
        if (localStatusOverrides[order.id]) {
          return { ...order, status: localStatusOverrides[order.id] };
        }
        return order;
      }),
    [rawOrders, localStatusOverrides],
  );

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      updateSellerOrderStatusApi(orderId, status),
    onMutate: async ({ orderId, status }) => {
      setLocalStatusOverrides((prev) => ({ ...prev, [orderId]: status }));
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      queryClient.invalidateQueries({
        queryKey: SELLER_ORDER_STATUS_CARD_QUERY_KEY,
      });
      toast.success(
        t('storeOrders.statusUpdated', {
          status: t(STORE_ORDER_STATUS_LABEL_KEYS[status]),
        }),
      );
    },
    onError: (err, { orderId }) => {
      setLocalStatusOverrides((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
      toast.error(getApiErrorMessage(err, 'Failed to update order status'));
    },
  });

  const handleStatusChange = (orderId, nextStatus) => {
    updateStatusMutation.mutate({ orderId, status: nextStatus });
  };

  const headCell =
    'whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#9aa3b5]';

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-7">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('storeOrders.title')}
          </h1>
          {isFetching && !isOrdersLoading ? (
            <RefreshCw
              size={18}
              className="animate-spin text-[#9ca3af]"
              aria-label="Updating"
            />
          ) : null}
        </div>
        <p className="max-w-190 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('storeOrders.subtitle')}
        </p>
      </header>

      {/* Status summary stats */}
      <StatCards stats={statsData} isLoading={isStatsLoading} />

      {/* Filter bars */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-semibold text-[#6b7280]">
            {t('storeOrders.filters.statusLabel')}
          </span>
          {STORE_ORDER_STATUS_FILTERS.map((filter) => {
            const countKey =
              filter.id === 'all'
                ? 'All'
                : filter.id.charAt(0).toUpperCase() + filter.id.slice(1);
            const count = counts[countKey] ?? counts[filter.id] ?? 0;

            return (
              <FilterChip
                key={filter.id}
                active={statusFilter === filter.id}
                onClick={() => {
                  setStatusFilter(filter.id);
                  setCurrentPage(1);
                }}
              >
                {t(filter.labelKey, { count })}
              </FilterChip>
            );
          })}
        </div>

        {/* Date filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-semibold text-[#6b7280]">
            {t('storeOrders.date.label')}
          </span>
          {STORE_ORDER_DATE_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              active={dateFilter === filter.id}
              onClick={() => {
                setDateFilter(filter.id);
                setCurrentPage(1);
              }}
            >
              {t(filter.labelKey)}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isError ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-8 text-center">
          <AlertCircle className="size-8 text-red-500" />
          <p className="text-[14px] text-gray-700">
            {getApiErrorMessage(error, 'Failed to fetch seller orders.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#d41921]"
          >
            <RefreshCw size={13} />
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : (
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
            {isOrdersLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="animate-pulse border-[#f1f3f7]">
                  <TableCell className="px-3 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-gray-200" />
                      <div className="h-4 w-24 rounded bg-gray-200" />
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-10 rounded-lg bg-gray-200" />
                      <div className="h-4 w-32 rounded bg-gray-200" />
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="h-4 w-12 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </TableCell>
                  <TableCell className="px-3 py-4 text-right">
                    <div className="ml-auto size-7 rounded bg-gray-200" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell
                  colSpan={9}
                  className="px-4 py-12 text-center text-[14px] text-[#6b7280]"
                >
                  {t('storeOrders.empty')}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-[#f1f3f7] last:border-b-0 hover:bg-[#fafafa]/80"
                >
                  <TableCell className="px-3 py-4">
                    <Link
                      to={ROUTES.USER_ORDERS_DETAIL.replace(':id', order.id)}
                      className="text-[13px] font-bold text-[#111827] transition hover:text-[#4048cd]"
                    >
                      {order.orderIdDisplay || `#${order.orderNumber}`}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="flex items-center gap-2.5">
                      {order.customerAvatar ? (
                        <img
                          src={order.customerAvatar}
                          alt=""
                          className="size-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${order.avatarClass}`}
                        >
                          {order.customerInitials}
                        </span>
                      )}
                      <span className="text-[13px] font-semibold text-[#111827]">
                        {order.customerName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="flex max-w-65 items-center gap-2.5">
                      {order.image ? (
                        <Image
                          src={order.image}
                          alt=""
                          className="size-10 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <ShoppingBag size={18} />
                        </div>
                      )}
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
      )}

      {/* Pagination footer */}
      {!isOrdersLoading && totalRecords > 0 ? (
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.4px] text-[#494453]">
            {t('storeOrders.showing', {
              showing: orders.length,
              total: totalRecords,
            })}
          </p>
          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              ariaLabel={t('storeOrders.paginationAria')}
            />
          ) : null}
        </footer>
      ) : null}
    </div>
  );
});

OrdersContent.displayName = 'OrdersContent';

export default OrdersContent;
