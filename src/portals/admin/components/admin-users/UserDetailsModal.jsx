import { BadgeCheck, TriangleAlert, X } from 'lucide-react';
import React, { memo, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import UserAvatar from '@/portals/admin/components/admin-users/UserAvatar';
import UserStatusBadge from '@/portals/admin/components/admin-users/UserStatusBadge';
import {
  formatUserDate,
  getUserRoleLabel,
  isUsableImageUrl,
} from '@/portals/admin/data/adminUsersData';

const DATE_FORMAT = { year: 'numeric', month: 'short', day: 'numeric' };
const DATE_TIME_FORMAT = { ...DATE_FORMAT, hour: '2-digit', minute: '2-digit' };

/**
 * @param {{ labelKey: string, children: React.ReactNode }} props
 */
const DetailItem = ({ labelKey, children }) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-[12px] font-medium uppercase leading-4 tracking-[0.4px] text-[#7f8ba1]">
        {t(labelKey)}
      </dt>
      <dd className="break-words text-[14px] leading-5 text-[#202838]">
        {children}
      </dd>
    </div>
  );
};

/** @param {{ src?: string | null }} props */
const CoverPhoto = ({ src }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="h-28 w-full bg-gradient-to-r from-[#4048cd] to-[#7b82e8] sm:h-32">
      {isUsableImageUrl(src) && !failed ? (
        <Image
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : null}
    </div>
  );
};

const DetailsSkeleton = () => (
  <div className="flex flex-col gap-4 p-6" aria-busy="true">
    <div className="h-28 w-full animate-pulse rounded-lg bg-[#f3f4f6]" />
    <div className="h-5 w-1/2 animate-pulse rounded bg-[#f3f4f6]" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-10 animate-pulse rounded bg-[#f3f4f6]" />
      ))}
    </div>
  </div>
);

/**
 * Read-only admin view of a user profile.
 * @param {{
 *   open: boolean,
 *   user: object | null,
 *   isLoading: boolean,
 *   isError: boolean,
 *   errorMessage: string,
 *   onRetry: () => void,
 *   onClose: () => void,
 * }} props
 */
const UserDetailsModal = memo(
  ({ open, user, isLoading, isError, errorMessage, onRetry, onClose }) => {
    const { t, i18n } = useTranslation();
    const titleId = useId();

    useEffect(() => {
      if (!open) return undefined;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [open, onClose]);

    if (!open) return null;

    const location = [user?.city, user?.country].filter(Boolean).join(', ');
    const hasSuspension = Boolean(user?.suspendReason || user?.suspendedAt);

    let body;
    if (isLoading) {
      body = <DetailsSkeleton />;
    } else if (isError || !user) {
      body = (
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <p className="text-[14px] text-[#ee1c25]">{errorMessage}</p>
          <Button
            unstyled
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg border border-[#4048cd] px-4 py-2 text-[14px] font-medium text-[#4048cd] transition hover:bg-[#f6fbff]"
          >
            {t('adminUsers.retry')}
          </Button>
        </div>
      );
    } else {
      body = (
        <>
          <CoverPhoto src={user.coverPhoto} />
          <div className="flex flex-col gap-5 px-6 pb-6">
            <div className="-mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <UserAvatar
                src={user.avatar}
                name={user.name}
                className="size-20 text-[24px] ring-4 ring-white"
              />
              <UserStatusBadge status={user.status} />
            </div>

            <div className="flex flex-col gap-1">
              <h2
                id={titleId}
                className="font-manrope flex flex-wrap items-center gap-2 text-[20px] font-bold leading-7 tracking-[-0.5px] text-[#202838]"
              >
                {user.name || '—'}
                {user.isVerified ? (
                  <BadgeCheck
                    size={20}
                    className="text-[#4048cd]"
                    aria-label={t('adminUsers.detailsModal.verified')}
                  />
                ) : null}
              </h2>
              {user.username ? (
                <p className="text-[14px] leading-5 text-[#7f8ba1]">
                  @{user.username}
                </p>
              ) : null}
            </div>

            {hasSuspension ? (
              <div className="flex gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-3">
                <TriangleAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-[#dc2626]"
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-col gap-0.5 text-[13px] leading-5">
                  <p className="font-semibold text-[#b91c1c]">
                    {t('adminUsers.detailsModal.suspendReason')}
                  </p>
                  <p className="break-words text-[#7f1d1d]">
                    {user.suspendReason || '—'}
                  </p>
                  {user.suspendedAt ? (
                    <p className="text-[#991b1b]">
                      {t('adminUsers.detailsModal.suspendedAt', {
                        date: formatUserDate(
                          user.suspendedAt,
                          i18n.language,
                          DATE_TIME_FORMAT,
                        ),
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem labelKey="adminUsers.detailsModal.email">
                {user.email || '—'}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.phone">
                {user.phone || '—'}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.role">
                {getUserRoleLabel(t, user.role)}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.verification">
                {user.isVerified
                  ? t('adminUsers.detailsModal.verified')
                  : t('adminUsers.detailsModal.notVerified')}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.location">
                {location || '—'}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.joined">
                {formatUserDate(user.createdAt, i18n.language, DATE_FORMAT)}
              </DetailItem>
              <DetailItem labelKey="adminUsers.detailsModal.lastLogin">
                {user.lastLoginAt
                  ? formatUserDate(
                      user.lastLoginAt,
                      i18n.language,
                      DATE_TIME_FORMAT,
                    )
                  : t('adminUsers.detailsModal.never')}
              </DetailItem>
            </dl>

            {user.bio ? (
              <div className="flex flex-col gap-1 border-t border-[#edf0f3] pt-4">
                <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.4px] text-[#7f8ba1]">
                  {t('adminUsers.detailsModal.bio')}
                </p>
                <p className="whitespace-pre-line text-[14px] leading-6 text-[#455163]">
                  {user.bio}
                </p>
              </div>
            ) : null}
          </div>
        </>
      );
    }

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 p-4 backdrop-blur-[6px]"
        role="presentation"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={user ? titleId : undefined}
          aria-label={user ? undefined : t('adminUsers.detailsModal.title')}
          className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-y-auto rounded-xl bg-white shadow-[0px_22px_70px_0px_rgba(14,20,35,0.25)]"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            unstyled
            type="button"
            onClick={onClose}
            aria-label={t('adminUsers.detailsModal.close')}
            className="absolute right-3 top-3 z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#455163] shadow-sm transition hover:bg-white"
          >
            <X size={18} aria-hidden="true" />
          </Button>
          {body}
        </div>
      </div>,
      document.body,
    );
  },
);

UserDetailsModal.displayName = 'UserDetailsModal';

export default UserDetailsModal;
