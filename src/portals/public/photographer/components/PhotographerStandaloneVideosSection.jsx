import { Calendar, Clock, Play, Sparkles, Video } from 'lucide-react';
import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { resolveMediaUrl } from '@/shared/utils/media';

/**
 * Displays standalone 1-minute videos (Video Updates) uploaded by the artist.
 *
 * @param {{
 *   videos?: Array<{
 *     id: string,
 *     title: string,
 *     story?: string,
 *     videoUrl: string,
 *     thumbnailUrl?: string,
 *     duration?: number,
 *     createdAt?: string,
 *     viewsCount?: number,
 *     likesCount?: number
 *   }>,
 *   artistName?: string
 * }} props
 */
const PhotographerStandaloneVideosSection = memo(({ videos = [], artistName = 'Artist' }) => {
  const { t } = useTranslation();
  const [activeVideoId, setActiveVideoId] = useState(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '1:00';
    const s = Math.round(seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="mt-8 sm:mt-12" aria-labelledby="standalone-videos-title">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-lg bg-red-50 text-[#ee1c25]">
              <Video size={14} />
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-[#ee1c25]">
              {t('standaloneVideos.tag', 'Standalone Videos')}
            </span>
          </div>
          <h2
            id="standalone-videos-title"
            className="mt-1 text-[20px] font-bold text-[#111827] sm:text-[24px]"
          >
            {t('standaloneVideos.title', '1-Minute Video Updates')}
          </h2>
          <p className="mt-1 text-[14px] text-[#6b7280]">
            {t(
              'standaloneVideos.subtitle',
              'Quick standalone video messages and studio updates from {{name}}',
              { name: artistName },
            )}
          </p>
        </div>
        <span className="text-xs font-semibold text-[#6b7280]">
          {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
        {videos.map((vid) => {
          const isPlaying = activeVideoId === vid.id;
          const videoSrc = resolveMediaUrl(vid.videoUrl);
          const thumbSrc = resolveMediaUrl(vid.thumbnailUrl);

          return (
            <div
              key={vid.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md"
            >
              {/* Video Player / Cover Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {isPlaying && videoSrc ? (
                  <video
                    src={videoSrc}
                    poster={thumbSrc}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <>
                    {thumbSrc ? (
                      <Image
                        src={thumbSrc}
                        alt={vid.title || 'Video update'}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-[#161c27] to-[#2b3548]">
                        <Video size={36} className="text-white/40" />
                      </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-xs border border-white/20">
                      <Clock size={12} />
                      <span>{formatDuration(vid.duration)}</span>
                    </div>

                    {/* 1-Minute badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ee1c25] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                        1-Min Video
                      </span>
                    </div>

                    {/* Play Button */}
                    <Button
                      unstyled
                      type="button"
                      onClick={() => setActiveVideoId(vid.id)}
                      aria-label={`Play ${vid.title || 'video'}`}
                      className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center group"
                    >
                      <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-xl transition transform duration-200 group-hover:scale-110 group-hover:bg-white">
                        <Play size={24} fill="currentColor" className="ml-1 text-[#111827]" />
                      </span>
                    </Button>
                  </>
                )}
              </div>

              {/* Video Info Footer */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#9ca3af]">
                  {vid.createdAt ? (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDate(vid.createdAt)}
                    </span>
                  ) : null}
                  <span className="font-semibold text-indigo-600">
                    Standalone Update
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-[#111827] line-clamp-1">
                  {vid.title || 'Untitled Video Update'}
                </h3>

                {vid.story ? (
                  <p className="mt-1.5 text-sm text-[#4b5563] line-clamp-2 leading-relaxed">
                    {vid.story}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

PhotographerStandaloneVideosSection.displayName = 'PhotographerStandaloneVideosSection';

export default PhotographerStandaloneVideosSection;
