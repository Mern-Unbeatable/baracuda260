import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectUser } from '@/app/store/slices/authSlice';
import Pagination from '@/components/common/Pagination/Pagination';
import MemberSellPhotoCard from '@/components/data-display/MemberSellPhotoCard/MemberSellPhotoCard';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import MemberUploadFormatMenu from '@/portals/member/components/member-sell-photos/MemberUploadFormatMenu';
import {
  matchesSellPhotosFilter,
  SELL_PHOTOS_FILTER_TABS,
  SELL_PHOTOS_ITEMS,
  SELL_PHOTOS_PAGE_SIZE,
  sortSellPhotosItems,
} from '@/portals/member/data/sellPhotosData';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  captureMarketplacePremiumPhotoPromotionPaymentApi,
  deleteMarketplacePremiumPhotoApi,
  getMarketplacePremiumPhotosApi,
  MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY,
  promoteMarketplacePremiumPhotoApi,
} from '@/shared/api/premiumPhotos.api';
import { ROUTES } from '@/shared/config';
import usePaginatedSlice from '@/shared/hooks/usePaginatedSlice';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
};

const mapFilterTabToKind = (tab) => {
  if (tab === 'Single Photo') return 'SINGLE';
  if (tab === '6 Photo Story') return 'SIX';
  if (tab === '12 photos - Full Zodiac Story') return 'TWELVE';
  return 'ALL';
};

const SellPhotosContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [filterTab, setFilterTab] = useState('All');
  const [promoteItem, setPromoteItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const capturedPaymentIdRef = useRef(null);

  const user = useSelector(selectUser);
  const username = user?.username;
  const currentKind = mapFilterTabToKind(filterTab);

  const { data: marketplaceResponse, isLoading } = useQuery({
    queryKey: MARKETPLACE_PREMIUM_PHOTOS_QUERY_KEY({
      kind: currentKind,
      page: currentPage,
      limit: SELL_PHOTOS_PAGE_SIZE,
      username,
    }),
    queryFn: () =>
      getMarketplacePremiumPhotosApi({
        kind: currentKind,
        page: currentPage,
        limit: SELL_PHOTOS_PAGE_SIZE,
        username,
      }),
    enabled: Boolean(username),
    staleTime: 30 * 1000,
  });

  // Promote mutation (POST /v1/marketplace/premium-photos/:id/promote)
  const promoteMutation = useMutation({
    mutationFn: ({ photoId, durationDays }) =>
      promoteMarketplacePremiumPhotoApi(photoId, { durationDays }),
    onSuccess: (response) => {
      const resData = response?.data || response;
      const approvalUrl =
        resData?.approvalUrl ||
        resData?.checkoutUrl ||
        resData?.redirectUrl ||
        resData?.url;
      const paymentId = resData?.paymentId || resData?.id;

      if (paymentId) {
        sessionStorage.setItem(
          'pendingPremiumPhotoPromotionPaymentId',
          paymentId,
        );
      }

      if (approvalUrl) {
        toast.loading(
          t('sellPhotos.promote.redirecting', 'Redirecting to PayPal checkout...'),
          { duration: 2500 },
        );
        window.location.href = approvalUrl;
      } else {
        toast.success(
          response?.message ||
            t('sellPhotos.promote.started', 'Promotion checkout initiated.'),
        );
        setPromoteItem(null);
      }
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('sellPhotos.promote.error', 'Failed to initiate promotion. Please try again.'),
        ),
      );
    },
  });

  // Capture promotion mutation (POST /v1/marketplace/premium-photos/promote/capture)
  const capturePromotionMutation = useMutation({
    mutationFn: (paymentId) =>
      captureMarketplacePremiumPhotoPromotionPaymentApi({ paymentId }),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          t('sellPhotos.promote.success', 'Photo promoted successfully!'),
      );
      queryClient.invalidateQueries({
        queryKey: ['marketplace-premium-photos'],
      });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('sellPhotos.promote.captureError', 'Failed to capture promotion payment.'),
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
      'pendingPremiumPhotoPromotionPaymentId',
    );
    const paymentId = paymentIdFromUrl || paymentIdFromSession;

    if (searchParams.get('cancel') || searchParams.get('cancelled')) {
      sessionStorage.removeItem('pendingPremiumPhotoPromotionPaymentId');
      toast.info(t('sellPhotos.promote.cancelled', 'Promotion was cancelled.'));
      navigate(ROUTES.USER_SELL_PHOTOS, { replace: true });
      return;
    }

    if (paymentId && capturedPaymentIdRef.current !== paymentId) {
      capturedPaymentIdRef.current = paymentId;
      sessionStorage.removeItem('pendingPremiumPhotoPromotionPaymentId');

      if (paymentIdFromUrl) {
        navigate(ROUTES.USER_SELL_PHOTOS, { replace: true });
      }

      capturePromotionMutation.mutate(paymentId);
    }
  }, [searchParams, navigate, capturePromotionMutation, t]);

  // Delete mutation (DELETE /v1/marketplace/premium-photos/:id)
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMarketplacePremiumPhotoApi(id),
    onSuccess: () => {
      toast.success(t('sellPhotos.deleteSuccess', 'Photo listing deleted successfully!'));
      queryClient.invalidateQueries({
        queryKey: ['marketplace-premium-photos'],
      });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('sellPhotos.deleteError', 'Failed to delete photo. Please try again.'),
        ),
      );
    },
  });

  const handleDeletePhoto = (item) => {
    if (!item?.id) return;
    if (window.confirm(t('sellPhotos.confirmDelete', 'Are you sure you want to delete this photo listing?'))) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleEditPhoto = (item) => {
    if (!item?.id) return;
    const editId = item.id;
    const kind = String(item.kind || item.albumBadge || '').toUpperCase();

    let targetRoute = ROUTES.USER_SELL_PHOTOS_UPLOAD_SINGLE;
    if (kind.includes('TWELVE') || kind.includes('12')) {
      targetRoute = ROUTES.USER_SELL_PHOTOS_UPLOAD_ZODIAC12;
    } else if (kind.includes('SIX') || kind.includes('6')) {
      targetRoute = ROUTES.USER_SELL_PHOTOS_UPLOAD_SIX;
    }

    navigate(`${targetRoute}?edit=${editId}`, {
      state: { editId, artwork: item, editArtwork: item, photo: item, editPhoto: item },
    });
  };

  const filterItems = SELL_PHOTOS_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const filteredMockItems = useMemo(() => {
    const filtered = SELL_PHOTOS_ITEMS.filter((item) =>
      matchesSellPhotosFilter(item, filterTab),
    );
    return sortSellPhotosItems(filtered);
  }, [filterTab]);

  const mockSlice = usePaginatedSlice(
    filteredMockItems,
    SELL_PHOTOS_PAGE_SIZE,
    [filterTab],
  );

  const hasApiData = Boolean(marketplaceResponse?.data);
  const rawApiItems = marketplaceResponse?.data || [];
  const apiItems = useMemo(() => {
    if (filterTab === 'Promoted') {
      return rawApiItems.filter((item) => item.promoted);
    }
    return rawApiItems;
  }, [rawApiItems, filterTab]);

  const displayItems = hasApiData ? apiItems : mockSlice.pagedItems;
  const totalPages = hasApiData
    ? (marketplaceResponse?.meta?.totalPages ?? 1)
    : mockSlice.totalPages;
  const totalRecords = hasApiData
    ? (marketplaceResponse?.meta?.totalRecords ?? apiItems.length)
    : filteredMockItems.length;
  const page = hasApiData ? currentPage : mockSlice.currentPage;
  const setPage = hasApiData ? setCurrentPage : mockSlice.setPage;

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('sellPhotos.title')}
          </h1>
          <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('sellPhotos.subtitle')}
          </p>
        </div>
        <MemberUploadFormatMenu />
      </header>

      <FilterPillGroup
        items={filterItems}
        value={filterTab}
        onChange={(value) => {
          setFilterTab(value);
          setPage(1);
        }}
        density="compact"
        layout="scroll"
        ariaLabel={t('sellPhotos.filters.aria')}
      />

      {isLoading ? (
        <div className="flex w-full items-center justify-center py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4048cd] border-t-transparent" />
        </div>
      ) : displayItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('sellPhotos.empty')}
        </p>
      ) : (
        <section
          aria-label={t('sellPhotos.gridAria')}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {displayItems.map((item) => (
            <MemberSellPhotoCard
              key={item.id}
              item={item}
              badgeLabel={t(
                SHOWCASE_BADGE_KEYS[item.albumBadge] || item.albumBadge,
                {
                  defaultValue: item.albumBadge,
                },
              )}
              onEdit={() => handleEditPhoto(item)}
              onDelete={() => handleDeletePhoto(item)}
              onPromote={setPromoteItem}
            />
          ))}
        </section>
      )}

      {totalRecords > 0 && !isLoading ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('sellPhotos.showing', {
              from: (page - 1) * SELL_PHOTOS_PAGE_SIZE + 1,
              to: Math.min(page * SELL_PHOTOS_PAGE_SIZE, totalRecords),
              total: totalRecords,
            })}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            ariaLabel={t('sellPhotos.paginationAria')}
          />
        </footer>
      ) : null}

      <MemberPromotePanel
        item={promoteItem}
        open={Boolean(promoteItem)}
        isLoading={promoteMutation.isPending}
        onClose={() => setPromoteItem(null)}
        onConfirm={(item, tier) => {
          promoteMutation.mutate({
            photoId: item.id,
            durationDays: tier?.days || 7,
          });
        }}
      />
    </div>
  );
});

SellPhotosContent.displayName = 'SellPhotosContent';

export default SellPhotosContent;
