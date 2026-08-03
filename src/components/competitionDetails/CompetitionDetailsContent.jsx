import React, { memo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../config';
import {
  COMPETITION_DETAILS_ASSETS,
  getCompetitionDetailById,
  RANK_BADGE_STYLES,
} from './competitionDetailsAssets';

const STATUS_STYLES = {
  pending: 'bg-[#fdc700] text-white',
  approved: 'bg-[#1e9d13] text-white',
  completed: 'bg-[#e34e18] text-[#f9f9ff]',
};

const TYPE_STYLES = {
  story6: 'bg-[#830f14] text-white',
  single: 'bg-[#4048cd] text-white',
  zodiac12: 'bg-[#ee1c25] text-white',
};

const SlideThumb = memo(({ slide, active, onSelect, name }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={active}
    aria-label={name}
    className="flex w-[min(100%,239px)] shrink-0 cursor-pointer flex-col gap-2.5 text-left sm:w-full"
  >
    <div className="flex w-full items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="inline-flex shrink-0 items-end rounded bg-[#ee1c25] px-2.5 py-1">
          <img
            src={slide.icon}
            alt=""
            width={24}
            height={21}
            className="h-[21px] w-6 object-contain"
          />
        </span>
        <span className="truncate text-[16px] text-[#2b2b2b] sm:text-[20px] lg:text-[24px]">
          {name}
        </span>
      </span>
      <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#fde8e9] text-[16px] text-[#ee1c25] sm:text-[20px]">
        {slide.number}
      </span>
    </div>
    <span
      className={`relative block h-[100px] w-full overflow-hidden rounded-lg sm:h-[120px] ${
        active ? 'border-[3px] border-[#ee1c25]' : ''
      }`}
    >
      <img
        src={slide.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    </span>
  </button>
));

SlideThumb.displayName = 'SlideThumb';

const RANKINGS_GRID =
  'grid w-full min-w-[760px] grid-cols-[minmax(110px,1fr)_minmax(240px,1.6fr)_minmax(180px,1.2fr)_minmax(160px,1fr)]';
const RANKINGS_CELL_X = 'px-8';

const RankingRow = memo(({ row }) => {
  const { t } = useTranslation();
  const badgeClass = RANK_BADGE_STYLES[row.rank] || RANK_BADGE_STYLES[5];
  const votesPillClass = row.highlighted
    ? 'bg-[#532aa8] text-white'
    : 'bg-[#e3e8f9] text-[#532aa8]';

  return (
    <div
      className={`relative ${RANKINGS_GRID} items-center border-b border-[rgba(203,195,213,0.3)] ${
        row.highlighted
          ? 'border-b-[#532aa8] bg-[rgba(83,42,168,0.05)]'
          : ''
      }`}
    >
      {row.highlighted ? (
        <span
          className="absolute inset-y-0 left-0 w-1 bg-[#532aa8]"
          aria-hidden="true"
        />
      ) : null}

      <div className={`${RANKINGS_CELL_X} flex items-center py-7`}>
        <span
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[16px] font-bold leading-6 ${badgeClass}`}
        >
          {row.rank}
        </span>
      </div>

      <div className={`${RANKINGS_CELL_X} flex min-w-0 items-center gap-4 py-7`}>
        <img
          src={row.avatar}
          alt=""
          width={48}
          height={48}
          className={`size-12 shrink-0 rounded-full object-cover shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] ${
            row.highlighted ? 'shadow-[0_0_0_2px_#532aa8,0px_4px_6px_-1px_rgba(0,0,0,0.1)]' : ''
          }`}
        />
        <p
          className={`min-w-0 truncate text-[16px] font-bold leading-6 ${
            row.highlighted ? 'text-[#532aa8]' : 'text-[#161c27]'
          }`}
        >
          {t(row.nameKey)}
        </p>
      </div>

      <div className={`${RANKINGS_CELL_X} flex items-center justify-center py-7`}>
        <p className="text-[16px] font-bold leading-6 text-[#161c27]">{row.wins}</p>
      </div>

      <div className={`${RANKINGS_CELL_X} flex items-center justify-center py-7`}>
        <span
          className={`rounded-full px-4 py-[2.5px] text-[16px] font-bold leading-6 ${votesPillClass}`}
        >
          {row.votes}
        </span>
      </div>
    </div>
  );
});

RankingRow.displayName = 'RankingRow';

const CompetitionDetailsContent = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const detail = getCompetitionDetailById(id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rankPage, setRankPage] = useState(1);

  useEffect(() => {
    setActiveIndex(0);
    setRankPage(1);
  }, [detail.id]);

  const activeSlide = detail.slides[activeIndex] || detail.slides[0];
  const statusClass = STATUS_STYLES[detail.status] || STATUS_STYLES.pending;
  const typeClass = TYPE_STYLES[detail.type] || TYPE_STYLES.story6;

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-6 sm:gap-8">
      <Link
        to={ROUTES.ADMIN_MY_COMPETITIONS}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('competitionDetails.back')}
      </Link>

      <section className="relative h-[220px] w-full overflow-hidden rounded-[16px] sm:h-[320px] sm:rounded-[20px] lg:h-[446px] lg:rounded-[24px]">
        <img
          src={activeSlide.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[rgba(22,28,39,0.6)] to-transparent"
          aria-hidden="true"
        />
        <div className="absolute left-3 top-3 flex items-end gap-2 rounded-[20px] bg-[#ee1c25] px-4 py-1 sm:left-6 sm:top-6 sm:px-5 sm:py-[5px]">
          <img
            src={activeSlide.icon}
            alt=""
            width={24}
            height={21}
            className="h-[21px] w-6 shrink-0 object-contain"
          />
          <span className="text-[16px] leading-none text-white sm:text-[20px]">
            {t(activeSlide.nameKey)}
          </span>
        </div>
      </section>

      <div className="relative h-8 w-full sm:h-10 lg:h-[52px]" aria-hidden="true">
        <img
          src={COMPETITION_DETAILS_ASSETS.wave}
          alt=""
          className="h-full w-full object-fill"
        />
      </div>

      <section
        aria-label={t('competitionDetails.slidesAria')}
        className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-6 lg:gap-3 xl:gap-4"
      >
        {detail.slides.map((slide, index) => (
          <SlideThumb
            key={slide.id}
            slide={slide}
            active={index === activeIndex}
            name={t(slide.nameKey)}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] backdrop-blur-[6px] ${statusClass}`}
          >
            {t(`myCompetitions.status.${detail.status}`)}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] backdrop-blur-[6px] ${typeClass}`}
          >
            {t(`myCompetitions.types.${detail.type}`)}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium leading-4 tracking-[0.6px] text-[#272727] shadow-sm backdrop-blur-[6px]">
            {t(`myCompetitions.categories.${detail.category}`)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="text-[28px] font-semibold leading-[32px] text-[#161c27] sm:text-[32px] sm:leading-[36px] lg:text-[36px] lg:leading-[40px]">
            {t(detail.titleKey)}
          </h1>
          <p className="text-[15px] font-medium leading-6 text-[#3e3f40] sm:text-[18px] sm:leading-7 lg:text-[20px] lg:leading-[30px]">
            {t(detail.descriptionKey)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.2)] bg-[#ecedfa] p-5 sm:p-[25px]">
            <img
              src={COMPETITION_DETAILS_ASSETS.votes}
              alt=""
              width={20}
              height={16}
              className="h-[16px] w-5 object-contain"
            />
            <p className="mt-2 text-[12px] font-medium uppercase leading-4 tracking-[1.2px] text-[#494453]">
              {t('competitionDetails.metrics.votes')}
            </p>
            <p className="text-[28px] font-black tracking-[-0.3px] text-[#161c27] sm:text-[30px] sm:leading-[38px]">
              {detail.votes}
            </p>
          </article>
          <article className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(203,195,213,0.2)] bg-[#ecedfa] p-5 sm:p-[25px]">
            <img
              src={COMPETITION_DETAILS_ASSETS.position}
              alt=""
              width={20}
              height={18}
              className="h-[18px] w-5 object-contain"
            />
            <p className="mt-2 text-[12px] font-medium uppercase leading-4 tracking-[1.2px] text-[#494453]">
              {t('competitionDetails.metrics.position')}
            </p>
            <p className="text-[28px] font-black tracking-[-0.3px] text-[#161c27] sm:text-[30px] sm:leading-[38px]">
              {detail.position}
            </p>
          </article>
        </div>
      </section>

      <section
        aria-label={t('competitionDetails.rankingsAria')}
        className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-[rgba(255,255,255,0.8)] shadow-[0px_4px_20px_-2px_rgba(83,42,168,0.04),0px_2px_12px_-4px_rgba(83,42,168,0.02)] backdrop-blur-[6px] sm:rounded-[24px]"
      >
        <div className="border-b border-[#cbc3d5] bg-[#f9f9ff] px-4 py-5 sm:px-8 sm:pb-[25px] sm:pt-6">
          <h2 className="text-[20px] font-semibold leading-8 text-[#161c27] sm:text-[24px]">
            {t('competitionDetails.rankingsTitle')}
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[760px]">
            <div className={`${RANKINGS_GRID} bg-[rgba(241,243,255,0.5)]`}>
              <div className={`${RANKINGS_CELL_X} py-5`}>
                <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453]">
                  {t('competitionDetails.table.rank')}
                </p>
              </div>
              <div className={`${RANKINGS_CELL_X} py-5`}>
                <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453]">
                  {t('competitionDetails.table.photographer')}
                </p>
              </div>
              <div className={`${RANKINGS_CELL_X} py-5 text-center`}>
                <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453]">
                  {t('competitionDetails.table.wins')}
                </p>
              </div>
              <div className={`${RANKINGS_CELL_X} py-5 text-center`}>
                <p className="text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453]">
                  {t('competitionDetails.table.votes')}
                </p>
              </div>
            </div>

            {detail.rankings.map((row) => (
              <RankingRow key={row.id} row={row} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 bg-[#f1f3ff] px-4 py-5 text-center sm:flex-row sm:justify-between sm:px-8 sm:py-6 sm:text-left">
          <p className="text-[14px] font-medium tracking-[0.6px] text-[#494453] sm:text-[16px] sm:leading-4">
            {t('competitionDetails.showing', {
              count: detail.showingCount,
              total: detail.showingTotal,
            })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t('competitionDetails.prevPage')}
              disabled={rankPage <= 1}
              onClick={() => setRankPage((page) => Math.max(1, page - 1))}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] bg-white shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <img
                src={COMPETITION_DETAILS_ASSETS.chevronLeft}
                alt=""
                width={8}
                height={12}
                className="h-3 w-[8px] object-contain"
              />
            </button>
            <button
              type="button"
              aria-label={t('competitionDetails.nextPage')}
              onClick={() => setRankPage((page) => page + 1)}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-[#cbc3d5] bg-white shadow-sm transition hover:bg-white"
            >
              <img
                src={COMPETITION_DETAILS_ASSETS.chevronRight}
                alt=""
                width={8}
                height={12}
                className="h-3 w-[8px] object-contain"
              />
            </button>
          </div>
        </div>
      </section>    </div>
  );
});

CompetitionDetailsContent.displayName = 'CompetitionDetailsContent';

export default CompetitionDetailsContent;
