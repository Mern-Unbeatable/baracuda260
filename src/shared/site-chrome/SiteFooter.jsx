import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/shared/config';
import { SITE_ASSETS } from './siteAssets';
import { SITE_FOOTER_COLUMNS, SITE_FOOTER_YEAR } from './siteCopy';
import AppLink from './AppLink';
import ImgIcon from './ImgIcon';
import Shell from './Shell';

const SOCIAL_ICONS = [SITE_ASSETS.ig, SITE_ASSETS.fb, SITE_ASSETS.x];

const FOOTER_LINK_HREF = {
  'footer.privacy': ROUTES.PRIVACY,
  'footer.terms': ROUTES.TERMS,
  'footer.cookies': ROUTES.COOKIES,
  'footer.gallery': ROUTES.GALLERY,
  'footer.leaderboard': ROUTES.LEADERBOARD,
  'footer.about': ROUTES.ABOUT,
  'footer.contact': ROUTES.CONTACT,
  'footer.winners': ROUTES.WINNERS,
  'footer.competitions': ROUTES.COMPETITIONS,
};

const SiteFooter = memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#ecedfa]">
      <Shell className="py-14 xl:py-[69px]">
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="relative h-[67px] w-[220px] overflow-hidden">
              <img
                src={SITE_ASSETS.logoFooter}
                alt="My 12 Photos"
                width={220}
                height={68}
                className="absolute left-0 top-[-110%] h-[326%] w-full max-w-none object-cover"
              />
            </div>
            <p className="mt-5 max-w-[320px] text-[16px] leading-[22.75px] text-[#1a1a1a]">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL_ICONS.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-2xl bg-[#2d3392]"
                  aria-label={t('footer.socialLink')}
                >
                  <ImgIcon src={icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {SITE_FOOTER_COLUMNS.map((col) => (
            <div key={col.titleKey}>
              <p className="text-[16px] font-extrabold uppercase tracking-[1.2px] text-[#1a1a1a]">
                {t(col.titleKey)}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.linkKeys.map((linkKey) => (
                  <li key={linkKey}>
                    <AppLink
                      href={FOOTER_LINK_HREF[linkKey] || '#'}
                      className="text-[16px] text-[#1a1a1a]"
                    >
                      {t(linkKey)}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Shell>
      <div className="border-t border-black/5 px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-0">
        <Shell>
          <p className="text-[16px] font-medium text-[#191818] sm:text-[20px]">
            {t('footer.rights', { year: SITE_FOOTER_YEAR })}
          </p>
        </Shell>
      </div>
    </footer>
  );
});

SiteFooter.displayName = 'SiteFooter';

export default SiteFooter;
