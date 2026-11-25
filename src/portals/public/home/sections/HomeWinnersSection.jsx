import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Image from '@/components/ui/Image';
import {
  COMPETITIONS_QUERY_KEY,
  getLatestMonthlyWinnersApi,
} from '@/shared/api/competitions.api';
import { ROUTES } from '@/shared/config';
import { AppLink, Shell } from '@/shared/site-chrome';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const HomeWinnersSection = memo(() => {
  const { t } = useTranslation();

  const {
    data: winners = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...COMPETITIONS_QUERY_KEY, 'home-monthly-winners'],
    queryFn: () => getLatestMonthlyWinnersApi({ kind: 'SINGLE', limit: 3 }),
    staleTime: 60 * 1000,
  });

  const periodLabel = useMemo(() => {
    const first = winners[0];
    if (!first?.year || !first?.month) return null;
    const monthName = MONTH_NAMES[Number(first.month) - 1];
    if (!monthName) return null;
    return `${monthName} ${first.year}`;
  }, [winners]);

  return (
    <section className="bg-white section-py">
      <Shell>
        <div className="rounded-[20px] bg-[#4048cd] px-4 py-8 sm:px-8 sm:py-12 lg:py-16 xl:px-6">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-[10px] font-bold uppercase tracking-[1.65px] text-white sm:text-[11px]">
              {periodLabel ||
                t('home.winners.monthLabel', { defaultValue: 'Monthly' })}
            </p>
            <h2 className="mt-2 text-center text-[24px] font-semibold tracking-[-0.9px] text-white/90 sm:mt-3 sm:text-[30px] lg:text-[36px]">
              {t('home.winners.title')}
            </h2>
            <p className="mt-2 text-center text-[14px] text-white sm:text-[16px]">
              {periodLabel
                ? t('home.winners.subtitleDynamic', {
                    period: periodLabel,
                    defaultValue: `Congratulations to our ${periodLabel} champions`,
                  })
                : t('home.winners.subtitle')}
            </p>

            {isLoading ? (
              <div className="mt-10 flex min-h-[220px] items-center justify-center">
                <RefreshCw
                  size={22}
                  className="animate-spin text-white"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  {t('common.loading', 'Loading...')}
                </span>
              </div>
            ) : isError ? (
              <div className="mt-10 flex flex-col items-center gap-3 text-center text-white">
                <p className="text-[15px] font-medium">
                  {t(
                    'home.winners.error',
                    'Could not load monthly winners. Please try again.',
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-white/25"
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  {t('common.retry', 'Try again')}
                </button>
              </div>
            ) : winners.length === 0 ? (
              <div className="mt-10 rounded-2xl bg-white/10 px-6 py-10 text-center text-white">
                <p className="text-[16px] font-semibold">
                  {t(
                    'home.winners.emptyTitle',
                    'No monthly winners yet',
                  )}
                </p>
                <p className="mt-2 text-[14px] text-white/85">
                  {t(
                    'home.winners.emptyBody',
                    'Winners will appear here after a competition month is finalized.',
                  )}
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3 lg:mt-12">
                {winners.map((w) => (
                  <article
                    key={w.id}
                    className="flex flex-col items-center rounded-2xl bg-[#666dd7] p-4 text-center text-white sm:p-6"
                  >
                    <span className="text-[28px] leading-8 sm:text-[36px] sm:leading-10">
                      {w.medal}
                    </span>
                    <div className="mt-3 size-16 overflow-hidden rounded-full border-2 border-white/20 bg-white/15">
                      {w.image ? (
                        <Image
                          src={w.image}
                          alt={w.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[20px] font-bold text-white">
                          {w.initial}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-[18px] font-semibold text-white/90">
                      {w.name}
                    </h3>
                    <p className="line-clamp-2 text-[14px]">{w.work}</p>
                    <p className="mt-1 text-[12px]">
                      {t('home.winners.votesLabel', {
                        count: w.votesCount,
                      })}
                    </p>
                    {w.prize ? (
                      <p className="mt-3 text-[20px] font-semibold text-white/90 sm:mt-4 sm:text-[24px]">
                        {w.prize}
                      </p>
                    ) : null}
                    <p className="mb-3 text-[11px] sm:mb-4 sm:text-[12px]">
                      {t('home.winners.cashPrize')}
                    </p>
                    <AppLink
                      href={w.href || ROUTES.WINNERS}
                      className="inline-flex h-8.5 w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/8 text-[12px] font-bold transition hover:bg-white/15"
                    >
                      {t('home.winners.viewAlbum')}
                    </AppLink>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6 text-center sm:mt-8">
              <AppLink
                href={ROUTES.WINNERS}
                className="text-[14px] font-semibold text-white transition hover:text-white/85"
              >
                {t('home.winners.viewAll')}
              </AppLink>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
});

HomeWinnersSection.displayName = 'HomeWinnersSection';

export default HomeWinnersSection;
