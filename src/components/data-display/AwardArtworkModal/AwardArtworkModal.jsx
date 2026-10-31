import { useQueryClient } from '@tanstack/react-query';
import { Camera, Check, Loader2, Sparkles, X } from 'lucide-react';
import React, { memo, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { awardArtworkAppreciationApi } from '@/shared/api/artworks.api';
import { getApiErrorMessage } from '@/shared/api/client';
import { ROUTES } from '@/shared/config';
import { getDaysUntilNextSundayMidnight } from '@/shared/utils/weekReset';

const TIER_CONFIG = {
  GOLD: {
    id: 'gold',
    key: 'GOLD',
    label: 'Gold Camera',
    titleKey: 'photographerProfile.appreciation.tiers.gold',
    badge:
      'bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] border border-[#eab308] text-[#713f12]',
    iconColor: 'text-[#854d0e]',
    btn: 'bg-gradient-to-r from-[#fde047] to-[#eab308] text-[#713f12] font-semibold hover:from-[#eab308] hover:to-[#ca8a04] hover:text-white',
    dot: 'bg-[#eab308]',
  },
  SILVER: {
    id: 'silver',
    key: 'SILVER',
    label: 'Silver Camera',
    titleKey: 'photographerProfile.appreciation.tiers.silver',
    badge: 'bg-[#f1f5f9] border border-[#e2e8f0] text-[#475569]',
    iconColor: 'text-[#64748b]',
    btn: 'bg-[#e2e8f0] text-[#475569] font-semibold hover:bg-[#64748b] hover:text-white',
    dot: 'bg-[#94a3b8]',
  },
  BRONZE: {
    id: 'bronze',
    key: 'BRONZE',
    label: 'Bronze Camera',
    titleKey: 'photographerProfile.appreciation.tiers.bronze',
    badge: 'bg-[#fff7ed] border border-[#fed7aa] text-[#9a3412]',
    iconColor: 'text-[#b45309]',
    btn: 'bg-[#ffedd5] text-[#9a3412] font-semibold hover:bg-[#b45309] hover:text-white',
    dot: 'bg-[#b45309]',
  },
};

const normalizeAppreciationData = (raw) => {
  const defaultWeekly = { gold: 1, silver: 1, bronze: 1 };
  const defaultTiers = { gold: 0, silver: 0, bronze: 0 };

  if (!raw) {
    return {
      tiers: defaultTiers,
      weekly: defaultWeekly,
      myAward: null,
      hasAwardedThisWeek: false,
      resetDays: getDaysUntilNextSundayMidnight(),
    };
  }

  if (Array.isArray(raw.tiers)) {
    const map = { gold: 0, silver: 0, bronze: 0 };
    raw.tiers.forEach((t) => {
      if (t?.id && map[t.id] !== undefined) {
        map[t.id] = Number(t.count) || 0;
      }
    });
    return {
      tiers: map,
      weekly: raw.weekly || defaultWeekly,
      myAward: raw.myAward || null,
      hasAwardedThisWeek: Boolean(raw.hasAwardedThisWeek),
      resetDays:
        typeof raw.resetInDays === 'number'
          ? raw.resetInDays
          : getDaysUntilNextSundayMidnight(),
    };
  }

  const myAward = raw.myAward || null;
  const hasAwardedThisWeek = Boolean(raw.hasAwardedThisWeek);
  const canAward = raw.canAward !== false;

  return {
    tiers: {
      gold: Number(raw.gold) || 0,
      silver: Number(raw.silver) || 0,
      bronze: Number(raw.bronze) || 0,
    },
    weekly: raw.weekly || {
      gold: canAward && (!hasAwardedThisWeek || myAward !== 'gold') ? 1 : 0,
      silver: canAward && (!hasAwardedThisWeek || myAward !== 'silver') ? 1 : 0,
      bronze: canAward && (!hasAwardedThisWeek || myAward !== 'bronze') ? 1 : 0,
    },
    myAward,
    hasAwardedThisWeek,
    resetDays:
      typeof raw.resetInDays === 'number'
        ? raw.resetInDays
        : getDaysUntilNextSundayMidnight(),
  };
};

const AwardArtworkModal = memo(
  ({
    open,
    onClose,
    submissionId,
    artworkTitle,
    photographerName,
    artworkImage,
    appreciation,
    userId,
    onSuccess,
  }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectUser);

    const initial = useMemo(
      () => normalizeAppreciationData(appreciation),
      [appreciation],
    );

    const [tierCounts, setTierCounts] = useState(initial.tiers);
    const [weeklyLimits, setWeeklyLimits] = useState(initial.weekly);
    const [awardedTier, setAwardedTier] = useState(initial.myAward);
    const [submittingTier, setSubmittingTier] = useState(null);

    useEffect(() => {
      const normalized = normalizeAppreciationData(appreciation);
      setTierCounts(normalized.tiers);
      setWeeklyLimits(normalized.weekly);
      setAwardedTier(normalized.myAward);
    }, [appreciation]);

    if (!open) return null;

    const isOwnArtwork = Boolean(
      currentUser &&
        ((userId && currentUser.id === userId) ||
          (currentUser.firstName &&
            photographerName
              ?.toLowerCase()
              .includes(currentUser.firstName.toLowerCase())) ||
          (currentUser.username &&
            photographerName
              ?.toLowerCase()
              .includes(currentUser.username.toLowerCase()))),
    );

    const handleAward = async (tierKey) => {
      if (!isAuthenticated) {
        toast.error(
          t(
            'photographerProfile.appreciation.loginPrompt',
            'Please sign in to give appreciation awards.',
          ),
        );
        onClose();
        navigate(ROUTES.LOGIN, { state: { from: location } });
        return;
      }

      if (isOwnArtwork) {
        toast.error(
          t(
            'photographerProfile.appreciation.cannotAwardOwn',
            'You cannot award your own artwork.',
          ),
        );
        return;
      }

      if (!submissionId) {
        toast.error(
          t(
            'photographerProfile.appreciation.noSubmission',
            'Artwork ID is missing.',
          ),
        );
        return;
      }

      const tierId = tierKey.toLowerCase();
      if ((weeklyLimits?.[tierId] ?? 0) === 0 || awardedTier === tierId) {
        toast.error(
          t(
            'photographerProfile.appreciation.alreadyAwarded',
            'Already awarded this week.',
          ),
        );
        return;
      }

      try {
        setSubmittingTier(tierKey);
        const res = await awardArtworkAppreciationApi({
          submissionId,
          tier: tierKey,
        });

        // Optimistic update
        setTierCounts((prev) => ({
          ...prev,
          [tierId]: (prev[tierId] || 0) + 1,
        }));
        setWeeklyLimits((prev) => ({
          ...prev,
          [tierId]: 0,
        }));
        setAwardedTier(tierId);

        // Invalidate relevant react-query caches
        queryClient.invalidateQueries({
          queryKey: ['artwork-detail', submissionId],
        });
        queryClient.invalidateQueries({ queryKey: ['artworks'] });
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });

        toast.success(
          res?.message ||
            t(
              'photographerProfile.appreciation.awardSuccess',
              'Award sent successfully!',
            ),
        );

        if (onSuccess) {
          onSuccess(res);
        }
      } catch (err) {
        toast.error(
          getApiErrorMessage(
            err,
            t('common.errors.general', 'Failed to award appreciation.'),
          ),
        );
      } finally {
        setSubmittingTier(null);
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-modal-title"
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-7">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
            className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Sparkles size={18} />
            </span>
            <div>
              <h2
                id="award-modal-title"
                className="text-[18px] font-bold text-gray-900 sm:text-[20px]"
              >
                {t('photographerProfile.appreciation.title', {
                  defaultValue: 'Artwork Appreciation',
                })}
              </h2>
              <p className="text-[12px] text-gray-500">
                {t(
                  'photographerProfile.appreciation.modalSubtitle',
                  'Recognize this masterpiece with a weekly Camera Award',
                )}
              </p>
            </div>
          </div>

          {/* Artwork Info Snippet */}
          {(artworkTitle || photographerName) && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
              {artworkImage && (
                <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  <Image
                    src={artworkImage}
                    alt={artworkTitle || 'Artwork'}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {artworkTitle && (
                  <p className="truncate text-[14px] font-semibold text-gray-900">
                    {artworkTitle}
                  </p>
                )}
                {photographerName && (
                  <p className="truncate text-[12px] text-gray-500">
                    {t('galleryDetail.by', { defaultValue: 'by' })}{' '}
                    {photographerName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Three Tiers */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Object.values(TIER_CONFIG).map((tier) => {
              const count = tierCounts[tier.id] ?? 0;
              const hasAwarded = awardedTier === tier.id;
              const isAvailable =
                (weeklyLimits[tier.id] ?? 0) > 0 && !hasAwarded;
              const isDisabled =
                isOwnArtwork || !isAvailable || Boolean(submittingTier);
              const isCurrentSubmitting = submittingTier === tier.key;

              return (
                <article
                  key={tier.key}
                  className={`relative flex flex-col items-center rounded-xl border p-4 text-center transition ${
                    hasAwarded
                      ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`relative inline-flex size-12 items-center justify-center rounded-full ${tier.badge}`}
                  >
                    <Camera size={22} className={tier.iconColor} />
                    {hasAwarded && (
                      <span className="absolute -bottom-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </span>

                  <p className="mt-2 text-[11px] font-bold tracking-wider text-gray-900 uppercase">
                    {t(tier.titleKey, { defaultValue: tier.label })}
                  </p>

                  <p className="mt-1 text-[20px] font-extrabold leading-none text-gray-900">
                    {count}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 tracking-wider">
                    {t('photographerProfile.appreciation.awards', {
                      defaultValue: 'AWARDS',
                    })}
                  </p>

                  <Button
                    unstyled
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleAward(tier.key)}
                    className={`mt-3 inline-flex h-8 w-full items-center justify-center rounded-lg px-2 text-[12px] font-semibold transition ${
                      isDisabled
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : `cursor-pointer ${tier.btn}`
                    }`}
                  >
                    {isCurrentSubmitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : isOwnArtwork ? (
                      t(
                        'photographerProfile.appreciation.cannotAwardOwnShort',
                        {
                          defaultValue: 'Own Artwork',
                        },
                      )
                    ) : hasAwarded ? (
                      t('photographerProfile.appreciation.awarded', {
                        defaultValue: 'Awarded',
                      })
                    ) : (
                      t(`photographerProfile.appreciation.give.${tier.id}`, {
                        defaultValue: `+ ${tier.key}`,
                      })
                    )}
                  </Button>
                </article>
              );
            })}
          </div>

          {/* Reset Information Footer */}
          <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 text-[12px] text-gray-600">
            <span>
              {t('photographerProfile.appreciation.resetIn', {
                days: initial.resetDays,
                defaultValue: `Resets in ${initial.resetDays} days`,
              })}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400">
                {t('photographerProfile.appreciation.weeklyLabel', {
                  defaultValue: 'WEEKLY QUOTA',
                })}
              </span>
              <span className="font-semibold text-gray-700">
                {Object.values(weeklyLimits).reduce((a, b) => a + b, 0)}/3
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

AwardArtworkModal.displayName = 'AwardArtworkModal';

export default AwardArtworkModal;
