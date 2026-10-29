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
