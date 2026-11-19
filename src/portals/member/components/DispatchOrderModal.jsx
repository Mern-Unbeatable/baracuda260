import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Loader2, Package, Truck, X } from 'lucide-react';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  SELLER_ORDER_DETAILS_QUERY_KEY,
  SELLER_ORDER_STATUS_CARD_QUERY_KEY,
  updateSellerOrderStatusApi,
} from '@/shared/api/orders.api';

const POPULAR_COURIERS = [
  'Royal Mail',
  'InPost',
  'DHL',
  'DPD',
  'FedEx',
  'UPS',
];

const DispatchOrderModal = memo(({ open, onClose, order, onSuccess }) => {
  const { t } = useTranslation();
  const titleId = useId();
  const queryClient = useQueryClient();

  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [formError, setFormError] = useState('');

  const isAlreadyDispatched =
    order &&
    (String(order.status).toLowerCase() === 'dispatched' ||
      String(order.status).toLowerCase() === 'shipped');

  useEffect(() => {
    if (open && order) {
      setCourierName(
        order.tracking?.courierName || order.courierName || 'Royal Mail',
      );
      setTrackingNumber(
        order.tracking?.trackingNumber || order.trackingNumber || '',
      );
      setTrackingUrl(order.tracking?.trackingUrl || order.trackingUrl || '');
      setFormError('');
    }
  }, [open, order]);

  const updateMutation = useMutation({
    mutationFn: (payload) =>
      updateSellerOrderStatusApi(order.id, payload),
    onSuccess: () => {
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
        t(
          'storeOrders.dispatchModal.success',
          'Order dispatched and tracking details updated successfully.',
        ),
      );
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (err) => {
      const msg = getApiErrorMessage(
        err,
        'Failed to dispatch order with tracking details.',
      );
      setFormError(msg);
      toast.error(msg);
    },
  });

  if (!open || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanCourier = courierName.trim();
    const cleanTracking = trackingNumber.trim();
    const cleanUrl = trackingUrl.trim();

    if (!cleanTracking) {
      setFormError(
        t(
          'storeOrders.dispatchModal.trackingRequired',
          'Please enter a tracking number so the buyer can track this shipment.',
        ),
      );
      return;
    }

    updateMutation.mutate({
      status: 'DISPATCHED',
      courierName: cleanCourier,
      trackingNumber: cleanTracking,
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
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#eef0f4] px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e0e7ff] text-[#4048cd]">
              <Truck size={20} />
            </div>
            <div>
              <h2
                id={titleId}
                className="text-[17px] font-bold text-[#111827]"
              >
                {isAlreadyDispatched
                  ? t(
                      'storeOrders.dispatchModal.titleEdit',
                      'Update Courier & Tracking',
                    )
                  : t('storeOrders.dispatchModal.title', 'Dispatch Order')}
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

            {/* Courier Selection */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#111827]">
                {t(
                  'storeOrders.dispatchModal.courierName',
                  'Courier / Shipping Carrier',
                )}
                <span className="text-red-500 ml-0.5">*</span>
              </label>

              {/* Popular presets */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {POPULAR_COURIERS.map((c) => {
                  const isSelected =
                    courierName.toLowerCase().trim() === c.toLowerCase().trim();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCourierName(c)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1 text-[12px] font-medium transition ${
                        isSelected
                          ? 'bg-[#4048cd] text-white shadow-xs'
                          : 'border border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                required
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                placeholder={t(
                  'storeOrders.dispatchModal.courierPlaceholder',
                  'e.g. Royal Mail, InPost, DHL, DPD, FedEx',
                )}
                className="h-10.5 w-full rounded-xl border border-[#d1d5db] bg-white px-3.5 text-[14px] text-[#111827] outline-none transition focus:border-[#4048cd] focus:ring-1 focus:ring-[#4048cd]"
              />
            </div>

            {/* Tracking Number */}
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#111827]">
                {t('storeOrders.dispatchModal.trackingNumber', 'Tracking Number')}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
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
              <label className="mb-1 block text-[13px] font-semibold text-[#111827]">
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
                  'Leave blank to automatically generate tracking link for Royal Mail, InPost, DHL, DPD, FedEx, UPS.',
                )}
              </p>
            </div>

            {/* Notification alert */}
            <div className="rounded-xl border border-[#c7d2fe] bg-[#f0f4ff] p-3 text-[12px] text-[#3730a3]">
              <span className="font-semibold">Note:</span> Once confirmed, the order status will be marked as{' '}
              <strong className="text-[#4048cd]">Dispatched</strong> and the buyer will receive an automatic notification with tracking information.
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="flex items-center justify-end gap-3 border-t border-[#eef0f4] bg-[#fafafa] px-6 py-3.5">
            <Button
              unstyled
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="cursor-pointer rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#374151] hover:bg-gray-100 transition"
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
                  <span>
                    {isAlreadyDispatched ? 'Saving...' : 'Dispatching...'}
                  </span>
                </>
              ) : (
                <>
                  <Truck size={15} />
                  <span>
                    {isAlreadyDispatched
                      ? t(
                          'storeOrders.dispatchModal.save',
                          'Save Tracking Details',
                        )
                      : t(
                          'storeOrders.dispatchModal.confirm',
                          'Confirm & Dispatch',
                        )}
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
});

DispatchOrderModal.displayName = 'DispatchOrderModal';

export default DispatchOrderModal;
