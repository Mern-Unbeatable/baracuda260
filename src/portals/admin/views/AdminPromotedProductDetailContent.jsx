import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Film,
  Heart,
  ImageIcon,
  Layers,
  MapPin,
  Play,
  RefreshCw,
  Sparkles,
  Tag,
  User,
  Vote,
} from 'lucide-react';
import React, { memo, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_PROMOTIONS_QUERY_KEY,
  ADMIN_PROMOTION_DETAILS_QUERY_KEY,
  formatPromoDate,
  getAdminPromotionDetailsApi,
} from '@/shared/api/promotions.api';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl } from '@/shared/utils/media';
import { scrollToPageTop } from '@/shared/utils/scrollToPageTop';

const SectionCard = memo(({ title, icon: Icon, children, className = '' }) => (
  <div
    className={`min-w-0 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0px_2px_4px_rgba(27,39,69,0.02)] sm:p-6 ${className}`}
    style={{ contentVisibility: 'auto', containIntrinsicSize: '180px' }}
  >
    {title ? (
      <div className="mb-4 flex items-center gap-2 border-b border-[#f3f4f6] pb-3">
        {Icon ? <Icon className="size-4.5 text-[#4048cd]" /> : null}
        <h2 className="font-manrope text-[15px] font-bold text-[#111827] sm:text-[16px]">
          {title}
        </h2>
      </div>
    ) : null}
    {children}
  </div>
));
SectionCard.displayName = 'SectionCard';

