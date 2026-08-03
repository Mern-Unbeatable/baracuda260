import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, Sparkles as SparklesLucide } from 'lucide-react';
import { ROUTES } from '../../config';
import PhotoSubmitSuccessModal from '../singlePhoto/PhotoSubmitSuccessModal';
import {
  ARTISTIC_CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_THEME_ID,
  getSlotsForTheme,
  getThemeById,
  SIX_PHOTO_ASSETS,
  THEMES,
} from './sixPhotoAssets';

const SlotIcon = memo(({ slot }) => {
  if (slot.iconBg && slot.iconOverlay) {
    return (
      <span className="relative size-[35px] shrink-0 overflow-hidden">
        <img
          src={slot.iconBg}
          alt=""
          width={35}
          height={35}
          className="absolute inset-0 size-[35px] object-contain"
        />
        <img
          src={slot.iconOverlay}
          alt=""
          className="absolute left-1/2 top-1/2 max-h-[26px] max-w-[26px] -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    );
  }

  if (slot.icon) {
    return (
      <img
        src={slot.icon}
        alt=""
        width={35}
        height={35}
        className="size-[35px] shrink-0 object-contain"
      />
    );
  }

  return null;
});

SlotIcon.displayName = 'SlotIcon';

/**
 * Zodiac slot card — Figma 190:331 (red) / 190:872 (blue).
 * Equal-height row; date band reserved so CTAs share one baseline.
 */
const ZodiacSlotCard = memo(({ slot, themeStyles, preview, onAddPhoto, changeLabel, addLabel }) => {
  const { t } = useTranslation();

  return (
    <article
      className={`flex h-full min-w-0 flex-col gap-[27px] rounded-[12px] border bg-white p-5 ${themeStyles.cardBorder}`}
    >
      <div className="flex w-full flex-1 flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <p className={`shrink-0 text-[20px] font-semibold leading-6 ${themeStyles.number}`}>
            #{slot.number}
          </p>
          <p className="shrink-0 text-[16px] font-medium leading-6 text-[#3a3a3a]">
            {t(slot.elementKey)}
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <SlotIcon slot={slot} />
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <p className={`w-full text-[20px] font-medium leading-6 ${themeStyles.name}`}>
              {t(slot.nameKey)}
            </p>
            <p
              className={`flex min-h-12 w-full items-start justify-center text-[16px] font-medium leading-6 ${themeStyles.range}`}
            >
              {t(slot.rangeKey)}
            </p>
          </div>
        </div>
      </div>

      {preview ? (
        <div className="relative mt-auto w-full overflow-hidden rounded-lg border border-black/10">
          <img src={preview} alt="" className="h-24 w-full object-cover" />
          <button
            type="button"
            onClick={onAddPhoto}
            className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-[#ee1c25] shadow"
          >
            {changeLabel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onAddPhoto}
          className={`mt-auto inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white px-6 py-3 text-[16px] font-medium leading-6 transition hover:bg-black/[0.02] ${themeStyles.buttonBorder} ${themeStyles.buttonText}`}
        >
          <img
            src={themeStyles.upload}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          {addLabel}
        </button>
      )}
    </article>
  );
});

ZodiacSlotCard.displayName = 'ZodiacSlotCard';

/**
 * 6 Photo Story upload workspace — Figma node 190:237 (file kE9g2eZmAoSco81PgZNlj2).
 * Theme accent → wave → 6 slots grid → metadata form + copyright + submit.
 */
const SixPhotoContent = memo(() => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);

  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  const theme = getThemeById(themeId);
  const slots = getSlotsForTheme(themeId);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleThemeChange = (nextThemeId) => {
    setThemeId(nextThemeId);
    setPreviews((previous) => {
      Object.values(previous).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return {};
    });
    setErrors((current) => {
      const { photos: _photos, ...rest } = current;
      return rest;
    });
  };

  const handlePickPhoto = (slotId) => {
    activeSlotRef.current = slotId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    const slotId = activeSlotRef.current;
    event.target.value = '';
    if (!file || !slotId) return;

    setPreviews((previous) => {
      const nextUrl = URL.createObjectURL(file);
      if (previous[slotId]) URL.revokeObjectURL(previous[slotId]);
      return { ...previous, [slotId]: nextUrl };
    });
    setErrors((current) => {
      const { photos: _photos, ...rest } = current;
      return rest;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = t('sixPhoto.errors.titleRequired');
    if (!story.trim()) nextErrors.story = t('sixPhoto.errors.storyRequired');
    const missingPhotos = slots.some((slot) => !previews[slot.id]);
    if (missingPhotos) nextErrors.photos = t('sixPhoto.errors.photosRequired');
    if (!copyrightOk) nextErrors.copyright = t('sixPhoto.errors.copyrightRequired');
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessOpen(false);
      return;
    }
    setErrors({});
    setSuccessOpen(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <Link
        to={ROUTES.ADMIN_UPLOAD_PHOTOS}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#202020] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('sixPhoto.backToSelection')}
      </Link>

      <div className="flex flex-col gap-8">
        <section className="flex w-full flex-col gap-6 rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white p-5 sm:p-8">
          <div className="flex items-center gap-2">
            <SparklesLucide size={16} className="shrink-0 text-[#1b1b1b]" aria-hidden="true" />
            <h1 className="text-[18px] font-medium leading-6 text-[#1b1b1b] sm:text-[20px]">
              {t('sixPhoto.selectTheme')}
            </h1>
          </div>

          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-6">
            {THEMES.map((item, index) => {
              const selected = item.id === themeId;
              const styles = selected ? item.selected : item.idle;

              return (
                <React.Fragment key={item.id}>
                  {index > 0 ? (
                    <p className="shrink-0 text-center text-[18px] font-semibold leading-6 text-black sm:text-[20px]">
                      {t('sixPhoto.or')}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleThemeChange(item.id)}
                    className={`flex flex-1 cursor-pointer flex-col gap-4 rounded-[10px] border p-5 text-left transition sm:p-6 ${styles.card}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <img
                          src={item.icon}
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 shrink-0"
                        />
                        <span
                          className={`text-[16px] font-semibold leading-6 sm:text-[18px] xl:text-[20px] ${styles.title}`}
                        >
                          {t(item.titleKey)}
                        </span>
                      </span>
                      {selected ? (
                        <img
                          src={item.selectedDot}
                          alt=""
                          width={8}
                          height={8}
                          className="mt-2 size-2 shrink-0"
                        />
                      ) : (
                        <span className="mt-2 size-2 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                    <p className={`text-[15px] font-medium leading-6 sm:text-[16px] ${styles.body}`}>
                      {t(item.descriptionKey)}
                    </p>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </section>

        <div className={`relative w-full overflow-visible ${theme.waveClassName}`} aria-hidden="true">
          <img
            src={theme.wave}
            alt=""
            className={`absolute inset-x-0 top-0 w-full object-fill ${theme.waveClassName}`}
          />
        </div>

        <section className="flex w-full flex-col gap-7">
          <div className="flex max-w-[485px] flex-col gap-3">
            <h2 className="text-[20px] font-semibold leading-6 text-[#0b0b0b]">
              {t('sixPhoto.slotsTitle')}
            </h2>
            <p className="text-[16px] font-medium leading-6 text-[#484848]">
              {t('sixPhoto.slotsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {slots.map((slot) => (
              <ZodiacSlotCard
                key={slot.id}
                slot={slot}
                themeStyles={theme.slot}
                preview={previews[slot.id]}
                onAddPhoto={() => handlePickPhoto(slot.id)}
                addLabel={t('sixPhoto.addPhoto')}
                changeLabel={t('sixPhoto.changePhoto')}
              />
            ))}
          </div>
          {errors.photos ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.photos}
            </p>
          ) : null}
        </section>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col gap-6 rounded-[20px] bg-[#ecedfa] p-5"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="six-photo-title"
              className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
            >
              {t('sixPhoto.collectionTitle')}
            </label>
            <input
              id="six-photo-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('sixPhoto.collectionTitlePlaceholder')}
              aria-invalid={Boolean(errors.title)}
              className="w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
            />
            {errors.title ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="relative flex flex-col gap-2.5">
            <p className="text-[16px] font-medium uppercase leading-6 text-[#494453]">
              {t('sixPhoto.artisticCategory')}
            </p>
            <button
              type="button"
              aria-expanded={categoryOpen}
              aria-haspopup="listbox"
              onClick={() => setCategoryOpen((open) => !open)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-left"
            >
              <span className="text-[16px] leading-6 text-[#707070]">
                {t(`sixPhoto.categories.${category}`)}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-[#494453] transition ${categoryOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {categoryOpen ? (
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] bg-white shadow-lg"
              >
                {ARTISTIC_CATEGORIES.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={item === category}
                      onClick={() => {
                        setCategory(item);
                        setCategoryOpen(false);
                      }}
                      className={`w-full cursor-pointer px-[17px] py-3 text-left text-[15px] transition hover:bg-[#ecedfa] ${
                        item === category ? 'bg-[#ecedfa] text-[#4048cd]' : 'text-[#494453]'
                      }`}
                    >
                      {t(`sixPhoto.categories.${item}`)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="six-photo-story"
              className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
            >
              {t('sixPhoto.storyLabel')}
            </label>
            <textarea
              id="six-photo-story"
              value={story}
              onChange={(event) => setStory(event.target.value)}
              placeholder={t('sixPhoto.storyPlaceholder')}
              rows={5}
              aria-invalid={Boolean(errors.story)}
              className="min-h-[147px] w-full resize-y rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
            />
            {errors.story ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.story}
              </p>
            ) : null}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={copyrightOk}
            onChange={(event) => {
              setCopyrightOk(event.target.checked);
              if (event.target.checked) {
                setErrors((current) => {
                  const { copyright: _copyright, ...rest } = current;
                  return rest;
                });
              }
            }}
            className="mt-1 size-[18px] shrink-0 cursor-pointer rounded-[2px] border border-black bg-white accent-[#ee1c25]"
          />
          <span className="text-[15px] font-medium leading-6 text-[#323030] sm:text-[16px]">
            {t('sixPhoto.copyrightConfirm')}
          </span>
        </label>
        {errors.copyright ? (
          <p className="-mt-3 text-sm text-red-600" role="alert">
            {errors.copyright}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg bg-[#ee1c25] px-6 py-3 text-[16px] font-medium leading-6 text-white transition hover:bg-[#d41921]"
        >
          <img
            src={SIX_PHOTO_ASSETS.sparkles}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0 brightness-0 invert"
          />
          {t('sixPhoto.submit')}
        </button>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <PhotoSubmitSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </div>
  );
});

SixPhotoContent.displayName = 'SixPhotoContent';

export default SixPhotoContent;
