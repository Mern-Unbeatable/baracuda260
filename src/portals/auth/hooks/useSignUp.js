import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { envVar } from '@/shared/config/env';
import { ROUTES } from '@/shared/config';
import { httpMethods } from '@/shared/lib/httpMethods';
import { API_ENDPOINTS } from '@/shared/lib/httpEndpoint';
import { EMAIL_REGEX } from '@/portals/auth/data/signupAssets';

export function useSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      country: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setGlobalError(null);

    const payload = {
      fullName: data.fullName.trim(),
      username: data.username.trim().replace(/^@/, ''),
      email: data.email.trim(),
      phone: data.phone.trim(),
      country: data.country.trim(),
      password: data.password,
    };

    try {
      if (envVar('DEV_MOCK_AUTH') === 'true') {
        dispatch(
          loginSuccess({
            user: {
              email: payload.email,
              fullName: payload.fullName,
              username: payload.username,
            },
            token: null,
          }),
        );
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        return;
      }

      const { data: responseData, error } = await httpMethods.post(API_ENDPOINTS.AUTH.REGISTER, payload);

      if (error) {
        setGlobalError(error?.data?.message ?? error?.message ?? t('signup.registerFailed'));
        return;
      }

      const token = responseData?.token ?? responseData?.data?.token ?? responseData?.accessToken;
      const user = responseData?.user ??
        responseData?.data?.user ?? {
          email: payload.email,
          fullName: payload.fullName,
          username: payload.username,
        };
      dispatch(loginSuccess({ user, token }));
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (_err) {
        setGlobalError(t('signup.registerFailed'));
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    globalError,
    t,
    EMAIL_REGEX,
  };
}
