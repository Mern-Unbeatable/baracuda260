import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';

const inputClassName =
  'w-full rounded-lg bg-[#fafaff] px-3.5 py-3 text-[13px] leading-5 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30 sm:px-[17px] sm:py-3.5 sm:text-[16px] sm:leading-6';

const labelClassName =
  'text-[12px] font-medium uppercase leading-5 tracking-wide text-[#494453] sm:text-[16px] sm:leading-6';

const MemberSellPhotoFields = memo(({ idPrefix, register, errors = {} }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <label htmlFor={`${idPrefix}-price`} className={labelClassName}>
          {t('sellPhotos.fields.price')}
        </label>
        <Input
          id={`${idPrefix}-price`}
          type="number"
          placeholder={t('sellPhotos.fields.pricePlaceholder')}
          error={errors.price}
          inputClassName={inputClassName}
          labelClassName="hidden"
          {...register('price', {
            required: t('uploadForm.errors.priceRequired'),
          })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <label htmlFor={`${idPrefix}-resolution`} className={labelClassName}>
            {t('uploadForm.resolution')}
          </label>
          <Input
            id={`${idPrefix}-resolution`}
            placeholder={t('sellPhotos.fields.resolutionPlaceholder')}
            error={errors.resolution}
            inputClassName={inputClassName}
            labelClassName="hidden"
            {...register('resolution', {
              required: t('uploadForm.errors.resolutionRequired'),
            })}
          />
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          <label htmlFor={`${idPrefix}-file-size`} className={labelClassName}>
            {t('uploadForm.fileSize')}
          </label>
          <Input
            id={`${idPrefix}-file-size`}
            placeholder={t('sellPhotos.fields.fileSizePlaceholder')}
            error={errors.fileSize}
            inputClassName={inputClassName}
            labelClassName="hidden"
            {...register('fileSize', {
              required: t('uploadForm.errors.fileSizeRequired'),
            })}
          />
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          <label htmlFor={`${idPrefix}-quality`} className={labelClassName}>
            {t('uploadForm.quality')}
          </label>
          <Input
            id={`${idPrefix}-quality`}
            placeholder={t('sellPhotos.fields.qualityPlaceholder')}
            error={errors.quality}
            inputClassName={inputClassName}
            labelClassName="hidden"
            {...register('quality', {
              required: t('uploadForm.errors.qualityRequired'),
            })}
          />
        </div>
      </div>
    </div>
  );
});

MemberSellPhotoFields.displayName = 'MemberSellPhotoFields';

export default MemberSellPhotoFields;
