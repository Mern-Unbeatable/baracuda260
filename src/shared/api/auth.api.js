import { apiClient } from './client';

export const loginApi = async (credentials) => {
  const response = await apiClient.post('/v1/auth/login', credentials);
  return response;
};

export const registerApi = async (formData) => {
  const response = await apiClient.post('/v1/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const forgotPasswordApi = async (email) => {
  const response = await apiClient.post('/v1/auth/forgot-password', { email });
  return response;
};

export const verifyOtpApi = async (payload) => {
  // payload: { email, otp }
  const response = await apiClient.post('/v1/auth/verify-otp', payload);
  return response;
};

export const resetPasswordApi = async (payload) => {
  // payload: { token, newPassword }
  const response = await apiClient.post('/v1/auth/reset-password', payload);
  return response;
};
