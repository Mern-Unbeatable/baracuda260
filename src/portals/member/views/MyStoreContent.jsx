import { Loader2, Plus, RefreshCw, Store } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberStoreProductCard from '@/components/data-display/MemberStoreProductCard/MemberStoreProductCard';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import Button from '@/components/ui/Button';
import {
  MY_STORE_CATEGORIES,
  MY_STORE_PAGE_SIZE,
} from '@/portals/member/data/myStoreData';
import useStoreProducts from '@/portals/member/hooks/useStoreProducts';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  captureStoreProductPromotionPaymentApi,
  promoteStoreProductApi,
  STORE_PRODUCTS_QUERY_KEY,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';

const MyStoreContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const capturedPaymentIdRef = useRef(null);

  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [promoteItem, setPromoteItem] = useState(null);

  const {
    products,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    deleteProduct,
  } = useStoreProducts({
    category,
    page,
    limit: MY_STORE_PAGE_SIZE,
  });

  // Promote mutation (POST /v1/store/:id/promote)
  const promoteMutation = useMutation({
    mutationFn: ({ productId, durationDays }) =>
      promoteStoreProductApi(productId, { durationDays }),
    onSuccess: (response) => {
      const resData = response?.data || response;
      const approvalUrl =
        resData?.approvalUrl ||
        resData?.checkoutUrl ||
        resData?.redirectUrl ||
        resData?.url;
      const paymentId = resData?.paymentId || resData?.id;

      if (paymentId) {
        sessionStorage.setItem('pendingStorePromotionPaymentId', paymentId);
      }

      if (approvalUrl) {
        toast.loading(
          t('myStore.promote.redirecting', 'Redirecting to PayPal checkout...'),
          { duration: 2500 },
        );
        window.location.href = approvalUrl;
      } else {
        toast.success(
          response?.message ||
            t('myStore.promote.started', 'Promotion checkout initiated.'),
        );
        setPromoteItem(null);
      }
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'myStore.promote.error',
            'Failed to initiate promotion. Please try again.',
          ),
        ),
      );
    },
  });

  // Capture promotion mutation (POST /v1/store/promote/capture)
  const capturePromotionMutation = useMutation({
    mutationFn: (paymentId) =>
      captureStoreProductPromotionPaymentApi({ paymentId }),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          t('myStore.promote.success', 'Product promoted successfully!'),
      );
      queryClient.invalidateQueries({
        queryKey: [STORE_PRODUCTS_QUERY_KEY],
      });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'myStore.promote.captureError',
            'Failed to capture promotion payment.',
          ),
        ),
      );
    },
  });

  // Handle return from PayPal checkout
  useEffect(() => {
    const paymentIdFromUrl =
      searchParams.get('paymentId') ||
      searchParams.get('token') ||
      searchParams.get('session_id') ||
      searchParams.get('sessionId');
    const paymentIdFromSession = sessionStorage.getItem(
      'pendingStorePromotionPaymentId',
    );
    const paymentId = paymentIdFromUrl || paymentIdFromSession;

    if (searchParams.get('cancel') || searchParams.get('cancelled')) {
      sessionStorage.removeItem('pendingStorePromotionPaymentId');
      toast.info(t('myStore.promote.cancelled', 'Promotion was cancelled.'));
      navigate(ROUTES.USER_MY_STORE, { replace: true });
      return;
    }

    if (paymentId && capturedPaymentIdRef.current !== paymentId) {
      capturedPaymentIdRef.current = paymentId;
      sessionStorage.removeItem('pendingStorePromotionPaymentId');

      if (paymentIdFromUrl) {
        navigate(ROUTES.USER_MY_STORE, { replace: true });
      }

      capturePromotionMutation.mutate(paymentId);
    }
  }, [searchParams, navigate, capturePromotionMutation, t]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleEdit = (product) => {
    navigate(ROUTES.USER_MY_STORE_EDIT.replace(':id', product.id));
  };

  const handleDelete = async (product) => {
    if (!product?.id) return;
    try {
      await deleteProduct(product.id, product.title);
    } catch {
      // toast is handled in useStoreProducts mutation onError
    }
  };

  const handlePromoteConfirm = (item, tier) => {
    if (!item?.id) return;
    promoteMutation.mutate({
      productId: item.id,
      durationDays: tier?.days || 7,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-7">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <Store
              size={26}
              className="shrink-0 text-[#161c27]"
              aria-hidden="true"
            />
            <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
              {t('myStore.title')}
            </h1>
            {isFetching && !isLoading ? (
              <Loader2
                size={18}
                className="animate-spin text-[#4048cd]"
                aria-label="Updating…"
              />
            ) : null}
          </div>
          <p className="mt-2 max-w-180 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myStore.subtitle')}
          </p>
        </div>

        <Link
          to={ROUTES.USER_MY_STORE_UPLOAD}
          className="inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-[#ee1c25] px-6 py-3 text-[15px] font-bold text-white transition hover:bg-[#d41921] sm:text-[16px]"
        >
          <Plus size={18} aria-hidden="true" />
          {t('myStore.uploadProduct')}
        </Link>
      </header>

      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label={t('myStore.filters.aria')}
        className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
      >
        {MY_STORE_CATEGORIES.map((item) => {
          const active = category === item.value;
          return (
            <Button
              unstyled
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleCategoryChange(item.value)}
              className={`shrink-0 cursor-pointer rounded-full px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition sm:text-[14px] ${
                active
                  ? 'bg-[#4048cd] text-white shadow-sm'
                  : 'border border-[#e4e4e4] bg-white text-[#5d687b] hover:border-[#d5d8e8] hover:text-[#161c27]'
              }`}
            >
              {t(item.labelKey)}
            </Button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-[#e4e4e4] bg-white py-16">
          <Loader2 className="size-8 animate-spin text-[#4048cd]" />
          <p className="text-[14px] font-medium text-[#687186]">
            {t('common.loading', 'Loading products…')}
          </p>
        </div>
      ) : isError ? (
        /* Error State */
        <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 rounded-[14px] border border-red-200 bg-red-50/50 p-6 text-center">
          <p className="text-[15px] font-medium text-red-600">
            {error?.message ||
              t('common.errorLoading', 'Failed to load store products.')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4048cd] px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-[#353cb0]"
          >
            <RefreshCw size={16} />
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <p className="rounded-[14px] border border-dashed border-[#e4e4e4] bg-white px-6 py-12 text-center text-[16px] text-[#687186]">
          {t('myStore.empty')}
        </p>
      ) : (
        /* Products Grid */
        <section
          aria-label={t('myStore.gridAria')}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {products.map((product) => (
            <MemberStoreProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
              onPromote={() => setPromoteItem(product)}
            />
          ))}
        </section>
      )}

      {/* Pagination */}
      {!isLoading && !isError && meta.totalPages > 1 ? (
        <footer className="flex justify-center">
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            ariaLabel={t('myStore.paginationAria')}
          />
        </footer>
      ) : null}

      <MemberPromotePanel
        item={promoteItem}
        open={Boolean(promoteItem)}
        onClose={() => setPromoteItem(null)}
        onConfirm={handlePromoteConfirm}
        isLoading={promoteMutation.isPending}
      />
    </div>
  );
});

MyStoreContent.displayName = 'MyStoreContent';

export default MyStoreContent;
