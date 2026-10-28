import { apiClient } from './client';
import { resolveMediaUrl } from '@/shared/utils/media';

export const BUYER_ORDERS_QUERY_KEY = ['buyer-orders'];
export const BUYER_ORDER_STATUS_CARD_QUERY_KEY = ['buyer-order-status-card'];
export const BUYER_ORDER_DETAILS_QUERY_KEY = (orderId) => [
  'buyer-order-details',
  String(orderId || ''),
];

export const SELLER_ORDERS_QUERY_KEY = (params) => ['seller-orders', params];
export const SELLER_ORDER_STATUS_CARD_QUERY_KEY = ['seller-order-status-card'];
export const SELLER_ORDER_DETAILS_QUERY_KEY = (orderId) => [
  'seller-order-details',
  String(orderId || ''),
];

const AVATAR_COLORS = [
  'bg-[#4048cd] text-white',
  'bg-[#f59e0b] text-white',
  'bg-[#059669] text-white',
  'bg-[#7c3aed] text-white',
  'bg-[#ee1c25] text-white',
  'bg-[#0ea5e9] text-white',
];

export const getAvatarClass = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const getCustomerInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'CU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const formatOrderCurrency = (val) => {
  if (val === null || val === undefined) return '$0.00';
  if (typeof val === 'string' && val.startsWith('$')) return val;
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const formatOrderDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPlacedAtDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  const dateFormatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeFormatted = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateFormatted} - ${timeFormatted}`;
};

export const buildSellerOrderTimeline = (orderDateStr, status) => {
  const normStatus = String(status || '').toUpperCase();
  const date = orderDateStr ? new Date(orderDateStr) : null;
  const validDate = date && !Number.isNaN(date.getTime());
  const dateStr = validDate
    ? date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  const timeStr = validDate
    ? date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return [
    {
      id: 'placed',
      state: 'done',
      date: dateStr,
      time: timeStr,
    },
    {
      id: 'processing',
      state: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(normStatus)
        ? 'done'
        : 'pending',
      date: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(normStatus)
        ? dateStr
        : null,
      time: null,
    },
    {
      id: 'shipped',
      state: ['SHIPPED', 'DELIVERED'].includes(normStatus) ? 'done' : 'pending',
      date: ['SHIPPED', 'DELIVERED'].includes(normStatus) ? dateStr : null,
      time: null,
    },
    {
      id: 'delivered',
      state: normStatus === 'DELIVERED' ? 'done' : 'pending',
      date: normStatus === 'DELIVERED' ? dateStr : null,
      time: null,
    },
  ];
};

/**
 * Normalizes seller order item from API.
 * @param {object} item
 */
export const normalizeSellerOrder = (item) => {
  if (!item) return null;

  const customerName = item.customer?.name || item.customerName || 'Customer';
  const orderNumber = item.orderIdDisplay
    ? String(item.orderIdDisplay).replace(/^#/, '')
    : item.orderNumber || item.id;

  return {
    id: item.id,
    orderNumber,
    orderIdDisplay: item.orderIdDisplay || `#${orderNumber}`,
    customerName,
    customerAvatar: resolveMediaUrl(item.customer?.avatar),
    customerInitials: getCustomerInitials(customerName),
    avatarClass: getAvatarClass(customerName),
    productTitle: item.product?.title || item.productTitle || 'Untitled Product',
    image: resolveMediaUrl(item.product?.image) || item.image || '',
    quantity: item.product?.quantity ?? item.quantity ?? 1,
    date: formatOrderDate(item.date),
    rawDate: item.date,
    total: formatOrderCurrency(item.total),
    totalRaw: item.total,
    commission: formatOrderCurrency(item.adminCommission),
    commissionRaw: item.adminCommission,
    earnings: formatOrderCurrency(item.sellerEarnings),
    earningsRaw: item.sellerEarnings,
    status: String(item.status || 'PROCESSING').toLowerCase(),
    rawStatus: item.status,
  };
};

/**
 * Normalizes full seller order detail from API.
 * @param {object} data
 */
