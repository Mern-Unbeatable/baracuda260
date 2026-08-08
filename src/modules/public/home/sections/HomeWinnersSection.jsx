import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Shell } from '@/shared/site-chrome';
import { HOME_WINNERS } from '../data/homePageData';

const HomeWinnersSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white section-py">
      <Shell>
        <div className="rounded-[20px] bg-[#4048cd] px-4 py-16 sm:px-8 sm:py-20 xl:px-6">
          <div className="mx-auto max-w-[896px]">
            <p className="text-center text-[11px] font-bold uppercase tracking-[1.65px] text-white">
              {t('home.winners.monthLabel')}
            </p>
            <h2 className="mt-3 text-center text-[32px] font-bold tracking-[-0.9px] text-white/90 sm:text-[36px]">
              {t('home.winners.title')}
            </h2>
            <p className="mt-2 text-center text-[16px] text-white">{t('home.winners.subtitle')}</p>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {HOME_WINNERS.map((w) => (
                <article
                  key={w.name}
                  className="flex flex-col items-center rounded-2xl bg-[#666dd7] p-6 text-center text-white"
                >
                  <span className="text-[36px] leading-10">{w.medal}</span>
                  <img
                    src={w.image}
                    alt={w.name}
                    width={64}
                    height={64}
                    className="mt-3 size-16 rounded-full border-2 border-white/20 object-cover"
                  />
                  <h3 className="mt-3 text-[18px] font-semibold text-white/90">{w.name}</h3>
                  <p className="text-[14px]">{w.work}</p>
                  <p className="mt-1 text-[12px]">
                    {t('home.winners.votesLabel', { count: w.votesCount })}
                  </p>
                  <p className="mt-4 text-[24px] font-semibold text-white/90">{w.prize}</p>
                  <p className="mb-4 text-[12px]">{t('home.winners.cashPrize')}</p>
                  <a
                    href="#"
                    className="inline-flex h-[34px] w-full items-center justify-center rounded-[14px] border border-white/20 bg-white/8 text-[12px] font-bold"
                  >
                    {t('home.winners.viewAlbum')}
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a href="#" className="text-[14px] font-semibold text-white">
                {t('home.winners.viewAll')}
              </a>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
});

HomeWinnersSection.displayName = 'HomeWinnersSection';

export default HomeWinnersSection;
