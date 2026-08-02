import React, { memo } from 'react';
import { Shell } from '../site';
import { ABOUT_ASSETS } from './aboutAssets';

const AboutStory = memo(() => (
  <section className="bg-white py-16 sm:py-20 xl:py-[120px]">
    <Shell>
      <div className="grid items-center gap-10 lg:grid-cols-[668fr_759fr] lg:gap-[101px]">
        <div className="relative h-[360px] overflow-hidden rounded-[20px] sm:h-[480px] lg:h-[604px]">
          <img
            src={ABOUT_ASSETS.story}
            alt=""
            width={668}
            height={604}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-8 lg:gap-10">
          <h2 className="text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
            Our Story
          </h2>
          <div className="flex flex-col gap-5 text-[16px] leading-normal text-[#5b5b5b] sm:text-[20px]">
            <p>
              My12Photos was created with a simple idea—to give photographers of every skill level a
              place to showcase their creativity, tell visual stories, and gain recognition. Unlike
              traditional photo-sharing platforms, My12Photos brings photographers together through
              exciting monthly competitions, transparent voting, and a supportive global community.
            </p>
            <p>
              Whether you&apos;re capturing breathtaking landscapes, unforgettable moments, or
              creative storytelling through albums, our platform helps your work reach a wider
              audience.
            </p>
          </div>
          <blockquote className="flex gap-2.5 border-l-2 border-[#4048cd] pl-2.5">
            <p className="text-[16px] italic leading-normal text-[#6b7280] sm:text-[20px]">
              &ldquo;Every photographer should have a fair stage to present their visual timeline.
              We designed My12Photos as that global amphitheater.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </Shell>
  </section>
));

AboutStory.displayName = 'AboutStory';

export default AboutStory;
