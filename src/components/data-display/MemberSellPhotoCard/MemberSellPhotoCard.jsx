import { Calendar, Clock, Eye, Heart, Images } from 'lucide-react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import MemberArtworkActionsMenu from '@/components/data-display/MemberArtworkActionsMenu/MemberArtworkActionsMenu';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import Image from '@/components/ui/Image';
import { sellPhotoDetailPath } from '@/portals/member/data/sellPhotosDetailData';

const BADGE_STYLES = {
  'Single Photo': 'bg-white/95 text-[#4048cd]',
  '6 Photos Story': 'bg-[#4048cd] text-white',
  '12 photos - full Zodiac Story': 'bg-[#3a3a42] text-white',
};

const MemberSellPhotoCard = memo(
  ({ item, badgeLabel, onEdit, onDelete, onPromote }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const badgeClass =
      BADGE_STYLES[item.albumBadge] ?? BADGE_STYLES['Single Photo'];
    const detailPath = sellPhotoDetailPath(item.id);

    const openDetails = () => {
      navigate(detailPath, { state: { sellPhoto: item } });
    };

    return (
      <article
        onClick={openDetails}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#e8eaef] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative aspect-[368/252] overflow-hidden bg-[#f3f4f6]">
          <button
            type="button"
            onClick={openDetails}
            className="absolute inset-0 z-0 cursor-pointer"
            aria-label={t('sellPhotos.card.openDetails', 'Open photo details')}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={368}
              height={252}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          </button>
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
            className="absolute right-3 top-3 z-20"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <MemberArtworkActionsMenu
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onPromote={onPromote}
            />
          </div>
          {item.promoted ? (
            <span className="pointer-events-none absolute bottom-3 left-3 z-[1] rounded-md bg-[#3a3a42]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
              {t('sellPhotos.card.promoted')}
            </span>
          ) : null}
          {item.extraPhotoCount != null ? (
            <span className="pointer-events-none absolute bottom-3 right-3 z-[1] inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
              <Images size={14} strokeWidth={2} aria-hidden="true" />
              {t('sellPhotos.card.extraPhotos', {
                count: item.extraPhotoCount,
              })}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-[16px] font-bold leading-snug text-[#0d0d14]">
            <Link
              to={detailPath}
              state={{ sellPhoto: item }}
              className="cursor-pointer transition hover:text-[#4048cd]"
            >
              {item.title}
            </Link>
          </h2>
          <button
            type="button"
            onClick={openDetails}
            className="mt-3 flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 text-left text-[13px] text-[#6b7280]"
          >
            <span className="inline-flex items-center gap-1.5">
              <Heart
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="fill-[#e53935] text-[#e53935]"
              />
              {item.hearts}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} strokeWidth={2} aria-hidden="true" />
              {item.views}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} strokeWidth={2} aria-hidden="true" />
              {item.uploadedDate}
            </span>
          </button>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={openDetails}
              className="cursor-pointer text-[18px] font-bold text-[#4048cd] transition hover:opacity-80"
            >
              {item.price}
            </button>
            {item.expiryDate ? (
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#ee1c25]">
                <Clock size={14} strokeWidth={2} aria-hidden="true" />
                {t('sellPhotos.card.expiry', { date: item.expiryDate })}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    );
  },
);

MemberSellPhotoCard.displayName = 'MemberSellPhotoCard';

export default MemberSellPhotoCard;
