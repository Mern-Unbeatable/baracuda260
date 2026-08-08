import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import PhotoSubmitSuccessModal from '@/modules/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import {
  ALL_SLOTS,
  ARTISTIC_CATEGORIES,
  BLUE_SLOTS,
  BUSINESS_LINK_ASSETS,
  DEFAULT_CATEGORY,
  RED_SLOTS,
} from '@/modules/member/data/businessLinkAssets';

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

const BusinessSlotCard = memo(({ slot, preview, onAddPhoto, changeLabel, addLabel }) => {
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

BusinessSlotCard.displayName = 'BusinessSlotCard';

/**
 * Business Link Photos — Figma node 195:271.
 * Back → info gateway card → dual wave → red (1–6) + blue (7–12) grids → form.
 */
const BusinessLinkContent = memo(() => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const activeSlotRef = useRef(null);
  const categoryMenuRef = useRef(null);

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
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

  useEffect(() => {
    if (!categoryOpen) return undefined;

    const onPointerDown = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCategoryOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [categoryOpen]);

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
    if (!title.trim()) nextErrors.title = t('businessLink.errors.titleRequired');
    if (!story.trim()) nextErrors.story = t('businessLink.errors.storyRequired');
    const missingPhotos = ALL_SLOTS.some((slot) => !previews[slot.id]);
    if (missingPhotos) nextErrors.photos = t('businessLink.errors.photosRequired');
    if (!copyrightOk) nextErrors.copyright = t('businessLink.errors.copyrightRequired');
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

  const gridSlots = [
    ...RED_SLOTS.slice(0, 3),
    ...BLUE_SLOTS.slice(0, 3),
    ...RED_SLOTS.slice(3, 6),
    ...BLUE_SLOTS.slice(3, 6),
  ];

  const slotOrderClass = {
    1: 'order-1 xl:order-none',
    2: 'order-2 xl:order-none',
    3: 'order-3 xl:order-none',
    4: 'order-4 xl:order-none',
    5: 'order-5 xl:order-none',
    6: 'order-6 xl:order-none',
    7: 'order-7 xl:order-none',
    8: 'order-8 xl:order-none',
    9: 'order-9 xl:order-none',
    10: 'order-10 xl:order-none',
    11: 'order-11 xl:order-none',
    12: 'order-12 xl:order-none',
  };

  return (
    <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-8">
      <Link
        to={ROUTES.ADMIN_UPLOAD_PHOTOS}
        className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#707070] transition hover:text-[#ee1c25]"
      >
        <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
        {t('businessLink.backToSelection')}
      </Link>

      <section className="flex w-full flex-col items-start gap-4 rounded-[20px] border border-black/20 bg-white p-5 sm:flex-row sm:gap-4">
        <div className="flex h-[30px] w-[31px] shrink-0 items-center justify-center rounded border border-[#ee1c25] bg-[#fde8e9] px-[3px] py-[3px] pl-1">
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

      <div className="relative h-[64px] w-full overflow-visible sm:h-[80px] lg:h-[103px]" aria-hidden="true">
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

        <div className="grid w-full grid-cols-1 items-stretch gap-[14px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {gridSlots.map((slot) => (
            <div key={slot.id} className={`min-w-0 ${slotOrderClass[slot.number]}`}>
              <BusinessSlotCard
                slot={slot}
                preview={previews[slot.id]}
                onAddPhoto={() => handlePickPhoto(slot.id)}
                addLabel={t('businessLink.addPhoto')}
                changeLabel={t('businessLink.changePhoto')}
              />
            </div>
          ))}
        </div>
        {errors.photos ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.photos}
          </p>
        ) : null}
      </section>

      <form
        onSubmit={handleSubmit}
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
            <input
              id="business-link-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('businessLink.collectionTitlePlaceholder')}
              aria-invalid={Boolean(errors.title)}
              className="w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30"
            />
            {errors.title ? (
              <p className="text-sm text-red-600" role="alert">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="relative flex flex-col gap-2.5" ref={categoryMenuRef}>
            <p className="text-[16px] font-medium uppercase leading-6 text-[#494453]">
              {t('businessLink.artisticCategory')}
            </p>
            <button
              type="button"
              aria-expanded={categoryOpen}
              aria-haspopup="listbox"
              onClick={() => setCategoryOpen((open) => !open)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-left"
            >
              <span className="text-[16px] leading-6 text-[#707070]">
                {t(`businessLink.categories.${category}`)}
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
                      {t(`businessLink.categories.${item}`)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
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
              value={story}
              onChange={(event) => setStory(event.target.value)}
              placeholder={t('businessLink.storyPlaceholder')}
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
            {t('businessLink.copyrightConfirm')}
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
            src={BUSINESS_LINK_ASSETS.submit}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
          />
          {t('businessLink.submit')}
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

BusinessLinkContent.displayName = 'BusinessLinkContent';

export default BusinessLinkContent;
