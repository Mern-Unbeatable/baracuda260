import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';

const inputClassName =
  'w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30';

const labelClassName = 'text-[16px] font-medium uppercase leading-6 text-[#494453]';

const MemberSellPhotoFields = memo(({
  idPrefix,
  price,
  resolution,
  fileSize,
  quality,
  onPriceChange,
  onResolutionChange,
  onFileSizeChange,
  onQualityChange,
  errors = {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <label htmlFor={`${idPrefix}-price`} className={labelClassName}>
          {t('sellPhotos.fields.price')}
        </label>
        <input
          id={`${idPrefix}-price`}
          type="text"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
          placeholder={t('sellPhotos.fields.pricePlaceholder')}
          aria-invalid={Boolean(errors.price)}
          className={inputClassName}
        />
        {errors.price ? (
          <p className="text-sm text-red-600" role="alert">
            {errors.price}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-resolution`} className={labelClassName}>
            {t('uploadForm.resolution')}
          </label>
          <input
            id={`${idPrefix}-resolution`}
            type="text"
            value={resolution}
            onChange={(event) => onResolutionChange(event.target.value)}
            placeholder={t('sellPhotos.fields.resolutionPlaceholder')}
            aria-invalid={Boolean(errors.resolution)}
            className={inputClassName}
          />
          {errors.resolution ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.resolution}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-file-size`} className={labelClassName}>
            {t('uploadForm.fileSize')}
          </label>
          <input
            id={`${idPrefix}-file-size`}
            type="text"
            value={fileSize}
            onChange={(event) => onFileSizeChange(event.target.value)}
            placeholder="125 KB"
            aria-invalid={Boolean(errors.fileSize)}
            className={inputClassName}
          />
          {errors.fileSize ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.fileSize}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-quality`} className={labelClassName}>
            {t('uploadForm.quality')}
          </label>
          <input
            id={`${idPrefix}-quality`}
            type="text"
            value={quality}
            onChange={(event) => onQualityChange(event.target.value)}
            placeholder="4K"
            aria-invalid={Boolean(errors.quality)}
            className={inputClassName}
          />
          {errors.quality ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.quality}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
});

MemberSellPhotoFields.displayName = 'MemberSellPhotoFields';

export default MemberSellPhotoFields;
