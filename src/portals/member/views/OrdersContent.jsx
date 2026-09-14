import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowUpDown,
  Banknote,
  MoreVertical,
  Percent,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import {
  STORE_ORDERS,
  STORE_ORDERS_PAGE_SIZE,
  STORE_ORDERS_STAT_CARDS,
  STORE_ORDERS_SUMMARY,
  STORE_ORDER_ACTION_STATUSES,
  STORE_ORDER_DATE_FILTERS,
  STORE_ORDER_STATUS_FILTERS,
  STORE_ORDER_STATUS_LABEL_KEYS,
  STORE_ORDER_STATUS_STYLES,
  countStoreOrdersByStatus,
  filterStoreOrders,
} from '@/portals/member/data/storeOrdersData';

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
      <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {t(STORE_ORDER_STATUS_LABEL_KEYS[status])}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const StatCards = memo(() => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('storeOrders.stats.aria')}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {STORE_ORDERS_STAT_CARDS.map((card) => {
        const Icon = STAT_ICONS[card.icon] || ShoppingBag;
        return (
          <article
            key={card.id}
            className={`rounded-[14px] border px-5 py-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] ${card.cardClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#8b93a7]">
                  {t(card.labelKey)}
                </p>
                <p className={`mt-2 text-[26px] font-extrabold leading-none ${card.valueClass}`}>
                  {STORE_ORDERS_SUMMARY[card.id]}
                </p>
                <p className="mt-1.5 text-[12px] font-medium text-[#687186]">{t(card.hintKey)}</p>
              </div>
              <span
                className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] ${card.iconBg}`}
                aria-hidden="true"
              >
                <Icon size={18} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
});
StatCards.displayName = 'StatCards';

const FilterChip = memo(({ active, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-[12px] font-semibold transition ${
      active
        ? 'bg-[#4048cd] text-white'
        : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
    }`}
  >
    {children}
  </button>
));
FilterChip.displayName = 'FilterChip';

const RowActions = memo(({ order, onStatusChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  const detailHref = ROUTES.ADMIN_ORDERS_DETAIL.replace(':id', order.id);

  return (
    <div className="relative flex justify-end" ref={menuRef}>
      <button
        type="button"
        aria-label={t('storeOrders.actions.menu', { number: order.orderNumber })}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-9 z-20 w-[168px] overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(detailHref);
            }}
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] font-semibold text-white bg-[#4048cd]"
          >
            {t('storeOrders.actions.viewDetails')}
          </button>
          {STORE_ORDER_ACTION_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setOpen(false);
                onStatusChange(order.id, status);
              }}
              className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] font-medium text-[#374151] transition hover:bg-[#f3f4f6]"
            >
              {t(STORE_ORDER_STATUS_LABEL_KEYS[status])}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
});
RowActions.displayName = 'RowActions';

const OrdersContent = memo(() => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState(STORE_ORDERS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('month');

  const statusCounts = useMemo(() => countStoreOrdersByStatus(orders), [orders]);
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
      prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order)),
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
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-7">
      <header className="flex flex-col gap-2">
        <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-[38px] lg:text-[40px]">
          {t('storeOrders.title')}
        </h1>
        <p className="max-w-[760px] text-[15px] leading-6 text-[#494453] sm:text-[16px]">
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

      <section className="overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0px_1px_2px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead>
              <tr className="border-b border-[#eef0f4]">
                <th className={headCell}>
                  <span className="inline-flex items-center gap-1">
                    {t('storeOrders.columns.orderId')}
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </span>
                </th>
                <th className={headCell}>{t('storeOrders.columns.customer')}</th>
                <th className={headCell}>{t('storeOrders.columns.product')}</th>
                <th className={headCell}>
                  <span className="inline-flex items-center gap-1">
                    {t('storeOrders.columns.date')}
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </span>
                </th>
                <th className={headCell}>
                  <span className="inline-flex items-center gap-1">
                    {t('storeOrders.columns.total')}
                    <ArrowUpDown size={12} aria-hidden="true" />
                  </span>
                </th>
                <th className={headCell}>{t('storeOrders.columns.admin')}</th>
                <th className={headCell}>{t('storeOrders.columns.earnings')}</th>
                <th className={headCell}>{t('storeOrders.columns.status')}</th>
                <th className={`${headCell} text-right`}>{t('storeOrders.columns.action')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[14px] text-[#6b7280]">
                    {t('storeOrders.empty')}
                  </td>
                </tr>
              ) : (
                pagedItems.map((order) => (
                  <tr key={order.id} className="border-b border-[#f1f3f7] last:border-b-0">
                    <td className="px-3 py-4 align-middle">
                      <Link
                        to={ROUTES.ADMIN_ORDERS_DETAIL.replace(':id', order.id)}
                        className="text-[13px] font-bold text-[#111827] transition hover:text-[#4048cd]"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-4 align-middle">
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
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <div className="flex max-w-[260px] items-center gap-2.5">
                        <img
                          src={order.image}
                          alt=""
                          className="size-10 shrink-0 rounded-[8px] object-cover"
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
                    </td>
                    <td className="px-3 py-4 align-middle text-[13px] text-[#6b7280]">
                      {order.date}
                    </td>
                    <td className="px-3 py-4 align-middle text-[13px] font-bold text-[#111827]">
                      {order.total}
                    </td>
                    <td className="px-3 py-4 align-middle text-[12px] text-[#9aa3b5]">
                      {order.commission}
                    </td>
                    <td className="px-3 py-4 align-middle text-[13px] font-bold text-[#059669]">
                      {order.earnings}
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <RowActions order={order} onStatusChange={handleStatusChange} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {filtered.length > 0 ? (
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.4px] text-[#494453]">
            {t('storeOrders.showing', { showing: showingCount, total: filtered.length })}
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
