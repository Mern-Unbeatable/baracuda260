import {
  Banknote,
  Check,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  UserRound,
  X,
  Zap,
} from 'lucide-react';
import React, { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  getMarkActionLabelKey,
  getStoreOrderById,
  STORE_ORDER_ACTION_STATUSES,
  STORE_ORDER_STATUS,
  STORE_ORDER_STATUS_LABEL_KEYS,
  STORE_ORDER_STATUS_STYLES,
} from '@/portals/member/data/storeOrdersData';
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
  const style = STORE_ORDER_STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ${style.badge}`}
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
      <p className="mt-0.5 text-[14px] leading-5 text-[#374151]">{value}</p>
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
  const baseOrder = getStoreOrderById(id);

  const [status, setStatus] = useState(
    () => baseOrder?.status || STORE_ORDER_STATUS.SHIPPED,
  );
  const [draftStatus, setDraftStatus] = useState(() => {
    if (!baseOrder) return STORE_ORDER_STATUS.DELIVERED;
    return baseOrder.status === STORE_ORDER_STATUS.SHIPPED
      ? STORE_ORDER_STATUS.DELIVERED
      : baseOrder.status;
  });

  if (!baseOrder) {
    return <Navigate to={ROUTES.USER_ORDERS} replace />;
  }

  const order = { ...baseOrder, status };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      toast.success(t('storeOrders.copySuccess'));
    } catch {
      toast.error(t('storeOrders.copyFailed'));
    }
  };

  const handleClose = () => {
    navigate(ROUTES.USER_ORDERS);
  };

  const handleMarkStatus = () => {
    setStatus(draftStatus);
    toast.success(
      t('storeOrders.statusUpdated', {
        status: t(STORE_ORDER_STATUS_LABEL_KEYS[draftStatus]),
      }),
    );
  };

  const timelineTitles = {
    placed: t('storeOrders.detail.timeline.placed'),
    processing: t('storeOrders.detail.timeline.processing'),
    shipped: t('storeOrders.detail.timeline.shipped'),
    delivered: t('storeOrders.detail.timeline.delivered'),
  };

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
          <StatusBadge status={status} />
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
            {t('storeOrders.detail.paid')}
          </p>
        </section>
        <section className={`${cardClass} flex flex-col`}>
          <SectionLabel icon={Package}>
            {t('storeOrders.detail.fulfillment')}
          </SectionLabel>
          <p className="mt-5 text-[16px] font-bold text-[#111827]">
            {t(STORE_ORDER_STATUS_LABEL_KEYS[status])}
          </p>
        </section>
      </div>

      <section className={cardClass}>
        <SectionLabel icon={UserRound}>
          {t('storeOrders.detail.customerInfo')}
        </SectionLabel>
        <div className="mt-5 flex items-center gap-3">
          <span
            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${order.avatarClass}`}
          >
            {order.customerInitials}
          </span>
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

      <section className={cardClass}>
        <SectionLabel icon={Package}>
          {t('storeOrders.detail.productInfo')}
        </SectionLabel>
        <div className="mt-5 flex items-start justify-between gap-4">
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
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {order.productMeta}
              </p>
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
      </section>

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
              className="h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-white/12 bg-[#27272a] py-2 pl-10 pr-10 text-[14px] font-semibold text-white outline-none focus:border-[#ffc107]"
            >
              {STORE_ORDER_ACTION_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(STORE_ORDER_STATUS_LABEL_KEYS[value])}
                </option>
              ))}
            </select>
            <span
              className={`pointer-events-none absolute left-3.5 top-1/2 size-2 -translate-y-1/2 rounded-full ${STORE_ORDER_STATUS_STYLES[draftStatus].dot}`}
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
          className="mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#ffc107] text-[15px] font-bold text-[#111827] transition hover:bg-[#f5b800]"
        >
          <Save size={17} aria-hidden="true" />
          {t(getMarkActionLabelKey(draftStatus))}
        </Button>
      </section>

      <section className={cardClass}>
        <SectionLabel icon={Clock}>
          {t('storeOrders.detail.orderTimeline')}
        </SectionLabel>
        <div className="mt-5">
          {order.timeline.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              title={timelineTitles[step.id]}
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
    </div>
  );
});

SellerOrderDetailsContent.displayName = 'SellerOrderDetailsContent';

export default SellerOrderDetailsContent;
