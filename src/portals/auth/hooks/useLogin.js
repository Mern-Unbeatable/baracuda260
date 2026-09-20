import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { envVar } from '@/shared/config/env';
import { ROUTES } from '@/shared/config';
import { httpMethods } from '@/shared/lib/httpMethods';
import { API_ENDPOINTS } from '@/shared/lib/httpEndpoint';
import { DEMO_ACCOUNTS, DEMO_PASSWORD, getDemoAccount } from '@/portals/auth/data/demoAccounts';
import { EMAIL_REGEX } from '@/portals/auth/data/loginAssets';

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: envVar('DEV_DEFAULT_EMAIL', '') || DEMO_ACCOUNTS.admin.email,
      password: envVar('DEV_DEFAULT_PASSWORD', '') || DEMO_PASSWORD,
      rememberMe: false,
    },
  });

  const rememberMeValue = watch('rememberMe');

  const goToDashboard = () => {
    const destination = location.state?.from?.pathname ?? ROUTES.ADMIN_DASHBOARD;
    navigate(destination, { replace: true });
  };

  const completeDemoLogin = (account) => {
    dispatch(
      loginSuccess({
        user: {
          email: account.email,
          fullName: account.fullName,
          role: account.role,
          rememberMe: rememberMeValue,
        },
        token: 'demo',
      }),
    );
    goToDashboard();
  };

  const handleDemoQuickLogin = (role) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;
    setGlobalError(null);
    setValue('email', account.email);
    setValue('password', DEMO_PASSWORD);
    // Directly submit since we bypass actual network in demo if found
    completeDemoLogin(account);
  };

  const onSubmit = async (data) => {
    setGlobalError(null);

    try {
      const demoAccount = getDemoAccount(data.email, data.password);
      if (demoAccount) {
        completeDemoLogin(demoAccount);
        return;
      }

      if (envVar('DEV_MOCK_AUTH') === 'true') {
        dispatch(
          loginSuccess({
            user: { email: data.email, rememberMe: data.rememberMe, role: 'user', fullName: data.email },
            token: null,
          }),
        );
        goToDashboard();
        return;
      }

      const { data: responseData, error } = await httpMethods.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (error) {
        setGlobalError(error?.data?.message ?? error?.message ?? t('login.invalidCredentials'));
        return;
      }

      const token = responseData?.token ?? responseData?.data?.token ?? responseData?.accessToken;
      const user = responseData?.user ?? responseData?.data?.user ?? null;
      dispatch(loginSuccess({ user, token }));
      goToDashboard();
    } catch (_err) {
      setGlobalError(t('login.invalidCredentials'));
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    globalError,
    handleDemoQuickLogin,
    rememberMeValue,
    t,
    EMAIL_REGEX,
  };
}
