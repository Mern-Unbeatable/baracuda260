import { apiClient } from './client';

/**
 * Initiate an artwork donation.
 * Endpoint: POST /v1/payments/donate
 *
 * @param {{
 *   submissionId: string,
 *   amount: number,
 *   donorName: string,
 *   donorEmail: string,
 *   type?: 'ONE_TIME' | 'MONTHLY',
 *   message?: string
 * }} payload
 */
export const createDonationPaymentApi = async ({
  submissionId,
  amount,
  donorName,
  donorEmail,
  type = 'ONE_TIME',
  message = '',
}) => {
  if (!submissionId) throw new Error('Artwork submission ID is required');
  if (!amount || Number(amount) <= 0) {
    throw new Error('Valid donation amount is required');
  }
  if (!donorName) throw new Error('Donor name is required');
  if (!donorEmail) throw new Error('Donor email is required');

  const normalizedType = String(type).toUpperCase().includes('MONTH')
    ? 'MONTHLY'
    : 'ONE_TIME';

  const response = await apiClient.post('/v1/payments/donate', {
    submissionId,
    amount: Number(amount),
    donorName: donorName.trim(),
    donorEmail: donorEmail.trim(),
    type: normalizedType,
    message: message || '',
  });

  return response?.data !== undefined ? response.data : response;
};

/**
 * Capture an approved donation payment.
 * Endpoint: POST /v1/payments/donate/capture
 *
 * @param {{ paymentId: string }} payload
 */
export const captureDonationPaymentApi = async ({ paymentId }) => {
  if (!paymentId) throw new Error('Payment ID is required');

  const response = await apiClient.post('/v1/payments/donate/capture', {
    paymentId,
  });

  return response?.data !== undefined ? response.data : response;
};

export const USER_PRIZE_MONEY_QUERY_KEY = ['user-prize-money'];
export const USER_DONATIONS_QUERY_KEY = ['user-donations'];

/**
 * Format prize or donation amounts cleanly with currency prefix.
 * @param {number | string} amount
 * @param {string} [fallback]
 * @returns {string}
 */
export const formatPrizeAmount = (amount, fallback = '$0.00') => {
  if (amount == null || amount === '') return fallback;
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Fetch authenticated user's prize money details & competition winning history.
 * Endpoint: GET /v1/payments/user/prize-money
 *
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{
 *   stats: {
 *     totalPrizeMoney: number,
 *     available: number,
 *     pending: number,
 *     paidOut: number,
 *   },
 *   list: {
 *     data: Array<{
 *       id: string,
 *       month: string,
 *       monthName: string,
 *       competitionName: string,
 *       category: string,
 *       albumType: string,
 *       position: string,
 *       totalVote: number,
 *       prizeMoney: number,
 *     }>,
 *     meta: {
 *       currentPage: number,
 *       totalPages: number,
 *       totalRecords: number,
 *       hasNext: boolean,
 *       hasPrevious: boolean,
 *     }
 *   }
 * }>}
 */
export const getUserPrizeMoneyApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/payments/user/prize-money', {
    params: { page, limit },
  });
  return response?.data !== undefined ? response.data : response;
};

/**
 * Fetch authenticated user's received donations & transactions.
 * Endpoint: GET /v1/payments/user/donations
 *
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{
 *   stats: {
 *     totalDonations: number,
 *     platformFee: number,
 *     yourEarnings: number,
 *     available: number,
 *     pending: number,
 *     paidOut: number,
 *   },
 *   list: {
 *     data: Array<{
 *       id: string,
 *       date: string,
 *       donorName: string,
 *       email: string,
 *       donation: number,
 *       platformFee: number,
 *       yourEarnings: number,
 *     }>,
 *     meta: {
 *       currentPage: number,
 *       totalPages: number,
 *       totalRecords: number,
 *       hasNext: boolean,
 *       hasPrevious: boolean,
 *     }
 *   }
 * }>}
 */
export const getUserDonationsApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/payments/user/donations', {
    params: { page, limit },
  });
  return response?.data !== undefined ? response.data : response;
};

export const USER_PHOTO_SALES_QUERY_KEY = ['user-photo-sales'];
export const USER_PAYMENT_HISTORY_QUERY_KEY = ['user-payment-history'];

