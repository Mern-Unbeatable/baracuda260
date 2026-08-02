import React, { memo } from 'react';
import { ImgIcon, Shell } from '../site';
import { ABOUT_ASSETS } from './aboutAssets';

const MissionVisionCard = memo(({ title, children, highlight }) => (
  <article className="flex h-full flex-col gap-4 rounded-2xl bg-[#fde8e9] p-6 sm:p-8">
    <h2 className="text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
      {title}
    </h2>
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="flex flex-col gap-5 text-[16px] leading-normal text-[#6b7280] sm:text-[20px]">
        {children}
      </div>
      <div className="flex items-center gap-2">
        <ImgIcon src={ABOUT_ASSETS.fire} size={24} />
        <p className="text-[16px] text-[#fd9400] sm:text-[20px]">{highlight}</p>
      </div>
    </div>
  </article>
));
MissionVisionCard.displayName = 'MissionVisionCard';

const AboutMissionVision = memo(() => (
  <section className="bg-white pb-16 sm:pb-20 xl:pb-[100px]">
    <Shell>
      <div className="grid gap-5 lg:grid-cols-2">
        <MissionVisionCard
          title="Our Mission"
          highlight="Fair Play, Transparent Voting & High Engagement"
        >
          <p>
            Our mission is to inspire creativity by providing a modern, fair, and engaging
            photography competition platform where every photographer has an equal opportunity to be
            recognized.
          </p>
          <p>
            We aim to make photography competitions simple, transparent, and enjoyable while
            rewarding participants for their passion and creativity.
          </p>
        </MissionVisionCard>

        <MissionVisionCard title="Our Vision" highlight="Connecting Photographers Worldwide">
          <p>
            We aspire to become one of the world&apos;s leading online photography competition
            platforms, connecting photographers from around the globe and building a vibrant
            community driven by creativity, recognition, and continuous participation.
          </p>
        </MissionVisionCard>
      </div>
    </Shell>
  </section>
));

AboutMissionVision.displayName = 'AboutMissionVision';

export default AboutMissionVision;
