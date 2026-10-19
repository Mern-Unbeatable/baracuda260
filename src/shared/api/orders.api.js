import { apiClient } from './client';

export const BUYER_ORDERS_QUERY_KEY = ['buyer-orders'];
export const BUYER_ORDER_STATUS_CARD_QUERY_KEY = ['buyer-order-status-card'];
export const BUYER_ORDER_DETAILS_QUERY_KEY = (orderId) => [
  'buyer-order-details',
  String(orderId || ''),
];

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
