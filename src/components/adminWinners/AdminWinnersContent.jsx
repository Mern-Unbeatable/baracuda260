import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_WINNERS_ASSETS,
  ALBUM_FORMATS,
  CALENDAR_ICON_SIZE,
  CHEVRON_ICON_SIZE,
  EYE_ICON_SIZE,
  MONTH_OPTIONS,
  PODIUM_MEDAL_SIZE,
  PODIUM_SIZES,
  TABLE_AVATAR_SIZE,
  TABLE_MEDAL_SIZE,
  formatCount,
  getRankDisplay,
  getRankMedalSrc,
  isMedalRank,
} from './adminWinnersData';
import useAdminWinners from './useAdminWinners';

/**
 * @param {{
 *   winner: {
 *     avatarKey?: string,
 *     initial?: string,
 *     nameKey: string,
 *   },
 *   size: number,
 * }} props
 */
const PhotographerAvatar = memo(({ winner, size }) => {
  const { t } = useTranslation();
  const avatarSrc = winner.avatarKey ? ADMIN_WINNERS_ASSETS[winner.avatarKey] : null;

  if (avatarSrc) {
    return (
      <img
        src={avatarSrc}
        alt={t(winner.nameKey)}
        width={size}
        height={size}
        className="size-full object-cover"
      />
    );
  }

  return (
    <span className="flex size-full items-center justify-center bg-[rgba(227,24,55,0.1)] text-[12px] font-bold leading-4 text-[#e31837]">
      {winner.initial || '?'}
    </span>
  );
});

PhotographerAvatar.displayName = 'PhotographerAvatar';

/**
 * @param {{ rank: number, size?: 'podium' | 'table' }} props
 */
const RankMedal = memo(({ rank, size = 'podium' }) => {
  const medalSrc = getRankMedalSrc(rank);
  if (!medalSrc) {
    return (
      <span className="text-[14px] font-extrabold leading-5 text-[#6b7280]">{getRankDisplay(rank)}</span>
    );
  }

  const dims = size === 'table' ? TABLE_MEDAL_SIZE : PODIUM_MEDAL_SIZE;

  return (
    <img
      src={medalSrc}
      alt=""
      width={dims.width}
      height={dims.height}
      className={size === 'table' ? 'size-5' : 'size-[30px]'}
    />
  );
});

RankMedal.displayName = 'RankMedal';

/**
 * @param {{
 *   winner: object | null,
 *   place: 'first' | 'second' | 'third',
 *   locale: string,
 * }} props
 */
const PodiumCard = memo(({ winner, place, locale }) => {
  const { t } = useTranslation();
  if (!winner) return null;

  const size = PODIUM_SIZES[place];
  const isFirst = place === 'first';
  const borderClass = isFirst
    ? 'border-4 border-[#fdc700] shadow-[0px_10px_15px_-3px_#fff085,0px_4px_6px_-4px_#fff085]'
    : place === 'second'
      ? 'border-[1.75px] border-[#e5e7eb]'
      : 'border-2 border-[#fee685]';
  const offsetClass = isFirst ? '-mt-4' : '';
  const padding = isFirst ? 4 : place === 'second' ? 1.75 : 2;

  return (
    <div className={`flex w-[76px] flex-col items-center sm:w-20 ${offsetClass}`}>
      <div className="flex h-[30px] items-center justify-center" aria-hidden="true">
        <RankMedal rank={winner.rank} size="podium" />
      </div>
      <div className="pt-2">
        <div
          className={`overflow-hidden rounded-full bg-[#f3f4f6] ${borderClass}`}
          style={{ width: size, height: size, padding }}
        >
          <div className="size-full overflow-hidden rounded-full">
            <PhotographerAvatar winner={winner} size={size - padding * 2} />
          </div>
        </div>
      </div>
      <p
        className={`pt-2 text-center text-[#0d0d14] ${
          isFirst
            ? 'text-[16px] font-extrabold leading-6'
            : 'text-[14px] font-bold leading-5'
        }`}
      >
        {t(winner.firstNameKey)}
      </p>
      <p className="text-center text-[12px] leading-4 text-[#6b7280]">{t(winner.cityKey)}</p>
      <p className="pt-1 text-center text-[14px] font-bold leading-5 text-[#e31837]">
        {t('adminWinners.votesLabel', { count: formatCount(winner.votes, locale) })}
      </p>
    </div>
  );
});

PodiumCard.displayName = 'PodiumCard';

/**
 * @param {{
 *   albumFormat: string,
 *   onSelect: (formatId: string) => void,
 * }} props
 */
