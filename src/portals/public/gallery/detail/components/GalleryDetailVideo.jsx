import React, { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pause, Play } from 'lucide-react';

const GalleryDetailVideo = memo(({ poster, src, title }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }, []);

  if (!src) return null;

  return (
    <div className="relative aspect-1536/653 w-full overflow-hidden rounded-2xl bg-[#0d0d14] sm:rounded-[20px]">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={poster}
        src={src}
        playsInline
        preload="metadata"
        aria-label={title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? t('galleryDetail.pauseVideo') : t('galleryDetail.playVideo')}
        className={`absolute flex cursor-pointer items-center justify-center transition ${
          playing
            ? 'bottom-4 right-4 size-11 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/65'
            : 'inset-0 bg-black/15 hover:bg-black/25'
        }`}
      >
        {playing ? (
          <Pause size={20} aria-hidden="true" />
        ) : (
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-white/90 text-[#0d0d14] shadow-[0_8px_24px_rgba(13,13,20,0.2)] backdrop-blur-sm sm:size-20">
            <Play size={32} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </span>
        )}
      </button>
    </div>
  );
});

GalleryDetailVideo.displayName = 'GalleryDetailVideo';

export default GalleryDetailVideo;
