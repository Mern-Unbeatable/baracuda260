import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Check,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Save,
  UserRound,
  X,
  Zap,
} from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  getMarkActionLabelKey,
  STORE_ORDER_ACTION_STATUSES,
  STORE_ORDER_STATUS,
  STORE_ORDER_STATUS_LABEL_KEYS,
  STORE_ORDER_STATUS_STYLES,
} from '@/portals/member/data/storeOrdersData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getSellerOrderDetailsApi,
  SELLER_ORDER_DETAILS_QUERY_KEY,
  SELLER_ORDER_STATUS_CARD_QUERY_KEY,
  updateSellerOrderStatusApi,
} from '@/shared/api/orders.api';
import { ROUTES } from '@/shared/config';

const cardClass = 'rounded-[14px] border border-[#e5e7eb] bg-white p-5 sm:p-6';

const SectionLabel = memo(({ icon: Icon, children, tone = 'muted' }) => (
  <h2
    className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] ${
      tone === 'green'
        ? 'text-[#10b981]'
        : tone === 'light'
          ? 'text-white/55'
          : 'text-[#9ca3af]'
    }`}
  >
    {Icon ? <Icon size={14} strokeWidth={2.25} aria-hidden="true" /> : null}
    {children}
  </h2>
));
SectionLabel.displayName = 'SectionLabel';

const StatusBadge = memo(({ status }) => {
  const { t } = useTranslation();
  const safeStatus = status || STORE_ORDER_STATUS.PROCESSING;
  const style =
    STORE_ORDER_STATUS_STYLES[safeStatus] ||
    STORE_ORDER_STATUS_STYLES[STORE_ORDER_STATUS.PROCESSING];

  return (
    <span
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ${style.badge}`}
    >
      <span
        className={`size-1.5 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      {t(STORE_ORDER_STATUS_LABEL_KEYS[safeStatus] || safeStatus)}
    </span>
  );
});
StatusBadge.displayName = 'StatusBadge';

const ContactRow = memo(({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <Icon
      size={15}
      className="mt-0.5 shrink-0 text-[#9ca3af]"
      aria-hidden="true"
    />
    <div className="min-w-0">
      <p className="text-[10px] font-bold tracking-[0.14em] text-[#9ca3af]">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] leading-5 text-[#374151]">
        {value || '—'}
      </p>
    </div>
  </div>
));
ContactRow.displayName = 'ContactRow';

const TimelineStep = memo(
  ({ step, title, pendingTitle, pendingMeta, transitNote, isLast }) => {
    const isDone = step.state === 'done';
    const isPending = step.state === 'pending';

    return (
      <div className={`relative flex gap-3.5 ${isLast ? '' : 'pb-6'}`}>
        <div className="flex w-6 shrink-0 flex-col items-center self-stretch">
          {isDone ? (
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white">
              <Check size={13} strokeWidth={3} aria-hidden="true" />
            </span>
          ) : (
            <span
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#d1d5db] bg-white"
              aria-hidden="true"
            />
          )}
          {!isLast ? (
            <span
              className={`mt-1.5 w-px flex-1 ${isDone ? 'bg-[#34d399]' : 'bg-[#e5e7eb]'}`}
              aria-hidden="true"
            />
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {isPending ? (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#9ca3af]">
                    {pendingTitle}{' '}
                    <span className="font-medium text-[#b0b7c6]">
                      {pendingMeta}
                    </span>
                  </p>
                  {transitNote ? (
                    <span className="inline-flex rounded-full bg-[#fff7ed] px-2.5 py-1 text-[11px] font-semibold text-[#d97706]">
                      {transitNote}
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="text-[14px] font-semibold text-[#111827]">
                  {title}
                </p>
              )}
            </div>
            {!isPending && step.date ? (
              <div className="shrink-0 text-right">
                <p className="text-[12px] font-medium text-[#6b7280]">
                  {step.date}
                </p>
                <p className="mt-0.5 text-[12px] text-[#9ca3af]">{step.time}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);
TimelineStep.displayName = 'TimelineStep';

const SellerOrderDetailsContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: SELLER_ORDER_DETAILS_QUERY_KEY(id),
    queryFn: () => getSellerOrderDetailsApi(id),
    enabled: Boolean(id),
  });

  const [draftStatus, setDraftStatus] = useState(STORE_ORDER_STATUS.DELIVERED);

  // Sync draftStatus with the loaded order status
  useEffect(() => {
    if (order?.status) {
      setDraftStatus(
        order.status === STORE_ORDER_STATUS.SHIPPED
          ? STORE_ORDER_STATUS.DELIVERED
          : order.status,
      );
    }
  }, [order?.status]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }) => updateSellerOrderStatusApi(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SELLER_ORDER_DETAILS_QUERY_KEY(id),
      });
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      queryClient.invalidateQueries({
        queryKey: SELLER_ORDER_STATUS_CARD_QUERY_KEY,
      });
      toast.success(
        t('storeOrders.statusUpdated', {
          status: t(
            STORE_ORDER_STATUS_LABEL_KEYS[variables.status] || variables.status,
          ),
        }),
      );
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update order status'));
    },
  });

  const handleCopy = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber || order.id);
      toast.success(t('storeOrders.copySuccess'));
    } catch {
      toast.error(t('storeOrders.copyFailed'));
    }
  };

  const handleClose = () => {
    navigate(ROUTES.USER_ORDERS);
  };

  const handleMarkStatus = () => {
    if (!draftStatus || updateStatusMutation.isPending) return;
    updateStatusMutation.mutate({ status: draftStatus });
  };

  const timelineTitles = {
    placed: t('storeOrders.detail.timeline.placed'),
    processing: t('storeOrders.detail.timeline.processing'),
    shipped: t('storeOrders.detail.timeline.shipped'),
    delivered: t('storeOrders.detail.timeline.delivered'),
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-395 flex-col gap-6 py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin text-[#4048cd]" />
          <p className="text-[15px] font-medium text-[#6b7280]">
            Loading order details...
          </p>
        </div>
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-28 animate-pulse rounded-[14px] bg-gray-100" />
            <div className="h-28 animate-pulse rounded-[14px] bg-gray-100" />
          </div>
          <div className="h-44 animate-pulse rounded-[14px] bg-gray-100" />
          <div className="h-40 animate-pulse rounded-[14px] bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto flex w-full max-w-395 flex-col items-center justify-center rounded-[14px] border border-[#e5e7eb] bg-white p-12 text-center">
        <AlertCircle className="size-12 text-red-500" />
        <h2 className="mt-4 text-[18px] font-bold text-[#111827]">
          Unable to load order
        </h2>
        <p className="mt-1 text-[14px] text-[#6b7280]">
          {getApiErrorMessage(error, 'Order not found or an error occurred.')}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#343bb5]"
          >
            <RefreshCw size={15} />
            Try again
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex items-center gap-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-[14px] font-medium text-[#374151] hover:bg-gray-50"
          >
            <ArrowLeft size={15} />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const itemsList =
    Array.isArray(order.items) && order.items.length > 0 ? order.items : null;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[26px] font-bold tracking-[-0.4px] text-[#111827] sm:text-[30px] sm:leading-9">
              {t('storeOrders.detail.title', { number: order.orderNumber })}
            </h1>
            <Button
              unstyled
              type="button"
              onClick={handleCopy}
              aria-label={t('storeOrders.copyAria', {
                number: order.orderNumber,
              })}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#4048cd]"
            >
              <Copy size={16} aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-1.5 text-[13px] text-[#6b7280]">{order.placedAt}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {isFetching ? (
            <RefreshCw
              size={16}
              className="animate-spin text-[#9ca3af]"
              aria-label="Updating"
            />
          ) : null}
          <StatusBadge status={order.status} />
          <Button
            unstyled
            type="button"
            onClick={handleClose}
            aria-label={t('storeOrders.detail.close')}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#6b7280] transition hover:bg-[#f9fafb]"
          >
            <X size={16} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section className={`${cardClass} flex flex-col`}>
          <SectionLabel icon={CreditCard}>
            {t('storeOrders.detail.payment')}
          </SectionLabel>
          <p className="mt-5 flex items-center gap-2.5 text-[16px] font-bold text-[#111827]">
            <span
              className="size-2.5 shrink-0 rounded-full bg-[#10b981]"
              aria-hidden="true"
            />
            {order.paymentStatus || t('storeOrders.detail.paid')}
          </p>
        </section>
        <section className={`${cardClass} flex flex-col`}>
          <SectionLabel icon={Package}>
            {t('storeOrders.detail.fulfillment')}
          </SectionLabel>
          <p className="mt-5 text-[16px] font-bold text-[#111827]">
            {t(
              STORE_ORDER_STATUS_LABEL_KEYS[order.status] ||
                order.rawStatus ||
                order.status,
            )}
          </p>
        </section>
      </div>

      <section className={cardClass}>
        <SectionLabel icon={UserRound}>
          {t('storeOrders.detail.customerInfo')}
        </SectionLabel>
        <div className="mt-5 flex items-center gap-3">
          {order.customerAvatar ? (
            <Image
              src={order.customerAvatar}
              alt={order.customerName}
              className="size-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${order.avatarClass}`}
            >
              {order.customerInitials}
            </span>
          )}
          <p className="text-[16px] font-bold text-[#111827]">
            {order.customerName}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3.5">
          <ContactRow
            icon={Mail}
            label={t('storeOrders.detail.email')}
            value={order.customerEmail}
          />
          <ContactRow
            icon={Phone}
            label={t('storeOrders.detail.phone')}
            value={order.customerPhone}
          />
          <ContactRow
            icon={MapPin}
            label={t('storeOrders.detail.shippingAddress')}
            value={order.shippingAddress}
          />
        </div>
      </section>

      {/* Product Items */}
      <section className={cardClass}>
        <SectionLabel icon={Package}>
          {t('storeOrders.detail.productInfo')}
        </SectionLabel>
        <div className="mt-5 divide-y divide-[#f3f4f6]">
          {itemsList ? (
            itemsList.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <Image
                    src={item.productImage}
                    alt={item.productTitle}
                    className="size-16 shrink-0 rounded-[10px] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-5 text-[#111827]">
                      {item.productTitle}
                    </p>
                    {item.size || item.category ? (
                      <p className="mt-1 text-[13px] text-[#6b7280]">
                        {[item.size, item.category].filter(Boolean).join(' • ')}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      {t('storeOrders.detail.unitLine', {
                        price: item.price,
                        qty: item.quantity,
                      })}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-bold tracking-[0.14em] text-[#9ca3af]">
                    {t('storeOrders.detail.subtotal')}
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#111827]">
                    {item.subtotal}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-start justify-between gap-4 pt-0">
              <div className="flex min-w-0 items-start gap-3.5">
                <Image
                  src={order.image}
                  alt={order.productTitle}
                  className="size-16 shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-5 text-[#111827]">
                    {order.productTitle}
                  </p>
                  {order.productMeta ? (
                    <p className="mt-1 text-[13px] text-[#6b7280]">
                      {order.productMeta}
                    </p>
                  ) : null}
                  <p className="mt-1 text-[13px] text-[#6b7280]">
                    {t('storeOrders.detail.unitLine', {
                      price: order.unitPrice,
                      qty: order.quantity,
                    })}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#9ca3af]">
                  {t('storeOrders.detail.subtotal')}
                </p>
                <p className="mt-1 text-[18px] font-bold text-[#111827]">
                  {order.total}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Payment breakdown */}
      <section className="rounded-[14px] border border-[#a7f3d0] bg-white p-5 sm:p-6">
        <SectionLabel icon={Banknote} tone="green">
          {t('storeOrders.detail.paymentBreakdown')}
        </SectionLabel>
        <div className="mt-5 flex flex-col gap-3 text-[14px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#6b7280]">
              {t('storeOrders.detail.orderTotal')}
            </span>
            <span className="font-bold text-[#111827]">{order.total}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#6b7280]">
              {t('storeOrders.detail.commission')}
            </span>
            <span className="font-medium text-[#9ca3af]">
              {order.commission}
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 rounded-[10px] bg-[#00c853] px-4 py-3.5 text-white">
          <span className="text-[14px] font-semibold">
            {t('storeOrders.detail.sellerEarnings')}
          </span>
          <span className="text-[22px] font-extrabold leading-none">
            {order.earnings}
          </span>
        </div>
        <p className="mt-3 text-center text-[12px] leading-5 text-[#9ca3af]">
          {t('storeOrders.detail.earningsNote')}
        </p>
      </section>

      {/* Seller Actions: Update Status */}
      <section className="rounded-[14px] bg-[#18181b] p-5 sm:p-6">
        <SectionLabel icon={Zap} tone="light">
          {t('storeOrders.detail.sellerActions')}
        </SectionLabel>
        <label className="mt-5 block">
          <span className="mb-2 block text-[12px] font-medium text-white/65">
            {t('storeOrders.detail.updateStatus')}
          </span>
          <span className="relative block">
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value)}
              disabled={updateStatusMutation.isPending}
              className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-white/12 bg-[#27272a] py-2 pl-10 pr-10 text-[14px] font-semibold text-white outline-none focus:border-[#ffc107] disabled:opacity-60"
            >
              {STORE_ORDER_ACTION_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(STORE_ORDER_STATUS_LABEL_KEYS[value])}
                </option>
              ))}
            </select>
            <span
              className={`pointer-events-none absolute left-3.5 top-1/2 size-2 -translate-y-1/2 rounded-full ${
                STORE_ORDER_STATUS_STYLES[draftStatus]?.dot || 'bg-[#f59e0b]'
              }`}
              aria-hidden="true"
            />
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/55"
              aria-hidden="true"
            />
          </span>
        </label>
        <Button
          unstyled
          type="button"
          onClick={handleMarkStatus}
          disabled={updateStatusMutation.isPending}
          className="mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#ffc107] text-[15px] font-bold text-[#111827] transition hover:bg-[#f5b800] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {updateStatusMutation.isPending ? (
            <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          ) : (
            <Save size={17} aria-hidden="true" />
          )}
          {updateStatusMutation.isPending
            ? 'Updating...'
            : t(getMarkActionLabelKey(draftStatus))}
        </Button>
      </section>

      {/* Order timeline */}
      {order.timeline && order.timeline.length > 0 ? (
        <section className={cardClass}>
          <SectionLabel icon={Clock}>
            {t('storeOrders.detail.orderTimeline')}
          </SectionLabel>
          <div className="mt-5">
            {order.timeline.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                title={timelineTitles[step.id] || step.title || step.id}
                pendingTitle={timelineTitles.delivered}
                pendingMeta={t('storeOrders.detail.timeline.pending')}
                transitNote={
                  step.id === 'delivered' && step.state === 'pending'
                    ? order.transitNote
                    : null
                }
                isLast={index === order.timeline.length - 1}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
});

SellerOrderDetailsContent.displayName = 'SellerOrderDetailsContent';

export default SellerOrderDetailsContent;
