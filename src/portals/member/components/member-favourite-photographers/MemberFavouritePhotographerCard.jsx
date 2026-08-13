import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Star, UserCheck } from 'lucide-react';
import { ROUTES } from '@/shared/config';

const MemberFavouritePhotographerCard = memo(({ photographer, defaultFollowing = true }) => {
  const { t } = useTranslation();
  const [following, setFollowing] = useState(defaultFollowing);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={photographer.avatar}
            alt={photographer.name}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover"
          />
          <span
            className="absolute -left-0.5 -top-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[#fdc700] text-white shadow-sm"
            aria-hidden="true"
          >
            <Star size={11} strokeWidth={2.5} className="fill-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-bold leading-snug text-[#0d0d14]">
            {photographer.name}
          </h2>
          <p className="truncate text-[14px] font-medium text-[#4048cd]">{photographer.handle}</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">{t(photographer.specialtyKey)}</p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-[#6b7280]">
            <MapPin size={13} strokeWidth={2} aria-hidden="true" className="shrink-0" />
            {t(photographer.locationKey)}
          </p>
        </div>
      </div>

      <blockquote className="mt-4 text-[14px] italic leading-[1.6] text-[#494453]">
        &ldquo;{t(photographer.quoteKey)}&rdquo;
      </blockquote>

      <div className="mt-4 inline-flex w-full items-center gap-2 rounded-lg bg-[#e8f0fe] px-3 py-2 text-[13px] font-medium text-[#4048cd]">
        <Calendar size={14} strokeWidth={2} aria-hidden="true" className="shrink-0" />
        {t('favouritePhotographers.card.followedYou', { date: photographer.followedDate })}
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x divide-[#e5e7eb] rounded-lg border border-[#e5e7eb] bg-[#fafafa] py-3 text-center">
        <div className="px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
            {t('favouritePhotographers.card.followers')}
          </p>
          <p className="mt-1 text-[20px] font-bold text-[#0d0d14]">{photographer.followers}</p>
        </div>
        <div className="px-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">
            {t('favouritePhotographers.card.artworks')}
          </p>
          <p className="mt-1 text-[20px] font-bold text-[#0d0d14]">{photographer.artworks}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-pressed={following}
          onClick={() => setFollowing((current) => !current)}
          className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-[13px] font-semibold transition ${
            following
              ? 'border-[#4048cd] bg-[#ecedfa] text-[#4048cd]'
              : 'border-[#4048cd] bg-[#4048cd] text-white hover:bg-[#363eb8]'
          }`}
        >
          <UserCheck size={15} strokeWidth={2} aria-hidden="true" />
          {following
            ? t('favouritePhotographers.card.following')
            : t('favouritePhotographers.card.follow')}
        </button>
        <Link
          to={ROUTES.PHOTOGRAPHER_PROFILE}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#494453] transition hover:border-[#4048cd] hover:text-[#4048cd]"
        >
          {t('favouritePhotographers.card.viewProfile')}
        </Link>
      </div>
    </article>
  );
});

MemberFavouritePhotographerCard.displayName = 'MemberFavouritePhotographerCard';

export default MemberFavouritePhotographerCard;
