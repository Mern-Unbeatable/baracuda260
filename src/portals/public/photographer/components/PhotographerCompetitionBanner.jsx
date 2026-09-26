import { ChevronLeft, ChevronRight, Heart, Trophy } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

import { useSelector } from 'react-redux';
import { selectUser } from '@/app/store/slices/authSlice';

const PhotographerCompetitionBanner = memo(
  ({ featured, photographerName, userId }) => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const [index, setIndex] = useState(0);
    const items = Array.isArray(featured) ? featured : [featured];
    const current = items[index] || items[0];

    const isOwnProfile = Boolean(
      user &&
        (user.id === userId ||
          (user.firstName &&
            photographerName
              ?.toLowerCase()
              .includes(user.firstName.toLowerCase())) ||
          (user.username &&
            photographerName
              ?.toLowerCase()
              .includes(user.username.toLowerCase()))),
    );

    if (!current) return null;

    const go = (dir) => {
      setIndex((prev) => (prev + dir + items.length) % items.length);
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
              className="absolute -left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#111827] shadow-md sm:inline-flex lg:-left-5"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </Button>
            <Button
              unstyled
              type="button"
              aria-label={t('photographerProfile.featured.next')}
              onClick={() => go(1)}
              className="absolute -right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#111827] shadow-md sm:inline-flex lg:-right-5"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </Button>
          </>
        ) : null}

        <div className="overflow-hidden rounded-2xl bg-[#1e293b]">
          <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-stretch lg:gap-6 lg:p-6">
            <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl lg:aspect-auto lg:h-auto lg:w-[42%]">
              <Image
                src={current.image}
                alt={current.subtitle}
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
                  disabled={isOwnProfile}
                  title={
                    isOwnProfile
                      ? t('photographerProfile.featured.cannotVoteOwn')
                      : undefined
                  }
                  className={`inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-bold text-white transition ${isOwnProfile ? 'cursor-not-allowed bg-[#ef4444]/50' : 'cursor-pointer bg-[#ee1c25] hover:bg-[#d01820]'}`}
                >
                  <Heart size={15} className="fill-white" aria-hidden="true" />
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
