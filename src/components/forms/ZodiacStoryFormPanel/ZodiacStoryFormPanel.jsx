import { Loader2, MapPin, Sparkles } from 'lucide-react';
import React, { memo } from 'react';
import AiGeneratedPhotoBadge from '@/components/data-display/AiGeneratedPhotoBadge/AiGeneratedPhotoBadge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const fieldClass =
  'w-full rounded-lg bg-[#fafaff] px-3.5 py-3 text-[13px] leading-5 text-[#707070] outline-none focus:ring-2 focus:ring-[#4048cd]/30 sm:px-[17px] sm:py-3.5 sm:text-[14px] sm:leading-6';

const ZodiacStoryFormPanel = memo(
  ({
    t,
    i18nPrefix,
    onSubmit,
    categoryOptions,
    categoryList = null,
    subCategoryList = null,
    onCategoryChange = null,
    register,
    errors = {},
    isSell = false,
    sellFields = null,
    publishTarget,
    setPublishTarget,
    aiCreated,
    setAiCreated,
    submitLabel = null,
    isSubmitting = false,
  }) => (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex w-full flex-col gap-4 rounded-[16px] bg-[#ecedfa] p-4 sm:gap-6 sm:rounded-[20px] sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <label
            htmlFor={`${i18nPrefix}-title`}
            className="text-[12px] font-medium uppercase leading-5 tracking-wide text-[#494453] sm:text-[16px] sm:leading-6"
          >
            {t(`${i18nPrefix}.collectionTitle`)}
          </label>
          <Input
            id={`${i18nPrefix}-title`}
            type="text"
            placeholder={t(`${i18nPrefix}.collectionTitlePlaceholder`)}
            error={errors.title}
            inputClassName={fieldClass}
            labelClassName="hidden"
            {...register('title', {
              required: t('singlePhoto.errors.titleRequired'),
            })}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-[12px] font-medium uppercase leading-5 tracking-wide text-[#494453] sm:text-[16px] sm:leading-6">
            {t(`${i18nPrefix}.artisticCategory`)}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              className={fieldClass}
              {...register('category')}
              onChange={(e) => {
                register('category').onChange(e);
                if (onCategoryChange) {
                  onCategoryChange(e.target.value);
                }
              }}
            >
              {categoryList && categoryList.length > 0 ? (
                categoryList.map((item) => (
                  <option key={item.id || item.slug} value={item.id || item.slug}>
                    {item.name}
                  </option>
                ))
              ) : (
                categoryOptions?.map((item) => (
                  <option key={item} value={item}>
                    {t(`${i18nPrefix}.categories.${item}`, { defaultValue: item })}
                  </option>
                ))
              )}
            </select>

            <select className={fieldClass} {...register('subCategory')}>
              <option value="">
                {t('uploadForm.selectSubcategory', {
                  defaultValue: 'Select subcategory',
                })}
              </option>
              {subCategoryList && subCategoryList.length > 0 ? (
                subCategoryList.map((sub) => (
                  <option key={sub.id || sub.slug} value={sub.id || sub.slug}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="night-sky">Night Sky</option>
                  <option value="constellation">Constellation</option>
                  <option value="deep-space">Deep Space</option>
                </>
              )}
            </select>
          </div>
        </div>

        {isSell ? (
          sellFields
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              <label
                htmlFor={`${i18nPrefix}-story`}
                className="text-[12px] font-medium uppercase leading-5 tracking-wide text-[#494453] sm:text-[16px] sm:leading-6"
              >
                Story / Concept / Creative Log
              </label>
              <textarea
                id={`${i18nPrefix}-story`}
                placeholder={t(`${i18nPrefix}.storyPlaceholder`)}
                rows={5}
                aria-invalid={Boolean(errors.story)}
                className={`${fieldClass} min-h-36.75 resize-y`}
                {...register('story', {
                  required: t('singlePhoto.errors.storyRequired'),
                })}
              />
              {errors.story ? (
                <p className="text-sm text-red-600" role="alert">
                  {errors.story.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-2.5">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#494453] sm:text-[14px]">
                  {t('uploadForm.resolution')}
                </span>
                <Input
                  placeholder={t('uploadForm.resolutionPlaceholder')}
                  error={errors.resolution}
                  inputClassName={fieldClass}
                  labelClassName="hidden"
                  {...register('resolution', {
                    required: t('uploadForm.errors.resolutionRequired'),
                  })}
                />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#494453] sm:text-[14px]">
                  {t('uploadForm.fileSize')}
                </span>
                <Input
                  placeholder={t('uploadForm.fileSizePlaceholder')}
                  error={errors.fileSize}
                  inputClassName={fieldClass}
                  labelClassName="hidden"
                  {...register('fileSize', {
                    required: t('uploadForm.errors.fileSizeRequired'),
                  })}
                />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[#494453] sm:text-[14px]">
                  {t('uploadForm.quality')}
                </span>
                <Input
                  placeholder={t('uploadForm.qualityPlaceholder')}
                  error={errors.quality}
                  inputClassName={fieldClass}
                  labelClassName="hidden"
                  {...register('quality', {
                    required: t('uploadForm.errors.qualityRequired'),
                  })}
                />
              </label>
            </div>

            <div className="space-y-3 rounded-lg border border-[#daddeb] bg-white p-4">
              <p className="text-[13px] text-[#494453]">
                Choose where this artwork should be published:
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e4e6f2] p-3">
                <input
                  type="radio"
                  name={`${i18nPrefix}-publish-target`}
                  checked={publishTarget === 'competition'}
                  onChange={() => setPublishTarget('competition')}
                  className="mt-1 size-4 accent-[#4048cd]"
                />
                <span className="text-[13px] text-[#313744]">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <MapPin size={12} className="text-[#f59e0b]" />
                    Add this artwork to this month&apos;s competition
                  </span>
                  <span className="mt-1 block text-[11px] text-[#7a8291]">
                    August Photography Competition
                  </span>
                  <span className="block text-[11px] text-[#7a8291]">
                    Voting Period: Aug 1 — Aug 31, 2026
                  </span>
                  <span className="block text-[11px] text-[#7a8291]">
                    Prize Pool: $10,000
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e4e6f2] p-3">
                <input
                  type="radio"
                  name={`${i18nPrefix}-publish-target`}
                  checked={publishTarget === 'profile'}
                  onChange={() => setPublishTarget('profile')}
                  className="mt-1 size-4 accent-[#4048cd]"
                />
                <span className="text-[13px] text-[#313744]">
                  <strong>Add this artwork only to my profile</strong>
                  <span className="mt-1 block text-[11px] text-[#7a8291]">
                    Keep on your personal showcase portfolio. You can always
                    enter it into future monthly competitions later.
                  </span>
                </span>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[14px] font-medium leading-5 text-[#323030] sm:text-[16px] sm:leading-6">
          {t('uploadForm.aiCreatedQuestion')}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={aiCreated === 'yes'}
              onChange={() => setAiCreated(aiCreated === 'yes' ? '' : 'yes')}
              className="size-4.5 shrink-0 cursor-pointer rounded-xs border border-black bg-white accent-[#ee1c25]"
            />
            <span className="text-[13px] font-medium leading-5 text-[#323030] sm:text-[16px] sm:leading-6">
              {t('uploadForm.aiCreatedYes')}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={aiCreated === 'no'}
              onChange={() => setAiCreated(aiCreated === 'no' ? '' : 'no')}
              className="size-4.5 shrink-0 cursor-pointer rounded-xs border border-black bg-white accent-[#ee1c25]"
            />
            <span className="text-[13px] font-medium leading-5 text-[#323030] sm:text-[16px] sm:leading-6">
              {t('uploadForm.aiCreatedNo')}
            </span>
          </label>
        </div>
        {aiCreated === 'yes' ? (
          <p className="flex items-center gap-2.5 rounded-lg border border-[#4048cd]/15 bg-[#eef0ff] px-3.5 py-2.5 text-[13px] leading-5 text-[#4048cd]">
            <AiGeneratedPhotoBadge variant="inline" size="sm" />
            <span>{t('uploadForm.aiCreatedConfirmed')}</span>
          </p>
        ) : null}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 size-4.5 shrink-0 cursor-pointer rounded-xs border border-black bg-white accent-[#ee1c25]"
            {...register('copyrightOk', {
              required: t('singlePhoto.errors.copyrightRequired'),
            })}
          />
          <span className="text-[13px] font-medium leading-5 text-[#323030] sm:text-[16px] sm:leading-6">
            {t(`${i18nPrefix}.copyrightConfirm`)}
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
        disabled={isSubmitting}
        unstyled={true}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#ee1c25] px-5 py-2.5 text-[14px] font-medium leading-5 text-white transition hover:bg-[#d41921] disabled:cursor-not-allowed disabled:opacity-70 sm:gap-4 sm:px-6 sm:py-3 sm:text-[16px] sm:leading-6"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin sm:size-6" aria-hidden="true" />
        ) : (
          <Sparkles size={20} aria-hidden="true" className="sm:size-6" />
        )}
        {isSubmitting
          ? t('common.submitting', 'Submitting...')
          : submitLabel || t(`${i18nPrefix}.submit`)}
      </Button>
    </form>
  ),
);

ZodiacStoryFormPanel.displayName = 'ZodiacStoryFormPanel';

export default ZodiacStoryFormPanel;
