import { useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpFromLine, ChevronDown, Sparkles } from 'lucide-react';
import { ROUTES } from '@/shared/config';
import { BUY_PHOTO_DEFAULT_SPECS } from '@/shared/data/buyPhotos';
import PhotoSubmitSuccessModal from '@/portals/member/components/member-upload/singlePhoto/PhotoSubmitSuccessModal';
import MemberSellPhotoFields from '@/portals/member/components/member-sell-photos/MemberSellPhotoFields';
import {
  ARTISTIC_CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_SIGN_ID,
  SINGLE_PHOTO_ASSETS,
  ZODIAC_SIGNS,
} from '@/portals/member/data/singlePhotoAssets';

const findSign = (id) => ZODIAC_SIGNS.find((sign) => sign.id === id) ?? ZODIAC_SIGNS[5];

const ZodiacIcon = memo(({ sign, size = 35, variant = 'default' }) => {
  const src = variant === 'slot' && sign.slotIcon ? sign.slotIcon : sign.icon;

  if (src) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded bg-[#4048cd] font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden="true"
    >
      {sign.symbol}
    </span>
  );
});

ZodiacIcon.displayName = 'ZodiacIcon';

/**
 * Single Photo upload workspace — Figma node 190:142 (file kE9g2eZmAoSco81PgZNlj2).
 * Layout: left 930 + gap 71 + right 579; copyright confirm + submit on right panel.
 */
