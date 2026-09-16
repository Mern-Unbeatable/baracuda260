import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ROUTES } from '@/shared/config';
import {
  ORDER_STATUS,
  ORDER_STATUS_LABEL_KEYS,
  ORDER_STATUS_STYLES,
  getOrderById,
} from '@/portals/member/data/myOrdersData';

const SectionLabel = memo(({ children }) => (
  <h2 className="text-[11px] font-semibold tracking-[0.16em] text-[#98a0b3]">{children}</h2>
));
SectionLabel.displayName = 'SectionLabel';

const cardClass =
  'rounded-[12px] border border-[#e8eaef] bg-white p-5 sm:p-6 shadow-[0px_1px_2px_rgba(15,23,42,0.03)]';

const ProgressStep = memo(({ state, title, detail, meta, isLast }) => {
  const isDone = state === 'done';
  const isCurrent = state === 'current';
  const isPending = state === 'pending';

  const titleClass = isDone
    ? 'text-[#1f9d6a]'
    : isCurrent
      ? 'text-[#d97706]'
      : 'text-[#a0a8b8]';

  const metaClass = isDone
    ? 'text-[#6b7280]'
    : isCurrent
      ? 'text-[#d97706]'
      : 'text-[#b0b7c6]';

  const detailClass = isPending ? 'text-[#b0b7c6]' : 'text-[#6b7280]';

  return (
    <div className={`relative flex gap-3.5 ${isLast ? '' : 'pb-5'}`}>
      <div className="flex w-6 shrink-0 flex-col items-center self-stretch">
        {isDone ? (
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1f9d6a] text-white">
            <Check size={13} strokeWidth={3} aria-hidden="true" />
          </span>
        ) : isCurrent ? (
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f59e0b]">
            <span className="size-2 rounded-full bg-white" aria-hidden="true" />
          </span>
        ) : (
          <span
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#d5dae3] bg-white"
            aria-hidden="true"
          />
        )}
        {!isLast ? (
          <span
            className={`mt-1.5 w-px flex-1 ${isDone ? 'bg-[#c6ebd9]' : 'bg-[#e5e7eb]'}`}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-[14px] font-semibold leading-5 ${titleClass}`}>{title}</p>
          <p className={`shrink-0 text-[12px] font-medium leading-5 ${metaClass}`}>{meta}</p>
        </div>
        <p className={`mt-0.5 text-[13px] leading-5 ${detailClass}`}>{detail}</p>
      </div>
    </div>
  );
});
ProgressStep.displayName = 'ProgressStep';

const OrderDetailsContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const order = getOrderById(id);

  if (!order) {
    return <Navigate to={ROUTES.ADMIN_MY_ORDERS} replace />;
  }

  const statusStyle = ORDER_STATUS_STYLES[order.status];

  const handleInvoice = () => {
    toast.success(t('myOrders.invoiceStarted', { order: order.orderNumber }));
  };

  const handleClose = () => {
    navigate(ROUTES.ADMIN_MY_ORDERS);
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-4 sm:gap-5">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={ROUTES.ADMIN_MY_ORDERS}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6b7280] transition hover:text-[#4048cd]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t('myOrders.detail.back')}
        </Link>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleInvoice}
            aria-label={t('myOrders.invoiceAria', { number: order.orderNumber })}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <FileText size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t('myOrders.detail.close')}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold leading-7 tracking-[-0.3px] text-[#111827] sm:text-[26px] sm:leading-8">
            <span className="font-semibold text-[#9ca3af]">{t('myOrders.detail.titlePrefix')}</span>{' '}
            <span>{t('myOrders.detail.titleOrder', { number: order.orderNumber })}</span>
          </h1>
          <p className="mt-1.5 text-[13px] text-[#6b7280]">
            {t('myOrders.detail.placedAt', { date: order.placedAt })}
          </p>
        </div>
        <span
          className={`inline-flex h-7 shrink-0 items-center gap-1.5 self-start rounded-full px-3 text-[12px] font-semibold ${statusStyle.badge}`}
        >
          <span className={`size-1.5 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
          {t(ORDER_STATUS_LABEL_KEYS[order.status])}
        </span>
      </header>

      <section className={cardClass}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionLabel>{t('myOrders.detail.progress')}</SectionLabel>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.04em] text-[#1f9d6a]">
            <ShieldCheck size={14} strokeWidth={2.25} aria-hidden="true" />
            {t('myOrders.detail.buyerProtection')}
          </p>
        </div>

        <div>
          <ProgressStep
            state={order.progress.placed}
            title={t('myOrders.detail.steps.placed')}
            detail={t('myOrders.detail.steps.placedDetail')}
            meta={order.placedShort}
          />
          <ProgressStep
            state={order.progress.processing}
            title={t('myOrders.detail.steps.processing')}
            detail={t('myOrders.detail.steps.processingDetail')}
            meta={
              order.progress.processing === 'pending'
                ? t('myOrders.detail.pending')
                : order.processingAt
            }
          />
          <ProgressStep
            state={order.progress.shipped}
            title={t('myOrders.detail.steps.shipped')}
            detail={t('myOrders.detail.steps.shippedDetail')}
            meta={
              order.progress.shipped === 'pending'
                ? t('myOrders.detail.pending')
                : order.tracking || t('myOrders.detail.inTransit')
            }
          />
          <ProgressStep
            isLast
            state={order.progress.delivered}
            title={t('myOrders.detail.steps.delivered')}
            detail={
              order.status === ORDER_STATUS.DELIVERED
                ? order.deliveryEstimate
                : t('myOrders.detail.steps.deliveredDetail', {
                    date: order.deliveryEstimateShort || order.deliveryEstimate,
                  })
            }
            meta={
              order.progress.delivered === 'pending'
                ? t('myOrders.detail.pending')
                : t('myOrders.status.delivered')
            }
          />
        </div>
      </section>

      <section className={cardClass}>
        <SectionLabel>{t('myOrders.detail.purchasedProduct')}</SectionLabel>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <img
              src={order.image}
              alt={order.productTitle}
              className="size-16 shrink-0 rounded-[10px] object-cover sm:size-18"
            />
            <div className="min-w-0">
              <p className="text-[15px] font-bold leading-5 text-[#111827]">{order.productTitle}</p>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                {t('myOrders.soldBy', { store: order.storeName })}
              </p>
              <p className="mt-1 text-[12px] text-[#9ca3af]">
                {t('myOrders.detail.unitMeta', {
                  qty: order.quantity,
                  price: order.unitPrice,
                })}
              </p>
            </div>
          </div>
          <p className="shrink-0 pt-0.5 text-[16px] font-bold text-[#111827]">{order.productSubtotal}</p>
        </div>
      </section>

      <section className={cardClass}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[#fff4e5] text-[14px] font-bold text-[#d97706]">
              {order.sellerInitials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold tracking-[0.12em] text-[#98a0b3]">
                  {t('myOrders.detail.soldByLabel')}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf8f1] px-2 py-0.5 text-[11px] font-semibold text-[#1f9d6a]">
                  <BadgeCheck size={12} aria-hidden="true" />
                  {t('myOrders.detail.verifiedCreator')}
                </span>
              </div>
              <p className="mt-1 text-[15px] font-bold leading-5 text-[#111827]">{order.storeName}</p>
              <p className="mt-0.5 text-[13px] text-[#6b7280]">{order.sellerName}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => toast(t('myOrders.detail.visitStoreSoon'))}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[10px] border border-[#e5e7eb] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb]"
            >
              {t('myOrders.detail.visitStore')}
            </button>
            <button
              type="button"
              onClick={() => toast(t('myOrders.detail.messageSoon'))}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#86d4b0] bg-white px-4 text-[13px] font-semibold text-[#1f9d6a] transition hover:bg-[#f3fbf7]"
            >
              <MessageSquare size={14} aria-hidden="true" />
              {t('myOrders.detail.message')}
            </button>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionLabel>{t('myOrders.detail.paymentSummary')}</SectionLabel>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f9d6a]">
            <CheckCircle2 size={14} aria-hidden="true" />
            {t('myOrders.detail.paidInFull')}
          </span>
        </div>
        <div className="flex flex-col gap-2.5 text-[14px]">
          <div className="flex items-center justify-between gap-3 text-[#6b7280]">
            <span>{t('myOrders.detail.subtotal')}</span>
            <span className="text-[#374151]">{order.productSubtotal}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#6b7280]">
            <span>{t('myOrders.detail.shipping')}</span>
            <span className="text-[#374151]">{order.shipping}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[#6b7280]">
            <span>{t('myOrders.detail.discount')}</span>
            <span className="text-[#374151]">{order.discount}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-[#eef0f4] pt-3 text-[15px] font-bold text-[#111827]">
            <span>{t('myOrders.detail.totalPaid')}</span>
            <span>{order.orderTotal}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eef0f4] pt-3.5 text-[12px] text-[#6b7280]">
          <span className="inline-flex items-center gap-2">
            <CreditCard size={15} className="text-[#9ca3af]" aria-hidden="true" />
            {t('myOrders.detail.paymentMethod', { method: order.paymentMethod })}
          </span>
          <span>{order.paymentDate}</span>
        </div>
      </section>

      <section className={cardClass}>
        <SectionLabel>{t('myOrders.detail.shippingInfo')}</SectionLabel>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#9ca3af]" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-semibold text-[#111827]">
                {t('myOrders.detail.shippingAddress')}
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#374151]">{order.shippingName}</p>
              {order.shippingLines.map((line) => (
                <p key={line} className="text-[13px] leading-5 text-[#6b7280]">
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="sm:text-left">
            <p className="text-[13px] text-[#9ca3af]">{t('myOrders.detail.estimatedDelivery')}</p>
            <p className="mt-1.5 text-[15px] font-bold text-[#1f9d6a]">{order.deliveryEstimate}</p>
          </div>
        </div>
      </section>
    </div>
  );
});

OrderDetailsContent.displayName = 'OrderDetailsContent';

export default OrderDetailsContent;
