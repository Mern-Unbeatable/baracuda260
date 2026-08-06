import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPETITION_CARDS } from '../../data/competitionsMarketing';
import { ImgIcon, Shell, homeAsset } from '../site';

const ENTER_ARROW = homeAsset('icon-arrow.svg');

/**
 * Shared Active Competitions section (Home + Competitions pages).
 */
const ActiveCompetitions = memo(({ headingAs = 'h2' }) => {
  const { t } = useTranslation();
  const HeadingTag = headingAs === 'h1' ? 'h1' : 'h2';

  return (
    <section className="bg-[#f7f8fa] py-16 sm:py-20 xl:py-[114px]">
      <Shell>
        <div className="mx-auto mb-11 flex max-w-[682px] flex-col items-center gap-5 text-center">
          <p className="w-full text-[16px] font-bold uppercase leading-4 tracking-[1.2px] text-[#e31837]">
            {t('home.competitions.eyebrow')}
          </p>
          <div className="flex w-full flex-col items-center gap-2.5">
            <HeadingTag className="w-full text-[48px] font-bold leading-[48px] text-[#3a3a42]">
              {t('home.competitions.title')}
            </HeadingTag>
            <p className="w-full text-[20px] font-normal leading-[29.25px] text-[#6b7280]">
              {t('home.competitions.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {COMPETITION_CARDS.map((card) => (
            <article
              key={card.titleKey}
              id={card.id}
              className="relative flex h-full scroll-mt-[140px] flex-col justify-between rounded-[20px] border border-black/16 bg-white p-8"
            >
              {card.popular ? (
                <span className="absolute left-1/2 top-[-12px] -translate-x-1/2 rounded-full bg-[#4048cd] px-3 py-1 text-[10px] font-extrabold leading-[15px] tracking-[0.5px] text-white">
                  {t('common.mostPopular')}
                </span>
              ) : null}
              <div className="flex flex-col gap-4">
                <div className="flex h-[57px] w-14 items-center justify-center rounded-lg bg-[#fde8e9]">
                  <ImgIcon src={card.icon} size={32} />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-[28px] font-semibold capitalize leading-7 text-[#3a3a42]">
                      {t(card.titleKey)}
                    </h3>
                    <p className="text-[16px] font-normal leading-normal text-[#6b7280]">
                      {t(card.descriptionKey)}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {card.featureKeys.map((featureKey) => (
                      <li
                        key={featureKey}
                        className="flex items-center gap-2 text-[14px] font-normal leading-5 text-[#111827]"
                      >
                        <ImgIcon src={card.check} size={13} />
                        {t(featureKey)}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-[16px] font-normal leading-normal text-[#1b1e56]">
                  <span className="text-[32px] font-medium leading-normal text-[#4048cd]">
                    {card.prize}
                  </span>
                  {t('common.prizeMoney')}
                </p>
              </div>
              <button
                type="button"
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-bold text-white"
              >
                {t('common.enterNow')}
                <ImgIcon src={ENTER_ARROW} size={16} />
              </button>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
});

ActiveCompetitions.displayName = 'ActiveCompetitions';

export default ActiveCompetitions;
