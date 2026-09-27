import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '@/app/store/slices/authSlice';
import { EMAIL_REGEX } from '@/portals/auth/data/signupAssets';
import { registerApi } from '@/shared/api/auth.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import { envVar } from '@/shared/config/env';

/** Order matters: `username` must be tested before the bare `name` rule. */
const SERVER_ERROR_FIELDS = [
  [/social/i, 'socialLink'],
  [/avatar|profile photo/i, 'profilePhoto'],
  [/cover/i, 'coverPhoto'],
  [/video/i, 'video'],
  [/e-?mail/i, 'email'],
  [/username/i, 'username'],
  [/phone/i, 'phone'],
  [/password/i, 'password'],
  [/country/i, 'country'],
  [/\bbio\b|about/i, 'about'],
  [/\bname\b/i, 'fullName'],
];

const getServerErrorField = (message) =>
  SERVER_ERROR_FIELDS.find(([pattern]) => pattern.test(message))?.[1] ?? null;

/** The backend rejects links without a protocol, e.g. `www.facebook.com`. */
const normalizeUrl = (value) => {
  const url = value.trim();
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^\/+/, '')}`;
};

export function useSignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [globalError, setGlobalError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
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
      const details = error?.response?.data?.details;
      const messages =
        Array.isArray(details) && details.length > 0
          ? details.map((detail) =>
              typeof detail === 'string' ? detail : detail?.message || '',
            )
          : [getApiErrorMessage(error, t('signup.registerFailed'))];

      const fieldErrors = new Map();
      const unmatched = [];
      for (const message of messages.filter(Boolean)) {
        const field = getServerErrorField(message);
        if (field && !fieldErrors.has(field)) fieldErrors.set(field, message);
        else if (!field) unmatched.push(message);
      }

      let isFirst = true;
      for (const [field, message] of fieldErrors) {
        setError(
          field,
          { type: 'server', message },
          { shouldFocus: isFirst && unmatched.length === 0 },
        );
        isFirst = false;
      }

      setGlobalError(unmatched.length > 0 ? unmatched.join('\n') : null);
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

    const socialLink = normalizeUrl(data.socialLink ?? '');
    const socialLinksArray = socialLink ? [socialLink] : [];
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
