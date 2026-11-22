import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Pencil, RefreshCw } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { publicStoreProductPath } from '@/portals/member/data/myStoreData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  getStoreProductDetailsApi,
  STORE_PRODUCTS_QUERY_KEY,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';

const MyStoreDetailContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  const listFallback = useMemo(() => {
    const raw = location.state?.product;
    if (!raw || String(raw.id) !== String(id)) return null;
    return raw;
  }, [id, location.state]);

  const {
    data: apiDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [STORE_PRODUCTS_QUERY_KEY, 'detail', id],
    queryFn: () => getStoreProductDetailsApi(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    retry: 1,
  });

  const product = apiDetail || listFallback;

  const isOwner = useMemo(() => {
    if (!product || !currentUser?.id) return false;
    const ownerId = product.userId || product.user?.id;
    return Boolean(ownerId && String(ownerId) === String(currentUser.id));
  }, [product, currentUser]);

  // Non-owners must use the public photographer product view (no edit/delete).
  useEffect(() => {
    if (!product || isLoading) return;
    if (!currentUser) return;
    if (isOwner) return;
    const username = product.username || product.user?.username;
    navigate(publicStoreProductPath(username, product.id), { replace: true });
  }, [product, isOwner, isLoading, currentUser, navigate]);
  const gallery = useMemo(() => {
    if (!product) return [];
    const images = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];
    if (images.length) return images;
    return product.image ? [product.image] : [];
  }, [product]);

  const [activeImage, setActiveImage] = useState(null);
  const displayImage = activeImage || gallery[0] || product?.image || '';

  const backFrom = location.state?.from;
  const backFromPrizePayments =
    typeof backFrom === 'string' &&
    backFrom.startsWith(ROUTES.USER_PRIZE_PAYMENTS);

  const handleBack = () => {
    if (backFrom) {
      navigate(backFrom);
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(ROUTES.USER_MY_STORE);
  };

  if (isLoading && !product) {
    return (
      <div className="mx-auto flex w-full max-w-395 flex-col items-center justify-center py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4048cd] border-t-transparent" />
        <p className="mt-4 text-[16px] text-[#494453]">
          {t('common.loading', 'Loading details...')}
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex w-full max-w-395 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-[16px] font-medium text-[#494453]">
          {isError
            ? getApiErrorMessage(
                error,
                t('myStore.detail.notFound', 'Product not found.'),
              )
            : t('myStore.detail.notFound', 'Product not found.')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isError ? (
            <Button
              unstyled
              type="button"
              onClick={() => refetch()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#353cb0]"
            >
              <RefreshCw size={16} aria-hidden="true" />
              {t('common.retry', 'Retry')}
            </Button>
          ) : null}
          <Button
            unstyled
            type="button"
            onClick={handleBack}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#e4e4e4] bg-white px-4 py-2 text-[14px] font-semibold text-[#161c27] transition hover:bg-[#f6f7f9]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {backFromPrizePayments
              ? t(
                  'myStore.detail.backToPrizePayments',
                  'Back to Prize & Payments',
                )
              : t('myStore.detail.back', 'Back to My Store')}
          </Button>
        </div>
      </div>
    );
  }

  const editPath = ROUTES.USER_MY_STORE_EDIT.replace(':id', product.id);

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          unstyled
          type="button"
          onClick={handleBack}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#6b7280] transition hover:text-[#4048cd]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {backFromPrizePayments
            ? t(
                'myStore.detail.backToPrizePayments',
                'Back to Prize & Payments',
              )
            : t('myStore.detail.back', 'Back to My Store')}
        </Button>
        {isOwner ? (
          <Link
            to={editPath}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[50px] bg-[#4048cd] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#353cb0]"
          >
            <Pencil size={15} aria-hidden="true" />
            {t('myStore.actions.edit', 'Edit')}
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="overflow-hidden rounded-[14px] bg-[#f3f4f6]">
            <Image
              src={displayImage}
              alt={product.title}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {gallery.map((src) => (
                <Button
                  unstyled
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`overflow-hidden rounded-[10px] border-2 ${
                    displayImage === src
                      ? 'border-[#4048cd]'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <span className="inline-flex items-center rounded-md bg-[#3a3f4b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white">
            {t(product.badgeKey, product.category || 'Product')}
          </span>
          {product.promoted ? (
            <span className="ml-2 inline-flex items-center rounded-md bg-[#ee1c25] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white">
              {t('myStore.promoted', 'Promoted')}
            </span>
          ) : null}

          <h1 className="mt-3 text-[24px] font-bold leading-snug text-[#111827] sm:text-[28px]">
            {product.title}
          </h1>

          {product.description ? (
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-6 text-[#6b7280]">
              {product.description}
            </p>
          ) : null}

          <p className="mt-5 text-[28px] font-bold text-[#4048cd]">
            {product.price}
          </p>

          {(product.city || product.country || product.shippingScope) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[#6b7280]">
              {(product.city || product.country) && (
                <span className="inline-flex items-center gap-1 text-[#4b5563]">
                  <MapPin size={14} className="text-[#9ca3af]" aria-hidden="true" />
                  {[product.city, product.country].filter(Boolean).join(', ')}
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  product.shippingScope === 'NATIONAL'
                    ? 'bg-[#fff7ed] text-[#c2410c]'
                    : 'bg-[#ecfdf5] text-[#047857]'
                }`}
              >
                {product.shippingScope === 'NATIONAL'
                  ? t('myStore.shipping.nationalOnly', 'Domestic Only')
                  : t('myStore.shipping.worldwide', 'Worldwide')}
              </span>
            </div>
          )}

          {product.setEditionSize ? (
            <p className="mt-4 text-[13px] text-[#6b7280]">
              {t('myStore.detail.edition', 'Edition')}:{' '}
              <span className="font-semibold text-[#161c27]">
                {product.setEditionSize}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
});

MyStoreDetailContent.displayName = 'MyStoreDetailContent';

export default MyStoreDetailContent;
