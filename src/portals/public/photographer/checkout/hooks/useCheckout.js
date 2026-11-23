import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/app/store/slices/authSlice';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  captureStoreProductPurchaseApi,
  createStoreProductCheckoutApi,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';
import {
  ALL_COUNTRIES,
  findCountryByNameOrCode,
  getCitiesForCountry,
  getStatesForCountry,
} from '@/shared/utils/locationData';

const PENDING_STORE_PURCHASE_KEY = 'pendingStoreProductPurchase';

const photographerStorePath = (username) => {
  const handle = String(username || '')
    .trim()
    .replace(/^@/, '');
  if (!handle) return ROUTES.MARKETPLACE;
  return `/photographer/${encodeURIComponent(handle)}?tab=store`;
};

const resolveSellerUsername = (product, locationState) => {
  const candidates = [
    locationState?.username,
    product?.username,
    product?.user?.username,
    product?.sellerUsername,
    product?.ownerUsername,
  ];
  for (const value of candidates) {
    const handle = String(value || '')
      .trim()
      .replace(/^@/, '');
    if (handle) return handle;
  }
  return '';
};

const readPendingPurchase = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_STORE_PURCHASE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const clearPendingPurchase = () => {
  sessionStorage.removeItem(PENDING_STORE_PURCHASE_KEY);
};

const countriesMatch = (a, b) => {
  const left = findCountryByNameOrCode(a);
  const right = findCountryByNameOrCode(b);
  if (left?.isoCode && right?.isoCode) {
    return left.isoCode.toUpperCase() === right.isoCode.toUpperCase();
  }
  return String(a || '')
    .trim()
    .toLowerCase() ===
    String(b || '')
      .trim()
      .toLowerCase();
};

