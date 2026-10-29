import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EMAIL_REGEX } from '@/portals/auth/data/loginAssets';
import { getApiErrorMessage } from '@/shared/api/client';
import { createBuyPremiumPhotoCheckoutApi } from '@/shared/api/premiumPhotos.api';
import { ROUTES } from '@/shared/config';
import {
  createBuyPurchaseRecord,
  saveLastBuyPurchase,
} from '@/shared/data/buyPhotos';

export function useBuyPhotosCheckout(photo) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      paymentMethod: 'paypal',
    },
  });

  const paymentMethodValue = watch('paymentMethod');

  const onSubmit = async (data) => {
    if (!photo?.id) return;
    setSubmitting(true);

    try {
      const response = await createBuyPremiumPhotoCheckoutApi(photo.id, {
        email: data.email.trim(),
        fullName: data.fullName.trim(),
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
        buyerName:
          data.fullName.trim() || t('buyPhotos.checkout.defaultBuyerName'),
        buyerEmail:
          data.email.trim() || t('buyPhotos.checkout.defaultBuyerEmail'),
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
    t,
    EMAIL_REGEX,
  };
}
