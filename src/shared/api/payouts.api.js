import { apiClient } from './client';

export const ADMIN_PAYOUTS_QUERY_KEY = ['admin-payouts'];

const PAYOUT_TAB_ENDPOINTS = {
  prize: '/v1/payments/admin/payouts/prize-money',
  donation: '/v1/payments/admin/payouts/donations',
  premium: '/v1/payments/admin/payouts/photo-sales',
  store: '/v1/payments/admin/payouts/store-sales',
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
};

const parseAmount = (amount) => {
  if (amount == null) return 0;
  if (typeof amount === 'number') return amount;
  if (typeof amount === 'string') {
    const num = parseFloat(amount.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? 0 : num;
  }
  if (typeof amount === 'object') {
    if (typeof amount.toNumber === 'function') {
      try {
        return amount.toNumber();
      } catch {
        // ignore
      }
    }
    if (Array.isArray(amount.d) && typeof amount.e === 'number') {
      const sign = amount.s ?? 1;
      const digitsStr = amount.d.join('');
      const num = sign * Number(digitsStr) * Math.pow(10, amount.e - digitsStr.length + 1);
      if (!isNaN(num)) return num;
    }
    if (typeof amount.value === 'number') return amount.value;
  }
  return 0;
};

const formatAmount = (amount, currency = 'GBP') => {
  const num = parseAmount(amount);
  const symbol = currency === 'GBP' || currency === '£' ? '£' : '$';
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const normalizeStatus = (raw) => {
  if (!raw) return 'pending';
  const s = String(raw).toLowerCase();
  if (s === 'appoved' || s === 'approved') return 'approved';
  return s;
};

/**
 * Fetch payouts by tab: prize-money, donations, photo-sales, store
 * @param {{ tab: 'prize' | 'donation' | 'premium' | 'store', page?: number, limit?: number }} params
 */
export const getAdminPayoutsApi = async ({ tab = 'prize', page = 1, limit = 10 } = {}) => {
  const endpoint = PAYOUT_TAB_ENDPOINTS[tab] || PAYOUT_TAB_ENDPOINTS.prize;
  const response = await apiClient.get(endpoint, {
    params: { page, limit },
  });

  const payload = response?.data || response;
  // Multi-tier array extraction ensuring no shape gets dropped
  let rawList = [];
  if (Array.isArray(response)) {
    rawList = response;
  } else if (Array.isArray(response?.data?.data)) {
    rawList = response.data.data;
  } else if (Array.isArray(response?.data)) {
    rawList = response.data;
  } else if (Array.isArray(payload?.data?.data)) {
    rawList = payload.data.data;
  } else if (Array.isArray(payload?.data)) {
    rawList = payload.data;
  } else if (Array.isArray(payload)) {
    rawList = payload;
  }

  const meta = response?.data?.meta || payload?.meta || response?.meta || {};

  const rows = rawList.map((item) => {
    const rawStatus = normalizeStatus(item.status);
    const itemDate = item.date || item.createdAt || item.updatedAt;

    return {
      id: item.id,
      date: itemDate,
      dateFormatted: formatDate(itemDate),
      type:
        item.type ||
        (item.kind
          ? item.kind.charAt(0).toUpperCase() + item.kind.slice(1).toLowerCase()
          : 'Withdrawal'),
      accountType: item.accountType || 'PayPal',
      accountNumber: item.accountNumber || item.user?.email || '—',
      amount: formatAmount(item.amount, item.currency),
      amountRaw: item.amount,
      status: rawStatus,
      rawStatus: item.status,
      user: item.user || null,
      raw: item,
    };
  });

  return {
    rows,
    meta: {
      currentPage: meta.currentPage ?? page,
      totalPages: meta.totalPages ?? 1,
      totalRecords: meta.totalRecords ?? rows.length,
      hasNext: Boolean(meta.hasNext),
      hasPrevious: Boolean(meta.hasPrevious),
    },
  };
};

/**
 * Update payout status: PATCH /v1/payments/admin/payouts/:id/status
 * @param {string} payoutId
 * @param {'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | string} status
 */
export const updateAdminPayoutStatusApi = async (payoutId, status) => {
  const upper = String(status || '').toUpperCase();
  const response = await apiClient.patch(
    `/v1/payments/admin/payouts/${payoutId}/status`,
    {
      status: upper,
    },
  );
  return response?.data || response;
};