export function useCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [submitting, setSubmitting] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const captureStartedRef = useRef(false);

  const pendingPurchase = useMemo(() => readPendingPurchase(), []);
  const product = location.state?.product || pendingPurchase?.product || null;
  const sellerUsername = resolveSellerUsername(
    product,
    location.state || pendingPurchase,
  );
  const returnToStorePath =
    pendingPurchase?.returnToStorePath || photographerStorePath(sellerUsername);

  const isDomesticOnly =
    String(product?.shippingScope || '').toUpperCase() === 'NATIONAL';
  const domesticCountry = useMemo(() => {
    if (!isDomesticOnly) return null;
    return findCountryByNameOrCode(product?.country) || null;
  }, [isDomesticOnly, product?.country]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      mobile: user?.mobile || user?.phone || '',
      country: domesticCountry?.value || product?.country || '',
      state: '',
      city: '',
      zip: '',
      address: '',
      agreeTerms: false,
    },
  });

  useEffect(() => {
    if (!domesticCountry?.value) return;
    setValue('country', domesticCountry.value, {
      shouldDirty: false,
      shouldValidate: true,
    });
    setValue('state', '', { shouldDirty: false });
    setValue('city', '', { shouldDirty: false });
  }, [domesticCountry?.value, setValue]);

  // Fresh checkout visit (has cart product, no PayPal return token):
  // drop any stale pending payment so we don't restore an old order.
  useEffect(() => {
    const returning =
      searchParams.get('token') ||
      searchParams.get('paymentId') ||
      searchParams.get('cancelled');
    if (location.state?.product && !returning) {
      clearPendingPurchase();
    }
  }, [location.state?.product, searchParams]);

  // Capture PayPal ONLY after return (token/paymentId must be in the URL).
  // Never capture from sessionStorage alone — that hits unapproved orders and
  // PayPal returns "semantically incorrect / failed business validation".
  useEffect(() => {
    const cancelled = searchParams.get('cancelled');
    if (cancelled) {
      clearPendingPurchase();
      toast.error('PayPal checkout was cancelled.');
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('cancelled');
          next.delete('token');
          next.delete('paymentId');
          next.delete('PayerID');
          return next;
        },
        { replace: true },
      );
      return;
    }

    const paymentIdFromUrl =
      searchParams.get('paymentId') || searchParams.get('token');
    if (!paymentIdFromUrl || captureStartedRef.current) return;

    const pending = readPendingPurchase();
    captureStartedRef.current = true;
    setCapturing(true);

    (async () => {
      try {
        await captureStoreProductPurchaseApi({ paymentId: paymentIdFromUrl });
        clearPendingPurchase();
        toast.success('Payment successful — order placed!');
        navigate(pending?.returnToStorePath || returnToStorePath, {
          replace: true,
        });
      } catch (err) {
        clearPendingPurchase();
        toast.error(
          getApiErrorMessage(
            err,
            'Payment capture failed. If you were charged, contact support.',
          ),
        );
      } finally {
        setCapturing(false);
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('token');
            next.delete('paymentId');
            next.delete('PayerID');
            return next;
          },
          { replace: true },
        );
      }
    })();
  }, [searchParams, setSearchParams, navigate, returnToStorePath]);

  const countryValue = watch('country') || '';
  const stateValue = watch('state') || '';
  const cityValue = watch('city') || '';

  const selectedCountry = useMemo(
    () => findCountryByNameOrCode(countryValue),
    [countryValue],
  );

  const countryOptions = useMemo(() => {
    if (isDomesticOnly && domesticCountry) return [domesticCountry];
    return ALL_COUNTRIES;
  }, [isDomesticOnly, domesticCountry]);

  const stateOptions = useMemo(
    () =>
      selectedCountry ? getStatesForCountry(selectedCountry.isoCode) : [],
    [selectedCountry],
  );

  const selectedState = useMemo(
    () =>
      stateOptions.find(
        (s) =>
          s.value === stateValue ||
          s.label === stateValue ||
          s.isoCode === stateValue,
      ) || null,
    [stateOptions, stateValue],
  );

  const cityOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return getCitiesForCountry(
      selectedCountry.isoCode,
      selectedState?.isoCode || undefined,
    );
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (val) => {
    if (isDomesticOnly && domesticCountry) {
      setValue('country', domesticCountry.value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }
    setValue('country', val, { shouldDirty: true, shouldValidate: true });
    setValue('state', '', { shouldDirty: true });
    setValue('city', '', { shouldDirty: true });
  };

  const handleStateChange = (val) => {
    setValue('state', val, { shouldDirty: true, shouldValidate: true });
    setValue('city', '', { shouldDirty: true });
  };

  const handleCityChange = (val) => {
    setValue('city', val, { shouldDirty: true, shouldValidate: true });
  };

  const cartItems = product ? [{ ...product, qty: product.qty || 1 }] : [];

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      parseFloat(String(item.price || '').replace(/[^0-9.]/g, '') || '0') *
        item.qty,
    0,
  );
  const delivery = 0;
  const total = subtotal + delivery;

  const onSubmit = async (data) => {
    if (!product?.id) {
      toast.error('Missing product. Please go back and try again.');
      return;
    }

    if (!data.agreeTerms) {
      toast.error('Please agree to the terms to place your order.');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to complete PayPal checkout.');
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    if (isDomesticOnly) {
      if (!domesticCountry && !product?.country) {
        toast.error(
          'This product is domestic-only, but the seller has not set a country.',
        );
        return;
      }
      const allowed = product?.country || domesticCountry?.value;
      if (!countriesMatch(data.country, allowed)) {
        toast.error(
          `This product ships only within ${allowed}. International delivery is not available.`,
        );
        return;
      }
    }

    const fullName = [data.firstName, data.lastName]
      .map((part) => String(part || '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();
    const email = String(user?.email || '').trim();
    if (!email) {
      toast.error('Your account needs an email address to pay with PayPal.');
      return;
    }
    if (!fullName) {
      toast.error('Please enter your name.');
      return;
    }

    setSubmitting(true);
    clearPendingPurchase();
    try {
      const response = await createStoreProductCheckoutApi(product.id, {
        email,
        fullName,
        mobile: data.mobile,
        country: data.country,
        city: data.city,
        state: data.state || data.city,
        zipCode: data.zip,
        deliveryAddress: data.address,
        quantity: Number(product.qty) > 0 ? Number(product.qty) : 1,
        size: product.sizeId || product.size || undefined,
      });

      const resData = response?.data || response;
      const approvalUrl =
        resData?.approvalUrl ||
        resData?.checkoutUrl ||
        resData?.redirectUrl ||
        null;
      const paymentId = resData?.paymentId || resData?.id || null;

      if (!approvalUrl) {
        toast.error('PayPal checkout URL was not returned. Please try again.');
        return;
      }

      sessionStorage.setItem(
        PENDING_STORE_PURCHASE_KEY,
        JSON.stringify({
          paymentId,
          product,
          username: sellerUsername,
          returnToStorePath,
        }),
      );

      toast.loading('Redirecting to PayPal checkout...', { duration: 2500 });
      window.location.assign(approvalUrl);
    } catch (err) {
      clearPendingPurchase();
      toast.error(
        getApiErrorMessage(
          err,
          'Failed to start PayPal checkout. Please try again.',
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (val) => `$${Number(val || 0).toFixed(2)}`;

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
    countryValue,
    stateValue,
    cityValue,
    countryOptions,
    stateOptions,
    cityOptions,
    selectedCountry,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    returnToStorePath,
    sellerUsername,
    submitting,
    capturing,
    isDomesticOnly,
    domesticCountry,
    isCountryLocked: Boolean(isDomesticOnly && domesticCountry),
  };
}
