import { Images, Loader2, Pencil, Play, Trash2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { isSlideshowPlayable } from '@/shared/data/slideshows';

const HOVER_PREVIEW_MS = 1100;

const DECK_LAYERS = [
  {
    depth: 2,
    className:
      '-translate-y-3 scale-[0.88] opacity-50 group-hover:-translate-y-4',
  },
  {
    depth: 1,
    className:
      '-translate-y-1.5 scale-[0.94] opacity-75 group-hover:-translate-y-2',
  },
];

const OwnerActionButton = ({ label, onClick, disabled, danger, children }) => (
  <Button
    unstyled
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#e5e7eb] bg-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
      danger
        ? 'text-[#dc2626] hover:border-red-200 hover:bg-red-50'
        : 'text-[#374151] hover:border-[#4048cd]/30 hover:bg-[#4048cd]/5 hover:text-[#4048cd]'
    }`}
  >
    {children}
  </Button>
);

/**
 * Profile card for a slideshow album: stacked-deck cover that previews its
 * photos on hover and opens the player on click.
 */
const SlideshowCard = memo(
  ({
    slideshow,
    canManage = false,
    isDeleting = false,
    onPlay,
    onEdit,
    onDelete,
  }) => {
    const { t, i18n } = useTranslation();
    const { photos, title } = slideshow;
    const playable = isSlideshowPlayable(slideshow);
    const [hovered, setHovered] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewMounted, setPreviewMounted] = useState(false);

    useEffect(() => {
      if (!hovered || photos.length < 2) return undefined;
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        return undefined;
      }
      const timerId = window.setInterval(() => {
        setPreviewIndex((current) => (current + 1) % photos.length);
      }, HOVER_PREVIEW_MS);
      return () => window.clearInterval(timerId);
    }, [hovered, photos.length]);

    const handlePointerEnter = (event) => {
      if (event.pointerType !== 'mouse' || !playable) return;
      setPreviewMounted(true);
      setHovered(true);
    };

    const handlePointerLeave = () => {
      setHovered(false);
      setPreviewIndex(0);
    };

    const createdLabel = new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
    }).format(new Date(slideshow.createdAt));

    const photoCountLabel = t('photographerProfile.slideshows.photoCount', {
      count: photos.length,
    });

    const coverPhotos = previewMounted ? photos : photos.slice(0, 1);

    return (
      <article
        className={`group flex flex-col transition-opacity ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
      >
        <Button
          unstyled
          type="button"
          onClick={() => onPlay(slideshow.id)}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          disabled={!playable}
          aria-label={t('photographerProfile.slideshows.play', { title })}
          className="group/cover relative block w-full cursor-pointer rounded-2xl pt-3 text-left focus-visible:outline-none disabled:cursor-default"
        >
          {DECK_LAYERS.map(({ depth, className }) =>
            photos[depth] ? (
              <span
                key={depth}
                aria-hidden="true"
                className={`absolute inset-x-0 top-3 aspect-368/252 origin-top overflow-hidden rounded-2xl bg-[#e5e7eb] shadow-sm transition duration-300 ease-out ${className}`}
              >
                <img
                  src={photos[depth].image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
            ) : null,
          )}

          <span className="relative block aspect-368/252 overflow-hidden rounded-2xl bg-[#f3f4f6] shadow-[0_10px_30px_rgba(17,24,39,0.18)] ring-1 ring-black/5 transition duration-300 group-hover:shadow-[0_16px_40px_rgba(17,24,39,0.25)] group-focus-visible/cover:ring-4 group-focus-visible/cover:ring-[#4048cd]/40">
            {coverPhotos.map((photo, i) => (
              <img
                key={photo.id}
                src={photo.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03]"
                style={{ opacity: i === previewIndex ? 1 : 0 }}
              />
            ))}

            <span className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-black/25" />

            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.35px] text-[#0d0d14] shadow-sm">
              <Play size={11} aria-hidden="true" className="fill-current" />
              {t('photographerProfile.slideshows.badge')}
            </span>

            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-[11px] font-semibold leading-none text-white backdrop-blur-[2px]">
              <Images size={13} strokeWidth={2.5} aria-hidden="true" />
              {photoCountLabel}
            </span>

            {playable ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white/90 text-[#4048cd] opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100"
              >
                <Play size={24} className="ml-0.5 fill-current" />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 p-4 text-center text-[13px] font-semibold text-white">
                {t('photographerProfile.slideshows.needsPhotos')}
              </span>
            )}

            {hovered && photos.length > 1 ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 top-11 flex gap-1"
              >
                {photos.map((photo, i) => (
                  <span
                    key={photo.id}
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      i <= previewIndex ? 'bg-white' : 'bg-white/35'
                    }`}
                  />
                ))}
              </span>
            ) : null}
          </span>
        </Button>

        <div className="mt-3 flex items-start justify-between gap-3 px-0.5">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-bold leading-6 text-[#0d0d14] transition group-hover:text-[#4048cd]">
              {title}
            </h3>
            <p className="mt-0.5 truncate text-[13px] leading-5 text-[#6b7280]">
              {photoCountLabel} · {createdLabel}
            </p>
          </div>

          {canManage ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <OwnerActionButton
                label={t('photographerProfile.slideshows.editAria', { title })}
                onClick={() => onEdit(slideshow)}
                disabled={isDeleting}
              >
                <Pencil size={15} aria-hidden="true" />
              </OwnerActionButton>
              <OwnerActionButton
                label={t('photographerProfile.slideshows.deleteAria', {
                  title,
                })}
                onClick={() => onDelete(slideshow)}
                disabled={isDeleting}
                danger
              >
                {isDeleting ? (
                  <Loader2
                    size={15}
                    aria-hidden="true"
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={15} aria-hidden="true" />
                )}
              </OwnerActionButton>
            </div>
          ) : null}
        </div>
      </article>
    );
  },
);

SlideshowCard.displayName = 'SlideshowCard';

export default SlideshowCard;
