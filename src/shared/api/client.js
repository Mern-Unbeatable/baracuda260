import axios from 'axios';
import { API_CONFIG } from '@/shared/config';
import i18n, { DEFAULT_LOCALE } from '@/shared/i18n/i18n';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const getErrorDetails = (details) =>
  (Array.isArray(details) ? details : [])
    .map((detail) =>
      typeof detail === 'string' ? detail : detail?.message || '',
    )
    .filter(Boolean)
    .join('\n');

export const getApiErrorMessage = (error, fallback) =>
  getErrorDetails(error?.response?.data?.details) ||
  (error?.response?.data?.error ??
    error?.response?.data?.message ??
    error?.message ??
    fallback);

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
      config.headers['Accept-Language'] =
        i18n.resolvedLanguage || i18n.language || DEFAULT_LOCALE;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API returned 401 Unauthorized. Clearing token.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);