const SinglePhotoContent = memo(({
  backHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  uploadAnotherHref = ROUTES.ADMIN_UPLOAD_PHOTOS,
  purpose = 'artwork',
  defaultPrice = '$2.00',
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const isSell = purpose === 'sell';

  const [signId, setSignId] = useState(DEFAULT_SIGN_ID);
  const [signOpen, setSignOpen] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [price, setPrice] = useState(defaultPrice);
  const [resolution, setResolution] = useState(BUY_PHOTO_DEFAULT_SPECS.resolution);
  const [format, setFormat] = useState(BUY_PHOTO_DEFAULT_SPECS.format);
  const [camera, setCamera] = useState(BUY_PHOTO_DEFAULT_SPECS.camera);
  const [copyrightOk, setCopyrightOk] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [successOpen, setSuccessOpen] = useState(false);

  const selectedSign = findSign(signId);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setErrors((current) => {
      const { photo: _photo, ...rest } = current;
      return rest;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = t('singlePhoto.errors.titleRequired');
    if (isSell) {
      if (!price.trim()) nextErrors.price = t('sellPhotos.errors.priceRequired');
    } else if (!story.trim()) {
      nextErrors.story = t('singlePhoto.errors.storyRequired');
    }
    if (!photoPreview) nextErrors.photo = t('singlePhoto.errors.photoRequired');
    if (!copyrightOk) nextErrors.copyright = t('singlePhoto.errors.copyrightRequired');
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

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1580px]">
      {/* Figma: left 930 | gap ~71 | right 579 */}
      <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,930fr)_minmax(280px,579fr)] lg:gap-10 xl:gap-[71px]">
        {/* LEFT */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-[34px]">
              <Link
                to={backHref}
                className="inline-flex w-fit cursor-pointer items-center gap-2 text-[16px] font-medium leading-6 text-[#272727] transition hover:text-[#ee1c25]"
              >
                <ArrowLeft size={24} aria-hidden="true" className="shrink-0" />
                {t('singlePhoto.backToSelection')}
              </Link>

              <section className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-[26px]">
                <p className="mb-5 whitespace-pre-wrap text-[16px] font-medium uppercase tracking-[0.28em] text-[#28252f]">
                  {t('singlePhoto.selectSign')}
                </p>
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={signOpen}
                    aria-haspopup="listbox"
                    onClick={() => {
                      setSignOpen((open) => !open);
                      setCategoryOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-[rgba(0,0,0,0.17)] bg-white p-[14px] text-left"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <ZodiacIcon sign={selectedSign} />
                      <span className="truncate text-[16px] leading-6 text-[#1b1b1b]">
                        {t(selectedSign.nameKey)} ({t(selectedSign.rangeKey)})
                      </span>
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[#494453] transition ${signOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {signOpen ? (
                    <ul
                      role="listbox"
                      className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-[rgba(0,0,0,0.12)] bg-white py-1 shadow-lg"
                    >
                      {ZODIAC_SIGNS.map((sign) => (
                        <li key={sign.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={sign.id === signId}
                            onClick={() => {
                              setSignId(sign.id);
                              setSignOpen(false);
                            }}
                            className={`flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left text-[15px] transition hover:bg-[#ecedfa] ${
                              sign.id === signId ? 'bg-[#ecedfa] text-[#4048cd]' : 'text-[#1b1b1b]'
                            }`}
                          >
                            <ZodiacIcon sign={sign} size={28} />
                            <span>
                              {t(sign.nameKey)} ({t(sign.rangeKey)})
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            </div>

            <div className="relative h-[46px] w-full overflow-visible" aria-hidden="true">
              <img
                src={SINGLE_PHOTO_ASSETS.wave}
                alt=""
                className="absolute inset-x-0 top-0 h-[58px] w-full object-fill"
              />
            </div>

            <div className="flex w-full max-w-[485px] flex-col gap-4">
              <h1 className="text-[24px] font-semibold leading-6 text-[#2a282d]">
                {t('singlePhoto.slotsTitle')}
              </h1>
              <p className="text-[16px] font-medium leading-6 text-[#555555]">
                {t('singlePhoto.slotsSubtitle')}
              </p>
            </div>
          </div>

          <article className="flex w-full flex-col items-center gap-[27px] rounded-xl border border-[#c4c6f0] bg-white p-5">
            <div className="flex w-full flex-col items-center gap-5">
              <div className="flex w-full items-center justify-between">
                <p className="text-[20px] font-semibold leading-6 text-[#4048cd]">
                  #{selectedSign.number}
                </p>
                <p className="text-[16px] font-medium uppercase leading-6 text-[#5e5d61]">
                  {t(selectedSign.elementKey)}
                </p>
              </div>

              <div className="flex w-[149px] flex-col items-center gap-3">
                <ZodiacIcon sign={selectedSign} variant="slot" />
                <div className="flex w-full flex-col items-center gap-1 text-center">
                  <p className="w-full text-[20px] font-medium leading-6 text-[#1b1e56]">
                    {t(selectedSign.nameKey)}
                  </p>
                  <p className="w-full whitespace-pre-wrap text-[16px] font-medium leading-6 text-[#666dd7]">
                    {t(selectedSign.rangeKey)}
                  </p>
                </div>
              </div>
            </div>

            {photoPreview ? (
              <div className="relative w-full overflow-hidden rounded-lg border border-[#c4c6f0]">
                <img src={photoPreview} alt="" className="max-h-72 w-full object-cover" />
                <button
                  type="button"
                  onClick={handlePickPhoto}
                  className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-white/95 px-3 py-1.5 text-sm font-medium text-[#4048cd] shadow"
                >
                  {t('singlePhoto.changePhoto')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePickPhoto}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-[#4048cd] bg-white px-6 py-3 text-[16px] font-medium leading-6 text-[#4048cd] transition hover:bg-[#ecedfa]"
              >
                <ArrowUpFromLine size={24} aria-hidden="true" />
                {t('singlePhoto.addPhoto')}
              </button>
            )}

            {errors.photo ? (
              <p className="w-full text-sm text-red-600" role="alert">
                {errors.photo}
              </p>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </article>
        </div>

        {/* RIGHT — Figma y=170 aligns with select card (after back link) */}
        <aside className="w-full min-w-0 lg:mt-[58px] lg:sticky lg:top-0">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex w-full flex-col gap-6 rounded-[20px] bg-[#ecedfa] p-5"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="single-photo-title"
                  className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
                >
                  {t('singlePhoto.collectionTitle')}
                </label>
                <input
                  id="single-photo-title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t('singlePhoto.collectionTitlePlaceholder')}
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
                  {t('singlePhoto.artisticCategory')}
                </p>
                <button
                  type="button"
                  aria-expanded={categoryOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setCategoryOpen((open) => !open);
                    setSignOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-left"
                >
                  <span className="text-[16px] leading-6 text-[#707070]">
                    {t(`singlePhoto.categories.${category}`)}
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
                    className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] bg-white shadow-lg"
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
                          {t(`singlePhoto.categories.${item}`)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {isSell ? (
                <MemberSellPhotoFields
                  idPrefix="single-photo"
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
              ) : (
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="single-photo-story"
                    className="text-[16px] font-medium uppercase leading-6 text-[#494453]"
                  >
                    {t('singlePhoto.storyLabel')}
                  </label>
                  <textarea
                    id="single-photo-story"
                    value={story}
                    onChange={(event) => setStory(event.target.value)}
                    placeholder={t('singlePhoto.storyPlaceholder')}
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
              )}
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
                {t('singlePhoto.copyrightConfirm')}
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
              <Sparkles size={24} aria-hidden="true" />
              {t('singlePhoto.submit')}
            </button>
          </form>
        </aside>
      </div>

      <PhotoSubmitSuccessModal
        open={successOpen}
        onClose={handleCloseSuccess}
        uploadAnotherHref={uploadAnotherHref}
      />
    </div>
  );
});

SinglePhotoContent.displayName = 'SinglePhotoContent';

export default SinglePhotoContent;
