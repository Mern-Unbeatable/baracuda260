import React, { memo } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

const fieldClass =
  'w-full rounded-lg bg-[#fafaff] px-[17px] py-3.5 text-[14px] leading-6 text-[#707070] outline-none focus:ring-2 focus:ring-[#4048cd]/30';

const ZodiacStoryFormPanel = memo(
  ({
    t,
    i18nPrefix,
    onSubmit,
    title,
    onTitleChange,
    category,
    onCategoryChange,
    categoryOptions,
    subCategory,
    onSubCategoryChange,
    story,
    onStoryChange,
    resolution,
    onResolutionChange,
    fileSize,
    onFileSizeChange,
    quality,
    onQualityChange,
    publishTarget,
    onPublishTargetChange,
    copyrightOk,
    onCopyrightChange,
    aiCreated = '',
    onAiCreatedChange,
    errors = {},
    isSell = false,
    sellFields = null,
  }) => (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-6 rounded-[20px] bg-[#ecedfa] p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${i18nPrefix}-title`} className="text-[16px] font-medium uppercase leading-6 text-[#494453]">
            {t(`${i18nPrefix}.collectionTitle`)}
          </label>
          <input
            id={`${i18nPrefix}-title`}
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder={t(`${i18nPrefix}.collectionTitlePlaceholder`)}
            aria-invalid={Boolean(errors.title)}
            className={fieldClass}
          />
          {errors.title ? <p className="text-sm text-red-600" role="alert">{errors.title}</p> : null}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-[16px] font-medium uppercase leading-6 text-[#494453]">{t(`${i18nPrefix}.artisticCategory`)}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className={fieldClass}>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {t(`${i18nPrefix}.categories.${item}`)}
                </option>
              ))}
            </select>

            <select value={subCategory} onChange={(event) => onSubCategoryChange(event.target.value)} className={fieldClass}>
              <option value="">{t('uploadForm.selectSubcategory', { defaultValue: 'Select subcategory' })}</option>
              <option value="night-sky">Night Sky</option>
              <option value="constellation">Constellation</option>
              <option value="deep-space">Deep Space</option>
            </select>
          </div>
        </div>

        {isSell ? (
          sellFields
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              <label htmlFor={`${i18nPrefix}-story`} className="text-[16px] font-medium uppercase leading-6 text-[#494453]">
                Story / Concept / Creative Log
              </label>
              <textarea
                id={`${i18nPrefix}-story`}
                value={story}
                onChange={(event) => onStoryChange(event.target.value)}
                placeholder={t(`${i18nPrefix}.storyPlaceholder`)}
                rows={5}
                aria-invalid={Boolean(errors.story)}
                className={`${fieldClass} min-h-[147px] resize-y`}
              />
              {errors.story ? <p className="text-sm text-red-600" role="alert">{errors.story}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-2.5">
                <span className="text-[14px] font-medium uppercase text-[#494453]">{t('uploadForm.resolution')}</span>
                <input value={resolution} onChange={(event) => onResolutionChange(event.target.value)} className={fieldClass} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[14px] font-medium uppercase text-[#494453]">{t('uploadForm.fileSize')}</span>
                <input value={fileSize} onChange={(event) => onFileSizeChange(event.target.value)} className={fieldClass} />
              </label>
              <label className="flex flex-col gap-2.5">
                <span className="text-[14px] font-medium uppercase text-[#494453]">{t('uploadForm.quality')}</span>
                <input value={quality} onChange={(event) => onQualityChange(event.target.value)} className={fieldClass} />
              </label>
            </div>

            <div className="space-y-3 rounded-lg border border-[#daddeb] bg-white p-4">
              <p className="text-[13px] text-[#494453]">Choose where this artwork should be published:</p>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e4e6f2] p-3">
                <input
                  type="radio"
                  name={`${i18nPrefix}-publish-target`}
                  checked={publishTarget === 'competition'}
                  onChange={() => onPublishTargetChange('competition')}
                  className="mt-1 size-4 accent-[#4048cd]"
                />
                <span className="text-[13px] text-[#313744]">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <MapPin size={12} className="text-[#f59e0b]" />
                    Add this artwork to this month&apos;s competition
                  </span>
                  <span className="mt-1 block text-[11px] text-[#7a8291]">August Photography Competition</span>
                  <span className="block text-[11px] text-[#7a8291]">Voting Period: Aug 1 — Aug 31, 2026</span>
                  <span className="block text-[11px] text-[#7a8291]">Prize Pool: $10,000</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e4e6f2] p-3">
                <input
                  type="radio"
                  name={`${i18nPrefix}-publish-target`}
                  checked={publishTarget === 'profile'}
                  onChange={() => onPublishTargetChange('profile')}
                  className="mt-1 size-4 accent-[#4048cd]"
                />
                <span className="text-[13px] text-[#313744]">
                  <strong>Add this artwork only to my profile</strong>
                  <span className="mt-1 block text-[11px] text-[#7a8291]">
                    Keep on your personal showcase portfolio. You can always enter it into future monthly competitions later.
                  </span>
                </span>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[16px] font-medium leading-6 text-[#323030]">
          {t('uploadForm.aiCreatedQuestion')}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={aiCreated === 'yes'}
              onChange={() => onAiCreatedChange?.(aiCreated === 'yes' ? '' : 'yes')}
              className="size-[18px] shrink-0 cursor-pointer rounded-[2px] border border-black bg-white accent-[#ee1c25]"
            />
            <span className="text-[15px] font-medium leading-6 text-[#323030] sm:text-[16px]">
              {t('uploadForm.aiCreatedYes')}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={aiCreated === 'no'}
              onChange={() => onAiCreatedChange?.(aiCreated === 'no' ? '' : 'no')}
              className="size-[18px] shrink-0 cursor-pointer rounded-[2px] border border-black bg-white accent-[#ee1c25]"
            />
            <span className="text-[15px] font-medium leading-6 text-[#323030] sm:text-[16px]">
              {t('uploadForm.aiCreatedNo')}
            </span>
          </label>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={copyrightOk}
          onChange={(event) => onCopyrightChange(event.target.checked)}
          className="mt-1 size-[18px] shrink-0 cursor-pointer rounded-[2px] border border-black bg-white accent-[#ee1c25]"
        />
        <span className="text-[15px] font-medium leading-6 text-[#323030] sm:text-[16px]">
          {t(`${i18nPrefix}.copyrightConfirm`)}
        </span>
      </label>
      {errors.copyright ? <p className="-mt-3 text-sm text-red-600" role="alert">{errors.copyright}</p> : null}

      <button
        type="submit"
        className="inline-flex w-full cursor-pointer items-center justify-center gap-4 rounded-lg bg-[#ee1c25] px-6 py-3 text-[16px] font-medium leading-6 text-white transition hover:bg-[#d41921]"
      >
        <Sparkles size={24} aria-hidden="true" />
        {t(`${i18nPrefix}.submit`)}
      </button>
    </form>
  ),
);

ZodiacStoryFormPanel.displayName = 'ZodiacStoryFormPanel';

export default ZodiacStoryFormPanel;
