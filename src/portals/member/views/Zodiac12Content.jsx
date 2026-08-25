import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { BUY_PHOTO_DEFAULT_SPECS } from '@/shared/data/buyPhotos';
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import MemberSellPhotoFields from '@/portals/member/components/member-sell-photos/MemberSellPhotoFields';
import ZodiacStoryFormPanel from '@/components/forms/ZodiacStoryFormPanel/ZodiacStoryFormPanel';
import {
  ALL_SLOTS,
  ARTISTIC_CATEGORIES,
  BLUE_SLOTS,
  DEFAULT_CATEGORY,
  RED_SLOTS,
  ZODIAC12_ASSETS,
} from '@/portals/member/data/zodiac12Assets';

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

const ZodiacSlotCard = memo(({ slot, preview, onAddPhoto, changeLabel, addLabel }) => {
  const { t } = useTranslation();
  const theme = slot.theme;

  return (
    <article
      className={`flex h-full min-w-0 w-full flex-col gap-[27px] rounded-[12px] border bg-white p-5 ${theme.cardBorder}`}
    >
      <div className="flex w-full flex-1 flex-col items-center gap-5">
        <div className="flex w-full items-center justify-between whitespace-nowrap">
          <p className={`shrink-0 text-[20px] font-semibold leading-6 ${theme.number}`}>
            #{slot.number}
          </p>
          <p className="shrink-0 text-[16px] font-medium leading-6 text-[#3a3a3a]">
            {t(slot.elementKey)}
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <SlotIcon slot={slot} />
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <p className={`w-full text-[20px] font-medium leading-6 ${theme.name}`}>
              {t(slot.nameKey)}
            </p>
            <p
              className={`flex min-h-12 w-full items-start justify-center text-[16px] font-medium leading-6 ${theme.range}`}
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
          className={`mt-auto inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white px-6 py-3 text-[16px] font-medium leading-6 transition hover:bg-black/[0.02] ${theme.buttonBorder} ${theme.buttonText}`}
        >
          <img
            src={theme.upload}
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
 * 12 Photo Zodiac Album — Figma node 190:1054.
 * Dual red/blue wave → hero banner → red (1–6) + blue (7–12) grids → form.
 */
const Zodiac12Content = memo(({
  backHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  uploadAnotherHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  purpose = 'artwork',
  defaultPrice = '$5.00',
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);
  const isSell = purpose === 'sell';

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState(defaultPrice);
  const [resolution, setResolution] = useState(BUY_PHOTO_DEFAULT_SPECS.resolution);
  const [fileSize, setFileSize] = useState('125 KB');
  const [quality, setQuality] = useState('4K');
  const [format, setFormat] = useState(BUY_PHOTO_DEFAULT_SPECS.format);
  const [camera, setCamera] = useState(BUY_PHOTO_DEFAULT_SPECS.camera);
  const [publishTarget, setPublishTarget] = useState('competition');
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

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
    if (!title.trim()) nextErrors.title = t('zodiac12.errors.titleRequired');
    if (isSell) {
      if (!price.trim()) nextErrors.price = t('sellPhotos.errors.priceRequired');
    } else if (!story.trim()) {
      nextErrors.story = t('zodiac12.errors.storyRequired');
    }
    const missingPhotos = ALL_SLOTS.some((slot) => !previews[slot.id]);
    if (missingPhotos) nextErrors.photos = t('zodiac12.errors.photosRequired');
    if (!copyrightOk) nextErrors.copyright = t('zodiac12.errors.copyrightRequired');
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

  const renderSlotGrid = (slots) => (
    <div className="grid w-full grid-cols-1 items-stretch gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <ZodiacSlotCard
          key={slot.id}
          slot={slot}
          preview={previews[slot.id]}
          onAddPhoto={() => handlePickPhoto(slot.id)}
          addLabel={t('zodiac12.addPhoto')}
          changeLabel={t('zodiac12.changePhoto')}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <Link
        to={backHref}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('zodiac12.backToSelection')}
      </Link>

      <div className="relative h-[64px] w-full overflow-visible sm:h-[80px] lg:h-[103px]" aria-hidden="true">
        <img
          src={ZODIAC12_ASSETS.dualWave}
          alt=""
          className="absolute inset-x-0 top-0 h-full w-full object-fill"
        />
      </div>

      <section className="flex w-full flex-col items-center gap-6 rounded-[20px] bg-[#ecedfa] px-5 py-6 sm:px-10 lg:flex-row lg:justify-center lg:gap-[84px] lg:px-16 xl:px-[208px]">
        <img
          src={ZODIAC12_ASSETS.sun}
          alt=""
          width={132}
          height={132}
          className="size-20 shrink-0 object-contain sm:size-28 lg:size-[132px]"
        />
        <div className="flex max-w-[736px] flex-col items-center gap-2 text-center">
          <h1 className="text-[24px] font-semibold leading-[1.35] text-black sm:text-[30px] lg:text-[36px] lg:leading-[50px]">
            <Trans
              i18nKey="zodiac12.bannerTitle"
              components={{
                red: <span className="text-[#ee1c25]" />,
                blue: <span className="text-[#4048cd]" />,
              }}
            />
          </h1>
          <p className="text-[16px] font-normal leading-6 text-[#4e4e4e] sm:text-[18px] lg:text-[20px]">
            {t('zodiac12.bannerSubtitle')}
          </p>
        </div>
        <img
          src={ZODIAC12_ASSETS.moon}
          alt=""
          width={132}
          height={132}
          className="size-20 shrink-0 object-contain sm:size-28 lg:size-[132px]"
        />
      </section>

      <section className="flex w-full flex-col gap-5">
        <h2 className="text-[20px] font-semibold leading-8 text-[#494453]">
          {t('zodiac12.gridTitle')}
        </h2>

        <div className="flex w-full flex-col items-stretch gap-5 xl:flex-row">
          <div className="min-w-0 flex-1">{renderSlotGrid(RED_SLOTS)}</div>
          <div className="min-w-0 flex-1">{renderSlotGrid(BLUE_SLOTS)}</div>
        </div>
        {errors.photos ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.photos}
          </p>
        ) : null}
      </section>

      <ZodiacStoryFormPanel
        t={t}
        i18nPrefix="zodiac12"
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
        errors={errors}
        isSell={isSell}
        sellFields={
          <MemberSellPhotoFields
            idPrefix="zodiac12"
            price={price}
            resolution={resolution}
            format={format}
            camera={camera}
            onPriceChange={setPrice}
            onResolutionChange={setResolution}
            onFormatChange={setFormat}
            onCameraChange={setCamera}
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

Zodiac12Content.displayName = 'Zodiac12Content';

export default Zodiac12Content;
