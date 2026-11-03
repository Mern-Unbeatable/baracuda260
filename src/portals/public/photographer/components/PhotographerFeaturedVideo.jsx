import { Play } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';

const PhotographerFeaturedVideo = memo(({ video }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video?.image && !video?.url) return null;

  return (
    <section className="mt-8 sm:mt-10" aria-label="Introduction Video">
      <div className="relative aspect-[2.15/1] overflow-hidden rounded-2xl bg-[#111827] shadow-sm">
        {isPlaying && video.url ? (
          <video
            src={video.url}
            poster={video.image}
            controls
            autoPlay
            className="h-full w-full object-cover"
          >
            {t('introVideo.unsupportedBrowser', 'Your browser does not support the video tag.')}
          </video>
        ) : (
          <>
            {video.image ? (
              <Image
                src={video.image}
                alt={video.title || '1-Minute Introduction Video'}
                className="h-full w-full object-cover transition duration-300 hover:scale-[1.01]"
              />
            ) : (
              <div className="h-full w-full bg-linear-to-tr from-[#161c27] via-[#232d3f] to-[#3a4763]" />
            )}

            {/* Gradient overlay */}
            <div
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/30"
              aria-hidden="true"
            />

            {/* Play Button Trigger */}
            <Button
              unstyled
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={video.playLabel || 'Play introduction video'}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center transition group"
            >
              <span className="inline-flex size-15 sm:size-18 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-xl transition transform duration-200 group-hover:scale-110 group-hover:bg-white">
                <Play size={28} fill="currentColor" aria-hidden="true" className="ml-1 text-[#111827]" />
              </span>
            </Button>

            {/* Bottom Title & Subtitle */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white sm:bottom-6 sm:left-6 sm:right-6 pointer-events-none">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-white/80">
                {t('introVideo.artistBioIntro', 'Artist Bio & Introduction')}
              </p>
              <h3 className="text-base sm:text-xl font-bold text-white line-clamp-1">
                {video.title || t('introVideo.defaultTitle', 'Artist Introduction Video')}
              </h3>
            </div>
          </>
        )}
      </div>
    </section>
  );
});

PhotographerFeaturedVideo.displayName = 'PhotographerFeaturedVideo';

export default PhotographerFeaturedVideo;
