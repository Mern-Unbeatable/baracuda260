import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_ASSETS } from './siteAssets';
import ImgIcon from './ImgIcon';
import Shell from './Shell';

const PANEL_CLASS = {
  page: 'relative min-h-[320px] overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-16 sm:min-h-[400px] sm:px-8 sm:py-20 xl:min-h-[465px]',
  home: 'relative overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-16 sm:px-8 sm:py-20',
  detail: 'relative overflow-hidden rounded-2xl bg-[#4048cd] px-4 py-14 sm:px-8 sm:py-16 xl:py-20',
};

const INNER_CLASS = {
  page: 'relative mx-auto flex h-full max-w-[640px] flex-col items-center justify-center gap-8 text-center',
  home: 'relative mx-auto flex max-w-[640px] flex-col items-center gap-8 text-center',
  detail: 'relative mx-auto flex max-w-[640px] flex-col items-center gap-8 text-center',
};

/**
 * Shared Stay Updated newsletter section (Home + marketing pages via SitePageLayout).
 */
const StayUpdated = memo(({ variant = 'page' }) => {
  const { t } = useTranslation();
  const panelClass = PANEL_CLASS[variant] || PANEL_CLASS.page;
  const innerClass = INNER_CLASS[variant] || INNER_CLASS.page;

  return (
    <section className="bg-white py-10 sm:py-16">
      <Shell>
        <div className={panelClass}>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage: `url(${SITE_ASSETS.newsletterBg})`,
              backgroundSize: '1024px 1024px',
              backgroundPosition: 'top left',
            }}
          />
          <div className={innerClass}>
            <div>
              <h2 className="text-[36px] font-medium text-white/90 sm:text-[48px]">
                {t('newsletter.title')}
              </h2>
              <p className="mt-2 text-[16px] leading-normal text-[#eaeaea] sm:text-[20px]">
                <span className="block">{t('newsletter.subtitleLine1')}</span>
                <span className="block">{t('newsletter.subtitleLine2')}</span>
              </p>
            </div>
            <form
              className="flex w-full max-w-130 flex-col gap-3 rounded-[33px] bg-white/24 p-3 sm:flex-row sm:items-center"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="flex flex-1 items-center gap-1 rounded-3xl bg-white px-4 py-3">
                <ImgIcon src={SITE_ASSETS.mail} size={24} />
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="w-full bg-transparent text-[12px] text-[#222] outline-none placeholder:text-[#7d7d7d]"
                />
              </label>
              <button
                type="submit"
                className="cursor-pointer rounded-[27px] bg-[#ee1c25] px-10 py-3 text-[16px] text-white"
              >
                {t('newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </Shell>
    </section>
  );
});

StayUpdated.displayName = 'StayUpdated';

export default StayUpdated;
