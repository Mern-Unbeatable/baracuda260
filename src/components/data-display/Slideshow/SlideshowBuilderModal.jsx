import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import React, {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import {
  SLIDESHOW_MAX_PHOTOS,
  SLIDESHOW_MIN_PHOTOS,
  SLIDESHOW_TITLE_MAX,
} from '@/shared/data/slideshows';

const SKELETON_TILES = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const OrderButton = ({ label, onClick, disabled, children }) => (
  <Button
    unstyled
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md bg-black/55 text-white transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-30"
  >
    {children}
  </Button>
);

const BuilderDialog = ({
  slideshow,
  photos,
  photosLoading,
  photosError,
  onRetryPhotos,
  isSaving,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const titleId = useId();
  const nameId = useId();
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);
  const isEdit = Boolean(slideshow);

  const [title, setTitle] = useState(slideshow?.title ?? '');
  const [selectedIds, setSelectedIds] = useState(slideshow?.photoIds ?? []);
  const [attempted, setAttempted] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const photoById = useMemo(
    () => new Map(photos.map((photo) => [photo.id, photo])),
    [photos],
  );
  // Ignore ids that are no longer selectable (e.g. a photo deleted since the slideshow was made).
  const selected = selectedIds.map((id) => photoById.get(id)).filter(Boolean);
  const selectedCount = selected.length;
  const maxReached = selectedCount >= SLIDESHOW_MAX_PHOTOS;
  const orderById = new Map(selected.map((photo, i) => [photo.id, i + 1]));

  const nameError =
    attempted && !title.trim()
      ? t('photographerProfile.slideshows.builder.nameRequired')
      : null;
  const photosErrorText =
    attempted && selectedCount < SLIDESHOW_MIN_PHOTOS
      ? t('photographerProfile.slideshows.builder.minPhotos', {
          min: SLIDESHOW_MIN_PHOTOS,
        })
      : null;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const setOrder = (updater) =>
    setSelectedIds((current) =>
      updater(current.filter((id) => photoById.has(id))),
    );

  const togglePhoto = (id) =>
    setOrder((ids) => {
      if (ids.includes(id)) return ids.filter((item) => item !== id);
      return ids.length >= SLIDESHOW_MAX_PHOTOS ? ids : [...ids, id];
    });

  const movePhoto = (from, to) => {
    if (from === to) return;
    setOrder((ids) =>
      to < 0 || to >= ids.length ? ids : moveItem(ids, from, to),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (isSaving) return;
    if (!title.trim()) {
      nameInputRef.current?.focus();
      return;
    }
    if (selectedCount < SLIDESHOW_MIN_PHOTOS) return;
    onSubmit({
      title: title.trim(),
      photoIds: selected.map((photo) => photo.id),
    });
  };

  const renderPhotoGrid = () => {
    if (photosLoading) {
      return (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
          {SKELETON_TILES.map((key) => (
            <span
              key={key}
              className="aspect-square animate-pulse rounded-xl bg-[#eef0f4]"
            />
          ))}
        </div>
      );
    }

    if (photosError) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-red-200 bg-red-50/60 px-4 py-8 text-center">
          <p className="text-[14px] text-red-700">
            {t('photographerProfile.slideshows.builder.photosLoadError')}
          </p>
          <Button
            unstyled
            type="button"
            onClick={onRetryPhotos}
            className="cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-[13px] font-semibold text-red-700 transition hover:bg-red-50"
          >
            {t('photographerProfile.slideshows.retry')}
          </Button>
        </div>
      );
    }

    if (!photos.length) {
      return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#d1d5db] px-4 py-10 text-center">
          <ImageOff size={28} className="text-[#9ca3af]" aria-hidden="true" />
          <p className="text-[14px] text-[#6b7280]">
            {t('photographerProfile.slideshows.builder.noPhotos')}
          </p>
        </div>
      );
    }

    return (
      <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
        {photos.map((photo) => {
          const order = orderById.get(photo.id);
          const isSelected = Boolean(order);
          return (
            <li key={photo.id}>
              <Button
                unstyled
                type="button"
                onClick={() => togglePhoto(photo.id)}
                disabled={!isSelected && maxReached}
                aria-pressed={isSelected}
                aria-label={t(
                  'photographerProfile.slideshows.builder.selectPhoto',
                  {
                    title: photo.title,
                  },
                )}
                className={`group/tile relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-[#f3f4f6] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4048cd] disabled:cursor-not-allowed disabled:opacity-35 ${
                  isSelected ? 'ring-3 ring-[#4048cd] ring-offset-2' : ''
                }`}
              >
                <img
                  src={photo.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className={`h-full w-full object-cover transition duration-200 ${
                    isSelected
                      ? 'scale-[0.94] rounded-lg'
                      : 'group-hover/tile:scale-105'
                  }`}
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/70 to-transparent px-2 pb-1.5 pt-6 text-left text-[11px] font-medium text-white">
                  {photo.title}
                </span>
                <span
                  className={`absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-[12px] font-bold transition ${
                    isSelected
                      ? 'bg-[#4048cd] text-white shadow-md'
                      : 'border-2 border-white/95 bg-black/25'
                  }`}
                >
                  {order ?? null}
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className="fixed inset-0 z-140 flex items-end justify-center bg-[#0e1423]/55 backdrop-blur-sm sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_22px_70px_rgba(14,20,35,0.3)] outline-none sm:max-h-[90dvh] sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-[#edf0f3] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-[20px] font-bold leading-7 tracking-[-0.3px] text-[#111827]"
            >
              {isEdit
                ? t('photographerProfile.slideshows.builder.editTitle')
                : t('photographerProfile.slideshows.builder.createTitle')}
            </h2>
            <p className="mt-0.5 text-[14px] leading-5 text-[#6b7280]">
              {t('photographerProfile.slideshows.builder.subtitle', {
                min: SLIDESHOW_MIN_PHOTOS,
                max: SLIDESHOW_MAX_PHOTOS,
              })}
            </p>
          </div>
          <Button
            unstyled
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label={t('photographerProfile.slideshows.builder.close')}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition hover:bg-black/5 hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} aria-hidden="true" />
          </Button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <label
                htmlFor={nameId}
                className="text-[14px] font-semibold leading-5 text-[#373737]"
              >
                {t('photographerProfile.slideshows.builder.nameLabel')}
              </label>
              <span className="text-[12px] tabular-nums text-[#9ca3af]">
                {title.length}/{SLIDESHOW_TITLE_MAX}
              </span>
            </div>
            <input
              ref={nameInputRef}
              id={nameId}
              type="text"
              value={title}
              maxLength={SLIDESHOW_TITLE_MAX}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t(
                'photographerProfile.slideshows.builder.namePlaceholder',
              )}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? `${nameId}-error` : undefined}
              className={`h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#4048cd] focus:ring-2 focus:ring-[#4048cd]/20 ${
                nameError ? 'border-red-400' : 'border-[#e5e7eb]'
              }`}
            />
            {nameError ? (
              <p
                id={`${nameId}-error`}
                className="mt-1.5 text-[13px] text-[#ee1c25]"
              >
                {nameError}
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[14px] font-semibold leading-5 text-[#373737]">
                {t('photographerProfile.slideshows.builder.photosLabel')}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums ${
                  selectedCount >= SLIDESHOW_MIN_PHOTOS
                    ? 'bg-[#4048cd]/10 text-[#4048cd]'
                    : 'bg-[#f3f4f6] text-[#6b7280]'
                }`}
                aria-live="polite"
              >
                {t('photographerProfile.slideshows.builder.selected', {
                  count: selectedCount,
                  max: SLIDESHOW_MAX_PHOTOS,
                })}
              </span>
            </div>
            {maxReached ? (
              <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
                {t('photographerProfile.slideshows.builder.maxReached', {
                  max: SLIDESHOW_MAX_PHOTOS,
                })}
              </p>
            ) : null}
            {renderPhotoGrid()}
            {photosErrorText ? (
              <p className="mt-2 text-[13px] text-[#ee1c25]">
                {photosErrorText}
              </p>
            ) : null}
          </div>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#edf0f3] bg-[#fafbfc] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-[13px] font-semibold text-[#373737]">
              {t('photographerProfile.slideshows.builder.orderLabel')}
            </span>
            <span className="text-[12px] text-[#6b7280]">
              {t('photographerProfile.slideshows.builder.orderHint')}
            </span>
          </div>

          {selectedCount ? (
            <ol className="flex gap-2 overflow-x-auto p-0.5 pb-1">
              {selected.map((photo, i) => (
                <li
                  key={photo.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', photo.id);
                    setDragIndex(i);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (dragIndex === null || dragIndex === i) return;
                    movePhoto(dragIndex, i);
                    setDragIndex(i);
                  }}
                  onDrop={(event) => event.preventDefault()}
                  onDragEnd={() => setDragIndex(null)}
                  className={`relative h-18 w-24 shrink-0 cursor-grab overflow-hidden rounded-lg bg-[#e5e7eb] ring-1 ring-black/10 transition active:cursor-grabbing ${
                    dragIndex === i ? 'opacity-40' : ''
                  }`}
                >
                  <img
                    src={photo.image}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#4048cd] px-1 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  {i === 0 ? (
                    <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#111827]">
                      {t('photographerProfile.slideshows.builder.cover')}
                    </span>
                  ) : null}
                  <span className="absolute right-1 top-1">
                    <OrderButton
                      label={t(
                        'photographerProfile.slideshows.builder.remove',
                        {
                          title: photo.title,
                        },
                      )}
                      onClick={() => togglePhoto(photo.id)}
                    >
                      <X size={13} aria-hidden="true" />
                    </OrderButton>
                  </span>
                  <span className="absolute bottom-1 right-1 flex gap-0.5">
                    <OrderButton
                      label={t(
                        'photographerProfile.slideshows.builder.moveEarlier',
                        {
                          title: photo.title,
                        },
                      )}
                      onClick={() => movePhoto(i, i - 1)}
                      disabled={i === 0}
                    >
                      <ChevronLeft size={14} aria-hidden="true" />
                    </OrderButton>
                    <OrderButton
                      label={t(
                        'photographerProfile.slideshows.builder.moveLater',
                        {
                          title: photo.title,
                        },
                      )}
                      onClick={() => movePhoto(i, i + 1)}
                      disabled={i === selectedCount - 1}
                    >
                      <ChevronRight size={14} aria-hidden="true" />
                    </OrderButton>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="flex h-18 items-center justify-center rounded-lg border border-dashed border-[#d1d5db] px-3 text-center text-[13px] text-[#9ca3af]">
              {t('photographerProfile.slideshows.builder.orderEmpty')}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              unstyled
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 cursor-pointer rounded-lg border border-[#e5e7eb] bg-white px-5 text-[14px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t('photographerProfile.slideshows.builder.cancel')}
            </Button>
            <Button
              unstyled
              type="submit"
              disabled={isSaving}
              className="h-11 cursor-pointer rounded-lg bg-[#4048cd] px-6 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#343bb0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? t('photographerProfile.slideshows.builder.saving')
                : isEdit
                  ? t('photographerProfile.slideshows.builder.save')
                  : t('photographerProfile.slideshows.builder.create')}
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
};

/**
 * Create / edit a slideshow: name it, pick 2–12 single photos, set the play order.
 * The dialog remounts per slideshow so it always starts from that slideshow's values.
 */
const SlideshowBuilderModal = memo(({ open, slideshow, ...props }) => {
  if (!open) return null;
  return createPortal(
    <BuilderDialog
      key={slideshow?.id ?? 'new'}
      slideshow={slideshow}
      {...props}
    />,
    document.body,
  );
});

SlideshowBuilderModal.displayName = 'SlideshowBuilderModal';

export default SlideshowBuilderModal;
