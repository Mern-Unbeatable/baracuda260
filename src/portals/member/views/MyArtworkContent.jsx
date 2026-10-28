import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, RefreshCw, X } from 'lucide-react';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Pagination from '@/components/common/Pagination/Pagination';
import DashboardStatCard from '@/components/data-display/DashboardStatCard/DashboardStatCard';
import MemberArtworkCard from '@/components/data-display/MemberArtworkCard/MemberArtworkCard';
import CreateSlideshowButton from '@/components/data-display/Slideshow/CreateSlideshowButton';
import MemberPromotePanel from '@/components/forms/MemberPromotePanel/MemberPromotePanel';
import FilterPillGroup from '@/components/marketing/FilterPillGroup/FilterPillGroup';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MemberFilterSelect from '@/portals/member/components/member-artwork/MemberFilterSelect';
import SwitchCompetitionModal from '@/portals/member/components/member-artwork/SwitchCompetitionModal';
import {
  MY_ARTWORK_FILTER_TABS,
  MY_ARTWORK_ITEMS,
  MY_ARTWORK_PAGE_SIZE,
  MY_ARTWORK_SORT_OPTIONS,
  MY_ARTWORK_STATS,
  MY_ARTWORK_STATUS_FILTERS,
} from '@/portals/member/data/myArtworkData';
import {
  captureArtworkPromotionPaymentApi,
  deleteArtworkApi,
  getUserArtworksApi,
  promoteArtworkApi,
  resubmitArtworkApi,
  switchArtworkToCompetitionApi,
  updateArtworkApi,
  USER_ARTWORKS_QUERY_KEY,
} from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const SHOWCASE_BADGE_KEYS = {
  'Single Photo': 'common.badges.singlePhoto',
  '6 Photos Story': 'common.badges.sixPhotosStory',
  '12 photos - full Zodiac Story': 'common.badges.twelveZodiacFull',
  'Video Update': 'common.badges.videoUpdate',
};

const TAB_KIND_MAP = {
  All: undefined,
  'Single Photo': 'SINGLE',
  '6 Photo Story': 'SIX',
  '12 photos - Full Zodiac Story': 'TWELVE',
};



