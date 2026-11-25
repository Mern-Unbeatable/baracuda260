import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Heart, Loader2, Trophy } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectUser,
} from '@/app/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { getApiErrorMessage } from '@/shared/api/client';
import {
  USER_ARTWORKS_QUERY_KEY,
  voteArtworkApi,
} from '@/shared/api/artworks.api';
import { ROUTES } from '@/shared/config';
import { optimizeImageUrl } from '@/shared/utils/media';

const PhotographerCompetitionBanner = memo(
  ({ featured, photographerName, userId, username }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState(() =>
      Array.isArray(featured) ? featured.filter(Boolean) : featured ? [featured] : [],
    );

    useEffect(() => {
      setItems(
        Array.isArray(featured)
          ? featured.filter(Boolean)
          : featured
            ? [featured]
            : [],
      );
      setIndex(0);
    }, [featured]);

    const current = items[index] || items[0];

    const isOwnProfile = Boolean(
      user &&
        (user.id === userId ||
          (username && user.username === username) ||
          (user.username &&
            photographerName
              ?.toLowerCase()
              .includes(String(user.username).toLowerCase()))),
    );

    const voteMutation = useMutation({
      mutationFn: (artworkId) => voteArtworkApi(artworkId),
      onSuccess: (_data, artworkId) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === artworkId
              ? { ...item, votes: Number(item.votes || 0) + 1 }
              : item,
          ),
        );
        toast.success(
          t('photographerProfile.featured.voteSuccess', 'Vote cast successfully.'),
        );
        queryClient.invalidateQueries({ queryKey: USER_ARTWORKS_QUERY_KEY });
        if (username) {
          queryClient.invalidateQueries({
            queryKey: ['profile-competition-artworks', username],
          });
          queryClient.invalidateQueries({
            queryKey: ['profile-artworks', username],
          });
        }
      },
      onError: (error) => {
        toast.error(
          getApiErrorMessage(
            error,
            t('photographerProfile.featured.voteFailed', 'Failed to cast vote.'),
          ),
        );
      },
    });

    if (!current) return null;

    const go = (dir) => {
      setIndex((prev) => (prev + dir + items.length) % items.length);
    };

    const handleVote = () => {
      if (!current?.id || voteMutation.isPending) return;
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, { state: { from: window.location.pathname } });
        return;
      }
      if (isOwnProfile) return;
      voteMutation.mutate(current.id);
    };

    return (
      <section className="relative mt-6 sm:mt-8">
        {items.length > 1 ? (
          <>
            <Button
              unstyled
              type="button"
              aria-label={t('photographerProfile.featured.previous')}
              onClick={() => go(-1)}
              className="absolute -left-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 cursor-pointer select-none items-center justify-center rounded-full bg-white text-[#111827] shadow-md transition hover:scale-105 hover:shadow-lg sm:size-10 lg:-left-5"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </Button>
            <Button
              unstyled
              type="button"
              aria-label={t('photographerProfile.featured.next')}
              onClick={() => go(1)}
              className="absolute -right-2 top-1/2 z-10 inline-flex size-9 -translate-y-1/2 cursor-pointer select-none items-center justify-center rounded-full bg-white text-[#111827] shadow-md transition hover:scale-105 hover:shadow-lg sm:size-10 lg:-right-5"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </Button>
          </>
        ) : null}

        <div className="overflow-hidden rounded-2xl bg-[#1e293b]">
          <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-stretch lg:gap-6 lg:p-6">
            <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl lg:aspect-auto lg:h-auto lg:w-[42%]">
              <Image
                src={optimizeImageUrl(current.image, 900)}
                alt={current.subtitle}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#fbbf24]/15 px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-[#fbbf24]">
                    {t('photographerProfile.featured.badge')}
                  </span>
                  <span className="text-[12px] font-medium text-white/70">
                    {t('photographerProfile.featured.uploaded', {
                      date: current.uploaded,
                    })}
                  </span>
                </div>
                <Button
                  unstyled
                  type="button"
                  disabled={isOwnProfile || voteMutation.isPending}
                  onClick={handleVote}
                  title={
                    isOwnProfile
                      ? t('photographerProfile.featured.cannotVoteOwn')
                      : undefined
                  }
                  className={`inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-bold text-white transition ${
                    isOwnProfile
                      ? 'cursor-not-allowed bg-[#ef4444]/50'
                      : 'cursor-pointer bg-[#ee1c25] hover:bg-[#d01820] disabled:cursor-not-allowed disabled:opacity-60'
                  }`}
                >
                  {voteMutation.isPending ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Heart size={15} className="fill-white" aria-hidden="true" />
                  )}
                  {t('photographerProfile.featured.castVote')}
                </Button>
              </div>

              <h2 className="mt-4 text-[20px] font-bold leading-snug text-white sm:text-[24px]">
                {current.title}
              </h2>
              <p className="mt-2 text-[15px] italic text-white/75">
                “{current.subtitle}”
              </p>

              <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Heart
                      size={14}
                      className="text-[#ee1c25]"
                      aria-hidden="true"
                    />
                    {t('photographerProfile.featured.votes', {
                      count: current.votes,
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy
                      size={14}
                      className="text-[#fbbf24]"
                      aria-hidden="true"
                    />
                    {t('photographerProfile.featured.rank', {
                      rank: current.rank,
                    })}
                  </span>
                  <span>
                    {t('photographerProfile.featured.votingEnds', {
                      date: current.votingEnds,
                    })}
                  </span>
                </div>
                {current.detailHref ? (
                  <Link
                    to={current.detailHref}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-white/80 transition hover:text-white"
                  >
                    {t('photographerProfile.featured.inspect')}
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

PhotographerCompetitionBanner.displayName = 'PhotographerCompetitionBanner';

export default PhotographerCompetitionBanner;