const FormatTabs = memo(({ albumFormat, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div
      role="tablist"
      aria-label={t('adminWinners.formatsAria')}
      className="flex flex-wrap items-center gap-3 sm:gap-4"
    >
      {ALBUM_FORMATS.map((format) => {
        const selected = format.id === albumFormat;
        return (
          <button
            key={format.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(format.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold leading-4 transition ${
              selected
                ? 'bg-[#4048cd] text-white'
                : 'bg-[#f2f2f2] text-[#6b7280] hover:bg-[#e8e8e8]'
            }`}
          >
            {t(format.labelKey)}
          </button>
        );
      })}
    </div>
  );
});

FormatTabs.displayName = 'FormatTabs';

/**
 * @param {{
 *   selectedMonth: { id: string, monthKey: string, year: number },
 *   monthOpen: boolean,
 *   onToggle: () => void,
 *   onClose: () => void,
 *   onSelect: (monthId: string) => void,
 * }} props
 */
const MonthSelect = memo(({ selectedMonth, monthOpen, onToggle, onClose, onSelect }) => {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!monthOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [monthOpen, onClose]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={monthOpen}
        aria-haspopup="listbox"
        aria-label={t('adminWinners.monthAria')}
        onClick={onToggle}
        className="inline-flex cursor-pointer items-center gap-[10px] rounded-[4px] bg-[#f0f0f0] px-3 py-2"
      >
        <img
          src={ADMIN_WINNERS_ASSETS.calendar}
          alt=""
          width={CALENDAR_ICON_SIZE}
          height={CALENDAR_ICON_SIZE}
          className="h-[13px] w-3"
        />
        <span className="font-manrope text-[16px] font-medium leading-normal text-[#222]">
          {t(selectedMonth.monthKey)}
        </span>
        <img
          src={ADMIN_WINNERS_ASSETS.chevronDown}
          alt=""
          width={CHEVRON_ICON_SIZE}
          height={CHEVRON_ICON_SIZE}
          className={`size-6 transition ${monthOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {monthOpen ? (
        <ul
          role="listbox"
          aria-label={t('adminWinners.monthAria')}
          className="absolute right-0 top-full z-20 mt-1 max-h-60 min-w-full overflow-auto rounded-[8px] border border-[#e4e4e4] bg-white shadow-lg"
        >
          {MONTH_OPTIONS.map((month) => {
            const selected = month.id === selectedMonth.id;
            return (
              <li key={month.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelect(month.id)}
                  className={`w-full cursor-pointer px-3 py-2.5 text-left text-[16px] transition hover:bg-[#f6fbff] ${
                    selected ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                  }`}
                >
                  {t(month.monthKey)}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});

MonthSelect.displayName = 'MonthSelect';

/**
 * @param {{ winner: object, locale: string, onView: (id: string) => void }} props
 */
const WinnerTableRow = memo(({ winner, locale, onView }) => {
  const { t } = useTranslation();
  const medal = isMedalRank(winner.rank);

  return (
    <tr className="border-b border-[rgba(0,0,0,0.2)] last:border-b-0">
      <td className="px-4 py-[22px] sm:px-6">
        {medal ? (
          <RankMedal rank={winner.rank} size="table" />
        ) : (
          <span className="text-[14px] font-extrabold leading-5 text-[#6b7280]">
            {getRankDisplay(winner.rank)}
          </span>
        )}
      </td>
      <td className="px-3 py-4 sm:px-4">
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 overflow-hidden rounded-full bg-[#f0f2f5]"
            style={{ width: TABLE_AVATAR_SIZE, height: TABLE_AVATAR_SIZE }}
          >
            <PhotographerAvatar winner={winner} size={TABLE_AVATAR_SIZE} />
          </div>
          <span className="text-[14px] font-bold leading-5 text-[#0d0d14]">{t(winner.nameKey)}</span>
        </div>
      </td>
      <td className="hidden px-3 py-[22px] text-[14px] leading-5 text-[#6b7280] sm:table-cell md:px-4">
        {t(winner.cityKey)}
      </td>
      <td className="px-3 py-[22px] text-right text-[14px] font-extrabold leading-5 text-[#0d0d14] md:px-4">
        {formatCount(winner.votes, locale)}
      </td>
      <td className="hidden px-3 py-[22px] text-right text-[14px] leading-5 text-[#6b7280] md:table-cell md:px-4">
        {formatCount(winner.points, locale)}
      </td>
      <td className="px-4 py-[22px] text-right sm:px-6">
        <button
          type="button"
          aria-label={t('adminWinners.view', { name: t(winner.nameKey) })}
          onClick={() => onView(winner.id)}
          className="inline-flex size-6 cursor-pointer items-center justify-center"
        >
          <img
            src={ADMIN_WINNERS_ASSETS.eye}
            alt=""
            width={EYE_ICON_SIZE}
            height={EYE_ICON_SIZE}
            className="size-6"
          />
        </button>
      </td>
    </tr>
  );
});

WinnerTableRow.displayName = 'WinnerTableRow';

/**
 * @param {{ winner: object, locale: string, onView: (id: string) => void }} props
 */
const WinnerMobileCard = memo(({ winner, locale, onView }) => {
  const { t } = useTranslation();
  const medal = isMedalRank(winner.rank);

  return (
    <article className="flex flex-col gap-3 border-b border-[rgba(0,0,0,0.2)] px-4 py-4 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {medal ? (
            <RankMedal rank={winner.rank} size="table" />
          ) : (
            <span className="text-[14px] font-extrabold leading-5 text-[#6b7280]">
              {getRankDisplay(winner.rank)}
            </span>
          )}
          <div
            className="shrink-0 overflow-hidden rounded-full bg-[#f0f2f5]"
            style={{ width: TABLE_AVATAR_SIZE, height: TABLE_AVATAR_SIZE }}
          >
            <PhotographerAvatar winner={winner} size={TABLE_AVATAR_SIZE} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-5 text-[#0d0d14]">
              {t(winner.nameKey)}
            </p>
            <p className="text-[12px] leading-4 text-[#6b7280]">{t(winner.cityKey)}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label={t('adminWinners.view', { name: t(winner.nameKey) })}
          onClick={() => onView(winner.id)}
          className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img
            src={ADMIN_WINNERS_ASSETS.eye}
            alt=""
            width={EYE_ICON_SIZE}
            height={EYE_ICON_SIZE}
            className="size-6"
          />
        </button>
      </div>
      <div className="flex items-center justify-between text-[14px]">
        <span className="font-extrabold text-[#0d0d14]">
          {formatCount(winner.votes, locale)} {t('adminWinners.votes')}
        </span>
        <span className="text-[#6b7280]">
          {formatCount(winner.points, locale)} {t('adminWinners.points')}
        </span>
      </div>
    </article>
  );
});

WinnerMobileCard.displayName = 'WinnerMobileCard';

/**
 * Admin Winners — Figma node 339:4188.
 */
const AdminWinnersContent = memo(() => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const {
    albumFormat,
    monthOpen,
    selectedMonth,
    winners,
    podium,
    handleSelectFormat,
    handleToggleMonth,
    handleCloseMonth,
    handleSelectMonth,
  } = useAdminWinners();

  const handleViewWinner = () => {
    // Placeholder for future photographer detail navigation.
  };

  return (
    <div className="flex w-full flex-col gap-8 py-4 sm:gap-11 sm:py-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="font-manrope pt-2 text-[32px] font-extrabold leading-10 tracking-[-0.5px] text-[#0d0d14] sm:text-[40px] sm:leading-[48px] lg:text-[48px]">
            {t('adminWinners.title')}
          </h1>
          <p className="pt-1 text-[16px] leading-6 text-[#6b7280]">
            {t('adminWinners.subtitle', {
              month: t(selectedMonth.monthKey),
              year: selectedMonth.year,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-4">
          <FormatTabs albumFormat={albumFormat} onSelect={handleSelectFormat} />
          <MonthSelect
            selectedMonth={selectedMonth}
            monthOpen={monthOpen}
            onToggle={handleToggleMonth}
            onClose={handleCloseMonth}
            onSelect={handleSelectMonth}
          />
        </div>
      </header>

      <section aria-label={t('adminWinners.podiumAria')} className="flex justify-center">
        <div className="flex items-end gap-4 sm:gap-6">
          <PodiumCard winner={podium.second} place="second" locale={locale} />
          <PodiumCard winner={podium.first} place="first" locale={locale} />
          <PodiumCard winner={podium.third} place="third" locale={locale} />
        </div>
      </section>

      <section
        aria-label={t('adminWinners.tableAria')}
        className="overflow-hidden rounded-[16px] border border-[rgba(0,0,0,0.2)] bg-white"
      >
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-[rgba(0,0,0,0.2)] bg-[#f7f8fa]">
                <th className="px-4 py-4 text-left text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] sm:px-6">
                  {t('adminWinners.columns.rank')}
                </th>
                <th className="px-3 py-4 text-left text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] md:px-4">
                  {t('adminWinners.columns.photographer')}
                </th>
                <th className="hidden px-3 py-4 text-left text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] sm:table-cell md:px-4">
                  {t('adminWinners.columns.city')}
                </th>
                <th className="px-3 py-4 text-right text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] md:px-4">
                  {t('adminWinners.columns.votes')}
                </th>
                <th className="hidden px-3 py-4 text-right text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] md:table-cell md:px-4">
                  {t('adminWinners.columns.points')}
                </th>
                <th className="px-4 py-4 text-right text-[10px] font-extrabold uppercase tracking-[1px] text-[#6b7280] sm:px-6">
                  {t('adminWinners.columns.action')}
                </th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner) => (
                <WinnerTableRow
                  key={winner.id}
                  winner={winner}
                  locale={locale}
                  onView={handleViewWinner}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {winners.map((winner) => (
            <WinnerMobileCard
              key={winner.id}
              winner={winner}
              locale={locale}
              onView={handleViewWinner}
            />
          ))}
        </div>
      </section>
    </div>
  );
});

AdminWinnersContent.displayName = 'AdminWinnersContent';

export default AdminWinnersContent;
