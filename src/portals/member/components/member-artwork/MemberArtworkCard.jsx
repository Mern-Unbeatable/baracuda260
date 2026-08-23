import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Images,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { MarketingButton } from '@/shared/ui/marketing';
import MemberArtworkActionsMenu from '@/portals/member/components/member-artwork/MemberArtworkActionsMenu';
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
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white shadow-sm">
      <div className="relative aspect-368/252 overflow-hidden bg-[#f3f4f6]">
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
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#6b7280]">
          <span>{item.category}</span>
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

        <h2 className="mt-2 text-[16px] font-bold leading-snug text-[#0d0d14]">
          <Link
            to={myArtworkDetailPath(item.id)}
            className="transition hover:text-[#4048cd]"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.5] text-[#6b7280]">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-[#6b7280]">
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

        {item.footerState === 'active' ? (
          <div className="mt-4 rounded-xl bg-[#ecfdf3] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-[#166534]">{item.competitionName}</p>
              <span className="rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                {t('myArtwork.card.live')}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white px-3 py-2 text-center">
                <p className="text-[11px] font-medium uppercase text-[#6b7280]">
                  {t('myArtwork.card.votes')}
                </p>
                <p className="text-[20px] font-bold text-[#16a34a]">{item.votes}</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-center">
                <p className="text-[11px] font-medium uppercase text-[#6b7280]">
                  {t('myArtwork.card.rank')}
                </p>
                <p className="text-[20px] font-bold text-[#4048cd]">{item.rank}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[12px]">
              <span className="inline-flex items-center gap-1 text-[#6b7280]">
                <Clock size={14} strokeWidth={2} aria-hidden="true" />
                {t('myArtwork.card.votingEnds', { date: item.votingEnds })}
              </span>
              <span className="font-semibold text-[#16a34a]">{t('myArtwork.card.activeEntry')}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#bbf7d0]">
              <div
                className="h-full rounded-full bg-[#22c55e]"
                style={{ width: `${item.progress ?? 0}%` }}
              />
            </div>
          </div>
        ) : null}

        {item.footerState === 'profileOnly' ? (
          <div className="mt-4 flex items-end justify-between gap-3 rounded-xl bg-[#f9fafb] p-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280]">
                <Clock size={12} strokeWidth={2} aria-hidden="true" />
                {t('myArtwork.card.profileOnly')}
              </span>
              <p className="mt-2 text-[12px] text-[#9ca3af]">{t('myArtwork.card.notInContest')}</p>
            </div>
            <MarketingButton
              type="button"
              className="rounded-lg bg-[#4048cd] px-4 py-2 text-[13px] hover:bg-[#363eb8]"
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.addToCompetition')}
            </MarketingButton>
          </div>
        ) : null}

        {item.footerState === 'ended' ? (
          <div className="mt-4 flex items-end justify-between gap-3 rounded-xl bg-[#f5f3ff] p-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ede9fe] px-2.5 py-1 text-[11px] font-semibold text-[#7c3aed]">
                <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
                {t('myArtwork.card.competitionEnded')}
              </span>
              <p className="mt-2 text-[12px] font-medium text-[#a78bfa]">
                {t('myArtwork.card.endedVotes', { count: item.endedVotes })}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6d28d9]"
            >
              <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
              {t('myArtwork.card.submitAgain')}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
});

MemberArtworkCard.displayName = 'MemberArtworkCard';

export default MemberArtworkCard;
