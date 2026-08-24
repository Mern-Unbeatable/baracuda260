import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Globe, Instagram } from 'lucide-react';

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

const linkClass =
  'inline-flex items-center gap-1.5 text-[14px] font-medium text-[#4048cd] transition hover:underline';

const PhotographerAboutSection = memo(({ profile }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-[18px] font-bold text-[#111827]">
        {t('photographerProfile.aboutTitle')}
      </h2>
      <div className="mt-3 text-[15px] leading-7 text-[#6b7280]">
        {profile.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={profile.website} target="_blank" rel="noreferrer" className={linkClass}>
          <Globe size={16} strokeWidth={2} aria-hidden="true" />
          {profile.websiteLabel}
        </a>
        <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkClass}>
          <Instagram size={16} strokeWidth={2} aria-hidden="true" />
          {profile.instagram}
        </a>
        <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className={linkClass}>
          <TwitterIcon size={16} />
          {profile.twitter}
        </a>
      </div>
    </section>
  );
});

PhotographerAboutSection.displayName = 'PhotographerAboutSection';

export default PhotographerAboutSection;
