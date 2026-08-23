import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, Images } from 'lucide-react';
import MemberArtworkActionsMenu from '@/portals/member/components/member-artwork/MemberArtworkActionsMenu';
import { sellPhotoDetailPath } from '@/portals/member/data/sellPhotosDetailData';
const BADGE_STYLES = {
  'Single Photo': 'bg-white/95 text-[#4048cd]',
  '6 Photos Story': 'bg-[#4048cd] text-white',
  '12 photos - full Zodiac Story': 'bg-[#3a3a42] text-white',
};

const MemberSellPhotoCard = memo(({ item, badgeLabel, onEdit, onDelete, onPromote }) => {
  const { t } = useTranslation();
  const badgeClass = BADGE_STYLES[item.albumBadge] ?? BADGE_STYLES['Single Photo'];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white shadow-sm">
      <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
        <Link to={sellPhotoDetailPath(item.id)} className="block h-full w-full">
          <img
            src={item.image}
            alt={item.title}
            width={368}
            height={252}
            loading="lazy"
            className="h-full w-full object-cover transition hover:scale-[1.02]"
          />
        </Link>        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.35px] shadow-sm backdrop-blur-[2px] ${badgeClass}`}
        >
          {badgeLabel}
        </span>
        <MemberArtworkActionsMenu
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onPromote={onPromote}
        />
        {item.promoted ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-[#3a3a42]/85 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
            {t('sellPhotos.card.promoted')}
          </span>
        ) : null}
        {item.extraPhotoCount != null ? (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
            <Images size={14} strokeWidth={2} aria-hidden="true" />
            {t('sellPhotos.card.extraPhotos', { count: item.extraPhotoCount })}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-[16px] font-bold leading-snug text-[#0d0d14]">
          <Link
            to={sellPhotoDetailPath(item.id)}
            className="transition hover:text-[#4048cd]"
          >
            {item.title}
          </Link>
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <Heart size={14} strokeWidth={2} aria-hidden="true" className="fill-[#e53935] text-[#e53935]" />
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
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
          <span className="text-[18px] font-bold text-[#4048cd]">{item.price}</span>
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
});

MemberSellPhotoCard.displayName = 'MemberSellPhotoCard';

export default MemberSellPhotoCard;
