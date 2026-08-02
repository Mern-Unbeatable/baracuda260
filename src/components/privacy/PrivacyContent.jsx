import React, { memo } from 'react';
import { ROUTES } from '../../config';
import { Shell, SitePageLayout } from '../site';
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from './privacyData';

const PrivacySection = memo(({ section }) => (
  <section className="flex w-full max-w-[1200px] flex-col gap-3">
    <h2 className="font-[family-name:Manrope,sans-serif] text-[24px] font-medium leading-normal text-[#0d0d0d] sm:text-[28px] md:text-[32px] xl:text-[36px]">
      {section.title}
    </h2>

    {section.lead ? (
      <p className="text-[16px] font-normal leading-8 text-[#2d2d2d] sm:text-[18px] md:text-[20px] xl:text-[24px]">
        {section.lead}
      </p>
    ) : null}

    {section.paragraphs?.map((text) => (
      <p
        key={text}
        className="text-[16px] font-normal leading-7 text-[#2d2d2d] sm:text-[18px] sm:leading-8 md:text-[20px]"
      >
        {text}
      </p>
    ))}

    {section.bullets?.length ? (
      <ul className="list-disc space-y-0 pl-[30px] text-[16px] font-normal leading-8 text-[#2d2d2d] sm:text-[18px] md:text-[20px]">
        {section.bullets.map((item) => (
          <li key={item}>
            <span className="leading-8">{item}</span>
          </li>
        ))}
      </ul>
    ) : null}

    {section.footnotes?.map((text) => (
      <p
        key={text}
        className="text-[16px] font-normal leading-8 text-[#2d2d2d] sm:text-[18px] md:text-[20px] xl:text-[24px]"
      >
        {text}
      </p>
    ))}
  </section>
));

PrivacySection.displayName = 'PrivacySection';

/**
 * Privacy Policy page — Figma node 264:839.
 * Chrome (announcement / header / newsletter / footer) from SitePageLayout.
 */
const PrivacyContent = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.PRIVACY}
    rootClassName="privacy-page-root"
    announcementTone="blue"
    newsletterVariant="page"
  >
    <main className="bg-[#f9fafb]">
      <Shell className="pb-16 pt-8 sm:pb-20 sm:pt-10 xl:pb-24 xl:pt-12">
        <header className="mb-6 flex max-w-[570px] flex-col gap-2 sm:mb-8">
          <h1 className="font-[family-name:Manrope,sans-serif] text-[28px] font-semibold leading-normal text-black sm:text-[34px] xl:text-[40px]">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-[9px]">
            <span
              className="inline-block size-2.5 shrink-0 rounded-full bg-[#ee1c25]"
              aria-hidden="true"
            />
            <p className="text-[16px] font-normal leading-normal text-[#373737] sm:text-[18px] md:text-[20px]">
              {PRIVACY_LAST_UPDATED}
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
          {PRIVACY_SECTIONS.map((section) => (
            <PrivacySection key={section.id} section={section} />
          ))}
        </div>
      </Shell>
    </main>
  </SitePageLayout>
));

PrivacyContent.displayName = 'PrivacyContent';

export default PrivacyContent;