/**
 * Fetch authenticated user's photo sales and earnings stats.
 * Endpoint: GET /v1/payments/user/photo-sales
 *
 * @param {{ page?: number, limit?: number, search?: string }} [params]
 * @returns {Promise<{
 *   stats: {
 *     totalSales: number,
 *     photosSold: number,
 *     platformFee: number,
 *     yourEarnings: number,
 *     available: number,
 *     pending: number,
 *     paidOut: number,
 *   },
 *   list: {
 *     data: Array<{
 *       id: string,
 *       date: string,
 *       buyer: string,
 *       email: string,
 *       premiumPhotoId: string,
 *       photo: string,
 *       photoUrl: string,
 *       salePrice: number,
 *       yourEarnings: number,
 *     }>,
 *     meta: {
 *       currentPage: number,
 *       totalPages: number,
 *       totalRecords: number,
 *       hasNext: boolean,
 *       hasPrevious: boolean,
 *     }
 *   }
 * }>}
 */
export const getUserPhotoSalesApi = async ({
  page = 1,
  limit = 10,
  search = '',
} = {}) => {
  const params = { page, limit };
  if (search?.trim()) params.search = search.trim();

  const response = await apiClient.get('/v1/payments/user/photo-sales', {
    params,
  });
  return response?.data !== undefined ? response.data : response;
};

/**
 * Exports user photo sales history as CSV.
 * Endpoint: GET /v1/payments/user/photo-sales/export?search=
 *
 * @param {{ search?: string }} [params]
 */
export const exportUserPhotoSalesCsvApi = async ({ search = '' } = {}) => {
  const params = {};
  if (search?.trim()) params.search = search.trim();

  const response = await apiClient.get('/v1/payments/user/photo-sales/export', {
    params,
    responseType: 'blob',
  });

  const blob =
    response instanceof Blob
      ? response
      : new Blob([response], { type: 'text/csv' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `photo-sales-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Fetch authenticated user's withdrawal and payout payment history.
 * Endpoint: GET /v1/payments/user/history
 *
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{
 *   data: Array<{
 *     id: string,
 *     date: string,
 *     type: string,
 *     payoutKind: string,
 *     accountType: string,
 *     accountNumber: string,
 *     amount: number,
 *     status: string,
 *   }>,
 *   meta: {
 *     currentPage: number,
 *     totalPages: number,
 *     totalRecords: number,
 *     hasNext: boolean,
 *     hasPrevious: boolean,
 *   }
 * }>}
 */
export const getUserPaymentHistoryApi = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const response = await apiClient.get('/v1/payments/user/history', {
    params: { page, limit },
  });
  return response?.data !== undefined ? response.data : response;
};

export const USER_STORE_SALES_QUERY_KEY = ['user-store-sales'];

/**
 * Fetch authenticated user's store sales and product earning stats.
 * Endpoint: GET /v1/payments/user/store-sales
 *
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{
 *   stats: {
 *     totalSales: number,
 *     itemsSold: number,
 *     platformFee: number,
 *     yourEarnings: number,
 *     paidOut: number,
 *     pending: number,
 *     available: number,
 *   },
 *   list: {
 *     data: Array<{
 *       id: string,
 *       date: string,
 *       buyer: string,
 *       email: string,
 *       productId: string,
 *       photo: string,
 *       photoUrl: string,
 *       quantity: number,
 *       salePrice: number,
 *       yourEarnings: number,
 *     }>,
 *     meta: {
 *       currentPage: number,
 *       totalPages: number,
 *       totalRecords: number,
 *       hasNext: boolean,
 *       hasPrevious: boolean,
 *     }
 *   }
 * }>}
 */
export const getUserStoreSalesApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await apiClient.get('/v1/payments/user/store-sales', {
    params: { page, limit },
  });
  return response?.data !== undefined ? response.data : response;
};

/**
 * Exports user store sales history as CSV.
 * Endpoint: GET /v1/payments/user/store-sales/export
 */
export const exportUserStoreSalesCsvApi = async () => {
  const response = await apiClient.get('/v1/payments/user/store-sales/export', {
    responseType: 'blob',
  });

  const blob =
    response instanceof Blob
      ? response
      : new Blob([response], { type: 'text/csv' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `store-sales-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Request a payout withdrawal for authenticated user.
 * Endpoint: POST /v1/payments/user/request-payout
 *
 * @param {{
 *   type: string,
 *   amount: number,
 *   accountNumber: string,
 * }} payload
 */
export const requestUserPayoutApi = async ({ type, amount, accountNumber }) => {
  if (!type) throw new Error('Payout type is required');
  if (amount == null || Number(amount) <= 0) {
    throw new Error('Valid payout amount is required');
  }
  if (!accountNumber?.trim()) {
    throw new Error('Account number or payment details are required');
  }

  const response = await apiClient.post('/v1/payments/user/request-payout', {
    type,
    amount: Number(amount),
    accountNumber: accountNumber.trim(),
  });

  return response?.data !== undefined ? response.data : response;
};
