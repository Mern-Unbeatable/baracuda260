import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Globe, Instagram } from 'lucide-react';

const PhotographerAboutSection = memo(({ profile }) => {
  const { t } = useTranslation();

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-[18px] font-bold text-[#111827] sm:text-[20px]">
        {t('photographerProfile.aboutTitle')}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-6 text-[#6b7280] sm:text-[16px] sm:leading-7">
        {profile.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
        <a
          href={profile.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-[#4048cd] hover:underline"
        >
          <Globe size={16} strokeWidth={2} aria-hidden="true" />
          {profile.websiteLabel}
        </a>
        <span className="inline-flex items-center gap-1.5 text-[#6b7280]">
          <Instagram size={16} strokeWidth={2} aria-hidden="true" />
          {profile.instagram}
        </span>
        <span className="text-[#6b7280]">{profile.twitter}</span>
      </div>
    </section>
  );
});

PhotographerAboutSection.displayName = 'PhotographerAboutSection';

export default PhotographerAboutSection;
