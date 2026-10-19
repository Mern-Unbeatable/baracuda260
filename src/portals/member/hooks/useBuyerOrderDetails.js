import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  BUYER_ORDER_DETAILS_QUERY_KEY,
  getBuyerOrderDetailsApi,
} from '@/shared/api/orders.api';
import { resolveMediaUrl } from '@/shared/utils/media';
import { normalizeOrderStatus } from './useBuyerOrders';

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return String(isoString);
};

const formatShortDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (!Number.isNaN(d.getTime())) {
      return (
        d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }) +
        ', ' +
        d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    }
  } catch {
    // fallback
  }
  return String(isoString);
};

export const mapBuyerOrderDetail = (raw) => {
  if (!raw) return null;
  const d = raw?.data ?? raw;
  if (!d || !d.id) return null;

  const status = normalizeOrderStatus(d.status);
  const placedDate = formatDate(d.date);
  const isDelivered = status === 'delivered';
  const deliveredOn = isDelivered ? placedDate : null;

  const items = Array.isArray(d.items) ? d.items : [];
  const firstItem = items[0] || {};
  const product = firstItem.product || {};
  const seller = product.seller || {};

  const quantity = Number(firstItem.quantity || 1);
  const unitPrice = Number(firstItem.price ?? 0);
  const subtotal = Number(
    d.paymentSummary?.subtotal ?? quantity * unitPrice,
  );
  const shipping = Number(d.paymentSummary?.shipping ?? 0);
  const discount = Number(d.paymentSummary?.discount ?? 0);
  const totalPaid = Number(
    d.paymentSummary?.totalPaid ?? subtotal + shipping - discount,
  );

  const image =
    resolveMediaUrl(product.image) || '/assets/home/photo-harbor.webp';
  const sellerName = seller.name || 'John Doe';
  const sellerInitials = sellerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const shippingInfo = d.shippingInformation || {};
  const estimatedDelivery =
    shippingInfo.estimatedDelivery ||
    (isDelivered ? 'Delivered' : 'Est. Delivery');

  return {
    id: d.id,
    orderNumber:
      d.orderIdDisplay ||
      `#ORD-${String(d.id || '').slice(0, 8).toUpperCase()}`,
    placedOn: placedDate,
    placedAt: placedDate,
    placedShort: formatShortDate(d.date),
    processingAt: formatShortDate(d.date),
    status,
    deliveredOn,
    productTitle: product.title || 'Product',
    storeName: sellerName,
    sellerName,
    sellerAvatar: resolveMediaUrl(seller.avatar),
    sellerInitials,
    quantity,
    unitPrice: `$${unitPrice.toFixed(2)}`,
    productSubtotal: `$${subtotal.toFixed(2)}`,
    shipping: `$${shipping.toFixed(2)}`,
    discount: `$${discount.toFixed(2)}`,
    orderTotal: `$${totalPaid.toFixed(2)}`,
    shippingNote:
      shipping === 0 ? 'Free Shipping' : `Shipping $${shipping.toFixed(2)}`,
    shippingNoteTone: shipping === 0 ? 'success' : 'muted',
    paymentStatus: d.paymentStatus || 'Paid',
    paymentMethod: d.paymentSummary?.paymentMethod || 'PAYPAL',
    paymentMethodShort: d.paymentSummary?.paymentMethod || 'PAYPAL',
    paymentDate: placedDate,
    deliveryLabel: estimatedDelivery,
    deliveryEstimate: estimatedDelivery,
    deliveryEstimateShort: estimatedDelivery,
    image,
    items: items.map((it) => ({
      id: it.id,
      price: `$${Number(it.price || 0).toFixed(2)}`,
      quantity: it.quantity,
      size: it.size || 'Original',
      title: it.product?.title || 'Product',
      image: resolveMediaUrl(it.product?.image) || image,
      sellerName: it.product?.seller?.name || sellerName,
    })),
    progress: {
      placed: 'done',
      processing: status === 'processing' ? 'current' : 'done',
      shipped:
        status === 'shipped' ? 'current' : isDelivered ? 'done' : 'pending',
      delivered: isDelivered ? 'done' : 'pending',
    },
    shippingName: shippingInfo.address ? 'Shipping Address' : 'Digital Delivery',
    shippingLines: shippingInfo.address
      ? [shippingInfo.address]
      : [
          'No physical shipping required',
          'High-resolution files delivered directly to your account',
        ],
  };
};

/**
 * Hook to fetch detailed order information by ID.
 *
 * @param {string} orderId
 */
export default function useBuyerOrderDetails(orderId) {
  const query = useQuery({
    queryKey: BUYER_ORDER_DETAILS_QUERY_KEY(orderId),
    queryFn: () => getBuyerOrderDetailsApi(orderId),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  });

  const order = useMemo(() => {
    const rawData = query.data?.data ?? query.data;
    return mapBuyerOrderDetail(rawData);
  }, [query.data]);

  return {
    order,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
