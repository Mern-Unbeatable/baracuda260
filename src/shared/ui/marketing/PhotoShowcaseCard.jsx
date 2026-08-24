import { useTranslation } from 'react-i18next';
import React, { memo, useState } from 'react';
import { Bookmark, Calendar, Eye, Heart, Images, MoreVertical } from 'lucide-react';
import { AppLink, ImgIcon } from '@/shared/site-chrome';
import MarketingCard from './MarketingCard';
import ReportPhotoModal from './ReportPhotoModal';

const TROPHY_ICON = '/assets/home/icon-trophy-cup.svg';

const parseCount = (value) => {
  const n = Number(String(value ?? '0').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const formatCount = (value) => parseCount(value).toLocaleString('en-US');

const ImageOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-md bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm backdrop-blur-[2px] ${className}`.trim()}
  >
    {children}
  </span>
);

const DarkOverlayBadge = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[11px] font-semibold leading-none text-white backdrop-blur-[2px] ${className}`.trim()}
  >
    {children}
  </span>
);

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
    onMenuClick,
  }) => {
    const { t } = useTranslation();
    const [saved, setSaved] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const displayLikes = formatCount(likes);
    const showPrice = price != null && price !== '';
    const bottomMetaClass = (layer) => {
      if (layer === 0 && winnerRank) return 'bottom-14';
      if (layer === 1 && competitionLabel) return winnerRank ? 'bottom-24' : 'bottom-14';
      return 'bottom-3';
    };

    const handleSave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setSaved((current) => !current);
    };

    const handleMenu = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (onMenuClick) {
        onMenuClick(event);
        return;
      }
      setReportOpen(true);
    };

    return (
      <>
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
              <ImageOverlayBadge className="absolute left-3 top-3 max-w-[calc(100%-3.5rem)]">
                {badge}
              </ImageOverlayBadge>
            ) : null}

            <button
              type="button"
              onClick={handleMenu}
              aria-label={t('gallery.moreActions', { defaultValue: 'More actions' })}
              className="absolute right-3 top-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] transition hover:bg-black/60"
            >
              <MoreVertical size={16} strokeWidth={2.5} aria-hidden="true" />
            </button>

            {winnerRank ? (
              <DarkOverlayBadge className={`absolute left-3 gap-1.5 ${bottomMetaClass(0)}`}>
                <ImgIcon src={TROPHY_ICON} size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.35px] text-[#fdc700]">
                  {winnerRank}
                </span>
              </DarkOverlayBadge>
            ) : null}

            {competitionLabel ? (
              <ImageOverlayBadge className={`absolute left-3 ${bottomMetaClass(1)}`}>
                {competitionLabel}
              </ImageOverlayBadge>
            ) : null}

            <button
              type="button"
              onClick={handleSave}
              aria-pressed={saved}
              aria-label={
                saved
                  ? t('gallery.unsave', { title, defaultValue: `Unsave ${title}` })
                  : t('gallery.saveAction', { title, defaultValue: `Save ${title}` })
              }
              className={`absolute bottom-4 left-4 inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold leading-none transition ${
                saved
                  ? 'bg-[#e53935] text-white'
                  : 'bg-[#fff1f2] text-[#e53935]'
              }`}
            >
              <Bookmark
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className={saved ? 'fill-transparent text-white' : 'fill-transparent text-[#e53935]'}
              />
              {saved ? t('gallery.saved', { defaultValue: 'Saved' }) : t('gallery.save', { defaultValue: 'Save' })}
            </button>

            {extraPhotosLabel ? (
              <DarkOverlayBadge className="absolute bottom-3 right-3">
                <Images size={13} strokeWidth={2.5} aria-hidden="true" />
                {extraPhotosLabel}
              </DarkOverlayBadge>
            ) : null}
          </div>

          <div className="p-4">
            <TitleTag className="text-[18px] font-bold leading-[1.3] text-[#0d0d14] transition group-hover:text-[#4048cd]">
              {title}
            </TitleTag>

            {description ? (
              <p className="mt-2 line-clamp-2 text-[14px] leading-[1.5] text-[#6b7280]">{description}</p>
            ) : null}

            <div className="mt-3 flex w-full items-center justify-between gap-2 text-[12px] font-medium">
              <span className="inline-flex items-center gap-1 text-[#e53935]">
                <Heart size={14} strokeWidth={2} aria-hidden="true" className="fill-[#e53935] text-[#e53935]" />
                {displayLikes}
              </span>
              {views ? (
                <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                  <Eye size={14} strokeWidth={2} aria-hidden="true" />
                  {views}
                </span>
              ) : null}
              {date ? (
                <span className="inline-flex items-center gap-1 text-[#9ca3af]">
                  <Calendar size={14} strokeWidth={2} aria-hidden="true" />
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

      <ReportPhotoModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        photoTitle={title}
      />
      </>
    );
  },
);

PhotoShowcaseCard.displayName = 'PhotoShowcaseCard';

export default PhotoShowcaseCard;
