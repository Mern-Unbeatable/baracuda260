import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Clock, Plus, RefreshCw, Sparkles } from 'lucide-react';
import MarketingButton from '@/components/marketing/MarketingButton/MarketingButton';

const MemberArtworkCardFooter = memo(({ item }) => {
  const { t } = useTranslation();

  if (item.footerState === 'active') {
    return (
      <div className="rounded-xl bg-[#ecfdf3] p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[13px] font-semibold text-[#166534]">
            {item.competitionName}
          </p>
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
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[12px]">
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
    );
  }

  if (item.footerState === 'profileOnly') {
    return (
      <div className="flex h-full flex-col justify-between gap-3 rounded-xl bg-[#f9fafb] p-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280]">
            <Clock size={12} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.card.profileOnly')}
          </span>
          <p className="mt-2 text-[12px] text-[#9ca3af]">{t('myArtwork.card.notInContest')}</p>
        </div>
        <MarketingButton
          type="button"
          className="w-full shrink-0 rounded-lg bg-[#4048cd] px-4 py-2 text-[13px] hover:bg-[#363eb8] sm:w-auto"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          {t('myArtwork.card.addToCompetition')}
        </MarketingButton>
      </div>
    );
  }

  if (item.footerState === 'ended') {
    return (
      <div className="flex h-full flex-col justify-between gap-3 rounded-xl bg-[#f5f3ff] p-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
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
          className="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6d28d9] sm:w-auto"
        >
          <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
          {t('myArtwork.card.submitAgain')}
        </button>
      </div>
    );
  }

  return null;
});

MemberArtworkCardFooter.displayName = 'MemberArtworkCardFooter';

export default MemberArtworkCardFooter;
