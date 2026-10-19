import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Package,
  RefreshCw,
  Truck,
} from 'lucide-react';
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  MY_ORDERS_STAT_CARDS,
  ORDER_STATUS,
  ORDER_STATUS_LABEL_KEYS,
  ORDER_STATUS_STYLES,
} from '@/portals/member/data/myOrdersData';
import useBuyerOrders from '@/portals/member/hooks/useBuyerOrders';
import { ROUTES } from '@/shared/config';

const STAT_ICONS = {
  Package,
  Clock,
  Truck,
  CheckCircle2,
};

const StatusBadge = memo(({ status, deliveredOn }) => {
  const { t } = useTranslation();
  const normalizedStatus = String(status || '').toLowerCase();
  const style =
    ORDER_STATUS_STYLES[normalizedStatus] ||
    ORDER_STATUS_STYLES[ORDER_STATUS.PROCESSING] || {
      badge: 'bg-[#eef7f3] text-[#268262]',
      dot: 'bg-[#268262]',
    };
  const isDelivered =
    normalizedStatus === 'delivered' || normalizedStatus === 'completed';

  const labelKey = ORDER_STATUS_LABEL_KEYS[normalizedStatus];
  const labelText = labelKey
    ? t(labelKey)
    : status
      ? String(status).toUpperCase()
      : t('myOrders.status.processing');

  return (
    <div className="flex flex-col items-end gap-1">
      <span
        className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold ${style.badge}`}
      >
        {isDelivered ? (
          <CheckCircle2 size={13} aria-hidden="true" />
        ) : (
          <span
            className={`size-1.5 rounded-full ${style.dot}`}
            aria-hidden="true"
          />
        )}
        {labelText}
      </span>
      {isDelivered && deliveredOn ? (
        <p className="text-[11px] font-medium text-[#9aa3b5]">
          {t('myOrders.deliveredOn', { date: deliveredOn })}
        </p>
      ) : null}
    </div>
  );
});
StatusBadge.displayName = 'StatusBadge';

import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';

const OrderStatCards = memo(({ stats }) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t('myOrders.stats.aria')}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {MY_ORDERS_STAT_CARDS.map((card) => {
        let iconBg = card.iconBg;
        let iconColor = 'text-current';

        if (iconBg && iconBg.includes('text-')) {
          const parts = iconBg.split(' ');
          iconBg = parts.find((p) => p.startsWith('bg-')) || iconBg;
          iconColor = parts.find((p) => p.startsWith('text-')) || iconColor;
        }

        return (
          <DashboardStatCard
            key={card.id}
            labelKey={card.labelKey}
            value={stats?.[card.id]?.value ?? stats?.[card.id] ?? 0}
            icon={card.icon}
            iconBg={iconBg}
            iconColor={iconColor}
          />
        );
      })}
    </div>
  );
});
OrderStatCards.displayName = 'OrderStatCards';

const OrderCard = memo(({ order }) => {
  const { t } = useTranslation();
  const detailHref = ROUTES.USER_MY_ORDERS_DETAIL.replace(':id', order.id);
  const displayOrderNumber = String(order.orderNumber || '').replace(/^#+/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      toast.success(t('myOrders.copySuccess', 'Order number copied!'));
    } catch {
      toast.error(t('myOrders.copyFailed', 'Failed to copy order number.'));
    }
  };

  const handleInvoice = () => {
    toast.success(t('myOrders.invoiceStarted', { order: order.orderNumber }));
  };

  return (
    <article className="overflow-hidden rounded-[14px] border border-[#eceef3] bg-white shadow-[0px_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#f1f3f7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
          <p className="text-[14px] font-bold text-[#151e31]">
            {t('myOrders.orderLabel', { number: displayOrderNumber })}
          </p>
          <Button
            unstyled
            type="button"
            onClick={handleCopy}
            aria-label={t('myOrders.copyAria', { number: order.orderNumber })}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-[#687186] transition hover:bg-[#f6f7f9] hover:text-[#4048cd]"
          >
            <Copy size={14} aria-hidden="true" />
          </Button>
          <Button
            unstyled
            type="button"
            onClick={handleInvoice}
            aria-label={t('myOrders.invoiceAria', {
              number: order.orderNumber,
            })}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-[#687186] transition hover:bg-[#f6f7f9] hover:text-[#4048cd]"
          >
            <FileText size={14} aria-hidden="true" />
          </Button>
          <p className="inline-flex items-center gap-1.5 text-[13px] text-[#687186]">
            <Calendar size={13} className="text-[#9aa3b5]" aria-hidden="true" />
            {t('myOrders.placedOn', { date: order.placedOn })}
          </p>
        </div>
        <StatusBadge status={order.status} deliveredOn={order.deliveredOn} />
      </div>

      <div className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:gap-5 xl:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <div className="relative size-18 shrink-0 overflow-hidden rounded-[10px] bg-[#f3f4f6] sm:size-21">
            <Image
              src={order.image}
              alt={order.productTitle}
              className="size-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-[#2f365f]/92 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {t('myOrders.qtyShort', { count: order.quantity })}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold leading-5 text-[#0d0d14] sm:text-[16px]">
              {order.productTitle}
            </h3>
            <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-[13px] text-[#687186]">
              <span>{t('myOrders.soldBy', { store: order.storeName })}</span>
              <BadgeCheck
                size={14}
                className="text-[#4048cd]"
                aria-hidden="true"
              />
            </p>
            <p className="mt-1 text-[12px] text-[#9aa3b5]">
              {t('myOrders.itemMeta', {
                qty: order.quantity,
                price: order.unitPrice,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-100 xl:shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#9aa3b5]">
              {t('myOrders.meta.orderTotal')}
            </p>
            <p className="mt-1 text-[16px] font-bold text-[#0d0d14]">
              {order.orderTotal}
            </p>
            <p
              className={`mt-0.5 text-[11px] font-medium ${
                order.shippingNoteTone === 'success'
                  ? 'text-[#268262]'
                  : 'text-[#9aa3b5]'
              }`}
            >
              {order.shippingNote}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#9aa3b5]">
              {t('myOrders.meta.payment')}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-[#268262]">
              <CheckCircle2 size={14} aria-hidden="true" />
              {t('myOrders.paid')}
            </p>
            <p className="mt-0.5 text-[11px] text-[#9aa3b5]">
              {order.paymentMethodShort}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#9aa3b5]">
              {t('myOrders.meta.delivery')}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#0d0d14]">
              {order.deliveryLabel}
            </p>
          </div>
        </div>

        <Link
          to={detailHref}
          className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#1a1f2e] px-4 text-[13px] font-bold text-white transition hover:bg-[#111522] xl:w-auto xl:min-w-44.5"
        >
          {t('myOrders.viewDetails')}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
});
OrderCard.displayName = 'OrderCard';

const PAGE_SIZE = 10;

const MyOrdersContent = memo(() => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  const { orders, meta, stats, isLoading, isError, error } = useBuyerOrders({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const totalRecords = meta.totalRecords;
  const totalPages = meta.totalPages;
  const showingCount = orders.length;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-7">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('myOrders.title')}
          </h1>
          {isLoading ? (
            <div className="flex items-center gap-2 text-[14px] text-[#7a7484]">
              <RefreshCw size={16} className="animate-spin text-[#4048cd]" />
              <span>{t('common.loading', 'Loading...')}</span>
            </div>
          ) : null}
        </div>
        <p className="max-w-190 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('myOrders.subtitle')}
        </p>
      </header>

      <OrderStatCards stats={stats} />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[12px] font-bold tracking-[0.14em] text-[#8b93a7]">
            {t('myOrders.recentTitle', {
              showing: showingCount,
              total: totalRecords,
              defaultValue: `RECENT ORDERS (${showingCount} OF ${totalRecords})`,
            })}
          </h2>
          <p className="text-[12px] text-[#9aa3b5]">{t('myOrders.sortedBy')}</p>
        </div>

        {isLoading && orders.length === 0 ? (
          <div className="flex min-h-60 items-center justify-center rounded-[14px] border border-[#eceef3] bg-white p-8">
            <RefreshCw size={24} className="animate-spin text-[#4048cd]" />
          </div>
        ) : isError && orders.length === 0 ? (
          <div className="rounded-[14px] border border-red-200 bg-red-50 p-6 text-[15px] text-red-600">
            {error?.message ||
              t('common.errors.general', 'Failed to load buyer orders.')}
          </div>
        ) : orders.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-[#e4e4e4] bg-white px-6 py-12 text-center text-[16px] text-[#687186]">
            {t('myOrders.empty', 'You have not placed any orders yet.')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {totalRecords > 0 ? (
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.4px] text-[#494453]">
            {t('myOrders.showing', {
              from: (currentPage - 1) * PAGE_SIZE + 1,
              to: Math.min(currentPage * PAGE_SIZE, totalRecords),
              total: totalRecords,
              defaultValue: `Showing ${
                (currentPage - 1) * PAGE_SIZE + 1
              }–${Math.min(currentPage * PAGE_SIZE, totalRecords)} of ${totalRecords} orders`,
            })}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            ariaLabel={t('myOrders.paginationAria')}
          />
        </footer>
      ) : null}
    </div>
  );
});

MyOrdersContent.displayName = 'MyOrdersContent';

export default MyOrdersContent;
