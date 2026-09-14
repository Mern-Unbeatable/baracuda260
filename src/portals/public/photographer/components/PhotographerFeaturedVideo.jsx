import React, { memo } from 'react';
import { Play } from 'lucide-react';

const PhotographerFeaturedVideo = memo(({ video }) => {
  if (!video?.image) return null;

  return (
    <section className="mt-8 sm:mt-10">
      <div className="relative aspect-[2.15/1] overflow-hidden rounded-2xl bg-[#f3f4f6]">
        <img src={video.image} alt={video.title || ''} className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label={video.playLabel || 'Play featured video'}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/5 transition hover:bg-black/10"
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md sm:size-16">
            <Play size={26} fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  );
});

PhotographerFeaturedVideo.displayName = 'PhotographerFeaturedVideo';

export default PhotographerFeaturedVideo;
