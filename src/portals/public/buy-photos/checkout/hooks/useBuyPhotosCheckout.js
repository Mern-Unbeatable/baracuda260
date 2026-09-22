import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EMAIL_REGEX } from '@/portals/auth/data/loginAssets';
import { ROUTES } from '@/shared/config';
import {
  createBuyPurchaseRecord,
  saveLastBuyPurchase,
} from '@/shared/data/buyPhotos';

export function useBuyPhotosCheckout(photo) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const onSubmit = (data) => {
    const purchase = createBuyPurchaseRecord({
      photo,
      buyerName:
        data.fullName.trim() || t('buyPhotos.checkout.defaultBuyerName'),
      buyerEmail:
        data.email.trim() || t('buyPhotos.checkout.defaultBuyerEmail'),
    });

    saveLastBuyPurchase(purchase);
    navigate(ROUTES.BUY_PHOTOS_SUCCESS, { state: { purchase } });
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    paymentMethodValue,
    t,
    EMAIL_REGEX,
  };
}
