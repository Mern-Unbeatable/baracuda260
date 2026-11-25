import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { selectIsAuthenticated } from '@/app/store/slices/authSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import CategoryFilterDropdown from '@/components/common/CategoryFilterDropdown/CategoryFilterDropdown';
import MemberStoreProductCard from '@/components/data-display/MemberStoreProductCard/MemberStoreProductCard';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  PHOTOGRAPHER_STORE_CATEGORIES,
  PHOTOGRAPHER_STORE_PAGE_SIZE,
} from '@/portals/public/photographer/data/photographerProfileData';
import {
  getStoreProductDetailsApi,
  getStoreProductsApi,
  STORE_PRODUCTS_QUERY_KEY,
  STORE_WATCHLIST_QUERY_KEY,
  toggleWatchlistApi,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';

const StoreProductDetail = memo(({ product, onBack, isOwner = false, username = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [isSaved, setIsSaved] = useState(Boolean(product.isSaved));
  const gallery = useMemo(() => {
    const fromGallery = Array.isArray(product.gallery) ? product.gallery : [];
    const fromImages = Array.isArray(product.images) ? product.images : [];
    const fallback = product.image ? [product.image] : [];
    const merged =
      fromGallery.length > 0
        ? fromGallery
        : fromImages.length > 0
          ? fromImages
          : fallback;
    return merged.filter(
      (url, index, list) => url && list.indexOf(url) === index,
    );
  }, [product.gallery, product.images, product.image]);

  const [activeImage, setActiveImage] = useState(
    gallery[0] || product.image || '',
  );

  useEffect(() => {
    setIsSaved(Boolean(product.isSaved));
  }, [product.isSaved, product.id]);

  useEffect(() => {
    setActiveImage(gallery[0] || product.image || '');
  }, [product.id, gallery, product.image]);

  const handleWatchlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error(
        t(
          'myStore.watchlist.loginRequired',
          'Please log in to save items to your watchlist.',
        ),
      );
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await toggleWatchlistApi(product.id);
      queryClient.invalidateQueries({ queryKey: [STORE_WATCHLIST_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [STORE_PRODUCTS_QUERY_KEY, 'detail', product.id],
      });
      toast.success(
        nextSaved
          ? t('myStore.watchlist.added', 'Added to Item Watchlist')
          : t('myStore.watchlist.removed', 'Removed from Item Watchlist'),
      );
    } catch {
      setIsSaved(!nextSaved);
      toast.error(t('myStore.watchlist.failed', 'Failed to update watchlist'));
    }
  };

  return (
    <div className="mt-6 sm:mt-8">
      <Button
        unstyled
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#6b7280] transition hover:text-[#4048cd]"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t('photographerProfile.store.back')}
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative overflow-hidden rounded-[14px] bg-[#f3f4f6]">
            <Image
              src={activeImage}
              alt={product.title}
              className="aspect-4/3 w-full object-cover"
            />
            {!isOwner ? (
              <Button
                unstyled
                type="button"
                onClick={handleWatchlistToggle}
                aria-label={t('myStore.watchlist.toggle', 'Save to Watchlist')}
                aria-pressed={isSaved}
                className="absolute right-3 top-3 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-[#161c27] shadow-md backdrop-blur-[2px] transition hover:scale-105 hover:bg-white"
              >
                <Heart
                  size={18}
                  strokeWidth={2}
                  className={
                    isSaved
                      ? 'fill-[#e53935] text-[#e53935]'
                      : 'fill-transparent text-[#161c27]'
                  }
                />
              </Button>
            ) : null}
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
                    activeImage === src
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
          <h2 className="mt-3 text-[24px] font-bold leading-snug text-[#111827] sm:text-[28px]">
            {product.title}
          </h2>
          <div className="mt-3 space-y-3 text-[14px] leading-6 text-[#6b7280]">
            {(product.detailParagraphs?.length
              ? product.detailParagraphs
              : product.description
                ? [product.description]
                : []
            ).map((paragraph) => (
              <p key={paragraph.slice(0, 28)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-5 text-[28px] font-bold text-[#4048cd]">
            {product.price}
          </p>

          {product.sizes?.length ? (
            <div className="mt-5">
              <p className="text-[13px] font-semibold text-[#374151]">
                {t('photographerProfile.store.selectSize')}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    unstyled
                    key={size.id}
                    type="button"
                    onClick={() => setSizeId(size.id)}
                    className={`inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-[12px] font-semibold transition ${
                      sizeId === size.id
                        ? 'border-[#4048cd] bg-[#4048cd] text-white'
                        : 'border-[#dbe0ea] bg-white text-[#374151] hover:border-[#4048cd]/40'
                    }`}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {!isOwner ? (
              <>
                <div className="grid grid-cols-[1fr_auto] gap-3 sm:flex sm:items-center">
                  <div className="inline-flex h-12 w-full items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-white sm:w-auto sm:justify-start">
                    <Button
                      unstyled
                      type="button"
                      aria-label={t('photographerProfile.store.decreaseQty')}
                      onClick={() => setQty((value) => Math.max(1, value - 1))}
                      className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center text-[#6b7280]"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </Button>
                    <span className="min-w-10 text-center text-[15px] font-bold text-[#111827]">
                      {String(qty).padStart(2, '0')}
                    </span>
                    <Button
                      unstyled
                      type="button"
                      aria-label={t('photographerProfile.store.increaseQty')}
                      onClick={() => setQty((value) => value + 1)}
                      className="inline-flex size-12 shrink-0 cursor-pointer items-center justify-center text-[#6b7280]"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    unstyled
                    type="button"
                    onClick={handleWatchlistToggle}
                    aria-pressed={isSaved}
                    aria-label={
                      isSaved
                        ? t('myStore.watchlist.saved', 'Saved')
                        : t('myStore.watchlist.save', 'Watchlist')
                    }
                    className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-4 text-[14px] font-bold transition sm:min-w-[7.5rem] ${
                      isSaved
                        ? 'border-[#fecaca] bg-[#fef2f2] text-[#e53935]'
                        : 'border-[#e5e7eb] bg-white text-[#161c27] hover:border-[#fca5a5] hover:text-[#e53935]'
                    }`}
                  >
                    <Heart
                      size={16}
                      strokeWidth={2}
                      className={
                        isSaved ? 'fill-[#e53935]' : 'fill-transparent'
                      }
                    />
                    <span className="hidden sm:inline">
                      {isSaved
                        ? t('myStore.watchlist.saved', 'Saved')
                        : t('myStore.watchlist.save', 'Watchlist')}
                    </span>
                  </Button>
                </div>
                <Button
                  unstyled
                  type="button"
                  onClick={() => {
                    const handle = String(
                      username ||
                        product.username ||
                        product.user?.username ||
                        '',
                    )
                      .trim()
                      .replace(/^@/, '');
                    navigate(ROUTES.PHOTOGRAPHER_STORE_CHECKOUT, {
                      state: {
                        product: {
                          ...product,
                          qty,
                          sizeId,
                          username: handle || product.username,
                        },
                        username: handle || undefined,
                      },
                    });
                  }}
                  className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#ee1c25] px-5 text-[14px] font-bold whitespace-nowrap text-white transition hover:bg-[#d01820] sm:w-auto sm:min-w-55 sm:flex-1"
                >
                  {t('photographerProfile.store.buyNow')}
                  <ShoppingCart size={16} aria-hidden="true" />
                </Button>
              </>
            ) : (
              <Button
                unstyled
                type="button"
                onClick={() => navigate(ROUTES.USER_MY_STORE)}
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#4048cd] px-6 text-[14px] font-bold text-white transition hover:bg-[#343bb0]"
              >
                {t('myStore.title', 'My Store')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
StoreProductDetail.displayName = 'StoreProductDetail';

const isDemoUserId = (id) => {
  if (!id) return true;
  const value = String(id);
  return value.startsWith('demo-') || value === 'elenavance';
};

const PhotographerStoreSection = memo(
  ({ userId, username, isOwner = false }) => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [category, setCategory] = useState('all');
    const productFromUrl = searchParams.get('product');
    const [selectedId, setSelectedId] = useState(productFromUrl || null);
    const [page, setPage] = useState(1);

    useEffect(() => {
      if (productFromUrl) setSelectedId(productFromUrl);
    }, [productFromUrl]);

    const clearSelectedProduct = () => {
      setSelectedId(null);
      if (!searchParams.get('product')) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('product');
          return next;
        },
        { replace: true },
      );
    };

    const openProductDetail = (productId) => {
      const id = String(productId);
      setSelectedId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('product', id);
          return next;
        },
        { replace: true },
      );
    };

    const cleanUserId =
      userId && !isDemoUserId(userId) ? String(userId) : '';
    const cleanUsername = String(username || '')
      .trim()
      .replace(/^@/, '');

    // Prefer username (URL identity) so public My Store matches marketplace
    // "See All" for the same handle; fall back to userId / owner auth scope.
    const canFetchApi = Boolean(isOwner || cleanUserId || cleanUsername);
    const storeScopeKey = cleanUsername
      ? `username:${cleanUsername}`
      : cleanUserId
        ? `user:${cleanUserId}`
        : `owner:${cleanUserId || 'me'}`;

    const {
      data: apiResult,
      isLoading,
      isError,
      refetch,
    } = useQuery({
      queryKey: [
        STORE_PRODUCTS_QUERY_KEY,
        'photographer-store',
        storeScopeKey,
        category,
        page,
      ],
      queryFn: () =>
        getStoreProductsApi({
          ...(cleanUsername
            ? { username: cleanUsername }
            : cleanUserId
              ? { userId: cleanUserId }
              : {}),
          category: category === 'all' ? undefined : category,
          page,
          limit: PHOTOGRAPHER_STORE_PAGE_SIZE,
        }),
      enabled: canFetchApi,
      staleTime: 30 * 1000,
    });

    const products = useMemo(() => apiResult?.data || [], [apiResult?.data]);

    const totalPages = apiResult?.meta?.totalPages || 1;

    const listSelectedProduct = useMemo(() => {
      if (!selectedId) return null;
      return products.find((p) => String(p.id) === String(selectedId)) || null;
    }, [products, selectedId]);

    // Always fetch detail — list payload omits `images[]`, so multi-image
    // gallery only appears after the product-details response.
    const { data: deepLinkProduct } = useQuery({
      queryKey: [STORE_PRODUCTS_QUERY_KEY, 'detail', selectedId],
      queryFn: () => getStoreProductDetailsApi(selectedId),
      enabled: Boolean(selectedId),
      staleTime: 60 * 1000,
    });

    const selectedProduct =
      deepLinkProduct || listSelectedProduct || null;

    const filterItems = useMemo(
      () =>
        PHOTOGRAPHER_STORE_CATEGORIES.map((item) => ({
          id: item.id,
          value: item.value || item.id,
          label: t(item.labelKey, item.label || item.value || item.id),
        })),
      [t],
    );

    const pagedItems = products;
    const currentPage = page;
    const pages = totalPages;
    const onPageChange = setPage;

    useEffect(() => {
      setPage(1);
    }, [category, storeScopeKey]);

    if (selectedProduct) {
      return (
        <StoreProductDetail
          product={selectedProduct}
          onBack={clearSelectedProduct}
          isOwner={isOwner}
          username={username}
        />
      );
    }

    return (
      <section className="mt-6 sm:mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag
                size={22}
                className="shrink-0 text-[#4048cd]"
                aria-hidden="true"
              />
              <h2 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">
                {t('photographerProfile.store.title')}
              </h2>
            </div>
            <p className="mt-1 max-w-2xl text-[14px] leading-6 text-[#6b7280] sm:text-[15px]">
              {t('photographerProfile.store.subtitle')}
            </p>
          </div>

          <div className="shrink-0">
            <CategoryFilterDropdown
              items={filterItems}
              value={category}
              onChange={(next) => {
                setCategory(next);
                setPage(1);
              }}
              align="right"
              labelPrefix={t(
                'photographerProfile.store.categoryPrefix',
                'Category:',
              )}
              ariaLabel={t('photographerProfile.store.filtersAria')}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 flex min-h-40 items-center justify-center">
            <RefreshCw size={22} className="animate-spin text-[#4048cd]" />
          </div>
        ) : isError ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-[14px] text-red-600">
              {t(
                'photographerProfile.store.loadError',
                'Failed to load store products.',
              )}
            </p>
            <Button
              unstyled
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-[#4048cd] px-4 py-2 text-[13px] font-semibold text-white"
            >
              {t('common.retry', 'Retry')}
            </Button>
          </div>
        ) : pagedItems.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-[#e5e7eb] bg-white px-6 py-12 text-center text-[14px] text-[#6b7280]">
            {t(
              'photographerProfile.store.empty',
              'No store products yet.',
            )}
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {pagedItems.map((product) => (
              <MemberStoreProductCard
                key={product.id}
                product={product}
                onView={(item) => openProductDetail(item.id)}
                showWatchlist={!isOwner}
              />
            ))}
          </div>
        )}

        {pages > 1 ? (
          <Pagination
            className="mt-8"
            currentPage={currentPage}
            totalPages={pages}
            onPageChange={onPageChange}
            ariaLabel={t('photographerProfile.store.paginationAria')}
          />
        ) : null}
      </section>
    );
  },
);

PhotographerStoreSection.displayName = 'PhotographerStoreSection';

export default PhotographerStoreSection;
