import React, { memo } from 'react';
import { Play } from 'lucide-react';

const PhotographerFeaturedCompetition = memo(({ featured }) => (
  <section className="mt-8 sm:mt-10">
    <div className="relative aspect-[2.15/1] overflow-hidden rounded-2xl">
      <img
        src={featured.image}
        alt={featured.subtitle}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        aria-label="Play featured video"
        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/5 transition hover:bg-black/10"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md">
          <Play size={24} fill="currentColor" aria-hidden="true" />
        </span>
      </button>
    </div>
  </section>
));

PhotographerFeaturedCompetition.displayName = 'PhotographerFeaturedCompetition';

export default PhotographerFeaturedCompetition;
