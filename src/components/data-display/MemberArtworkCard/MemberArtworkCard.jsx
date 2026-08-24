import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Heart, Images } from 'lucide-react';
import MemberArtworkActionsMenu from '@/components/data-display/MemberArtworkActionsMenu/MemberArtworkActionsMenu';
import MemberArtworkCardFooter from '@/components/data-display/MemberArtworkCardFooter/MemberArtworkCardFooter';
import { myArtworkDetailPath } from '@/portals/member/data/myArtworkDetailData';

const BADGE_STYLES = {
  'Single Photo': 'bg-white/95 text-[#4048cd]',
  '6 Photos Story': 'bg-[#4048cd] text-white',
  '12 photos - full Zodiac Story': 'bg-[#3a3a42] text-white',
};

const MemberArtworkCard = memo(({ item, badgeLabel, onEdit, onDelete, onPromote }) => {
  const { t } = useTranslation();
  const badgeClass = BADGE_STYLES[item.albumBadge] ?? BADGE_STYLES['Single Photo'];

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white shadow-sm">
      <div className="relative aspect-368/252 shrink-0 overflow-hidden bg-[#f3f4f6]">
        <Link to={myArtworkDetailPath(item.id)} className="block h-full w-full">
          <img
            src={item.image}
            alt={item.title}
            width={368}
            height={252}
            loading="lazy"
            className="h-full w-full object-cover transition hover:scale-[1.02]"
          />
        </Link>
        <span
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
          <span className="absolute bottom-3 left-3 rounded-md bg-[#22c55e] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.35px] text-white shadow-sm">
            {t('myArtwork.card.promoted')}
          </span>
        ) : null}
        {item.extraPhotoCount != null ? (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
            <Images size={14} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.card.extraPhotos', { count: item.extraPhotoCount })}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-col gap-1.5 text-[13px] text-[#6b7280] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span className="font-medium text-[#494453]">{item.category}</span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.uploaded', { date: item.uploadedDate })}
            </span>
            {item.uploadedTime ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} strokeWidth={2} aria-hidden="true" />
                {item.uploadedTime}
              </span>
            ) : null}
          </div>
        </div>

        <h2 className="mt-2 min-h-10 text-[16px] font-bold leading-snug text-[#0d0d14]">
          <Link
            to={myArtworkDetailPath(item.id)}
            className="line-clamp-2 transition hover:text-[#4048cd]"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-[14px] leading-[1.43] text-[#6b7280]">
          {item.description}
        </p>

        <div className="mt-3 flex min-h-10 flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={14} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.card.views', { count: item.views })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Heart size={14} strokeWidth={2} aria-hidden="true" className="fill-[#e53935] text-[#e53935]" />
            {t('myArtwork.card.hearts', { count: item.hearts })}
          </span>
          {item.expiryDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.expiry', { date: item.expiryDate })}
            </span>
          ) : null}
        </div>

        <div className="mt-4 min-h-[170px]">
          <MemberArtworkCardFooter item={item} />
        </div>
      </div>
    </article>
  );
});

MemberArtworkCard.displayName = 'MemberArtworkCard';

export default MemberArtworkCard;
