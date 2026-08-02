import React, { memo } from 'react';
import { SITE_ASSETS } from './siteAssets';
import { SITE_NEWSLETTER_SUBTITLE, SITE_NEWSLETTER_TITLE } from './siteCopy';
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

const SiteNewsletter = memo(({ variant = 'page' }) => {
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
              <h2 className="text-[36px] font-semibold text-white sm:text-[48px]">
                {SITE_NEWSLETTER_TITLE}
              </h2>
              <p className="mt-2 text-[16px] text-[#eaeaea] sm:text-[20px]">
                {SITE_NEWSLETTER_SUBTITLE}
              </p>
            </div>
            <form
              className="flex w-full max-w-[520px] flex-col gap-3 rounded-[33px] bg-white/24 p-3 sm:flex-row sm:items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex flex-1 items-center gap-1 rounded-3xl bg-white px-4 py-3">
                <ImgIcon src={SITE_ASSETS.mail} size={24} />
                <input
                  type="email"
                  placeholder="Enter your email here..."
                  className="w-full bg-transparent text-[12px] text-[#222] outline-none placeholder:text-[#7d7d7d]"
                />
              </label>
              <button
                type="submit"
                className="rounded-[27px] bg-[#ee1c25] px-10 py-3 text-[16px] text-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </Shell>
    </section>
  );
});

SiteNewsletter.displayName = 'SiteNewsletter';

export default SiteNewsletter;
