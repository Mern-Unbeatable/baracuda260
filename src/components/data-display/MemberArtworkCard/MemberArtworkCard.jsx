import { Calendar, Clock, Eye, Heart, Images } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import MemberArtworkActionsMenu from '@/components/data-display/MemberArtworkActionsMenu/MemberArtworkActionsMenu';
import MemberArtworkCardFooter from '@/components/data-display/MemberArtworkCardFooter/MemberArtworkCardFooter';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
import Image from '@/components/ui/Image';
import { myArtworkDetailPath } from '@/portals/member/data/myArtworkDetailData';

const BADGE_STYLES = {
  'Single Photo': 'bg-white/95 text-[#4048cd]',
  '6 Photos Story': 'bg-[#4048cd] text-white',
  '12 photos - full Zodiac Story': 'bg-[#3a3a42] text-white',
};

const MemberArtworkCard = memo(
  ({ item, badgeLabel, onEdit, onDelete, onPromote, onSwitchCompetition }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const badgeClass =
      BADGE_STYLES[item.albumBadge] ?? BADGE_STYLES['Single Photo'];
    const detailPath = myArtworkDetailPath(item.id);

    const openDetails = () => {
      navigate(detailPath, { state: { artwork: item } });
    };

    return (
      <article
        onClick={openDetails}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetails();
          }
        }}
        role="link"
        tabIndex={0}
        className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.15)] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c7cbf2] hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)]"
      >
        <div className="relative aspect-368/252 shrink-0 overflow-hidden bg-[#f3f4f6]">
          <Image
            src={item.image}
            alt={item.title}
            width={368}
            height={252}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
          <span
            className={`pointer-events-none absolute left-3 top-3 z-[1] rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] shadow-sm backdrop-blur-[2px] ${badgeClass}`}
          >
            {badgeLabel}
          </span>
          <PhotoAiBadgeOverlay
            show={item.isAiGenerated}
            placement="card-end"
            size="sm"
          />
          <div
            className="relative z-20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <MemberArtworkActionsMenu
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onPromote={onPromote}
              onSwitchCompetition={onSwitchCompetition}
            />
          </div>
          {item.promoted ? (
            <span className="pointer-events-none absolute bottom-3 left-3 z-[1] rounded-md bg-[#22c55e] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
              {t('myArtwork.card.promoted')}
            </span>
          ) : null}
          {item.extraPhotoCount != null ? (
            <span className="pointer-events-none absolute bottom-3 right-3 z-[1] inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
              <Images size={14} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.extraPhotos', { count: item.extraPhotoCount })}
            </span>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          <div className="flex min-h-10 items-start justify-between gap-2 text-[13px] text-[#6b7280]">
            <span className="min-w-0 truncate font-medium text-[#494453]">
              {item.category}
            </span>
            <div className="flex shrink-0 flex-col items-end gap-0.5 text-right sm:flex-row sm:items-center sm:gap-x-3">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Calendar size={14} strokeWidth={2} aria-hidden="true" />
                {t('myArtwork.card.uploaded', { date: item.uploadedDate })}
              </span>
              {item.uploadedTime ? (
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Clock size={14} strokeWidth={2} aria-hidden="true" />
                  {item.uploadedTime}
                </span>
              ) : null}
            </div>
          </div>

          <h2 className="mt-2 h-10 text-[16px] font-bold leading-5 text-[#0d0d14]">
            <Link
              to={detailPath}
              state={{ artwork: item }}
              onClick={(e) => e.stopPropagation()}
              className="line-clamp-2 transition group-hover:text-[#4048cd]"
            >
              {item.title}
            </Link>
          </h2>
          <p className="mt-1.5 h-10 line-clamp-2 text-[14px] leading-5 text-[#6b7280]">
            {item.description || '\u00A0'}
          </p>

          <div className="mt-3 flex h-6 flex-wrap items-center gap-x-4 gap-y-1 overflow-hidden text-[13px] text-[#6b7280]">
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.views', { count: item.views })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="fill-[#e53935] text-[#e53935]"
              />
              {t('myArtwork.card.hearts', { count: item.hearts })}
            </span>
            {item.expiryDate ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} strokeWidth={2} aria-hidden="true" />
                {t('myArtwork.card.expiry', { date: item.expiryDate })}
              </span>
            ) : null}
            {item.awards || item.appreciation ? (
              <PhotographerAwardCounters
                awards={item.awards || item.appreciation}
                size="sm"
              />
            ) : null}
          </div>

          <div
            className="mt-auto flex min-h-44 flex-col justify-end pt-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <MemberArtworkCardFooter
              item={item}
              onSwitchCompetition={onSwitchCompetition}
            />
          </div>
        </div>
      </article>
    );
  },
);

MemberArtworkCard.displayName = 'MemberArtworkCard';

export default MemberArtworkCard;
