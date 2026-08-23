import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Heart, Trophy } from 'lucide-react';
import { AppLink } from '@/shared/site-chrome';
import { MarketingButton } from '@/shared/ui/marketing';

const PhotographerFeaturedCompetition = memo(({ featured }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-8 sm:mt-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#1e293b] p-4 sm:p-6 lg:p-8">
        <button
          type="button"
          aria-label={t('photographerProfile.featured.previous')}
          className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0d0d14] shadow-sm sm:inline-flex lg:left-4"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t('photographerProfile.featured.next')}
          className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0d0d14] shadow-sm sm:inline-flex lg:right-4"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl lg:max-w-md lg:shrink-0">
            <img
              src={featured.image}
              alt={featured.subtitle}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#facc15] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#422006]">
                {t('photographerProfile.featured.badge')}
              </span>
              <span className="text-[13px] text-white/70">
                {t('photographerProfile.featured.uploaded', { date: featured.uploaded })}
              </span>
            </div>

            <h2 className="mt-3 text-[20px] font-bold leading-snug text-white sm:text-[24px] lg:text-[26px]">
              {featured.title}
            </h2>
            <p className="mt-1 text-[16px] italic text-white/75 sm:text-[17px]">{featured.subtitle}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Heart size={16} className="fill-[#f43f5e] text-[#f43f5e]" aria-hidden="true" />
                {t('photographerProfile.featured.votes', { count: featured.votes })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Trophy size={16} className="text-[#facc15]" aria-hidden="true" />
                {t('photographerProfile.featured.rank', { rank: featured.rank })}
              </span>
              <span>{t('photographerProfile.featured.votingEnds', { date: featured.votingEnds })}</span>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <MarketingButton type="button" className="w-full justify-center sm:w-auto">
                <Heart size={18} aria-hidden="true" />
                {t('galleryDetail.castVote')}
              </MarketingButton>
              <AppLink
                href={featured.detailHref}
                className="text-[14px] font-semibold text-white/90 transition hover:text-white"
              >
                {t('photographerProfile.featured.inspect')} →
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PhotographerFeaturedCompetition.displayName = 'PhotographerFeaturedCompetition';

export default PhotographerFeaturedCompetition;
