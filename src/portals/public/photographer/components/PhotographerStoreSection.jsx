import {
  ArrowLeft,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Pagination from '@/components/common/Pagination/Pagination';
import CategoryFilterDropdown from '@/components/common/CategoryFilterDropdown/CategoryFilterDropdown';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  getPhotographerStoreProduct,
  PHOTOGRAPHER_STORE_CATEGORIES,
  PHOTOGRAPHER_STORE_PAGE_SIZE,
} from '@/portals/public/photographer/data/photographerProfileData';
import { filterStoreProducts } from '@/portals/member/data/myStoreData';
import {
  STORE_WATCHLIST_QUERY_KEY,
  toggleWatchlistApi,
} from '@/shared/api/store.api';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const StoreProductCard = memo(({ product, onView, isOwner = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(Boolean(product.isSaved));

  useEffect(() => {
    setIsSaved(Boolean(product.isSaved));
  }, [product.isSaved]);

  const handleWatchlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await toggleWatchlistApi(product.id);
      queryClient.invalidateQueries({ queryKey: [STORE_WATCHLIST_QUERY_KEY] });
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
    <article className="overflow-hidden rounded-[14px] border border-[#e8eaef] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative aspect-4/3 overflow-hidden bg-[#f3f4f6]">
        <Image
          src={product.image}
          alt={product.title}
          className="size-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#111827]/85 px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white">
          {t(product.badgeKey, product.category || 'Product')}
        </span>
        {!isOwner ? (
          <Button
            unstyled
            type="button"
            onClick={handleWatchlistToggle}
            aria-label={t('myStore.watchlist.toggle', 'Save to Watchlist')}
            aria-pressed={isSaved}
            className="absolute right-2.5 top-2.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#161c27] shadow-sm backdrop-blur-[2px] transition hover:bg-white"
          >
            <Heart
              size={16}
              strokeWidth={2}
              className={
                isSaved
                  ? 'fill-[#e53935] text-[#e53935]'
                  : 'fill-transparent text-[#161c27] hover:text-[#e53935]'
              }
            />
          </Button>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-3.5 sm:p-4">
        <div>
          <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[#111827]">
            {product.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-4 text-[#6b7280]">
            {product.description}
          </p>

          {/* Location & Shipping Scope */}
          {(product.city || product.country || product.shippingScope) ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[#6b7280]">
              {(product.city || product.country) ? (
                <span className="inline-flex items-center gap-1 text-[#4b5563]">
                  <MapPin size={12} className="text-[#9ca3af]" />
                  {[product.city, product.country].filter(Boolean).join(', ')}
                </span>
              ) : null}
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                product.shippingScope === 'NATIONAL'
                  ? 'bg-[#fff7ed] text-[#c2410c]'
                  : 'bg-[#ecfdf5] text-[#047857]'
              }`}>
                {product.shippingScope === 'NATIONAL'
                  ? t('myStore.shipping.nationalOnly', 'Domestic Only')
                  : t('myStore.shipping.worldwide', 'Worldwide')}
              </span>
            </div>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <p className="text-[16px] font-bold text-[#111827]">
            {product.price}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              unstyled
              type="button"
              onClick={() => onView(product.id)}
              className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-[#4048cd] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#343bb0]"
            >
              {t('photographerProfile.store.viewProduct')}
            </Button>
            {!isOwner ? (
              <Button
                unstyled
                type="button"
                onClick={() =>
                  navigate(ROUTES.PHOTOGRAPHER_STORE_CHECKOUT, {
                    state: { product },
                  })
                }
                className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-[#ee1c25] px-2.5 text-[12px] font-semibold text-white transition hover:bg-[#d01820]"
              >
                {t('photographerProfile.store.buyNow')}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
});
StoreProductCard.displayName = 'StoreProductCard';

const StoreProductDetail = memo(({ product, onBack, isOwner = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sizeId, setSizeId] = useState(product.sizes?.[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product.gallery?.[0] || product.image,
  );

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
          <div className="overflow-hidden rounded-[14px] bg-[#f3f4f6]">
            <Image
              src={activeImage}
              alt={product.title}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          {product.gallery?.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {product.gallery.map((src) => (
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
          <h2 className="text-[24px] font-bold leading-snug text-[#111827] sm:text-[28px]">
            {product.title}
          </h2>
          <div className="mt-3 space-y-3 text-[14px] leading-6 text-[#6b7280]">
            {product.detailParagraphs.map((paragraph) => (
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isOwner ? (
              <>
                <div className="inline-flex h-11 items-center rounded-[10px] border border-[#e5e7eb] bg-white">
                  <Button
                    unstyled
                    type="button"
                    aria-label={t('photographerProfile.store.decreaseQty')}
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    className="inline-flex size-11 cursor-pointer items-center justify-center text-[#6b7280]"
                  >
                    <Minus size={16} aria-hidden="true" />
                  </Button>
                  <span className="min-w-8 text-center text-[14px] font-bold text-[#111827]">
                    {String(qty).padStart(2, '0')}
                  </span>
                  <Button
                    unstyled
                    type="button"
                    aria-label={t('photographerProfile.store.increaseQty')}
                    onClick={() => setQty((value) => value + 1)}
                    className="inline-flex size-11 cursor-pointer items-center justify-center text-[#6b7280]"
                  >
                    <Plus size={16} aria-hidden="true" />
                  </Button>
                </div>
                <Button
                  unstyled
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.PHOTOGRAPHER_STORE_CHECKOUT, {
                      state: { product: { ...product, qty, sizeId } },
                    })
                  }
                  className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#ee1c25] px-5 text-[14px] font-bold text-white transition hover:bg-[#d01820] sm:min-w-55"
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
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#4048cd] px-6 text-[14px] font-bold text-white transition hover:bg-[#343bb0]"
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

const PhotographerStoreSection = memo(({ products, isOwner = false }) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const selectedProduct = selectedId
    ? getPhotographerStoreProduct(selectedId)
    : null;

  const filterItems = useMemo(
    () =>
      PHOTOGRAPHER_STORE_CATEGORIES.map((item) => ({
        id: item.id,
        value: item.value || item.id,
        label: t(item.labelKey, item.label || item.value || item.id),
      })),
    [t],
  );

  const filtered = useMemo(() => {
    if (category === 'all') return products;
    return filterStoreProducts(products, category);
  }, [category, products]);

  const { currentPage, setPage, totalPages, pagedItems } = usePaginatedSlice(
    filtered,
    PHOTOGRAPHER_STORE_PAGE_SIZE,
    [category],
  );

  if (selectedProduct) {
    return (
      <StoreProductDetail
        product={selectedProduct}
        onBack={() => setSelectedId(null)}
        isOwner={isOwner}
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

        {/* Category Dropdown Filter */}
        <div className="shrink-0">
          <CategoryFilterDropdown
            items={filterItems}
            value={category}
            onChange={setCategory}
            align="right"
            labelPrefix={t('photographerProfile.store.categoryPrefix', 'Category:')}
            ariaLabel={t('photographerProfile.store.filtersAria')}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {pagedItems.map((product) => (
          <StoreProductCard
            key={product.id}
            product={product}
            onView={setSelectedId}
            isOwner={isOwner}
          />
        ))}
      </div>

      <Pagination
        className="mt-8"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        ariaLabel={t('photographerProfile.store.paginationAria')}
      />
    </section>
  );
});

PhotographerStoreSection.displayName = 'PhotographerStoreSection';

export default PhotographerStoreSection;
