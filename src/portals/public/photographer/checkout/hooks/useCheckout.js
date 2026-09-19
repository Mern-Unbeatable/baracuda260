import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES } from '@/shared/config';

export function useCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      mobile: '',
      city: '',
      state: '',
      zip: '',
      address: '',
      agreeTerms: false,
    },
  });

  const cartItems = product ? [{ ...product, qty: product.qty || 1 }] : [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.qty,
    0,
  );
  const delivery = 20.0;
  const total = subtotal + delivery;

  const onSubmit = (data) => {
    if (!data.agreeTerms) {
      toast.error('Please agree to the terms to place your order.');
      return;
    }
    toast.success('Order placed successfully!');
    navigate(ROUTES.PHOTOGRAPHER_PROFILE, { state: { tab: 'store' } });
  };

  const formatPrice = (val) => `$${val.toFixed(2)}`;

  return {
    product,
    cartItems,
    subtotal,
    delivery,
    total,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    formatPrice,
  };
}
