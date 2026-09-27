import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { EMAIL_REGEX } from '@/portals/auth/data/loginAssets';
import { ROUTES } from '@/shared/config';
import { loginApi } from '@/shared/api/auth.api';
import {
  getDashboardRouteByRole,
  getPortalByRole,
} from '@/shared/utils/roles';

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMeValue = watch('rememberMe');

  const goToDashboard = (userRole) => {
    const from = location.state?.from?.pathname;
    const portal = getPortalByRole(userRole);
    const destination =
      from && portal && from.startsWith(`${portal}/`)
        ? from
        : getDashboardRouteByRole(userRole);
    navigate(destination, { replace: true });
  };

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (response) => {
      const responseData = response?.data;
      const token =
        responseData?.data?.accessToken || responseData?.accessToken;
      const user = responseData?.data?.user || responseData?.user;

      if (!token || !user) {
        setGlobalError('Invalid response from server.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(loginSuccess({ user, token }));
      goToDashboard(user.role);
    },
    onError: (error) => {
      setGlobalError(
        error?.response?.data?.message ??
        error?.message ??
        t('login.invalidCredentials'),
      );
    },
  });

  const onSubmit = async (data) => {
    setGlobalError(null);
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: loginMutation.isPending,
    globalError,
    rememberMeValue,
    t,
    EMAIL_REGEX,
  };
}
