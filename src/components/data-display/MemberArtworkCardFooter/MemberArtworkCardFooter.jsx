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
      <div className="flex h-full flex-col justify-between gap-2 rounded-xl bg-[#f9fafb] p-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e5e7eb] px-2.5 py-1 text-[11px] font-semibold text-[#6b7280]">
            <Clock size={12} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.card.profileOnly')}
          </span>
          <p className="mt-1.5 text-[12px] font-medium text-[#6b7280]">Not in any competition</p>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white p-2">
          <p className="text-[10px] font-medium uppercase text-[#9ca3af]">Available Competitions</p>
          <p className="mt-1 text-[13px] font-bold text-[#4048cd]">3 Active</p>
        </div>

        <MarketingButton
          type="button"
          className="w-full rounded-lg bg-[#4048cd] px-4 py-1.5 text-[12px] font-semibold hover:bg-[#363eb8]"
        >
          <Plus size={14} strokeWidth={2} aria-hidden="true" />
          Add to Competition
        </MarketingButton>
      </div>
    );
  }

  if (item.footerState === 'ended') {
    return (
      <div className="flex h-full flex-col justify-between gap-2 rounded-xl bg-[#f5f3ff] p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ede9fe] px-2.5 py-1 text-[11px] font-semibold text-[#7c3aed]">
            <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
            {t('myArtwork.card.competitionEnded')}
          </span>
          <span className="text-base">🏆</span>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#e9d5ff] bg-white/50 p-2">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-[9px] font-medium uppercase text-[#9ca3af]">Votes</p>
            <p className="mt-0.5 text-[16px] font-bold text-[#7c3aed]">{item.endedVotes}</p>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-[#e9d5ff] text-center">
            <p className="text-[9px] font-medium uppercase text-[#9ca3af]">Rank</p>
            <p className="mt-0.5 text-[16px] font-bold text-[#7c3aed]">#{item.finalRank ?? '-'}</p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            className="flex-1 inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#7c3aed] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#6d28d9]"
          >
            <RefreshCw size={14} strokeWidth={2} aria-hidden="true" />
            Submit
          </button>
          <button
            type="button"
            className="flex-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#e9d5ff] bg-white/40 px-3 py-1.5 text-[12px] font-semibold text-[#7c3aed] transition hover:bg-white/60"
          >
            Results
          </button>
        </div>
      </div>
    );
  }

  return null;
});

MemberArtworkCardFooter.displayName = 'MemberArtworkCardFooter';

export default MemberArtworkCardFooter;
