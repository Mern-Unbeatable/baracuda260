import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

const inputClassName =
  'w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30';

const labelClassName = 'text-[16px] font-medium uppercase leading-6 text-[#494453]';

const MemberSellPhotoFields = memo(({
  idPrefix,
  price,
  resolution,
  format,
  camera,
  onPriceChange,
  onResolutionChange,
  onFormatChange,
  onCameraChange,
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
            {t('sellPhotos.fields.resolution')}
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
          <label htmlFor={`${idPrefix}-format`} className={labelClassName}>
            {t('sellPhotos.fields.format')}
          </label>
          <input
            id={`${idPrefix}-format`}
            type="text"
            value={format}
            onChange={(event) => onFormatChange(event.target.value)}
            placeholder={t('sellPhotos.fields.formatPlaceholder')}
            aria-invalid={Boolean(errors.format)}
            className={inputClassName}
          />
          {errors.format ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.format}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-camera`} className={labelClassName}>
            {t('sellPhotos.fields.camera')}
          </label>
          <input
            id={`${idPrefix}-camera`}
            type="text"
            value={camera}
            onChange={(event) => onCameraChange(event.target.value)}
            placeholder={t('sellPhotos.fields.cameraPlaceholder')}
            aria-invalid={Boolean(errors.camera)}
            className={inputClassName}
          />
          {errors.camera ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.camera}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
});

MemberSellPhotoFields.displayName = 'MemberSellPhotoFields';

export default MemberSellPhotoFields;
