import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  ADMIN_BUSINESS_LINK_ASSETS,
  ARROW_ICON_SIZE,
  formatBusinessLinkDate,
  getInitials,
} from '@/portals/admin/data/adminBusinessLinkData';
import useAdminBusinessLinkDetail from '@/portals/admin/hooks/useAdminBusinessLinkDetail';
import {
  ADMIN_BUSINESS_LINKS_QUERY_KEY,
  deleteAdminBusinessLinkApi,
} from '@/shared/api/businessLinks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import { confirmDestructiveAction } from '@/shared/utils/confirmDialog';
import { getLocalizedText } from '@/shared/utils/localizedText';
import { resolveMediaUrl } from '@/shared/utils/media';

const UPLOADED_DATE_FORMAT = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

/**
 * @param {{
 *   slide: object,
 *   active: boolean,
 *   onSelect: () => void,
 * }} props
 */
const ZodiacThumb = memo(({ slide, active, onSelect }) => {
  const { t } = useTranslation();
  const isBlue = slide.theme === 'blue';
  const numberColor = isBlue ? 'text-[#4048cd]' : 'text-[#ee1c25]';
  const borderClass = active
    ? isBlue
      ? 'border-[#4048cd]'
      : 'border-[#ee1c25]'
    : 'border-transparent';

  return (
    <Button
      unstyled
      type="button"
      onClick={onSelect}
      aria-label={t('adminBusinessLink.detail.selectPhoto', {
        number: slide.number,
        sign: slide.sign,
      })}
      aria-current={active ? 'true' : undefined}
      className="flex w-[72px] min-w-[72px] cursor-pointer flex-col items-center gap-[8px] sm:w-auto sm:min-w-0 sm:flex-1"
    >
      <span
        className={`inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[16px] leading-none sm:text-[18px] ${numberColor}`}
      >
        {slide.number}
      </span>

      {/* Figma: red/blue badge with white glyph — white SVGs need the colored box */}
      {slide.icon && (
        <span
          className={`relative inline-flex size-[35px] shrink-0 items-center justify-center overflow-hidden ${
            isBlue
              ? slide.iconBoxed
                ? 'rounded-[4px] bg-[#4048cd]'
                : ''
              : 'rounded-[4px] bg-[#ee1c25] px-2.5 py-1'
          }`}
        >
          <Image
            src={slide.icon}
            alt=""
            width={35}
            height={35}
            className={`object-contain ${
              slide.iconBoxed || !isBlue ? 'h-5 w-5' : 'h-full w-full'
            }`}
          />
        </span>
      )}

      <span className="max-w-full truncate text-center text-[12px] leading-none text-[#2b2b2b] capitalize sm:text-[14px] lg:text-[16px] xl:text-[18px]">
        {slide.sign}
      </span>

      <span
        className={`mt-1 block size-[64px] overflow-hidden rounded-[8px] border-[3px] sm:size-[80px] lg:h-[100px] lg:w-full lg:max-w-[112px] ${borderClass}`}
      >
        <Image src={slide.thumb} alt="" className="size-full object-cover" />
      </span>
    </Button>
  );
});

ZodiacThumb.displayName = 'ZodiacThumb';

/**
 * @param {{ src?: string | null, name: string, className: string }} props
 */
const UserAvatar = memo(({ src, name, className }) =>
  src ? (
    <Image
      src={resolveMediaUrl(src)}
      alt=""
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[#eff4ff] font-bold text-[#2563eb] ${className}`}
    >
      {getInitials(name)}
    </div>
  ),
);

UserAvatar.displayName = 'UserAvatar';

/** @param {{ children: React.ReactNode }} props */
const DetailBadge = ({ children }) => (
  <div className="flex items-center justify-center gap-2.5 rounded-[50px] bg-violet-100 px-4 py-1.5">
    <div className="font-manrope text-[13px] font-bold uppercase leading-5 tracking-wider text-indigo-700 sm:text-[14px]">
      {children}
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="flex w-full flex-col gap-6 py-2 sm:py-4" aria-busy="true">
    <div className="h-4 w-48 animate-pulse rounded bg-[#f3f4f6]" />
    <div className="h-44 w-full animate-pulse rounded-[24px] bg-[#f3f4f6]" />
    <div className="aspect-[1536/653] w-full animate-pulse rounded-[20px] bg-[#f3f4f6]" />
    <div className="h-8 w-2/3 animate-pulse rounded bg-[#f3f4f6]" />
    <div className="h-24 w-full animate-pulse rounded bg-[#f3f4f6]" />
  </div>
);

/**
 * @param {{ message: string, onRetry?: () => void }} props
 */
const DetailMessage = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-start gap-4 py-6">
      <p className="text-[16px] text-[#687186]">{message}</p>
      <div className="flex flex-wrap items-center gap-4">
        {onRetry && (
          <Button
            unstyled
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-xl border border-[#4048cd] px-4 py-2 text-[16px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
          >
            {t('adminBusinessLink.retry')}
          </Button>
        )}
        <Link
          to={ROUTES.ADMIN_BUSINESS_PHOTOS}
          className="text-[16px] font-medium text-[#4048cd] hover:underline"
        >
          {t('adminBusinessLink.detail.back')}
        </Link>
      </div>
    </div>
  );
};

