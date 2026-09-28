import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Share2,
  X,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import PhotoAiBadgeOverlay from '@/components/data-display/PhotoAiBadgeOverlay/PhotoAiBadgeOverlay';
import PhotographerAwardCounters from '@/components/data-display/PhotographerAwardCounters/PhotographerAwardCounters';
import Button from '@/components/ui/Button';
import { SLIDESHOW_SLIDE_MS } from '@/shared/data/slideshows';

const FADE_MS = 700;
const HOLD_TO_PAUSE_MS = 250;
const SWIPE_THRESHOLD_PX = 50;

const ControlButton = ({ label, onClick, children, className = '' }) => (
  <Button
    unstyled
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`.trim()}
  >
    {children}
  </Button>
);

/**
 * Full-screen slideshow player: auto-advances, pauses on demand or while the
 * photo is pressed, and supports keyboard, swipe and tap-zone navigation.
 * @param {{
 *   slideshow: { id: string, title: string, photos: { id: string, title: string, image: string, isAiGenerated?: boolean }[] },
 *   ownerName?: string,
 *   onClose: () => void,
 * }} props
 */
const SlideshowPlayer = memo(({ slideshow, ownerName, onClose }) => {
  const { t } = useTranslation();
  const { photos } = slideshow;
  const count = photos.length;

  const [position, setPosition] = useState({ index: 0, previous: null });
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const dialogRef = useRef(null);
  const thumbsRef = useRef(null);
  const gestureRef = useRef(null);

  const { index, previous } = position;
  const activePhoto = photos[index];
  const playState = paused || holding ? 'paused' : 'running';

  const goTo = useCallback((nextIndex) => {
    setPosition((current) =>
      current.index === nextIndex
        ? current
        : { index: nextIndex, previous: current.index },
    );
  }, []);

  const goNext = useCallback(() => {
    setPosition((current) => ({
      index: (current.index + 1) % count,
      previous: current.index,
    }));
  }, [count]);

  const goPrev = useCallback(() => {
    setPosition((current) => ({
      index: (current.index - 1 + count) % count,
      previous: current.index,
    }));
  }, [count]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const onButton = Boolean(event.target.closest?.('button'));

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === ' ' && !onButton) {
        event.preventDefault();
        setPaused((current) => !current);
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    // Scroll only the strip: scrollIntoView would also scroll the dialog itself sideways.
    const strip = thumbsRef.current;
    const thumb = strip?.children[index];
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: 'smooth',
    });
  }, [index]);

  const endGesture = () => {
    const gesture = gestureRef.current;
    if (!gesture) return null;
    window.clearTimeout(gesture.holdTimer);
    gestureRef.current = null;
    if (gesture.held) setHolding(false);
    return gesture;
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    endGesture();
    const gesture = {
      x: event.clientX,
      y: event.clientY,
      held: false,
      holdTimer: 0,
    };
    gesture.holdTimer = window.setTimeout(() => {
      gesture.held = true;
      setHolding(true);
    }, HOLD_TO_PAUSE_MS);
    gestureRef.current = gesture;
  };

  const handlePointerUp = (event) => {
    const gesture = endGesture();
    if (!gesture || gesture.held) return;

    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX - rect.left < rect.width / 3) goPrev();
    else goNext();
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: slideshow.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('photographerProfile.slideshows.toast.linkCopied'));
    } catch {
      // Share sheet dismissed or clipboard blocked — nothing to report.
    }
  };

  const counter = t('photographerProfile.slideshows.player.counter', {
    current: index + 1,
    total: count,
  });

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={slideshow.title}
      tabIndex={-1}
      className="fixed inset-0 z-150 flex flex-col overflow-clip bg-[#0b0b0f] text-white outline-none"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {photos.map((photo, i) =>
          i === index || i === previous ? (
            <img
              key={photo.id}
              src={photo.image}
              alt=""
              className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl transition-opacity ease-out"
              style={{
                opacity: i === index ? 0.4 : 0,
                transitionDuration: `${FADE_MS}ms`,
              }}
            />
          ) : null,
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <header className="relative z-10 flex flex-col gap-3 bg-linear-to-b from-black/70 to-transparent px-4 pb-6 pt-3 sm:px-6 sm:pt-4">
        <div className="flex gap-1" aria-hidden="true">
          {photos.map((photo, i) => (
            <span
              key={photo.id}
              className="h-0.75 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              {i < index ? (
                <span className="block h-full w-full bg-white" />
              ) : null}
              {i === index ? (
                <span
                  className="slideshow-progress block h-full w-full bg-white"
                  style={{
                    animationDuration: `${SLIDESHOW_SLIDE_MS}ms`,
                    animationPlayState: playState,
                  }}
                  onAnimationEnd={goNext}
                />
              ) : null}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-semibold leading-6 sm:text-[18px]">
              {slideshow.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-[13px] leading-5 text-white/70">
              <span className="truncate">
                {ownerName
                  ? `${t('photographerProfile.slideshows.player.by', { name: ownerName })} · `
                  : ''}
                {counter}
              </span>
              <PhotographerAwardCounters size="sm" className="shrink-0" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ControlButton
              label={
                paused
                  ? t('photographerProfile.slideshows.player.play')
                  : t('photographerProfile.slideshows.player.pause')
              }
              onClick={() => setPaused((current) => !current)}
            >
              {paused ? (
                <Play size={20} aria-hidden="true" className="fill-current" />
              ) : (
                <Pause size={20} aria-hidden="true" className="fill-current" />
              )}
            </ControlButton>
            <ControlButton
              label={t('photographerProfile.slideshows.player.share')}
              onClick={handleShare}
            >
              <Share2 size={19} aria-hidden="true" />
            </ControlButton>
            <ControlButton
              label={t('photographerProfile.slideshows.player.close')}
              onClick={onClose}
              className="bg-white/10"
            >
              <X size={20} aria-hidden="true" />
            </ControlButton>
          </div>
        </div>
      </header>

      <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
        <div
          className="absolute inset-0 cursor-pointer touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={endGesture}
          onPointerLeave={endGesture}
          onContextMenu={(event) => event.preventDefault()}
        >
          {photos.map((photo, i) => {
            const isActive = i === index;
            const isAnimated = isActive || i === previous;
            return (
              <div
                key={photo.id}
                aria-hidden={!isActive}
                className="absolute inset-0 flex items-center justify-center px-2 transition-opacity ease-out sm:px-20"
                style={{
                  opacity: isActive ? 1 : 0,
                  transitionDuration: `${FADE_MS}ms`,
                }}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  draggable={false}
                  className={`max-h-full max-w-full rounded-sm object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)] ${
                    isAnimated ? 'slideshow-kenburns' : ''
                  }`}
                  style={
                    isAnimated
                      ? {
                          animationDuration: `${SLIDESHOW_SLIDE_MS + FADE_MS}ms`,
                          animationPlayState: playState,
                        }
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>

        <PhotoAiBadgeOverlay
          show={Boolean(activePhoto?.isAiGenerated)}
          placement="hero-end"
          size="sm"
        />

        {paused ? (
          <span className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
            {t('photographerProfile.slideshows.player.paused')}
          </span>
        ) : null}

        <ControlButton
          label={t('photographerProfile.slideshows.player.previous')}
          onClick={goPrev}
          className="absolute left-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 bg-white/10 backdrop-blur hover:bg-white/25 sm:inline-flex"
        >
          <ChevronLeft size={26} aria-hidden="true" />
        </ControlButton>
        <ControlButton
          label={t('photographerProfile.slideshows.player.next')}
          onClick={goNext}
          className="absolute right-4 top-1/2 z-10 hidden size-12 -translate-y-1/2 bg-white/10 backdrop-blur hover:bg-white/25 sm:inline-flex"
        >
          <ChevronRight size={26} aria-hidden="true" />
        </ControlButton>
      </div>

      <footer className="relative z-10 bg-linear-to-t from-black/70 to-transparent px-4 pb-4 pt-5 sm:px-6 sm:pb-6">
        <p className="mb-3 truncate text-center text-[14px] font-medium text-white/85">
          {activePhoto?.title}
        </p>
        <div
          ref={thumbsRef}
          className="relative mx-auto flex w-fit max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none]"
        >
          {photos.map((photo, i) => (
            <Button
              unstyled
              key={photo.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t('photographerProfile.slideshows.player.goTo', {
                index: i + 1,
                title: photo.title,
              })}
              aria-current={i === index ? 'true' : undefined}
              className={`relative h-12 w-16 shrink-0 cursor-pointer overflow-hidden rounded-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-20 ${
                i === index
                  ? 'opacity-100 ring-2 ring-white'
                  : 'opacity-45 hover:opacity-80'
              }`}
            >
              <img
                src={photo.image}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </Button>
          ))}
        </div>
      </footer>

      <p
        className="sr-only"
        aria-live={playState === 'paused' ? 'polite' : 'off'}
      >
        {t('photographerProfile.slideshows.player.status', {
          current: index + 1,
          total: count,
          title: activePhoto?.title,
        })}
      </p>
    </div>,
    document.body,
  );
});

SlideshowPlayer.displayName = 'SlideshowPlayer';

export default SlideshowPlayer;
