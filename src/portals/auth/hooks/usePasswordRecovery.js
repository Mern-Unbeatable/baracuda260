import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from '@/shared/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config';

export function usePasswordRecovery() {
  const navigate = useNavigate();
  const [step, setStep] = useState('EMAIL'); // EMAIL | OTP | RESET | SUCCESS
  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const emailValue = watch('email');

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      setStep('OTP');
      setGlobalError(null);
    },
    onError: (error) => {
      setGlobalError(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message ??
          'Failed to send OTP. Please try again.',
      );
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (response) => {
      const resetToken = response?.data?.data?.resetToken;
      if (resetToken) {
        // We'll store it in sessionStorage temporarily to use in the next step
        sessionStorage.setItem('resetToken', resetToken);
        setStep('RESET');
        setGlobalError(null);
      } else {
        setGlobalError('Invalid response from server. Missing reset token.');
      }
    },
    onError: (error) => {
      setGlobalError(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message ??
          'Invalid OTP. Please try again.',
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      sessionStorage.removeItem('resetToken');
      setStep('SUCCESS');
      setGlobalError(null);
    },
    onError: (error) => {
      setGlobalError(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message ??
          'Failed to reset password. Please try again.',
      );
    },
  });

  const onSubmitEmail = (data) => {
    setGlobalError(null);
    forgotPasswordMutation.mutate(data.email);
  };

  const onSubmitOtp = (data) => {
    setGlobalError(null);
    verifyOtpMutation.mutate({ email: data.email, otp: data.otp });
  };

  const onSubmitReset = (data) => {
    setGlobalError(null);
    const token = sessionStorage.getItem('resetToken');
    if (!token) {
      setGlobalError(
        'Session expired. Please try recovering your password again.',
      );
      setStep('EMAIL');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setGlobalError('Passwords do not match.');
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: data.password,
    });
  };

  const isSubmitting =
    forgotPasswordMutation.isPending ||
    verifyOtpMutation.isPending ||
    resetPasswordMutation.isPending;

  return {
    step,
    globalError,
    isSubmitting,
    register,
    errors,
    emailValue,
    handlers: {
      submitEmail: handleSubmit(onSubmitEmail),
      submitOtp: handleSubmit(onSubmitOtp),
      submitReset: handleSubmit(onSubmitReset),
      goToLogin: () => navigate(ROUTES.LOGIN),
    },
  };
}
