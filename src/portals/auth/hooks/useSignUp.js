import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { EMAIL_REGEX } from '@/portals/auth/data/signupAssets';
import { ROUTES } from '@/shared/config';
import { envVar } from '@/shared/config/env';
import { registerApi } from '@/shared/api/auth.api';

export function useSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      country: '',
      about: '',
      socialLink: '',
      profilePhoto: null,
      coverPhoto: null,
      video: null,
      password: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (response) => {
      const responseData = response?.data;
      const user = responseData?.data;

      const token =
        responseData?.accessToken ?? responseData?.data?.accessToken;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(loginSuccess({ user, token }));
      }

      navigate(ROUTES.USER_DASHBOARD, { replace: true });
    },
    onError: (error) => {
      setGlobalError(
        error?.response?.data?.error ??
          error?.response?.data?.message ??
          error?.message ??
          t('signup.registerFailed'),
      );
    },
  });

  const onSubmit = async (data) => {
    setGlobalError(null);

    if (envVar('DEV_MOCK_AUTH') === 'true') {
      dispatch(
        loginSuccess({
          user: {
            email: data.email.trim(),
            fullName: data.fullName.trim(),
            username: data.username.trim().replace(/^@/, ''),
          },
          token: null,
        }),
      );
      navigate(ROUTES.USER_DASHBOARD, { replace: true });
      return;
    }

    const formData = new FormData();
    formData.append('name', data.fullName.trim());
    formData.append('username', data.username.trim().replace(/^@/, ''));
    formData.append('email', data.email.trim());
    formData.append('phone', data.phone.trim());
    formData.append('country', data.country.trim());
    formData.append('bio', data.about.trim());

    const socialLinksArray = data.socialLink ? [data.socialLink.trim()] : [];
    formData.append('socialLinks', JSON.stringify(socialLinksArray));
    formData.append('password', data.password);

    if (data.profilePhoto?.[0]) formData.append('avatar', data.profilePhoto[0]);
    if (data.coverPhoto?.[0]) formData.append('coverPhoto', data.coverPhoto[0]);
    if (data.video?.[0]) formData.append('introVideo', data.video[0]);

    registerMutation.mutate(formData);
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting: registerMutation.isPending,
    globalError,
    t,
    EMAIL_REGEX,
  };
}
