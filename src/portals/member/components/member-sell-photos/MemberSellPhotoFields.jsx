import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '@/components/ui/Input';

const inputClassName =
  'w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[16px] leading-6 text-[#161c27] placeholder:text-[#a8a8b0] outline-none focus:ring-2 focus:ring-[#4048cd]/30';

const labelClassName =
  'text-[16px] font-medium uppercase leading-6 text-[#494453]';

const MemberSellPhotoFields = memo(({ idPrefix, register, errors = {} }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2.5">
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

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-file-size`} className={labelClassName}>
            {t('uploadForm.fileSize')}
          </label>
          <Input
            id={`${idPrefix}-file-size`}
            placeholder="125 KB"
            error={errors.fileSize}
            inputClassName={inputClassName}
            labelClassName="hidden"
            {...register('fileSize', {
              required: t('uploadForm.errors.fileSizeRequired'),
            })}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${idPrefix}-quality`} className={labelClassName}>
            {t('uploadForm.quality')}
          </label>
          <Input
            id={`${idPrefix}-quality`}
            placeholder="4K"
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
