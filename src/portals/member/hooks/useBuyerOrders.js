import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  BUYER_ORDERS_QUERY_KEY,
  BUYER_ORDER_STATUS_CARD_QUERY_KEY,
  getBuyerOrdersApi,
  getBuyerOrderStatusCardApi,
} from '@/shared/api/orders.api';
import { resolveMediaUrl } from '@/shared/utils/media';

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

export const normalizeOrderStatus = (rawStatus) => {
  const s = String(rawStatus || '').toLowerCase().trim();
  if (s === 'delivered' || s === 'completed') return 'delivered';
  if (s === 'shipped' || s === 'in_transit') return 'shipped';
  if (s === 'processing' || s === 'pending') return 'processing';
  if (s === 'cancelled' || s === 'canceled') return 'cancelled';
  return 'processing';
};

export const mapBuyerOrder = (raw) => {
  if (!raw) return null;
  const status = normalizeOrderStatus(raw.status);
  const placedDate = formatDate(raw.date);
  const isDelivered = status === 'delivered';
  const deliveredOn = isDelivered
    ? placedDate
    : raw.deliveredOn
      ? formatDate(raw.deliveredOn)
      : null;

  const product = raw.product || {};
  const quantity = Number(product.quantity || raw.quantity || 1);
  const itemPrice = Number(product.itemPrice ?? raw.itemPrice ?? 0);
  const total = Number(raw.total ?? quantity * itemPrice);

  const image =
    resolveMediaUrl(product.image || raw.image) ||
    '/assets/home/photo-harbor.webp';

  const sellerName = product.sellerName || raw.storeName || 'My12Photos Creator';

  return {
    id: raw.id,
    orderNumber:
      raw.orderIdDisplay ||
      raw.orderNumber ||
      `#ORD-${String(raw.id || '').slice(0, 8).toUpperCase()}`,
    placedOn: placedDate,
    placedAt: placedDate,
    placedShort: formatShortDate(raw.date),
    processingAt: formatShortDate(raw.date),
    status,
    deliveredOn,
    productTitle: product.title || raw.title || 'Product',
    storeName: sellerName,
    sellerName,
    sellerInitials: sellerName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    quantity,
    unitPrice: `$${itemPrice.toFixed(2)}`,
    productSubtotal: `$${(quantity * itemPrice).toFixed(2)}`,
    shipping: '$0.00',
    discount: '$0.00',
    orderTotal: `$${total.toFixed(2)}`,
    shippingNote: raw.shippingNote || 'Standard Delivery',
    shippingNoteTone: isDelivered ? 'success' : 'muted',
    paymentStatus: raw.paymentStatus || 'Paid',
    paymentMethod: raw.paymentMethod || 'PAYPAL',
    paymentMethodShort: raw.paymentMethod || 'PAYPAL',
    paymentDate: placedDate,
    deliveryLabel: raw.delivery || (isDelivered ? 'Delivered' : 'Est. Delivery'),
    deliveryEstimate: raw.delivery || 'Est. Delivery',
    deliveryEstimateShort: raw.delivery || 'Est. Delivery',
    image,
    progress: {
      placed: 'done',
      processing: status === 'processing' ? 'current' : 'done',
      shipped:
        status === 'shipped' ? 'current' : isDelivered ? 'done' : 'pending',
      delivered: isDelivered ? 'done' : 'pending',
    },
    shippingName: raw.shippingInformation?.address || 'Buyer',
    shippingLines: raw.shippingInformation?.address
      ? [raw.shippingInformation.address]
      : ['Digital Product / Downloadable artwork'],
  };
};

/**
 * Hook to fetch paginated buyer orders and status-card summary counts.
 *
 * @param {{ page?: number, limit?: number }} params
 */
export default function useBuyerOrders({ page = 1, limit = 10 } = {}) {
  // 1. Fetch status card counts
  const statusQuery = useQuery({
    queryKey: BUYER_ORDER_STATUS_CARD_QUERY_KEY,
    queryFn: getBuyerOrderStatusCardApi,
    staleTime: 30 * 1000,
  });

  // 2. Fetch paginated orders
  const ordersQuery = useQuery({
    queryKey: [...BUYER_ORDERS_QUERY_KEY, page, limit],
    queryFn: () => getBuyerOrdersApi({ page, limit }),
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });

  // Extract status counts
  const stats = useMemo(() => {
    const rawCard = statusQuery.data?.data ?? statusQuery.data ?? {};
    return {
      total: { value: String(rawCard.Total ?? rawCard.total ?? 0) },
      processing: {
        value: String(rawCard.Processing ?? rawCard.processing ?? 0),
      },
      shipped: { value: String(rawCard.Shipped ?? rawCard.shipped ?? 0) },
      delivered: {
        value: String(rawCard.Delivered ?? rawCard.delivered ?? 0),
      },
    };
  }, [statusQuery.data]);

  // Extract raw order items & meta defensively
  const { orders, meta } = useMemo(() => {
    const rawData = ordersQuery.data?.data ?? ordersQuery.data;
    let rawList = [];
    let metaObj = null;

    if (Array.isArray(rawData)) {
      rawList = rawData;
    } else if (Array.isArray(rawData?.data)) {
      rawList = rawData.data;
      metaObj = rawData.meta;
    } else if (Array.isArray(rawData?.items)) {
      rawList = rawData.items;
      metaObj = rawData.meta || rawData.pagination;
    }

    if (!metaObj) {
      metaObj = ordersQuery.data?.meta;
    }

    const mapped = rawList.map(mapBuyerOrder).filter(Boolean);

    const resolvedMeta = {
      currentPage: metaObj?.currentPage ?? metaObj?.page ?? page,
      totalPages:
        metaObj?.totalPages ??
        metaObj?.pageCount ??
        Math.max(1, Math.ceil((metaObj?.totalRecords ?? mapped.length) / limit)),
      totalRecords:
        metaObj?.totalRecords ??
        metaObj?.total ??
        metaObj?.totalCount ??
        mapped.length,
      hasNext: Boolean(metaObj?.hasNext),
      hasPrevious: Boolean(metaObj?.hasPrevious),
    };

    return { orders: mapped, meta: resolvedMeta };
  }, [ordersQuery.data, page, limit]);

  return {
    orders,
    meta,
    stats,
    isLoading: ordersQuery.isLoading || statusQuery.isLoading,
    isOrdersLoading: ordersQuery.isLoading,
    isStatsLoading: statusQuery.isLoading,
    isError: ordersQuery.isError || statusQuery.isError,
    error: ordersQuery.error || statusQuery.error,
    refetch: () => {
      ordersQuery.refetch();
      statusQuery.refetch();
    },
  };
}