const InfoRow = memo(({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between gap-4 py-2 text-[14px]">
    <span className="flex shrink-0 items-center gap-1.5 text-[#6b7280]">
      {Icon ? <Icon className="size-3.5 opacity-60" /> : null}
      {label}
    </span>
    <span
      className="min-w-0 max-w-[65%] truncate text-right font-semibold text-[#111827]"
      title={typeof value === 'string' ? value : undefined}
    >
      {value}
    </span>
  </div>
));
InfoRow.displayName = 'InfoRow';

const MediaItemCard = memo(({ media }) => {
  const isVideo = media.kind === 'VIDEO';
  const [isPlaying, setIsPlaying] = useState(false);

  const poster = optimizeImageUrl(media.thumbnailUrl || media.url, 600);
  const mediaUrl = optimizeImageUrl(media.url, 800);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e5e7eb] bg-[#f9fafb] shadow-sm transition hover:shadow-md"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '240px' }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
        {isVideo && isPlaying ? (
          <video
            src={media.url}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : isVideo ? (
          <div
            onClick={() => setIsPlaying(true)}
            className="relative h-full w-full cursor-pointer"
          >
            <Image
              src={poster}
              alt=""
              width={400}
              height={225}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/95 text-[#4048cd] shadow-md transition group-hover:scale-110">
                <Play className="ml-0.5 size-5 fill-current" />
              </span>
            </div>
          </div>
        ) : (
          <Image
            src={mediaUrl}
            alt=""
            width={400}
            height={225}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
          {media.zodiacSign ? (
            <span className="rounded-full bg-[#4048cd] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
              {media.zodiacSign}
            </span>
          ) : null}
          {media.slotIndex != null ? (
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
              #{media.slotIndex}
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white">
            {isVideo ? <Film size={12} /> : <ImageIcon size={12} />}
            {media.kind}
          </span>
        </div>
      </div>
      {(media.width || media.bytes) ? (
        <div className="flex items-center justify-between gap-2 p-2.5 text-[11px] text-[#6b7280]">
          {media.width && media.height ? (
            <span>
              {media.width} × {media.height}
            </span>
          ) : <span />}
          {media.bytes ? (
            <span>{(media.bytes / 1024 / 1024).toFixed(1)} MB</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
MediaItemCard.displayName = 'MediaItemCard';

const AdminPromotedProductDetailContent = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Instant scroll-to-top synchronously before paint
  useLayoutEffect(() => {
    scrollToPageTop('auto');
  }, [id]);

  // Read already cached promotion item from list queries to eliminate 4-5s delay
  const cachedPromo = useMemo(() => {
    if (!id) return undefined;
    const queries = queryClient.getQueriesData({
      queryKey: ADMIN_PROMOTIONS_QUERY_KEY,
    });
    for (const [, data] of queries) {
      const items = data?.items || data?.data || (Array.isArray(data) ? data : []);
      const found = items.find((item) => String(item.id) === String(id));
      if (found) {
        return found;
      }
    }
    return undefined;
  }, [queryClient, id]);

  const {
    data: promo,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ADMIN_PROMOTION_DETAILS_QUERY_KEY(id),
    queryFn: () => getAdminPromotionDetailsApi(id),
    enabled: Boolean(id),
    placeholderData: cachedPromo,
    staleTime: 60 * 1000,
  });

  if (isLoading && !promo) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 py-24 text-center text-[#687186]">
        <div className="size-9 animate-spin rounded-full border-3 border-[#4048cd] border-t-transparent" />
        <span className="text-[15px] font-medium">
          {t('adminPromoted.loadingDetails', 'Loading promotion details...')}
        </span>
      </div>
    );
  }

  if (isError || !promo) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-[16px] font-semibold text-[#ee1c25]">
          {error?.message ||
            t(
              'adminPromoted.errorDetails',
              'Failed to load promotion details.',
            )}
        </p>
        <div className="flex items-center gap-3">
          <Button
            unstyled
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer rounded-lg bg-[#ee1c25] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#d41921]"
          >
            {t('adminPromoted.retry', 'Retry')}
          </Button>
          <Button
            unstyled
            type="button"
            onClick={() => {
              navigate(ROUTES.ADMIN_PROMOTED_PRODUCTS);
              scrollToPageTop('auto');
            }}
            className="cursor-pointer rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-semibold text-[#374151] hover:bg-gray-50"
          >
            {t('adminPromoted.backToList', 'Back to Promoted Products')}
          </Button>
        </div>
      </div>
    );
  }

  const item = promo.item || {};
  const user = promo.user || {};
  const mediaList = Array.isArray(item.media) ? item.media : [];

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 pb-16 sm:gap-8 sm:pb-20">
      {/* Top back navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to={ROUTES.ADMIN_PROMOTED_PRODUCTS}
          onClick={() => scrollToPageTop('auto')}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#4048cd] transition hover:text-[#3238a8]"
        >
          <ArrowLeft size={16} />
          {t('adminPromoted.backToList', 'Back to Promoted Products')}
        </Link>
        {isFetching ? (
          <RefreshCw size={16} className="animate-spin text-[#9ca3af]" />
        ) : null}
      </div>

      {/* Header with Title and Status Badges */}
      <header className="flex flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
                promo.isExpired
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  promo.isExpired ? 'bg-gray-400' : 'bg-emerald-500'
                }`}
              />
              {promo.isExpired
                ? t('adminPromoted.badge.expired', 'Expired')
                : t('adminPromoted.status.active', 'Active')}
            </span>
            <span className="rounded-full bg-[#eff1fe] px-3 py-1 text-[12px] font-bold text-[#4048cd] uppercase">
              {promo.promotionType}
            </span>
            {item.kind ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[12px] font-bold text-slate-700 uppercase">
                {item.kind}
              </span>
            ) : null}
          </div>
          <h1 className="mt-1 break-words font-manrope text-[22px] font-bold tracking-tight text-[#111827] sm:text-[26px]">
            {item.title || promo.title}
          </h1>
          <p className="text-[13px] text-[#6b7280]">
            ID: <span className="font-mono break-all">{promo.id}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-2 sm:pt-0">
          <div className="rounded-xl bg-[#f9fafb] px-4 py-2.5 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#9ca3af]">
              {t('adminPromoted.detail.amountPaid', 'Amount Paid')}
            </p>
            <p className="text-[20px] font-extrabold text-[#111827]">
              ${Number(promo.amountPaid || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </header>

      {/* Grid with Promotion, User, and Item Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Promotion Overview */}
        <SectionCard
          title={t('adminPromoted.detail.promoInfo', 'Promotion Details')}
          icon={Sparkles}
        >
          <div className="divide-y divide-[#f3f4f6]">
            <InfoRow
              icon={CheckCircle2}
              label={t('adminPromoted.detail.status', 'Status')}
              value={promo.isExpired ? 'Expired' : 'Active'}
            />
            <InfoRow
              icon={Clock}
              label={t('adminPromoted.detail.duration', 'Duration')}
              value={`${promo.durationDays || 0} days`}
            />
            <InfoRow
              icon={Calendar}
              label={t('adminPromoted.detail.daysLeft', 'Days Remaining')}
              value={
                promo.isExpired
                  ? '0 days'
                  : `${promo.daysRemaining ?? 0} days`
              }
            />
            <InfoRow
              icon={Calendar}
              label={t('adminPromoted.detail.startsAt', 'Starts At')}
              value={formatPromoDate(promo.startsAt)}
            />
            <InfoRow
              icon={Calendar}
              label={t('adminPromoted.detail.endsAt', 'Ends At')}
              value={formatPromoDate(promo.endsAt)}
            />
            <InfoRow
              icon={DollarSign}
              label={t('adminPromoted.detail.paid', 'Amount Paid')}
              value={`$${Number(promo.amountPaid || 0).toFixed(2)}`}
            />
          </div>
        </SectionCard>

        {/* Promoter / User */}
        <SectionCard
          title={t('adminPromoted.detail.promoterInfo', 'Promoter')}
          icon={User}
        >
          <div className="flex items-center gap-3 pb-4">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                className="size-13 rounded-full object-cover ring-2 ring-[#4048cd]/20"
              />
            ) : (
              <div className="flex size-13 items-center justify-center rounded-full bg-[#4048cd] text-[18px] font-bold text-white">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-manrope text-[16px] font-bold text-[#111827]">
                {user.name}
              </p>
              {user.username ? (
                <p className="truncate text-[13px] text-[#6b7280]">@{user.username}</p>
              ) : null}
            </div>
          </div>
          <div className="divide-y divide-[#f3f4f6] border-t border-[#f3f4f6]">
            {user.email ? (
              <InfoRow
                label={t('adminPromoted.detail.email', 'Email')}
                value={user.email}
              />
            ) : null}
            {user.location ? (
              <InfoRow
                icon={MapPin}
                label={t('adminPromoted.detail.location', 'Location')}
                value={user.location}
              />
            ) : null}
          </div>
        </SectionCard>

        {/* Item Stats & Metadata */}
        <SectionCard
          title={t('adminPromoted.detail.itemStats', 'Performance & Stats')}
          icon={Layers}
        >
          <div className="divide-y divide-[#f3f4f6]">
            <InfoRow
              icon={Tag}
              label={t('adminPromoted.detail.category', 'Category')}
              value={item.category || 'General'}
            />
            <InfoRow
              icon={Eye}
              label={t('adminPromoted.viewsLabel', 'Views')}
              value={Number(item.viewsCount || 0).toLocaleString()}
            />
            <InfoRow
              icon={Heart}
              label={t('adminPromoted.heartLabel', 'Likes')}
              value={Number(item.likesCount || 0).toLocaleString()}
            />
            <InfoRow
              icon={Vote}
              label={t('adminPromoted.detail.votes', 'Votes')}
              value={Number(item.votesCount || 0).toLocaleString()}
            />
            <InfoRow
              icon={ImageIcon}
              label={t('adminPromoted.detail.mediaCount', 'Media Count')}
              value={item.mediaCount || mediaList.length || 1}
            />
            {item.competitionState ? (
              <InfoRow
                label={t('adminPromoted.detail.compState', 'State')}
                value={item.competitionState}
              />
            ) : null}
          </div>
        </SectionCard>
      </div>

      {/* Item Story / Description */}
      {item.story ? (
        <SectionCard title={t('adminPromoted.detail.story', 'Description / Story')}>
          <p className="break-words font-manrope text-[15px] leading-6 text-[#374151]">
            {item.story}
          </p>
        </SectionCard>
      ) : null}

      {/* Media Gallery (Images & Videos) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-manrope text-[18px] font-bold text-[#111827] sm:text-[20px]">
            {t('adminPromoted.detail.mediaGallery', 'Media Gallery')}{' '}
            <span className="text-[14px] font-normal text-[#6b7280]">
              ({mediaList.length})
            </span>
          </h2>
        </div>

        {mediaList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {mediaList.map((m) => (
              <MediaItemCard key={m.id} media={m} />
            ))}
          </div>
        ) : item.coverImage ? (
          <div className="max-w-xl overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-3 shadow-sm">
            <Image
              src={optimizeImageUrl(item.coverImage, 1200)}
              alt={item.title}
              width={600}
              height={320}
              className="h-80 w-full rounded-xl object-cover"
            />
          </div>
        ) : (
          <p className="py-6 text-[14px] text-[#6b7280]">
            {t('adminPromoted.detail.noMedia', 'No media items available.')}
          </p>
        )}
      </section>
    </div>
  );
});

AdminPromotedProductDetailContent.displayName =
  'AdminPromotedProductDetailContent';

export default AdminPromotedProductDetailContent;
