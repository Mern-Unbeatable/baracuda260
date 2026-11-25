import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/app/store/slices/authSlice';
import { EMAIL_REGEX } from '@/portals/auth/data/loginAssets';
import { getApiErrorMessage } from '@/shared/api/client';
import { createBuyPremiumPhotoCheckoutApi } from '@/shared/api/premiumPhotos.api';
import { ROUTES } from '@/shared/config';
import { saveLastBuyPurchase } from '@/shared/data/buyPhotos';

const resolveAccountName = (user) => {
  if (!user) return '';
  return (
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.username ||
    ''
  );
};

export function useBuyPhotosCheckout(photo) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [submitting, setSubmitting] = useState(false);

  const accountDefaults = useMemo(
    () => ({
      fullName: resolveAccountName(user),
      email: user?.email || '',
    }),
    [user],
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: accountDefaults.fullName,
      email: accountDefaults.email,
      paymentMethod: 'paypal',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    reset({
      fullName: accountDefaults.fullName,
      email: accountDefaults.email,
      paymentMethod: 'paypal',
    });
  }, [isAuthenticated, accountDefaults, reset]);

  const paymentMethodValue = watch('paymentMethod');

  const onSubmit = async (data) => {
    if (!photo?.id) return;
    setSubmitting(true);

    try {
      const fullName = (
        data.fullName ||
        accountDefaults.fullName ||
        ''
      ).trim();
      const email = (data.email || accountDefaults.email || '').trim();

      const response = await createBuyPremiumPhotoCheckoutApi(photo.id, {
        email,
        fullName,
      });

      const resData = response?.data || response;
      const approvalUrl =
        resData?.approvalUrl || resData?.checkoutUrl || resData?.redirectUrl;
      const paymentId = resData?.paymentId || resData?.id;
      const orderId = resData?.orderId;

      const purchaseRecord = {
        id:
          orderId ||
          `TXN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        orderId,
        paymentId,
        photoId: photo.id,
        title: photo.title,
        image: photo.image,
        photographer: photo.photographer,
        price: photo.price,
        priceAmount: photo.priceAmount,
        buyerName: fullName || t('buyPhotos.checkout.defaultBuyerName'),
        buyerEmail: email || t('buyPhotos.checkout.defaultBuyerEmail'),
        paymentMethod: 'PayPal',
        license: photo.license || 'Standard Commercial License (Royalty Free)',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      saveLastBuyPurchase(purchaseRecord);
      if (paymentId) {
        sessionStorage.setItem('pendingBuyPhotoPaymentId', paymentId);
      }

      if (approvalUrl) {
        toast.loading(
          t(
            'buyPhotos.checkout.redirecting',
            'Redirecting to PayPal checkout...',
          ),
          { duration: 2500 },
        );
        window.location.href = approvalUrl;
      } else {
        navigate(ROUTES.BUY_PHOTOS_SUCCESS, {
          state: { purchase: purchaseRecord },
        });
      }
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'buyPhotos.checkout.error',
            'Failed to initiate checkout. Please try again.',
          ),
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    paymentMethodValue,
    submitting,
    isAuthenticated,
    accountDefaults,
    t,
    EMAIL_REGEX,
  };
}