const MyArtworkContent = memo(() => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const capturedPaymentIdRef = useRef(null);

  const [filterTab, setFilterTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [promoteItem, setPromoteItem] = useState(null);
  const [switchingArtwork, setSwitchingArtwork] = useState(null);

  const handleEditArtwork = (item) => {
    if (!item?.id) return;
    const editId = item.id;
    const kind = String(item.kind || item.albumBadge || '').toUpperCase();

    let targetRoute = ROUTES.USER_MY_ARTWORK_UPLOAD_SINGLE;
    if (kind.includes('TWELVE') || kind.includes('12')) {
      targetRoute = ROUTES.USER_MY_ARTWORK_UPLOAD_ZODIAC12;
    } else if (kind.includes('SIX') || kind.includes('6')) {
      targetRoute = ROUTES.USER_MY_ARTWORK_UPLOAD_SIX;
    }

    navigate(`${targetRoute}?edit=${editId}`, {
      state: { editId, artwork: item, editArtwork: item },
    });
  };

  const switchCompetitionMutation = useMutation({
    mutationFn: ({ artworkId, competitionId, newCompetitionId, isResubmit }) => {
      if (isResubmit) {
        return resubmitArtworkApi(artworkId, {
          newCompetitionId: newCompetitionId || competitionId,
        });
      }
      return switchArtworkToCompetitionApi(artworkId, { competitionId });
    },
    onSuccess: (_, variables) => {
      const msg = variables?.isResubmit
        ? t(
            'myArtwork.resubmitSuccess',
            'Artwork successfully resubmitted to competition!',
          )
        : t(
            'myArtwork.switchSuccess',
            'Artwork successfully entered into competition!',
          );
      toast.success(msg);
      setSwitchingArtwork(null);
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
    },
    onError: (err, variables) => {
      const fallback = variables?.isResubmit
        ? t(
            'myArtwork.resubmitError',
            'Failed to resubmit artwork. Please try again.',
          )
        : t(
            'myArtwork.switchError',
            'Failed to enter competition. Please try again.',
          );
      toast.error(getApiErrorMessage(err, fallback));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteArtworkApi(id),
    onSuccess: () => {
      toast.success(t('myArtwork.deleteSuccess', 'Artwork deleted successfully!'));
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          t('myArtwork.deleteError', 'Failed to delete artwork. Please try again.'),
        ),
      );
    },
  });

  const handleDeleteArtwork = (item) => {
    if (!item?.id) return;
    if (window.confirm(t('myArtwork.confirmDelete', 'Are you sure you want to delete this artwork?'))) {
      deleteMutation.mutate(item.id);
    }
  };

  const promoteMutation = useMutation({
    mutationFn: ({ artworkId, durationDays }) =>
      promoteArtworkApi(artworkId, { durationDays }),
    onSuccess: (response) => {
      const resData = response?.data || response;
      const checkoutUrl =
        resData?.checkoutUrl ||
        resData?.url ||
        resData?.checkout_url ||
        resData?.sessionUrl ||
        resData?.session_url ||
        resData?.redirectUrl ||
        resData?.paymentUrl ||
        resData?.stripeUrl ||
        response?.checkoutUrl ||
        response?.url ||
        response?.checkout_url;

      const paymentId =
        resData?.paymentId ||
        resData?.id ||
        resData?.sessionId ||
        resData?.session_id ||
        response?.paymentId ||
        response?.id;

      if (paymentId) {
        sessionStorage.setItem('pendingPromotionPaymentId', paymentId);
      }

      if (checkoutUrl) {
        toast.loading(
          t('myArtwork.promote.redirecting', 'Redirecting to checkout...'),
          { duration: 2500 },
        );
        window.location.href = checkoutUrl;
      } else {
        console.warn('Promote API response without redirect URL:', response);
        toast.success(
          response?.message ||
            t('myArtwork.promoteStarted', 'Promotion checkout initiated.'),
        );
        setPromoteItem(null);
      }
    },
    onError: (err) => {
      console.error('Failed to initiate promotion:', err);
      toast.error(
        getApiErrorMessage(
          err,
          t(
            'myArtwork.promote.error',
            'Failed to initiate promotion. Please try again.',
          ),
        ),
      );
    },
  });

  const capturePromotionMutation = useMutation({
    mutationFn: (paymentId) =>
      captureArtworkPromotionPaymentApi({ paymentId }),
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          t('myArtwork.promote.success', 'Artwork promoted successfully!'),
      );
      queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(
          err,
          'The requested action could not be performed, semantically incorrect, or failed business validation.',
        ),
      );
    },
  });

  // Handle return from checkout (Stripe or PayPal)
  useEffect(() => {
    const paymentIdFromUrl =
      searchParams.get('paymentId') ||
      searchParams.get('token') ||
      searchParams.get('session_id') ||
      searchParams.get('sessionId');
    const paymentIdFromSession = sessionStorage.getItem(
      'pendingPromotionPaymentId',
    );
    const paymentId = paymentIdFromUrl || paymentIdFromSession;

    if (searchParams.get('cancel') || searchParams.get('cancelled')) {
      sessionStorage.removeItem('pendingPromotionPaymentId');
      toast.info(t('myArtwork.promote.cancelled', 'Promotion was cancelled.'));
      navigate(ROUTES.USER_MY_ARTWORK, { replace: true });
      return;
    }

    if (paymentId && capturedPaymentIdRef.current !== paymentId) {
      capturedPaymentIdRef.current = paymentId;
      sessionStorage.removeItem('pendingPromotionPaymentId');

      if (paymentIdFromUrl) {
        navigate(ROUTES.USER_MY_ARTWORK, { replace: true });
      }

      capturePromotionMutation.mutate(paymentId);
    }
  }, [searchParams, navigate, capturePromotionMutation, t]);

  const filterItems = MY_ARTWORK_FILTER_TABS.map((tab) => ({
    value: tab.value,
    label: t(tab.labelKey),
  }));

  const kindParam = TAB_KIND_MAP[filterTab];

  // Fetch live artworks from GET /api/v1/artworks
  const {
    data: apiResult,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      ...USER_ARTWORKS_QUERY_KEY,
      kindParam,
      statusFilter,
      sort,
      page,
      MY_ARTWORK_PAGE_SIZE,
    ],
    queryFn: () =>
      getUserArtworksApi({
        kind: kindParam,
        status: statusFilter,
        sort,
        page,
        limit: MY_ARTWORK_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });

  const liveItems = apiResult?.items ?? [];
  const meta = apiResult?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const totalRecords = meta?.totalRecords ?? liveItems.length;

  // Filter promoted on client if "Promoted" tab is active
  const displayedItems = useMemo(() => {
    if (filterTab === 'Promoted') {
      return liveItems.filter((it) => it.promoted);
    }
    return liveItems;
  }, [liveItems, filterTab]);

  // Compute stat cards from live data or fallbacks
  const statCards = useMemo(() => {
    const totalCount = meta?.totalRecords ?? liveItems.length;
    const singleCount = liveItems.filter((i) => i.kind === 'SINGLE').length;
    const sixCount = liveItems.filter((i) => i.kind === 'SIX').length;
    const twelveCount = liveItems.filter((i) => i.kind === 'TWELVE').length;
    const entriesCount = liveItems.filter((i) => i.footerState === 'active').length;

    return [
      {
        id: 'total',
        labelKey: 'myArtwork.stats.total',
        value: String(totalCount),
        icon: 'images',
        iconBg: 'bg-[#ede9fe]',
        iconColor: 'text-[#7c3aed]',
      },
      {
        id: 'single',
        labelKey: 'myArtwork.stats.single',
        value: String(singleCount),
        icon: 'camera',
        iconBg: 'bg-[#dbeafe]',
        iconColor: 'text-[#2563eb]',
      },
      {
        id: 'six',
        labelKey: 'myArtwork.stats.six',
        value: String(sixCount),
        icon: 'layers',
        iconBg: 'bg-[#f3e8ff]',
        iconColor: 'text-[#9333ea]',
      },
      {
        id: 'twelve',
        labelKey: 'myArtwork.stats.twelve',
        value: String(twelveCount),
        icon: 'book',
        iconBg: 'bg-[#ecedfa]',
        iconColor: 'text-[#4048cd]',
      },
      {
        id: 'entries',
        labelKey: 'myArtwork.stats.entries',
        value: String(entriesCount),
        icon: 'trophy',
        iconBg: 'bg-[#fef3c7]',
        iconColor: 'text-[#b45309]',
      },
    ];
  }, [liveItems, meta]);

  const handlePageChange = (nextPage) => {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    setPage(clamped);
    scrollToPageTop();
  };

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.75px] text-[#161c27] sm:text-[36px] sm:leading-9.5 lg:text-[40px]">
            {t('myArtwork.title')}
          </h1>
          <p className="max-w-240 text-[15px] leading-6 text-[#494453] sm:text-[16px]">
            {t('myArtwork.subtitle')}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <CreateSlideshowButton className="rounded-xl border border-[#c7cbf2] bg-white px-5 py-2.5 text-[16px] leading-6 text-[#4048cd] shadow-sm hover:bg-[#f5f6ff]" />
          <Link
            to={ROUTES.USER_MY_ARTWORK_UPLOAD}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#ee1c25] px-5 py-2.5 text-[16px] leading-6 text-white shadow-sm transition hover:bg-[#d41921]"
          >
            <Plus size={16} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.uploadCta')}
          </Link>
        </div>
      </header>

      <section
        aria-label={t('myArtwork.stats.aria')}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:gap-5"
      >
        {statCards.map((stat) => (
          <DashboardStatCard key={stat.id} {...stat} />
        ))}
      </section>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterPillGroup
          items={filterItems}
          value={filterTab}
          onChange={(value) => {
            setFilterTab(value);
            setPage(1);
          }}
          density="compact"
          layout="scroll"
          ariaLabel={t('myArtwork.filters.aria')}
          className="lg:max-w-3xl"
        />

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <MemberFilterSelect
            label={t('myArtwork.statusFilterAria')}
            value={statusFilter}
            options={MY_ARTWORK_STATUS_FILTERS}
            optionKeyPrefix="myArtwork.statusOptions"
            prefixLabelKey="myArtwork.sortByPrefix"
            open={statusOpen}
            onToggle={() => {
              setStatusOpen((open) => !open);
              setSortOpen(false);
            }}
            onClose={() => setStatusOpen(false)}
            onSelect={(value) => {
              setStatusFilter(value);
              setStatusOpen(false);
              setPage(1);
            }}
          />
          <MemberFilterSelect
            label={t('myArtwork.sortFilterAria')}
            value={sort}
            options={MY_ARTWORK_SORT_OPTIONS}
            optionKeyPrefix="myArtwork.sortOptions"
            showFilterIcon={false}
            open={sortOpen}
            onToggle={() => {
              setSortOpen((open) => !open);
              setStatusOpen(false);
            }}
            onClose={() => setSortOpen(false)}
            onSelect={(value) => {
              setSort(value);
              setSortOpen(false);
              setPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: MY_ARTWORK_PAGE_SIZE }).map((_, idx) => (
            <div
              key={idx}
              className="flex h-80 animate-pulse flex-col rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-4 shadow-sm"
            >
              <div className="h-44 w-full rounded-xl bg-[#e2e8f0]" />
              <div className="mt-4 h-5 w-3/4 rounded bg-[#e2e8f0]" />
              <div className="mt-2 h-4 w-1/2 rounded bg-[#e2e8f0]" />
            </div>
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <p className="text-[16px] text-[#494453]" role="status">
          {t('myArtwork.empty')}
        </p>
      ) : (
        <section
          aria-label={t('myArtwork.gridAria')}
          className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {displayedItems.map((item) => (
            <MemberArtworkCard
              key={item.id}
              item={item}
              badgeLabel={t(
                SHOWCASE_BADGE_KEYS[item.albumBadge] || item.albumBadge,
                {
                  defaultValue: item.albumBadge,
                },
              )}
              onEdit={() => handleEditArtwork(item)}
              onDelete={() => handleDeleteArtwork(item)}
              onPromote={setPromoteItem}
              onSwitchCompetition={setSwitchingArtwork}
            />
          ))}
        </section>
      )}

      {displayedItems.length > 0 ? (
        <footer className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-medium tracking-[0.6px] text-[#494453]">
            {t('myArtwork.showing', {
              from: (page - 1) * MY_ARTWORK_PAGE_SIZE + 1,
              to: Math.min(page * MY_ARTWORK_PAGE_SIZE, totalRecords),
              total: totalRecords,
            })}
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ariaLabel={t('myArtwork.paginationAria')}
          />
        </footer>
      ) : null}



      <SwitchCompetitionModal
        artwork={switchingArtwork}
        onClose={() => setSwitchingArtwork(null)}
        onConfirm={(payload) => switchCompetitionMutation.mutate(payload)}
        isLoading={switchCompetitionMutation.isPending}
      />

      <MemberPromotePanel
        item={promoteItem}
        open={Boolean(promoteItem)}
        isLoading={promoteMutation.isPending}
        onClose={() => setPromoteItem(null)}
        onConfirm={(item, tier) => {
          promoteMutation.mutate({
            artworkId: item.id,
            durationDays: tier?.days || 7,
          });
        }}
      />
    </div>
  );
});

MyArtworkContent.displayName = 'MyArtworkContent';

export default MyArtworkContent;