/**
 * Admin Business Link Details — Figma node 345:1130.
 */
const AdminBusinessLinkDetailContent = memo(() => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    detail,
    isLoading,
    isError,
    isNotFound,
    notFoundMessage,
    errorMessage,
    refetch,
    slides,
    activeIndex,
    activeSlide,
    goPrev,
    goNext,
    selectSlide,
  } = useAdminBusinessLinkDetail(id);

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminBusinessLinkApi(id),
    onSuccess: () => {
      toast.success(t('adminBusinessLink.detail.deleteSuccess'));
      queryClient.invalidateQueries({
        queryKey: ADMIN_BUSINESS_LINKS_QUERY_KEY,
      });
      navigate(ROUTES.ADMIN_BUSINESS_PHOTOS, { replace: true });
    },
    onError: (err) => {
      toast.error(
        getApiErrorMessage(err, t('adminBusinessLink.detail.deleteError')),
      );
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirmDestructiveAction({
      title: t('adminBusinessLink.detail.confirmDelete.title'),
      text: t('adminBusinessLink.detail.confirmDelete.text'),
      confirmButtonText: t('adminBusinessLink.detail.confirmDelete.confirm'),
      cancelButtonText: t('adminBusinessLink.detail.confirmDelete.cancel'),
    });
    if (confirmed) {
      await deleteMutation.mutateAsync();
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError && !isNotFound) {
    return <DetailMessage message={errorMessage} onRetry={() => refetch()} />;
  }

  if (!detail) {
    return (
      <DetailMessage
        message={notFoundMessage || t('adminBusinessLink.detail.notFound')}
      />
    );
  }

  const ownerName = detail.user?.name || detail.email || '—';
  const ownerEmail = detail.email || detail.user?.email || '—';
  const avatar = detail.user?.avatar;
  const ownerUsername = String(detail.user?.username || '')
    .trim()
    .replace(/^@/, '');
  const profileHref = ownerUsername
    ? `/photographer/${encodeURIComponent(ownerUsername)}`
    : null;
  const title = getLocalizedText(detail.title, i18n.language);
  const story = getLocalizedText(detail.story, i18n.language);
  const categoryName = getLocalizedText(detail.category?.name, i18n.language);
  const kindLabel = detail.kind
    ? t(`adminBusinessLink.detail.kinds.${detail.kind.toLowerCase()}`, {
        defaultValue: detail.kind,
      })
    : '';
  // Business links are shareable as soon as uploaded — no approval gate.
  const statusLabel = t('adminBusinessLink.detail.status.live', 'Live');
  const statusClass = 'bg-[#ecfdf5] text-[#059669]';

  const isBlueTheme = activeSlide?.theme === 'blue';
  const badgeBg = isBlueTheme ? 'bg-[#4048cd]' : 'bg-[#ee1c25]';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(detail.businessLink);
      toast.success(t('adminBusinessLink.detail.copySuccess'));
    } catch {
      toast.error(t('adminBusinessLink.detail.copyFailed'));
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 py-2 sm:gap-8 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] text-[#687186]">
          <Link
            to={ROUTES.ADMIN_BUSINESS_PHOTOS}
            className="hover:text-[#4048cd] hover:underline"
          >
            {t('adminBusinessLink.title')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111827]">{ownerName}</span>
        </div>

        <Button
          unstyled
          type="button"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ee1c25] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#d41921] disabled:opacity-50 sm:text-[14px]"
        >
          <Trash2 size={16} aria-hidden="true" />
          {t('adminBusinessLink.detail.delete')}
        </Button>
      </div>

      {/* Profile card */}
      <section className="rounded-[20px] border border-[#f3f4f6] bg-white p-4 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              src={avatar}
              name={ownerName}
              className="size-12 text-[15px] sm:size-14 sm:text-[16px]"
            />
            <div className="min-w-0">
              <h1 className="font-manrope text-[16px] font-bold tracking-tight text-[#111827] sm:text-[18px] sm:leading-7">
                {ownerName}
              </h1>
              <p className="break-all text-[13px] leading-5 text-[#6b7280] sm:text-[14px]">
                {ownerEmail}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-[12px] font-semibold leading-5 ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="my-5 h-px w-full bg-[#f3f4f6]" />

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <dt className="text-[12px] font-medium leading-5 text-[#9ca3af] sm:text-[13px]">
              {t('adminBusinessLink.detail.phone')}
            </dt>
            <dd className="text-[14px] font-medium leading-6 text-[#374151] sm:text-[15px]">
              {detail.phone || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium leading-5 text-[#9ca3af] sm:text-[13px]">
              {t('adminBusinessLink.detail.countryLabel')}
            </dt>
            <dd className="text-[14px] font-medium leading-6 text-[#374151] sm:text-[15px]">
              {detail.country || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium leading-5 text-[#9ca3af] sm:text-[13px]">
              {t('adminBusinessLink.detail.uploadedLabel')}
            </dt>
            <dd className="text-[14px] font-medium leading-6 text-[#374151] sm:text-[15px]">
              {formatBusinessLinkDate(
                detail.createdAt,
                i18n.language,
                UPLOADED_DATE_FORMAT,
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-medium leading-5 text-[#9ca3af] sm:text-[13px]">
              {t('adminBusinessLink.detail.albumIdLabel')}
            </dt>
            <dd className="text-[14px] font-bold leading-6 text-[#111827] sm:text-[15px]">
              {detail.albumId || '—'}
            </dd>
          </div>
        </dl>
      </section>

      {/* Hero viewer */}
      {activeSlide ? (
        <section
          aria-label={t('adminBusinessLink.detail.galleryAria')}
          className="flex flex-col gap-4"
        >
          <div className="relative aspect-[1536/653] w-full overflow-hidden rounded-[16px] bg-[#f3f4f6] sm:rounded-[20px]">
            <Image
              src={activeSlide.hero}
              alt={title ? `${title} — ${activeSlide.sign}` : activeSlide.sign}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className={`absolute left-4 top-4 inline-flex items-end gap-2 rounded-[20px] px-4 py-1.5 sm:left-6 sm:top-6 ${badgeBg}`}
            >
              <Image
                src={activeSlide.icon || ADMIN_BUSINESS_LINK_ASSETS.ariesWhite}
                alt=""
                width={24}
                height={21}
                className="h-[21px] w-6 object-contain"
              />
              <span className="text-[14px] text-white sm:text-[16px]">
                {activeSlide.sign}
              </span>
            </div>

            {slides.length > 1 && (
              <>
                <Button
                  unstyled
                  type="button"
                  aria-label={t('adminBusinessLink.detail.previousPhoto')}
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:left-4 sm:size-[51px]"
                >
                  <Image
                    src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
                    alt=""
                    width={ARROW_ICON_SIZE}
                    height={32}
                    className="h-8 w-4 rotate-180"
                  />
                </Button>
                <Button
                  unstyled
                  type="button"
                  aria-label={t('adminBusinessLink.detail.nextPhoto')}
                  onClick={goNext}
                  className="absolute right-3 top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 transition hover:bg-white sm:right-4 sm:size-[51px]"
                >
                  <Image
                    src={ADMIN_BUSINESS_LINK_ASSETS.arrow}
                    alt=""
                    width={ARROW_ICON_SIZE}
                    height={32}
                    className="h-8 w-4"
                  />
                </Button>
              </>
            )}
          </div>

          <div className="w-full px-1 sm:px-4" aria-hidden="true">
            <Image
              src={ADMIN_BUSINESS_LINK_ASSETS.curve}
              alt=""
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max items-start justify-between gap-3 px-1 sm:min-w-0 sm:gap-2 md:gap-3">
              {slides.map((slide, index) => (
                <ZodiacThumb
                  key={slide.id}
                  slide={slide}
                  active={index === activeIndex}
                  onSelect={() => selectSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <p className="rounded-[16px] bg-white px-6 py-10 text-center text-[16px] text-[#687186]">
          {t('adminBusinessLink.detail.noPhotos')}
        </p>
      )}

      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full flex-col gap-6">
          <section
            className="inline-flex w-full flex-col items-start justify-start gap-3"
            aria-labelledby="business-link-photo-title"
          >
            <div className="inline-flex flex-wrap items-start justify-start gap-2 sm:gap-3">
              {kindLabel && <DetailBadge>{kindLabel}</DetailBadge>}
              {categoryName && <DetailBadge>{categoryName}</DetailBadge>}
              {detail.isAiGenerated && (
                <DetailBadge>
                  {t('adminBusinessLink.detail.aiGenerated')}
                </DetailBadge>
              )}
            </div>

            <div className="flex w-full flex-col items-start justify-start gap-3 self-stretch">
              <h2
                id="business-link-photo-title"
                className="w-full self-stretch font-manrope text-[28px] font-semibold leading-tight text-[#111827] sm:text-[32px]"
              >
                {title || t('adminBusinessLink.detail.untitled')}
              </h2>
              {story && (
                <p className="w-full self-stretch whitespace-pre-line font-manrope text-[15px] font-medium leading-6 text-neutral-700 sm:text-[16px] sm:leading-7">
                  {story}
                </p>
              )}
            </div>
          </section>

          {detail.businessLink && (
            <section className="flex w-full flex-col gap-4 rounded-[20px] border border-solid border-[#f3f4f6] bg-white p-5 shadow-[0px_8px_15px_rgba(0,0,0,0.04)] sm:p-6">
              <div className="flex w-full items-center justify-between gap-3">
                <h3 className="font-manrope text-[15px] font-bold leading-6 tracking-tight text-[#111827] sm:text-[16px]">
                  {t('adminBusinessLink.detail.linkLabel')}
                </h3>
                <span className="shrink-0 text-[12px] font-medium leading-5 text-[#6b7280] sm:text-[13px]">
                  {t('adminBusinessLink.detail.autoGenerated')}
                </span>
              </div>

              <div className="w-full rounded-[12px] border border-dashed border-[#d1d5db] bg-[#f9fafb] px-4 py-3 sm:px-5">
                <p className="break-all font-mono text-[13px] leading-5 tracking-[-0.2px] text-[#1f2937] sm:truncate sm:whitespace-nowrap sm:text-[14px]">
                  {detail.businessLink}
                </p>
              </div>

              <div className="flex w-full items-center">
                <Button
                  unstyled
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#4048cd] px-4 py-2.5 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#343aa8]"
                >
                  <Image
                    src={ADMIN_BUSINESS_LINK_ASSETS.copy}
                    alt=""
                    width={16}
                    height={16}
                    className="size-4 shrink-0"
                  />
                  <span className="text-[14px] font-semibold leading-5 text-white">
                    {t('adminBusinessLink.detail.copyLink')}
                  </span>
                </Button>
              </div>
            </section>
          )}

          <div className="h-0 w-full" aria-hidden="true">
            <Image
              src={ADMIN_BUSINESS_LINK_ASSETS.divider}
              alt=""
              className="block h-px w-full max-w-none"
            />
          </div>
        </div>

        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {profileHref ? (
            <Link
              to={profileHref}
              className="inline-flex items-center gap-3 rounded-xl transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4048cd]"
              aria-label={t('adminBusinessLink.detail.viewProfile', {
                name: ownerName,
                defaultValue: `View ${ownerName}'s profile`,
              })}
            >
              <UserAvatar
                src={avatar}
                name={ownerName}
                className="size-12 text-[15px]"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  {t('adminBusinessLink.detail.photographerLabel')}
                </p>
                <p className="text-[15px] font-semibold text-[#111827] hover:text-[#4048cd] sm:text-[16px]">
                  {ownerName}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <UserAvatar
                src={avatar}
                name={ownerName}
                className="size-12 text-[15px]"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  {t('adminBusinessLink.detail.photographerLabel')}
                </p>
                <p className="text-[15px] font-semibold text-[#111827] sm:text-[16px]">
                  {ownerName}
                </p>
              </div>
            </div>
          )}

          {profileHref ? (
            <Link
              to={profileHref}
              className="inline-flex w-fit cursor-pointer items-center justify-center rounded-lg bg-[#4048cd] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#343aa8] sm:text-[14px]"
            >
              {t('adminBusinessLink.detail.visitProfile', 'Visit profile')}
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
});

AdminBusinessLinkDetailContent.displayName = 'AdminBusinessLinkDetailContent';

export default AdminBusinessLinkDetailContent;
