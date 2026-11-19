import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Loader2, Package, Truck, X } from 'lucide-react';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import CourierSelector from '@/portals/member/components/CourierSelector';
import { saveCustomCourierPreset } from '@/portals/member/data/courierPresets';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  SELLER_ORDER_DETAILS_QUERY_KEY,
  SELLER_ORDER_STATUS_CARD_QUERY_KEY,
  updateSellerOrderStatusApi,
} from '@/shared/api/orders.api';

const ORDER_STATUS_OPTIONS = [
  { value: 'PROCESSING', labelKey: 'storeOrders.status.processing', defaultLabel: 'Processing' },
  { value: 'DISPATCHED', labelKey: 'storeOrders.status.dispatched', defaultLabel: 'Dispatched' },
  { value: 'SHIPPED', labelKey: 'storeOrders.status.shipped', defaultLabel: 'Shipped' },
  { value: 'DELIVERED', labelKey: 'storeOrders.status.delivered', defaultLabel: 'Delivered' },
  { value: 'CANCELLED', labelKey: 'storeOrders.status.cancelled', defaultLabel: 'Cancelled' },
];

const DispatchOrderModal = memo(
  ({ open, onClose, order, initialStatus, onSuccess }) => {
    const { t } = useTranslation();
    const titleId = useId();
    const queryClient = useQueryClient();

    const [targetStatus, setTargetStatus] = useState('DISPATCHED');
    const [courierName, setCourierName] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
      if (open && order) {
        const initSt = initialStatus
          ? String(initialStatus).toUpperCase()
          : order.rawStatus
            ? String(order.rawStatus).toUpperCase()
            : order.status
              ? String(order.status).toUpperCase()
              : 'DISPATCHED';

        setTargetStatus(initSt);
        setCourierName(
          order.tracking?.courierName || order.courierName || 'Royal Mail',
        );
        setTrackingNumber(
          order.tracking?.trackingNumber || order.trackingNumber || '',
        );
        setTrackingUrl(order.tracking?.trackingUrl || order.trackingUrl || '');
        setFormError('');
      }
    }, [open, order, initialStatus]);

    const updateMutation = useMutation({
      mutationFn: (payload) => updateSellerOrderStatusApi(order.id, payload),
      onSuccess: () => {
        if (courierName.trim()) {
          saveCustomCourierPreset(courierName.trim());
        }
        queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
        queryClient.invalidateQueries({
          queryKey: SELLER_ORDER_STATUS_CARD_QUERY_KEY,
        });
        if (order?.id) {
          queryClient.invalidateQueries({
            queryKey: SELLER_ORDER_DETAILS_QUERY_KEY(order.id),
          });
        }
        toast.success(
          t('storeOrders.statusUpdated', {
            status: targetStatus,
          }),
        );
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: (err) => {
        const msg = getApiErrorMessage(
          err,
          'Failed to update order status and courier details.',
        );
        setFormError(msg);
        toast.error(msg);
      },
    });

    if (!open || !order) return null;

    const isDispatchOrShipped =
      targetStatus === 'DISPATCHED' || targetStatus === 'SHIPPED';

    const handleSubmit = (e) => {
      e.preventDefault();
      setFormError('');

      const cleanCourier = courierName.trim();
      const cleanTracking = trackingNumber.trim();
      const cleanUrl = trackingUrl.trim();

      if (isDispatchOrShipped && !cleanTracking) {
        setFormError(
          t(
            'storeOrders.dispatchModal.trackingRequired',
            'Please enter a tracking number so the buyer can track this shipment.',
          ),
        );
        return;
      }

      updateMutation.mutate({
        status: targetStatus,
        courierName: cleanCourier || undefined,
        trackingNumber: cleanTracking || undefined,
        trackingUrl: cleanUrl || undefined,
      });
    };

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={!updateMutation.isPending ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 animate-in fade-in zoom-in-95">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-4.5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#e0e7ff] text-[#4048cd]">
                <Truck size={20} />
              </div>
              <div>
                <h2 id={titleId} className="text-[17px] font-bold text-[#111827]">
                  {isDispatchOrShipped
                    ? t('storeOrders.dispatchModal.title', 'Dispatch Order')
                    : t('storeOrders.dispatchModal.titleStatus', 'Update Order Status & Courier')}
                </h2>
                <p className="text-[12px] text-[#6b7280]">
                  {order.orderIdDisplay || `#${order.orderNumber}`}
                </p>
              </div>
            </div>
            <Button
              unstyled
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
              aria-label="Close"
            >
              <X size={18} />
            </Button>
          </header>

          {/* Product / Buyer snippet */}
          <div className="flex items-center gap-3 border-b border-[#f3f4f6] bg-[#f8fafc] px-6 py-3">
            {order.image ? (
              <Image
                src={order.image}
                alt=""
                className="size-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-400">
                <Package size={18} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#111827]">
                {order.productTitle}
              </p>
              <p className="text-[12px] text-[#6b7280]">
                Customer: <span className="font-medium text-[#374151]">{order.customerName}</span>
                {order.quantity ? ` • Qty ${order.quantity}` : ''}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-col gap-4.5 overflow-y-auto px-6 py-5">
              {formError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                  {formError}
                </div>
              ) : null}

              {/* Status Selector */}
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#111827]">
                  {t('storeOrders.detail.updateStatus', 'Update Status to')}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="h-10.5 w-full cursor-pointer rounded-xl border border-[#d1d5db] bg-white px-3.5 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey, opt.defaultLabel)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Courier Section Header */}
              <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-2">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#4048cd]">
                  {t('storeOrders.detail.dispatchDetails', 'Courier & Tracking Details')}
                </span>
                {isDispatchOrShipped ? (
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    Required for Dispatch
                  </span>
                ) : (
                  <span className="text-[11px] text-[#6b7280]">Optional</span>
                )}
              </div>

              {/* Courier Selection */}
              <CourierSelector
                value={courierName}
                onChange={setCourierName}
                required={isDispatchOrShipped}
                theme="light"
              />

              {/* Tracking Number */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#374151]">
                  {t('storeOrders.dispatchModal.trackingNumber', 'Tracking Number')}
                  {isDispatchOrShipped ? (
                    <span className="text-red-500 ml-0.5">*</span>
                  ) : null}
                </label>
                <input
                  type="text"
                  required={isDispatchOrShipped}
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t(
                    'storeOrders.dispatchModal.trackingNumberPlaceholder',
                    'e.g. GB123456789, 620000000123',
                  )}
                  className="h-10.5 w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 font-mono text-[14px] text-[#111827] outline-none transition focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
                />
              </div>

              {/* Optional Custom Tracking URL */}
              <div>
                <label className="mb-1 block text-[13px] font-medium text-[#374151]">
                  {t(
                    'storeOrders.dispatchModal.trackingUrl',
                    'Tracking URL (Optional)',
                  )}
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-10.5 w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 text-[13px] text-[#111827] outline-none transition focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
                />
                <p className="mt-1 text-[11px] text-[#6b7280]">
                  {t(
                    'storeOrders.dispatchModal.trackingUrlHint',
                    'Leave blank to automatically generate tracking link for major couriers or universal package tracking.',
                  )}
                </p>
              </div>

              {/* Notification note */}
              {isDispatchOrShipped ? (
                <div className="rounded-xl border border-[#c7d2fe] bg-[#f0f4ff] p-3 text-[12px] text-[#3730a3]">
                  <span className="font-semibold">Note:</span> The buyer will receive an automatic dispatch notification with courier and tracking details.
                </div>
              ) : null}
            </div>

            {/* Footer Actions */}
            <footer className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#fafafa] px-6 py-3.5">
              <Button
                unstyled
                type="button"
                onClick={onClose}
                disabled={updateMutation.isPending}
                className="cursor-pointer rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#374151] transition hover:bg-gray-100"
              >
                {t('storeOrders.dispatchModal.cancel', 'Cancel')}
              </Button>
              <Button
                unstyled
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4048cd] px-5 py-2 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#343cb0] disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Truck size={15} />
                    <span>
                      {targetStatus === 'DISPATCHED'
                        ? t('storeOrders.dispatchModal.confirm', 'Confirm & Dispatch')
                        : t('storeOrders.dispatchModal.saveStatus', 'Update Status & Save Details')}
                    </span>
                  </>
                )}
              </Button>
            </footer>
          </form>
        </div>
      </div>,
      document.body,
    );
  },
);

DispatchOrderModal.displayName = 'DispatchOrderModal';

export default DispatchOrderModal;