export const normalizeSellerOrderDetail = (data) => {
  if (!data) return null;

  const orderNumber = data.orderIdDisplay
    ? String(data.orderIdDisplay).replace(/^#/, '')
    : data.id;

  const customerName = data.customer?.name || 'Customer';
  const customerEmail = data.customer?.email || '—';
  const customerPhone =
    data.customer?.phone || data.customer?.address?.mobile || '—';
  const customerAvatar = resolveMediaUrl(data.customer?.avatar);
  const customerInitials = getCustomerInitials(customerName);
  const avatarClass = getAvatarClass(customerName);

  const address = data.customer?.address;
  const shippingAddress = address
    ? [address.street, address.city, address.postalCode, address.country]
        .filter(Boolean)
        .join(', ')
    : '—';

  const rawItems = Array.isArray(data.items) ? data.items : [];
  const normalizedItems = rawItems.map((item) => {
    const unitPriceNum = item.price ?? 0;
    const qty = item.quantity ?? 1;
    return {
      id: item.id,
      price: formatOrderCurrency(unitPriceNum),
      priceRaw: unitPriceNum,
      quantity: qty,
      size: item.size || '',
      category: item.product?.category || '',
      productTitle: item.product?.title || 'Product',
      productImage: resolveMediaUrl(item.product?.image),
      subtotal: formatOrderCurrency(unitPriceNum * qty),
    };
  });

  const firstItem = normalizedItems[0] || {
    productTitle: 'Product',
    productImage: '',
    size: '',
    quantity: 1,
    price: '$0.00',
    subtotal: '$0.00',
  };

  const rawStatus = String(data.status || 'PROCESSING').toUpperCase();
  const status = rawStatus.toLowerCase();

  const totalRaw =
    data.paymentBreakdown?.orderTotal ??
    (rawItems.length
      ? rawItems.reduce(
          (acc, it) => acc + (it.price || 0) * (it.quantity || 1),
          0,
        )
      : data.total ?? 0);
  const commissionRaw =
    data.paymentBreakdown?.platformCommission ??
    data.adminCommission ??
    totalRaw * 0.1;
  const earningsRaw =
    data.paymentBreakdown?.sellerEarnings ??
    data.sellerEarnings ??
    totalRaw - commissionRaw;

  return {
    id: data.id,
    orderNumber,
    orderIdDisplay: data.orderIdDisplay || `#${orderNumber}`,
    placedAt: formatPlacedAtDate(data.date),
    rawDate: data.date,
    status,
    rawStatus,
    paymentStatus: data.paymentStatus || 'Paid',
    customerName,
    customerEmail,
    customerPhone,
    customerAvatar,
    customerInitials,
    avatarClass,
    shippingAddress,
    items: normalizedItems,
    productTitle: firstItem.productTitle,
    image: firstItem.productImage,
    productMeta: firstItem.size || firstItem.category,
    quantity: firstItem.quantity,
    unitPrice: firstItem.price,
    total: formatOrderCurrency(totalRaw),
    totalRaw,
    commission: formatOrderCurrency(commissionRaw),
    commissionRaw,
    earnings: formatOrderCurrency(earningsRaw),
    earningsRaw,
    timeline: buildSellerOrderTimeline(data.date, rawStatus),
  };
};

/**
 * Fetch buyer order status counts (Total, Processing, Shipped, Delivered).
 * GET /api/v1/orders/buyer/status-card
 */
export const getBuyerOrderStatusCardApi = async () => {
  const response = await apiClient.get('/v1/orders/buyer/status-card');
  return response;
};

/**
 * Fetch paginated list of buyer orders.
 * GET /api/v1/orders/buyer?page=1&limit=10
 *
 * @param {{ page?: number, limit?: number }} params
 */
export const getBuyerOrdersApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/orders/buyer', {
    params: { page, limit },
  });
  return response;
};

/**
 * Fetch single buyer order details by ID.
 * GET /api/v1/orders/buyer/{{order_id}}
 *
 * @param {string} orderId
 */
export const getBuyerOrderDetailsApi = async (orderId) => {
  const cleanId = String(orderId || '').trim();
  const response = await apiClient.get(
    `/v1/orders/buyer/${encodeURIComponent(cleanId)}`,
  );
  return response;
};

/**
 * Fetch seller order status card statistics.
 * GET /api/v1/orders/seller/status-card
 */
export const getSellerOrderStatusCardApi = async () => {
  const response = await apiClient.get('/v1/orders/seller/status-card');
  return response?.data ?? response;
};

/**
 * Fetch seller orders with pagination, status, and date filters.
 * GET /api/v1/orders/seller?page=1&limit=10&status=All&date=This Month
 *
 * @param {{ page?: number, limit?: number, status?: string, date?: string }} params
 */
export const getSellerOrdersApi = async ({
  page = 1,
  limit = 10,
  status = 'All',
  date = 'This Month',
} = {}) => {
  const params = { page, limit };
  if (status) params.status = status;
  if (date) params.date = date;

  const response = await apiClient.get('/v1/orders/seller', { params });
  const payload = response?.data;
  const rawList = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : Array.isArray(response)
        ? response
        : [];

  return {
    items: rawList.map(normalizeSellerOrder).filter(Boolean),
    counts: payload?.counts || response?.counts || {
      All: rawList.length,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    },
    meta: payload?.meta || response?.meta || {
      currentPage: page,
      totalPages: 1,
      totalRecords: rawList.length,
      hasNext: false,
      hasPrevious: false,
    },
    message: response?.message || '',
  };
};

/**
 * Fetch single seller order details by ID.
 * GET /api/v1/orders/seller/{{order_id}}
 *
 * @param {string} orderId
 */
export const getSellerOrderDetailsApi = async (orderId) => {
  const cleanId = String(orderId || '').trim();
  const response = await apiClient.get(
    `/v1/orders/seller/${encodeURIComponent(cleanId)}`,
  );
  const data = response?.data ?? response;
  return normalizeSellerOrderDetail(data);
};

/**
 * Update a seller order status.
 * PUT /api/v1/orders/seller/{{order_id}}/status
 *
 * @param {string | { orderId: string, status: string }} orderIdOrPayload
 * @param {string} [maybeStatus]
 */
export const updateSellerOrderStatusApi = async (
  orderIdOrPayload,
  maybeStatus,
) => {
  let orderId;
  let status;

  if (typeof orderIdOrPayload === 'string') {
    orderId = orderIdOrPayload;
    status = maybeStatus;
  } else if (orderIdOrPayload && typeof orderIdOrPayload === 'object') {
    orderId = orderIdOrPayload.orderId || orderIdOrPayload.id;
    status = orderIdOrPayload.status;
  }

  if (!orderId) {
    throw new Error('Order ID is required to update order status');
  }

  const cleanId = String(orderId).trim();
  const normalizedStatus = String(status || '').toUpperCase();

  const response = await apiClient.put(
    `/v1/orders/seller/${encodeURIComponent(cleanId)}/status`,
    { status: normalizedStatus },
  );

  return response?.data ?? response;
};
