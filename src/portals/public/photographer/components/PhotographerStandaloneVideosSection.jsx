import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Play,
  Trash2,
  Video,
} from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { resolveMediaUrl } from '@/shared/utils/media';

const DEFAULT_STORY_PLACEHOLDER =
  'Sharing a quick 1-minute message about my upcoming photo series and thanking my supporters!';

const getDisplayStory = (story) => {
  const value = typeof story === 'string' ? story.trim() : '';
  if (!value) return '';
  if (value === DEFAULT_STORY_PLACEHOLDER) return '';
  return value;
};

/**
 * Displays standalone 1-minute videos (Video Updates) in a single-row carousel.
 */
const PhotographerStandaloneVideosSection = memo(
  ({
    videos = [],
    artistName = 'Artist',
    canManage = false,
    onEdit,
    onDelete,
    isDeletingId = null,
  }) => {
    const { t } = useTranslation();
    const scrollerRef = useRef(null);
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
      setIndex(0);
    }, [videos.length]);

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

    const showArrows = videos.length > 1;

    const scrollByCard = (direction) => {
      const el = scrollerRef.current;
      if (!el) return;
      const card = el.querySelector('[data-video-card]');
      const amount = card
        ? card.getBoundingClientRect().width + 16
        : el.clientWidth * 0.85;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);

      const nextIndex = (index + direction + videos.length) % videos.length;
      setIndex(nextIndex);

      if (maxScroll <= 4) return;

      const target = Math.min(maxScroll, Math.max(0, nextIndex * amount));
      el.scrollTo({ left: target, behavior: 'smooth' });
    };

    return (
      <section className="mt-8 sm:mt-12" aria-labelledby="standalone-videos-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
                'Quick one-minute video messages and studio updates from {{name}}',
                { name: artistName },
              )}
            </p>
          </div>

          <span className="text-xs font-semibold text-[#6b7280]">
            {videos.length}{' '}
            {videos.length === 1
              ? t('standaloneVideos.videoSingular', 'Video')
              : t('standaloneVideos.videoPlural', 'Videos')}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 sm:gap-3">
          {showArrows ? (
            <Button
              unstyled
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={t('standaloneVideos.prev', 'Previous videos')}
              className="inline-flex size-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] shadow-sm transition hover:bg-[#f9fafb] hover:shadow-md sm:size-10"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </Button>
          ) : null}

          <div
            ref={scrollerRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {videos.map((vid) => {
              const isPlaying = activeVideoId === vid.id;
              const videoSrc = resolveMediaUrl(vid.videoUrl);
              const thumbSrc = resolveMediaUrl(vid.thumbnailUrl);
              const displayStory = getDisplayStory(vid.story);

              return (
                <article
                  key={vid.id}
                  data-video-card
                  className="group flex w-[min(100%,300px)] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-[#e8eaef] bg-white"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#111827]">
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
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#1f2937]">
                            <Video size={32} className="text-white/35" />
                          </div>
                        )}

                        <div
                          className="pointer-events-none absolute inset-0 bg-black/15"
                          aria-hidden="true"
                        />

                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center rounded-md bg-[#ee1c25] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            1 Min
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white">
                          <Clock size={11} />
                          <span>{formatDuration(vid.duration)}</span>
                        </div>

                        <Button
                          unstyled
                          type="button"
                          onClick={() => setActiveVideoId(vid.id)}
                          aria-label={`Play ${vid.title || 'video'}`}
                          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
                        >
                          <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-[#111827] shadow-md transition duration-200 group-hover:scale-105">
                            <Play
                              size={18}
                              fill="currentColor"
                              className="ml-0.5"
                            />
                          </span>
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#111827]">
                      {vid.title || 'Untitled Video Update'}
                    </h3>

                    {vid.createdAt ? (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-[#9ca3af]">
                        <Calendar size={12} />
                        {formatDate(vid.createdAt)}
                      </p>
                    ) : null}

                    {displayStory ? (
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#6b7280]">
                        {displayStory}
                      </p>
                    ) : null}

                    {canManage ? (
                      <div className="mt-3 flex items-center justify-end gap-1 border-t border-[#f3f4f6] pt-2.5">
                        <Button
                          unstyled
                          type="button"
                          onClick={() => onEdit?.(vid)}
                          aria-label={t('standaloneVideos.edit', 'Edit video')}
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#4048cd] transition hover:bg-[#eef0ff]"
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          unstyled
                          type="button"
                          onClick={() => onDelete?.(vid)}
                          disabled={isDeletingId === vid.id}
                          aria-label={t(
                            'standaloneVideos.delete',
                            'Delete video',
                          )}
                          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#ee1c25] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          {showArrows ? (
            <Button
              unstyled
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={t('standaloneVideos.next', 'Next videos')}
              className="inline-flex size-9 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] shadow-sm transition hover:bg-[#f9fafb] hover:shadow-md sm:size-10"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      </section>
    );
  },
);

PhotographerStandaloneVideosSection.displayName =
  'PhotographerStandaloneVideosSection';

export default PhotographerStandaloneVideosSection;
