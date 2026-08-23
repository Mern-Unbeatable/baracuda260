import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import {
  getUploadTierHref,
  UPLOAD_ROUTE_SETS,
  UPLOAD_TIERS,
} from '@/portals/member/data/uploadPhotosAssets';

const UploadTierCard = memo(({ tier, routeSet }) => {
  const { t } = useTranslation();
  const Icon = tier.icon;
  const href = getUploadTierHref(tier.id, routeSet);

  const ctaClassName =
    'mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-bold text-white transition hover:bg-[#d41921]';

  return (
    <article
      className={`relative flex h-full flex-col justify-between rounded-[20px] border border-[rgba(0,0,0,0.16)] bg-white p-6 sm:p-8 ${
        tier.popular ? 'mt-3 xl:mt-0' : ''
      }`}
    >
      {tier.popular ? (
        <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4048cd] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.5px] text-white">
          {t('uploadPhotos.mostPopular')}
        </span>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-7">
          <div className="flex h-[57px] w-14 items-center justify-center rounded-lg bg-[#fde8e9]">
            <Icon size={32} className="text-[#ee1c25]" aria-hidden="true" strokeWidth={1.75} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2
                className={`text-[26px] font-semibold leading-7 text-[#0d0d14] sm:text-[32px] ${
                  tier.titleUppercase ? 'uppercase' : ''
                }`}
              >
                {t(tier.titleKey)}
              </h2>
              <p className="text-[15px] leading-normal text-[#6b7280] sm:text-[16px]">
                {t(tier.descriptionKey)}
              </p>
            </div>

            <ul className="flex flex-col gap-2.5" role="list">
              {tier.featureKeys.map((featureKey) => (
                <li key={featureKey} className="flex items-center gap-2 pt-0 sm:pt-2">
                  <Check
                    size={13}
                    className="shrink-0 text-[#ee1c25]"
                    aria-hidden="true"
                    strokeWidth={3}
                  />
                  <span className="text-[14px] leading-5 text-[#111827]">{t(featureKey)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="pt-1">
          <span className="text-[28px] font-semibold leading-none text-[#4048cd] sm:text-[32px]">
            {tier.price}
          </span>
          <span className="text-[14px] font-normal text-[#1b1e56] sm:text-[16px]">
            {t('uploadPhotos.prizeMoney')}
          </span>
        </p>
      </div>

      {href ? (
        <Link to={href} className={ctaClassName}>
          {t('uploadPhotos.enterNow')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <button type="button" className={ctaClassName}>
          {t('uploadPhotos.enterNow')}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
    </article>
  );
});

UploadTierCard.displayName = 'UploadTierCard';

/**
 * Upload Photos page content — Figma node 111:1692 (Creative Upload Hub).
 */
const UploadPhotosContent = memo(({ routeSet = UPLOAD_ROUTE_SETS.standalone }) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      <header className="flex flex-col gap-3 sm:gap-4">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.75px] text-[#161c27] sm:text-[36px] lg:text-[40px] lg:leading-[38px]">
          {t('uploadPhotos.title')}
        </h1>
        <p className="max-w-3xl text-[15px] leading-6 text-[#494453] sm:text-[16px]">
          {t('uploadPhotos.subtitle')}
        </p>
      </header>

      <section
        aria-label={t('uploadPhotos.tiersAria')}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {UPLOAD_TIERS.map((tier) => (
          <UploadTierCard key={tier.id} tier={tier} routeSet={routeSet} />
        ))}
      </section>
    </div>
  );
});

UploadPhotosContent.displayName = 'UploadPhotosContent';

export default UploadPhotosContent;
