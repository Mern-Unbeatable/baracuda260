import React, { memo } from 'react';
import { AppLink } from '@/shared/site-chrome';
import MarketingCard from './MarketingCard';
import OverlayBadge from './OverlayBadge';

const BADGE_VARIANT = {
  indigo:
    'rounded-md bg-[#e8eafc]/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#4048cd] shadow-sm backdrop-blur-[2px]',
  light:
    'rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-[#0d0d14] shadow-[0_2px_8px_rgba(13,13,20,0.12)] backdrop-blur-[2px]',
  dark:
    'rounded-md bg-[#0d0d14]/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm backdrop-blur-[2px]',
};

/**
 * Gallery / showcase tile — image, category badge, title, footer row (author + actions).
 */
const PhotoShowcaseCard = memo(
  ({
    href,
    image,
    imageAlt,
    title,
    titleAs: TitleTag = 'h3',
    badge,
    badgeVariant = 'light',
    footer,
    className = '',
  }) => (
    <MarketingCard variant="showcase" className={`group overflow-hidden ${className}`.trim()}>
      <AppLink href={href} className="block focus-visible:outline-none">
        <div className="relative aspect-[368/252] overflow-hidden bg-[#f3f4f6]">
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
            <OverlayBadge
              className={`absolute left-3 top-3 ${BADGE_VARIANT[badgeVariant] ?? BADGE_VARIANT.light}`}
            >
              {badge}
            </OverlayBadge>
          ) : null}
        </div>
        <div className="px-4 pb-3 pt-4">
          <TitleTag className="text-[16px] font-bold leading-snug text-[#0d0d14] transition group-hover:text-[#4048cd]">
            {title}
          </TitleTag>
        </div>
      </AppLink>
      {footer ? (
        <div className="flex items-center justify-between border-t border-black/[0.06] px-4 py-3 text-[14px] text-[#6b7280]">
          {footer}
        </div>
      ) : null}
    </MarketingCard>
  ),
);

PhotoShowcaseCard.displayName = 'PhotoShowcaseCard';

export default PhotoShowcaseCard;
