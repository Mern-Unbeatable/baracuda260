import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
  ALL_SLOTS,
  ARTISTIC_CATEGORIES,
  BLUE_SLOTS,
  BUSINESS_LINK_ASSETS,
  DEFAULT_CATEGORY,
  RED_SLOTS,
} from '@/portals/member/data/businessLinkAssets';

const SlotIcon = memo(({ slot }) => {
  if (slot.iconBg && slot.iconOverlay) {
    return (
      <span className="relative size-8.75 shrink-0 overflow-hidden">
        <img
          src={slot.iconBg}
          alt=""
          width={35}
          height={35}
          className="absolute inset-0 size-8.75 object-contain"
        />
        <img
          src={slot.iconOverlay}
          alt=""
          className="absolute left-1/2 top-1/2 max-h-6.5 max-w-6.5 -translate-x-1/2 -translate-y-1/2 object-contain"
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
        className="size-8.75 shrink-0 object-contain"
      />
    );
  }

  return null;
});

SlotIcon.displayName = 'SlotIcon';

const BusinessSlotCard = memo(({ slot, preview, onAddPhoto, changeLabel, addLabel }) => {
  const { t } = useTranslation();
  const theme = slot.theme;

  return (
    <article
      className={`flex h-full min-w-0 w-full flex-col gap-6.75 rounded-xl border bg-white p-5 ${theme.cardBorder}`}
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

        <div className="flex w-full flex-1 flex-col items-center gap-3">
          <SlotIcon slot={slot} />
          <div className="flex w-full flex-1 flex-col items-center gap-1 text-center">
            <p className={`min-h-6 w-full text-[20px] font-medium leading-6 ${theme.name}`}>
              {t(slot.nameKey)}
            </p>
            {/* Reserve 2 lines so Add Photo stays aligned when ranges wrap. */}
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
          className={`mt-auto inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-lg border bg-white px-6 py-3 text-[16px] font-medium leading-6 transition hover:bg-black/2 ${theme.buttonBorder} ${theme.buttonText}`}
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

BusinessSlotCard.displayName = 'BusinessSlotCard';

/**
 * Business Link Photos — Figma node 195:271.
 * Back → info gateway card → dual wave → red (1–6) + blue (7–12) grids → form.
 */
const BusinessLinkContent = memo(() => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      category: DEFAULT_CATEGORY,
      story: '',
      copyrightOk: false,
    },
  });

  const [previews, setPreviews] = useState({});
  const [photosError, setPhotosError] = useState('');
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
    setPhotosError('');
  };

  const onSubmit = (_data) => {
    const missingPhotos = ALL_SLOTS.some((slot) => !previews[slot.id]);
    if (missingPhotos) {
      setPhotosError(t('businessLink.errors.photosRequired'));
      setSuccessOpen(false);
      return;
    }
    setPhotosError('');
    setSuccessOpen(true);
  };

  const renderSlotGrid = (slots) => (
    <div className="grid w-full grid-cols-1 items-stretch gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <BusinessSlotCard
          key={slot.id}
          slot={slot}
          preview={previews[slot.id]}
          onAddPhoto={() => handlePickPhoto(slot.id)}
          addLabel={t('businessLink.addPhoto')}
          changeLabel={t('businessLink.changePhoto')}
        />
      ))}
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-395 flex-col gap-8">
      <Link
        to={ROUTES.ADMIN_DASHBOARD}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('businessLink.backToSelection')}
      </Link>

      <section className="flex w-full flex-col items-start gap-4 rounded-[20px] border border-black/20 bg-white p-5 sm:flex-row sm:gap-4">
        <div className="flex h-7.5 w-7.75 shrink-0 items-center justify-center rounded border border-[#ee1c25] bg-[#fde8e9] px-0.75 py-0.75 pl-1">
          <img
            src={BUSINESS_LINK_ASSETS.bag}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <h1 className="text-[20px] font-semibold leading-6 text-[#494453]">
            {t('businessLink.infoTitle')}
          </h1>
          <p className="text-[16px] font-medium leading-6 text-[#585858]">
            {t('businessLink.infoBody')}
          </p>
        </div>
      </section>

      <div className="relative h-16 w-full overflow-visible sm:h-20 lg:h-25.75" aria-hidden="true">
        <img
          src={BUSINESS_LINK_ASSETS.dualWave}
          alt=""
          className="absolute inset-x-0 top-0 h-full w-full object-fill"
        />
      </div>

      <section className="flex w-full flex-col gap-5">
        <h2 className="text-[20px] font-semibold leading-6 text-[#1c1c1c]">
          {t('businessLink.gridTitle')}
        </h2>

        <div className="flex w-full flex-col items-stretch gap-5 xl:flex-row">
          <div className="min-w-0 flex-1">{renderSlotGrid(RED_SLOTS)}</div>
          <div className="min-w-0 flex-1">{renderSlotGrid(BLUE_SLOTS)}</div>
        </div>
        {photosError ? (
          <p className="text-sm text-red-600" role="alert">
            {photosError}
          </p>
        ) : null}
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full flex-col gap-6 rounded-[20px] bg-[#ecedfa] p-5"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="business-link-title"
              className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
            >
              {t('businessLink.collectionTitle')}
            </label>
            <Input
              id="business-link-title"
              type="text"
              placeholder={t('businessLink.collectionTitlePlaceholder')}
              error={errors.title}
              inputClassName="w-full rounded-lg bg-[#fafaff] px-4.25 py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
              labelClassName="hidden"
              {...register('title', { required: t('businessLink.errors.titleRequired') })}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="business-link-category"
              className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
            >
              {t('businessLink.artisticCategory')}
            </label>
            <div className="relative">
              <select
                id="business-link-category"
                className="w-full appearance-none rounded-lg bg-[#fafaff] px-4.25 py-3.5 text-[16px] leading-6 text-[#707070] outline-none focus:ring-2 focus:ring-[#4048cd]/30 cursor-pointer"
                {...register('category')}
              >
                {ARTISTIC_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {t(`businessLink.categories.${item}`)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#494453]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="business-link-story"
              className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
            >
              {t('businessLink.storyLabel')}
            </label>
            <textarea
              id="business-link-story"
              placeholder={t('businessLink.storyPlaceholder')}
              rows={5}
              aria-invalid={Boolean(errors.story)}
              className="min-h-36.75 w-full resize-y rounded-lg bg-[#fafaff] px-4.25 py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
              {...register('story', { required: t('businessLink.errors.storyRequired') })}
            />
            {errors.story ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.story.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 size-4.5 shrink-0 cursor-pointer rounded-xs border border-black bg-white accent-[#ee1c25]"
              {...register('copyrightOk', { required: t('businessLink.errors.copyrightRequired') })}
            />
            <span className="text-[15px] font-medium leading-6 text-[#323030] sm:text-[16px]">
              {t('businessLink.copyrightConfirm')}
            </span>
          </label>
          {errors.copyrightOk ? (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.copyrightOk.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          unstyled={true}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg bg-[#ee1c25] px-6 py-3 text-[16px] font-medium leading-6 text-white transition hover:bg-[#d41921]"
        >
          <img
            src={BUSINESS_LINK_ASSETS.submit}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          {t('businessLink.submit')}
        </Button>
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

BusinessLinkContent.displayName = 'BusinessLinkContent';

export default BusinessLinkContent;
