import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import {
  COMPETITION_DETAILS_ASSETS,
  RANK_BADGE_STYLES,
} from '@/portals/public/competition-details/data/competitionDetailsAssets';

const RANKINGS_GRID =
  'grid w-full min-w-[520px] grid-cols-[minmax(64px,0.7fr)_minmax(160px,1.6fr)_minmax(110px,1fr)_minmax(100px,0.9fr)] md:min-w-[640px] md:grid-cols-[minmax(88px,0.85fr)_minmax(200px,1.6fr)_minmax(140px,1.1fr)_minmax(120px,1fr)]';
const RANKINGS_CELL_X = 'px-3 md:px-5 lg:px-6';

const RankingRow = memo(({ row }) => {
  const { t } = useTranslation();
  const badgeClass = RANK_BADGE_STYLES[row.rank] || RANK_BADGE_STYLES[5];
  const votesPillClass = row.highlighted
    ? 'bg-[#532aa8] text-white'
    : 'bg-[#e3e8f9] text-[#532aa8]';

  return (
    <div
      className={`relative ${RANKINGS_GRID} items-center border-b border-[rgba(203,195,213,0.3)] ${
        row.highlighted ? 'border-b-[#532aa8] bg-[rgba(83,42,168,0.05)]' : ''
      }`}
    >
      {row.highlighted ? (
        <span
          className="absolute inset-y-0 left-0 w-1 bg-[#532aa8]"
          aria-hidden="true"
        />
      ) : null}

      <div className={`${RANKINGS_CELL_X} flex items-center py-2.5 md:py-3.5`}>
        <span
          className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold leading-4 md:size-8 md:text-[13px] ${badgeClass}`}
        >
          {row.rank}
        </span>
      </div>

      <div
        className={`${RANKINGS_CELL_X} flex min-w-0 items-center gap-2 py-2.5 md:gap-3 md:py-3.5`}
      >
        <Image
          src={row.avatar}
          alt=""
          width={32}
          height={32}
          className={`size-8 shrink-0 rounded-full object-cover shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.1)] md:size-9 ${
            row.highlighted
              ? 'shadow-[0_0_0_2px_#532aa8,0px_2px_4px_-1px_rgba(0,0,0,0.1)]'
              : ''
          }`}
        />
        <p
          className={`min-w-0 truncate text-[12px] font-semibold leading-4 md:text-[14px] md:leading-5 ${
            row.highlighted ? 'text-[#532aa8]' : 'text-[#161c27]'
          }`}
        >
          {row.photographer || row.name || (row.nameKey ? t(row.nameKey) : '')}
        </p>
      </div>

      <div
        className={`${RANKINGS_CELL_X} flex items-center justify-center py-2.5 md:py-3.5`}
      >
        <p className="text-[12px] font-semibold leading-4 text-[#161c27] md:text-[14px] md:leading-5">
          {row.wins}
        </p>
      </div>

      <div
        className={`${RANKINGS_CELL_X} flex items-center justify-center py-2.5 md:py-3.5`}
      >
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-4 md:px-3 md:text-[13px] md:leading-5 ${votesPillClass}`}
        >
          {row.votes}
        </span>
      </div>
    </div>
  );
});

RankingRow.displayName = 'RankingRow';

const PAGE_SIZE = 5;

const MemberArtworkGlobalRankings = memo(
  ({ rankings = [], showingTotal }) => {
    const { t } = useTranslation();
    const [rankPage, setRankPage] = useState(1);

    const total = rankings.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const hasMultiplePages = totalPages > 1;

    const currentPage = Math.min(Math.max(1, rankPage), totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, total);

    const paginatedRankings = hasMultiplePages
      ? rankings.slice(startIndex, endIndex)
      : rankings;

    const from = total === 0 ? 0 : startIndex + 1;
    const to = total === 0 ? 0 : endIndex;

    const showingText = hasMultiplePages
      ? from === to
        ? t('competitionDetails.showingSingle', {
            from,
            total,
            defaultValue: `Showing ${from} of ${total} photographers`,
          })
        : t('competitionDetails.showingRange', {
            from,
            to,
            total,
            defaultValue: `Showing ${from}–${to} of ${total} photographers`,
          })
      : t('competitionDetails.showing', {
          count: total,
          total: showingTotal || total,
          defaultValue: `Showing top ${total} of ${showingTotal || total} photographers`,
        });

    return (
      <section
        aria-label={t('competitionDetails.rankingsAria')}
        className="overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-[rgba(255,255,255,0.8)] shadow-[0px_4px_20px_-2px_rgba(83,42,168,0.04),0px_2px_12px_-4px_rgba(83,42,168,0.02)] backdrop-blur-[6px] md:rounded-[20px]"
      >
        <div className="border-b border-[#cbc3d5] bg-[#f9f9ff] px-3.5 py-3 md:px-5 md:py-4 lg:px-6">
          <h2 className="text-[15px] font-semibold leading-5 text-[#161c27] md:text-[18px] md:leading-6">
            {t('competitionDetails.rankingsTitle')}
          </h2>
        </div>

        <div className="w-full overflow-x-auto overscroll-x-contain [touch-action:pan-y]">
          <div className="min-w-0">
            <div className={`${RANKINGS_GRID} bg-[rgba(241,243,255,0.5)]`}>
              {[
                'competitionDetails.table.rank',
                'competitionDetails.table.photographer',
                'competitionDetails.table.wins',
                'competitionDetails.table.votes',
              ].map((key, index) => (
                <div
                  key={key}
                  className={`${RANKINGS_CELL_X} py-2.5 md:py-3 ${index >= 2 ? 'text-center' : ''}`}
                >
                  <p className="text-[10px] font-medium uppercase leading-4 tracking-[0.5px] text-[#494453] md:text-[11px]">
                    {t(key)}
                  </p>
                </div>
              ))}
            </div>

            {paginatedRankings.map((row) => (
              <RankingRow key={row.id} row={row} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2.5 bg-[#f1f3ff] px-3.5 py-3 text-center md:flex-row md:justify-between md:gap-3 md:px-5 md:py-3.5 md:text-left lg:px-6">
          <p className="text-[11px] font-medium tracking-[0.3px] text-[#494453] md:text-[13px] md:leading-4">
            {showingText}
          </p>
          {hasMultiplePages ? (
            <div className="flex items-center gap-2">
              <Button
                unstyled
                type="button"
                aria-label={t('competitionDetails.prevPage')}
                disabled={currentPage <= 1}
                onClick={() => setRankPage((page) => Math.max(1, page - 1))}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] bg-white shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:size-9"
              >
                <Image
                  src={COMPETITION_DETAILS_ASSETS.chevronLeft}
                  alt=""
                  width={8}
                  height={12}
                  className="h-3 w-2 object-contain"
                />
              </Button>
              <Button
                unstyled
                type="button"
                aria-label={t('competitionDetails.nextPage')}
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setRankPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] bg-white shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 md:size-9"
              >
                <Image
                  src={COMPETITION_DETAILS_ASSETS.chevronRight}
                  alt=""
                  width={8}
                  height={12}
                  className="h-3 w-2 object-contain"
                />
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    );
  },
);

MemberArtworkGlobalRankings.displayName = 'MemberArtworkGlobalRankings';

export default MemberArtworkGlobalRankings;
