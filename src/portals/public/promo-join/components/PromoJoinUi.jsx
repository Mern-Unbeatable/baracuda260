import { Trans, useTranslation } from 'react-i18next';
import React, { memo, useEffect, useRef } from 'react';
import { ArrowUpFromLine, ChevronDown, Info, Upload } from 'lucide-react';
import UploadedPhotoPreview from '@/components/data-display/UploadedPhotoPreview/UploadedPhotoPreview';
import {
  FIELD_BG,
  SIX_PHOTO_ASSETS,
  ZODIAC12_ASSETS,
} from '@/portals/public/promo-join/promoJoinData';

export const FieldLabel = memo(({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="mb-2 block text-[13px] font-bold leading-5 text-[#373737]"
  >
    {children}
  </label>
));
FieldLabel.displayName = 'FieldLabel';

export const TextField = memo(
  ({ id, label, value, onChange, placeholder, type = 'text', className = '' }) => (
    <div className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-12 w-full rounded-[10px] ${FIELD_BG} px-4 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#ee1c25]/30`}
      />
    </div>
  ),
);
TextField.displayName = 'TextField';

export const TextAreaField = memo(({ id, label, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <FieldLabel htmlFor={id}>{label}</FieldLabel>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full resize-y rounded-[10px] ${FIELD_BG} px-4 py-3 text-[15px] text-[#151e31] outline-none placeholder:text-[#9aa3b5] focus:ring-2 focus:ring-[#ee1c25]/30`}
    />
  </div>
));
TextAreaField.displayName = 'TextAreaField';

export const CapsLabel = memo(({ children }) => (
  <p className="mb-2 text-[11px] font-bold tracking-[0.14em] text-[#8b93a7]">{children}</p>
));
CapsLabel.displayName = 'CapsLabel';

export const DashedUpload = memo(
  ({ title, hint, onClick, preview, fileName, tall = false }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#cfd3e6] bg-[#fafbff] px-4 text-center transition hover:border-[#4048cd] hover:bg-[#f4f5ff] ${
        tall ? 'min-h-[160px] py-8' : 'min-h-[140px] py-6'
      }`}
    >
      {preview ? (
        <img src={preview} alt="" className="max-h-24 rounded-lg object-cover" />
      ) : (
        <ArrowUpFromLine size={22} className="text-[#687186]" aria-hidden="true" />
      )}
      <p className="text-[15px] font-semibold text-[#373737]">{fileName || title}</p>
      {!fileName ? <p className="text-[12px] text-[#9aa3b5]">{hint}</p> : null}
    </button>
  ),
);
DashedUpload.displayName = 'DashedUpload';

export const VideoDropzone = memo(({ onClick, files = [] }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#d5d8e8] bg-white px-4 py-8 text-center transition hover:border-[#4048cd]"
    >
      <Upload size={28} className="text-[#9aa3b5]" aria-hidden="true" />
      <p className="text-[15px] font-semibold text-[#373737]">
        {t('promoJoin.video.click')}
      </p>
      <p className="text-[13px] text-[#9aa3b5]">{t('promoJoin.video.hint')}</p>
      {files.length > 0 ? (
        <p className="mt-2 text-[13px] font-medium text-[#4048cd]">
          {t('promoJoin.video.selected', { count: files.length })}
        </p>
      ) : null}
    </button>
  );
});
VideoDropzone.displayName = 'VideoDropzone';

const SlotIcon = memo(({ slot }) => {
  if (slot.iconBg && slot.iconOverlay) {
    return (
      <span className="relative size-8.75 shrink-0 overflow-hidden">
        <img src={slot.iconBg} alt="" className="absolute inset-0 size-8.75 object-contain" />
        <img
          src={slot.iconOverlay}
          alt=""
          className="absolute left-1/2 top-1/2 max-h-6.5 max-w-6.5 -translate-x-1/2 -translate-y-1/2 object-contain"
        />
      </span>
    );
  }
  if (slot.icon) {
    return <img src={slot.icon} alt="" className="size-8.75 shrink-0 object-contain" />;
  }
  return null;
});
SlotIcon.displayName = 'SlotIcon';

export const ZodiacSlotCard = memo(
  ({ slot, themeStyles, preview, onAddPhoto, addLabel, changeLabel }) => {
    const { t } = useTranslation();
    const styles = themeStyles || slot.theme;

    return (
      <article
        className={`flex h-full min-w-0 flex-col gap-5 rounded-xl border bg-white p-4 sm:p-5 ${styles.cardBorder}`}
      >
        <div className="flex w-full flex-1 flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <p className={`text-[18px] font-semibold ${styles.number}`}>#{slot.number}</p>
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#3a3a3a]">
              {t(slot.elementKey)}
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <SlotIcon slot={slot} />
            <p className={`text-[18px] font-medium ${styles.name}`}>{t(slot.nameKey)}</p>
            <p className={`min-h-10 text-[13px] font-medium leading-5 ${styles.range}`}>
              {t(slot.rangeKey)}
            </p>
          </div>
        </div>

        {preview ? (
          <UploadedPhotoPreview
            src={preview}
            frameClassName="relative mt-auto w-full overflow-hidden rounded-lg border border-black/10"
          >
            <button
              type="button"
              onClick={onAddPhoto}
              className="absolute bottom-2 right-2 cursor-pointer rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium text-[#ee1c25] shadow"
            >
              {changeLabel}
            </button>
          </UploadedPhotoPreview>
        ) : (
          <button
            type="button"
            onClick={onAddPhoto}
            className={`mt-auto inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-[14px] font-medium transition hover:bg-black/[0.02] ${styles.buttonBorder} ${styles.buttonText}`}
          >
            <img src={styles.upload} alt="" className="size-5 shrink-0" />
            {addLabel}
          </button>
        )}
      </article>
    );
  },
);
ZodiacSlotCard.displayName = 'ZodiacSlotCard';

export const ThemePicker = memo(({ themes, themeId, onSelect }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[14px] border border-[#e8eaf3] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-[14px] font-semibold text-[#373737]">
          {t('promoJoin.six.selectTheme')}
        </p>
        <Info size={14} className="text-[#9aa3b5]" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {themes.map((theme, index) => {
          const selected = theme.id === themeId;
          const style = selected ? theme.selected : theme.idle;
          return (
            <React.Fragment key={theme.id}>
              {index === 1 ? (
                <div className="flex items-center justify-center">
                  <span className="text-[13px] font-bold uppercase tracking-wide text-[#9aa3b5]">
                    {t('promoJoin.six.or')}
                  </span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => onSelect(theme.id)}
                className={`relative cursor-pointer rounded-[12px] border p-4 text-left transition ${style.card}`}
              >
                {selected ? (
                  <img
                    src={theme.selectedDot}
                    alt=""
                    className="absolute right-3 top-3 size-3"
                  />
                ) : null}
                <div className="flex items-start gap-3">
                  <img src={theme.icon} alt="" className="mt-0.5 size-6 shrink-0" />
                  <div>
                    <p className={`text-[15px] font-bold leading-6 ${style.title}`}>
                      {t(theme.titleKey)}
                    </p>
                    <p className={`mt-1 text-[13px] leading-5 ${style.body}`}>
                      {t(theme.descriptionKey)}
                    </p>
                  </div>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
});
ThemePicker.displayName = 'ThemePicker';

export const WaveDivider = memo(({ src, className = 'h-[52px]' }) => (
  <div className="overflow-hidden py-2">
    <img src={src} alt="" className={`w-full object-contain ${className}`} />
  </div>
));
WaveDivider.displayName = 'WaveDivider';

export const Zodiac12Banner = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[16px] bg-[#f0f2f8] px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <img src={ZODIAC12_ASSETS.sun} alt="" className="size-14 shrink-0 sm:size-16" />
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[16px] font-bold leading-7 text-[#151e31] sm:text-[18px]">
            <Trans
              i18nKey="promoJoin.twelve.bannerTitleRich"
              defaults="Spring, Summer, Autumn and Winter – <red>Red</red> and <blue>Blue</blue> Full 12 Zodiac Story"
              components={{
                red: <span className="text-[#ee1c25]" />,
                blue: <span className="text-[#4048cd]" />,
              }}
            />
          </p>
          <p className="mt-1 text-[13px] leading-5 text-[#687186] sm:text-[14px]">
            {t('promoJoin.twelve.bannerSubtitle')}
          </p>
        </div>
        <img src={ZODIAC12_ASSETS.moon} alt="" className="size-14 shrink-0 sm:size-16" />
      </div>
    </div>
  );
});
Zodiac12Banner.displayName = 'Zodiac12Banner';

export const AstroSignSelect = memo(({ open, onToggle, onClose, selected, signs, onSelect, t }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className="relative">
      <p className="mb-2 text-[11px] font-bold tracking-[0.14em] text-[#8b93a7]">
        {t('promoJoin.single.selectSign')}
      </p>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-[10px] ${FIELD_BG} px-3 text-left`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#5850ec] text-[16px] text-white">
            {selected.symbol || '♍'}
          </span>
          <span className="truncate text-[15px] font-medium text-[#151e31]">
            {t(selected.nameKey)} ({t(selected.rangeKey)})
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#687186] transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <ul className="absolute left-0 top-full z-20 mt-1 max-h-64 w-full overflow-auto rounded-[10px] border border-[#e4e4e4] bg-white shadow-lg">
          {signs.map((sign) => (
            <li key={sign.id}>
              <button
                type="button"
                onClick={() => onSelect(sign.id)}
                className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[#f6fbff] ${
                  sign.id === selected.id ? 'bg-[#f6fbff] text-[#4048cd]' : 'text-[#373737]'
                }`}
              >
                <span className="inline-flex size-7 items-center justify-center rounded-[6px] bg-[#ecedfa] text-sm">
                  {sign.symbol}
                </span>
                <span className="text-[14px]">
                  {t(sign.nameKey)} ({t(sign.rangeKey)})
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
AstroSignSelect.displayName = 'AstroSignSelect';

export const StoryMetaPanel = memo(({ story, onPatch, showSubcategory = true }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[14px] bg-[#f3f4ff] p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div>
          <CapsLabel>{t('promoJoin.meta.collectionTitle')}</CapsLabel>
          <input
            value={story.title}
            onChange={(event) => onPatch('title', event.target.value)}
            placeholder={t('promoJoin.meta.collectionPlaceholder')}
            className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#4048cd]/25"
          />
        </div>

        <div className={`grid grid-cols-1 gap-4 ${showSubcategory ? 'sm:grid-cols-2' : ''}`}>
          <div>
            <CapsLabel>{t('promoJoin.meta.artisticCategory')}</CapsLabel>
            <select
              value={story.category}
              onChange={(event) => onPatch('category', event.target.value)}
              className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[15px] outline-none"
            >
              <option value="astrophotography">{t('promoJoin.meta.categories.astrophotography')}</option>
              <option value="portrait">{t('promoJoin.meta.categories.portrait')}</option>
              <option value="landscape">{t('promoJoin.meta.categories.landscape')}</option>
              <option value="street">{t('promoJoin.meta.categories.street')}</option>
              <option value="abstract">{t('promoJoin.meta.categories.abstract')}</option>
            </select>
          </div>
          {showSubcategory ? (
            <div>
              <CapsLabel>{t('promoJoin.meta.subcategory')}</CapsLabel>
              <select
                value={story.subCategory}
                onChange={(event) => onPatch('subCategory', event.target.value)}
                className="h-12 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[15px] text-[#687186] outline-none"
              >
                <option value="">{t('promoJoin.meta.subcategoryPlaceholder')}</option>
                <option value="astrophotography">{t('promoJoin.meta.categories.astrophotography')}</option>
                <option value="portrait">{t('promoJoin.meta.categories.portrait')}</option>
                <option value="landscape">{t('promoJoin.meta.categories.landscape')}</option>
              </select>
            </div>
          ) : null}
        </div>

        <div>
          <CapsLabel>{t('promoJoin.meta.story')}</CapsLabel>
          <textarea
            value={story.story}
            onChange={(event) => onPatch('story', event.target.value)}
            placeholder={t('promoJoin.meta.storyPlaceholder')}
            rows={4}
            className="w-full resize-y rounded-[10px] border border-[#e4e8f8] bg-white px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#4048cd]/25"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ['resolution', 'promoJoin.meta.resolution'],
            ['fileSize', 'promoJoin.meta.fileSize'],
            ['quality', 'promoJoin.meta.quality'],
          ].map(([key, labelKey]) => (
            <div key={key}>
              <label className="mb-2 block text-[13px] font-semibold text-[#687186]">
                {t(labelKey)}
              </label>
              <input
                value={story[key]}
                onChange={(event) => onPatch(key, event.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[14px] outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
StoryMetaPanel.displayName = 'StoryMetaPanel';

export const ComplianceBlock = memo(({ aiCreated, copyrightOk, onAi, onCopyright, quality, onQuality }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-[14px] bg-[#f3f4ff] p-4 sm:p-5">
      <div className="mb-4">
        <label className="mb-2 block text-[13px] font-semibold text-[#687186]">
          {t('promoJoin.meta.quality')}
        </label>
        <input
          value={quality}
          onChange={(event) => onQuality(event.target.value)}
          className="h-11 w-full rounded-[10px] border border-[#e4e8f8] bg-white px-3 text-[14px] outline-none"
        />
      </div>
      <p className="mb-3 text-[14px] font-medium text-[#373737]">{t('promoJoin.meta.aiQuestion')}</p>
      <div className="mb-4 flex flex-wrap gap-5">
        {['yes', 'no'].map((value) => (
          <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-[#373737]">
            <input
              type="checkbox"
              checked={aiCreated === value}
              onChange={() => onAi(aiCreated === value ? '' : value)}
              className="size-4 rounded border-[#cfd3e6] accent-[#ee1c25]"
            />
            {t(`promoJoin.meta.${value}`)}
          </label>
        ))}
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-[#4b556f]">
        <input
          type="checkbox"
          checked={copyrightOk}
          onChange={(event) => onCopyright(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-[#cfd3e6] accent-[#ee1c25]"
        />
        <span>{t('promoJoin.meta.copyright')}</span>
      </label>
    </div>
  );
});
ComplianceBlock.displayName = 'ComplianceBlock';

export { SIX_PHOTO_ASSETS, ZODIAC12_ASSETS };
