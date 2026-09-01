import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles as SparklesLucide, Upload } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import MemberSellPhotoFields from '@/portals/member/components/member-sell-photos/MemberSellPhotoFields';
import ZodiacStoryFormPanel from '@/components/forms/ZodiacStoryFormPanel/ZodiacStoryFormPanel';
import {
  ARTISTIC_CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_THEME_ID,
  getSlotsForTheme,
  getThemeById,
  THEMES,
} from '@/portals/member/data/sixPhotoAssets';

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
const SixPhotoContent = memo(({
  backHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  uploadAnotherHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  purpose = 'artwork',
  defaultPrice = '$5.00',
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);
  const isSell = purpose === 'sell';

  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [subCategory, setSubCategory] = useState('astrophotography');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [price, setPrice] = useState(defaultPrice);
  const [resolution, setResolution] = useState('6000*6000');
  const [fileSize, setFileSize] = useState('125 KB');
  const [quality, setQuality] = useState('4K');
  const [publishTarget, setPublishTarget] = useState('competition');
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [aiCreated, setAiCreated] = useState('');
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
    if (isSell) {
      if (!price.trim()) nextErrors.price = t('sellPhotos.errors.priceRequired');
    } else if (!story.trim()) {
      nextErrors.story = t('sixPhoto.errors.storyRequired');
    }
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
        to={backHref}
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

        <article className="rounded-xl border border-[#e6e8ef] bg-white p-5">
          <h3 className="text-[24px] font-semibold leading-8 text-[#2a282d]">Upload Videos</h3>
          <p className="mt-1 text-[13px] leading-5 text-[#717784]">
            Help your pro prepare by showing them the work area. Optional but highly recommended.
          </p>
          <button
            type="button"
            className="mt-4 flex h-[112px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#d8dbe6] bg-white text-[#7f8593] transition hover:border-[#b9bfd0]"
          >
            <Upload size={24} className="mb-2 text-[#b1b6c5]" />
            <span className="text-[16px] leading-6">Click to upload Videos or drag &amp; drop</span>
            <span className="text-[12px] text-[#9ca3af]">MP4 — max 10MB each</span>
          </button>
        </article>
      </div>

      <ZodiacStoryFormPanel
        t={t}
        i18nPrefix="sixPhoto"
        onSubmit={handleSubmit}
        title={title}
        onTitleChange={setTitle}
        category={category}
        onCategoryChange={setCategory}
        categoryOptions={ARTISTIC_CATEGORIES}
        subCategory={subCategory}
        onSubCategoryChange={setSubCategory}
        story={story}
        onStoryChange={setStory}
        resolution={resolution}
        onResolutionChange={setResolution}
        fileSize={fileSize}
        onFileSizeChange={setFileSize}
        quality={quality}
        onQualityChange={setQuality}
        publishTarget={publishTarget}
        onPublishTargetChange={setPublishTarget}
        copyrightOk={copyrightOk}
        onCopyrightChange={(checked) => {
          setCopyrightOk(checked);
          if (checked) {
            setErrors((current) => {
              const { copyright: _copyright, ...rest } = current;
              return rest;
            });
          }
        }}
        aiCreated={aiCreated}
        onAiCreatedChange={setAiCreated}
        errors={errors}
        isSell={isSell}
        sellFields={
          <MemberSellPhotoFields
            idPrefix="six-photo"
            price={price}
            resolution={resolution}
            fileSize={fileSize}
            quality={quality}
            onPriceChange={setPrice}
            onResolutionChange={setResolution}
            onFileSizeChange={setFileSize}
            onQualityChange={setQuality}
            errors={errors}
          />
        }
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      <PhotoSubmitSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        uploadAnotherHref={uploadAnotherHref}
      />
    </div>
  );
});

SixPhotoContent.displayName = 'SixPhotoContent';

export default SixPhotoContent;
