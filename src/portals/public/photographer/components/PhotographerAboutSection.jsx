import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Globe, Instagram, Youtube } from 'lucide-react';

const TwitterIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.068-.102a2.895 2.895 0 0 1 2.373-4.532c.307 0 .604.048.882.138V9.387a6.34 6.34 0 0 0-.882-.062 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34c3.5 0 6.34-2.84 6.34-6.34V8.528a8.197 8.197 0 0 0 5.071 1.743V6.826a4.834 4.834 0 0 1-1.3-.14z" />
  </svg>
);

const linkClass =
  'inline-flex items-center gap-1.5 text-[14px] font-medium text-[#4048cd] transition hover:underline';

const PhotographerAboutSection = memo(({ profile }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-[18px] font-bold text-[#111827]">
        {t('photographerProfile.aboutTitle')}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#6b7280]">
        {profile.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {profile.website ? (
          <a href={profile.website} target="_blank" rel="noreferrer" className={linkClass}>
            <Globe size={16} strokeWidth={2} aria-hidden="true" />
            {profile.websiteLabel || profile.website}
          </a>
        ) : null}
        {profile.instagram ? (
          <a
            href={
              profile.instagram.startsWith('http')
                ? profile.instagram
                : `https://instagram.com/${profile.instagram.replace('@', '')}`
            }
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <Instagram size={16} strokeWidth={2} aria-hidden="true" />
            {profile.instagram}
          </a>
        ) : null}
        {profile.twitter ? (
          <a
            href={
              profile.twitter.startsWith('http')
                ? profile.twitter
                : `https://twitter.com/${profile.twitter.replace('@', '')}`
            }
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <TwitterIcon size={16} />
            {profile.twitter}
          </a>
        ) : null}
        {profile.youtube ? (
          <a
            href={
              profile.youtube.startsWith('http')
                ? profile.youtube
                : `https://youtube.com/${profile.youtube.startsWith('@') ? profile.youtube : '@' + profile.youtube}`
            }
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <Youtube size={16} strokeWidth={2} aria-hidden="true" />
            {profile.youtube}
          </a>
        ) : null}
        {profile.tiktok ? (
          <a
            href={
              profile.tiktok.startsWith('http')
                ? profile.tiktok
                : `https://tiktok.com/@${profile.tiktok.replace('@', '')}`
            }
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <TikTokIcon size={16} />
            {profile.tiktok}
          </a>
        ) : null}
      </div>
    </section>
  );
});

PhotographerAboutSection.displayName = 'PhotographerAboutSection';

export default PhotographerAboutSection;
