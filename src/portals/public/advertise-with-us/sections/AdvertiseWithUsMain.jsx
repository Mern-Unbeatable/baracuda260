import React, { memo } from 'react';
import { ROUTES } from '@/shared/config';
import { Shell, SitePageLayout } from '@/shared/site-chrome';
import AdvertiseBusinessForm from '@/components/forms/AdvertiseBusinessForm/AdvertiseBusinessForm';

const AdvertiseWithUsMain = memo(() => (
  <SitePageLayout
    activeHref={ROUTES.ADVERTISE_WITH_US}
    rootClassName="advertise-with-us-page-root"
    announcementTone="blue"
    newsletterVariant="page"
    showPromoBanner={false}
  >
    <section className="bg-[radial-gradient(circle_at_top_left,_#fde8e9,_#eef0ff_58%,_#f8fbff)] py-16 sm:py-20">
      <Shell>
        <div className="mx-auto max-w-[980px] text-center">
          <p className="mx-auto inline-flex rounded-full border border-[#f3c1c4] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#5b6270]">
            Official Lumina Advertising Network
          </p>
          <h1 className="mt-4 text-[34px] font-semibold leading-tight text-[#202531] sm:text-[54px]">
            <span className="text-[#ee1c25]">Promote</span> Your Business to
            <br />
            Our Photography <span className="text-[#4048cd]">Community</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[760px] text-[18px] leading-[1.45] text-[#555b68] sm:text-[20px]">
            Reach photographers, artists, and photography enthusiasts by displaying your business on
            our platform. High-intent audience, verified placements, and instant transparent
            analytics.
          </p>
        </div>
      </Shell>
    </section>

    <section className="bg-white py-8 sm:py-10">
      <Shell>
        <div className="mx-auto max-w-6xl">
          <AdvertiseBusinessForm />
        </div>
      </Shell>
    </section>
  </SitePageLayout>
));

AdvertiseWithUsMain.displayName = 'AdvertiseWithUsMain';

export default AdvertiseWithUsMain;

