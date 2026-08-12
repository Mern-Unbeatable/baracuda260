import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Eye, Heart, Images } from 'lucide-react';
import { AppLink, ImgIcon } from '@/shared/site-chrome';
import MarketingCard from './MarketingCard';

const TROPHY_ICON = '/assets/home/icon-trophy-cup.svg';

const parseCount = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCount = (value) => parseCount(value).toLocaleString('en-US');

const PhotoShowcaseCard = memo(
  ({
    href,
    image,
    imageAlt,
    title,
    titleAs: TitleTag = 'h3',
    badge,
    description,
    likes,
    views,
    date,
    price,
    competitionLabel,
    winnerRank,
    extraPhotosLabel,
    className = '',
  }) => {
    const { t } = useTranslation();
    const baseLikes = parseCount(likes);
    const [favorited, setFavorited] = useState(false);
    const displayLikes = formatCount(favorited ? baseLikes + 1 : baseLikes);
    const showPrice = price != null && price !== '';

    const handleFavorite = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setFavorited((current) => !current);
    };

    return (
      <MarketingCard variant="showcase" className={`group overflow-hidden ${className}`.trim()}>
        <AppLink href={href} className="block focus-visible:outline-none">
          <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
            <img
              src={image}
              alt={imageAlt ?? title}
              width={368}
              height={252}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            {badge ? (
              <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#4048cd] shadow-sm backdrop-blur-[2px]">
                {badge}
              </span>
            ) : null}
            {competitionLabel ? (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-[#facc15] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#422006]">
                {competitionLabel}
              </span>
            ) : null}
            {winnerRank ? (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-2 py-1">
                <ImgIcon src={TROPHY_ICON} size={16} />
                <span className="text-[11px] font-bold uppercase leading-none tracking-[0.35px] text-[#fdc700]">
                  {winnerRank}
                </span>
              </span>
            ) : null}
            {extraPhotosLabel ? (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold leading-none text-white">
                <Images size={14} strokeWidth={2} aria-hidden="true" />
                {extraPhotosLabel}
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleFavorite}
              aria-pressed={favorited}
              aria-label={
                favorited
                  ? t('gallery.unfavorite', { title, defaultValue: `Unfavorite ${title}` })
                  : t('gallery.favorite', { title, defaultValue: `Favorite ${title}` })
              }
              className="absolute right-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(13,13,20,0.12)] transition hover:scale-105"
            >
              <Heart
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                className={
                  favorited
                    ? 'fill-[#e53935] text-[#e53935]'
                    : 'fill-transparent text-[#0d0d14]'
                }
              />
            </button>
          </div>

          <div className="p-4">
            <TitleTag className="text-[16px] font-bold leading-snug text-[#0d0d14] transition group-hover:text-[#4048cd]">
              {title}
            </TitleTag>

            {description ? (
              <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.5] text-[#6b7280]">
                {description}
              </p>
            ) : null}

            <div className="mt-3 flex w-full items-center justify-between gap-2 text-[13px] text-[#6b7280]">
              <span className="inline-flex items-center gap-1.5">
                <Heart size={14} strokeWidth={2} aria-hidden="true" className="fill-[#e53935] text-[#e53935]" />
                {displayLikes}
              </span>
              {views ? (
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={14} strokeWidth={2} aria-hidden="true" className="text-[#9ca3af]" />
                  {views}
                </span>
              ) : null}
              {date ? (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} strokeWidth={2} aria-hidden="true" className="text-[#9ca3af]" />
                  {date}
                </span>
              ) : null}
            </div>

            {showPrice ? (
              <p className="mt-3 text-[18px] font-bold leading-none text-[#4048cd]">{price}</p>
            ) : null}
          </div>
        </AppLink>
      </MarketingCard>
    );
  },
);

PhotoShowcaseCard.displayName = 'PhotoShowcaseCard';

export default PhotoShowcaseCard;
