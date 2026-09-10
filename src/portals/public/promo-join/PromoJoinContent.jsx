import { Trans, useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config';
import AuthPageChrome from '@/portals/auth/components/auth/auth/AuthPageChrome';
import usePromoJoin from '@/portals/public/promo-join/usePromoJoin';
import {
  ALL_SLOTS,
  BLUE_SLOTS,
  RED_SLOTS,
  THEMES,
  ZODIAC_SIGNS,
  getThemeById,
} from '@/portals/public/promo-join/promoJoinData';
import {
  AstroSignSelect,
  ComplianceBlock,
  DashedUpload,
  StoryMetaPanel,
  TextAreaField,
  TextField,
  ThemePicker,
  VideoDropzone,
  WaveDivider,
  Zodiac12Banner,
  ZodiacSlotCard,
  ZODIAC12_ASSETS,
} from '@/portals/public/promo-join/components/PromoJoinUi';

const SectionCard = memo(({ title, subtitle, children, className = '' }) => (
  <section className={`rounded-[16px] border border-[#e8eaf3] bg-white p-4 sm:p-6 ${className}`}>
    {title ? (
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-[#151e31] sm:text-[20px]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13px] text-[#687186] sm:text-[14px]">{subtitle}</p> : null}
      </div>
    ) : null}
    {children}
  </section>
));
SectionCard.displayName = 'SectionCard';

const PromoJoinContent = memo(({ code }) => {
  const { t } = useTranslation();
  const join = usePromoJoin(code);
  const theme = getThemeById(join.themeId);

  return (
    <div className="relative min-h-screen bg-[#f9fafb]">
      <AuthPageChrome backLabelKey="promoJoin.backHome" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-20 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9aa3b5]">
              {t('promoJoin.badge')}
            </p>
            <h1 className="mt-1 font-manrope text-[28px] font-bold tracking-[-0.5px] text-[#151e31] sm:text-[34px]">
              {t('promoJoin.title')}
            </h1>
            {join.promoLink ? (
              <p className="mt-1 text-[14px] text-[#687186]">
                {t('promoJoin.codeLabel', { code: join.promoLink.code })}
              </p>
            ) : (
              <p className="mt-1 text-[14px] text-[#c26a1a]">
                {t('promoJoin.unknownCode', { code })}
              </p>
            )}
          </div>
          <Link
            to={ROUTES.HOME}
            className="text-[14px] font-semibold text-[#4048cd] transition hover:underline"
          >
            {t('promoJoin.backHome')}
          </Link>
        </div>

        <form
          className="flex flex-col gap-5 sm:gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            join.handleSubmit(t);
          }}
        >
          {/* Account */}
          <SectionCard>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="fullName"
                label={t('promoJoin.account.fullName')}
                value={join.account.fullName}
                onChange={(event) => join.patchAccount('fullName', event.target.value)}
                placeholder={t('promoJoin.account.fullNamePh')}
              />
              <TextField
                id="username"
                label={t('promoJoin.account.username')}
                value={join.account.username}
                onChange={(event) => join.patchAccount('username', event.target.value)}
                placeholder={t('promoJoin.account.usernamePh')}
              />
              <TextField
                id="email"
                label={t('promoJoin.account.email')}
                type="email"
                value={join.account.email}
                onChange={(event) => join.patchAccount('email', event.target.value)}
                placeholder={t('promoJoin.account.emailPh')}
              />
              <TextField
                id="phone"
                label={t('promoJoin.account.phone')}
                value={join.account.phone}
                onChange={(event) => join.patchAccount('phone', event.target.value)}
                placeholder={t('promoJoin.account.phonePh')}
              />
              <TextField
                id="country"
                label={t('promoJoin.account.country')}
                value={join.account.country}
                onChange={(event) => join.patchAccount('country', event.target.value)}
                placeholder={t('promoJoin.account.countryPh')}
              />
              <TextField
                id="paypal"
                label={t('promoJoin.account.paypal')}
                value={join.account.paypal}
                onChange={(event) => join.patchAccount('paypal', event.target.value)}
                placeholder={t('promoJoin.account.paypalPh')}
              />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <TextAreaField
                id="about"
                label={t('promoJoin.account.about')}
                value={join.account.about}
                onChange={(event) => join.patchAccount('about', event.target.value)}
                placeholder={t('promoJoin.account.aboutPh')}
                rows={4}
              />

              <div>
                <TextField
                  id="social-0"
                  label={t('promoJoin.account.social')}
                  value={join.socialLinks[0] || ''}
                  onChange={(event) => join.handleSocialChange(0, event.target.value)}
                  placeholder={t('promoJoin.account.socialPh')}
                />
                {join.socialLinks.slice(1).map((link, index) => (
                  <div key={`social-${index + 1}`} className="mt-3">
                    <TextField
                      id={`social-${index + 1}`}
                      label={t('promoJoin.account.socialExtra', { n: index + 2 })}
                      value={link}
                      onChange={(event) => join.handleSocialChange(index + 1, event.target.value)}
                      placeholder={t('promoJoin.account.socialPh')}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={join.handleAddSocial}
                  className="mt-2 cursor-pointer text-[14px] font-semibold text-[#ee1c25] hover:underline"
                >
                  {t('promoJoin.account.addAnother')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DashedUpload
                  title={t('promoJoin.account.profilePhoto')}
                  hint={t('promoJoin.account.profileHint')}
                  preview={join.profilePreview}
                  onClick={() => join.profileInputRef.current?.click()}
                />
                <DashedUpload
                  title={t('promoJoin.account.coverPhoto')}
                  hint={t('promoJoin.account.coverHint')}
                  preview={join.coverPreview}
                  onClick={() => join.coverInputRef.current?.click()}
                />
              </div>

              <DashedUpload
                tall
                title={t('promoJoin.account.video')}
                hint={t('promoJoin.account.videoHint')}
                fileName={join.introVideoName}
                onClick={() => join.introVideoRef.current?.click()}
              />

              <TextField
                id="password"
                label={t('promoJoin.account.password')}
                type="password"
                value={join.account.password}
                onChange={(event) => join.patchAccount('password', event.target.value)}
                placeholder={t('promoJoin.account.passwordPh')}
              />
            </div>
          </SectionCard>

          {/* Single photo / astro */}
          <SectionCard title={t('promoJoin.single.title')}>
            <AstroSignSelect
              open={join.astroOpen}
              onToggle={() => join.setAstroOpen((open) => !open)}
              onClose={() => join.setAstroOpen(false)}
              selected={join.selectedSign}
              signs={ZODIAC_SIGNS}
              onSelect={(id) => {
                join.setAstroSignId(id);
                join.setAstroOpen(false);
              }}
              t={t}
            />
          </SectionCard>

          <ComplianceBlock
            aiCreated={join.aiCreated}
            copyrightOk={join.copyrightOk}
            onAi={join.setAiCreated}
            onCopyright={join.setCopyrightOk}
            quality={join.sixStory.quality}
            onQuality={(value) => join.patchSixStory('quality', value)}
          />

          {/* 6 Photos */}
          <SectionCard title={t('promoJoin.six.title')}>
            <ThemePicker themes={THEMES} themeId={join.themeId} onSelect={join.setThemeId} />
            <WaveDivider src={theme.wave} className={theme.waveClassName} />
            <div className="mt-2">
              <h3 className="text-[18px] font-bold text-[#151e31]">
                {t('promoJoin.six.gridTitle')}
              </h3>
              <p className="mt-1 text-[13px] text-[#687186]">{t('promoJoin.six.gridSubtitle')}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                {join.sixSlots.map((slot) => (
                  <ZodiacSlotCard
                    key={slot.id}
                    slot={slot}
                    themeStyles={theme.slot}
                    preview={join.sixPreviews[slot.id]}
                    onAddPhoto={() => join.handleSixSlotPick(slot.id)}
                    addLabel={t('promoJoin.addPhoto')}
                    changeLabel={t('promoJoin.changePhoto')}
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={t('promoJoin.video.title')}
            subtitle={t('promoJoin.video.subtitle')}
          >
            <VideoDropzone
              onClick={() => join.sixVideoInputRef.current?.click()}
              files={join.sixVideos}
            />
          </SectionCard>

          <StoryMetaPanel story={join.sixStory} onPatch={join.patchSixStory} />

          {/* 12 Photos */}
          <SectionCard>
            <h2 className="text-[18px] font-bold text-[#151e31] sm:text-[20px]">
              {t('promoJoin.twelve.title')}
            </h2>
            <WaveDivider src={ZODIAC12_ASSETS.dualWave} className="mt-3 h-[46px]" />
            <div className="mt-4">
              <Zodiac12Banner />
            </div>
            <div className="mt-5">
              <h3 className="text-[18px] font-bold text-[#151e31]">
                {t('promoJoin.twelve.gridTitle')}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                {RED_SLOTS.map((slot) => (
                  <ZodiacSlotCard
                    key={slot.id}
                    slot={slot}
                    preview={join.twelvePreviews[slot.id]}
                    onAddPhoto={() => join.handleTwelveSlotPick(slot.id)}
                    addLabel={t('promoJoin.addPhoto')}
                    changeLabel={t('promoJoin.changePhoto')}
                  />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
                {BLUE_SLOTS.map((slot) => (
                  <ZodiacSlotCard
                    key={slot.id}
                    slot={slot}
                    preview={join.twelvePreviews[slot.id]}
                    onAddPhoto={() => join.handleTwelveSlotPick(slot.id)}
                    addLabel={t('promoJoin.addPhoto')}
                    changeLabel={t('promoJoin.changePhoto')}
                  />
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title={t('promoJoin.video.title')}
            subtitle={t('promoJoin.video.subtitle')}
          >
            <VideoDropzone
              onClick={() => join.twelveVideoInputRef.current?.click()}
              files={join.twelveVideos}
            />
          </SectionCard>

          <StoryMetaPanel story={join.twelveStory} onPatch={join.patchTwelveStory} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={join.submitting || join.submitted}
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-[10px] bg-[#ee1c25] px-6 py-3.5 text-[16px] font-bold text-white transition hover:bg-[#d41921] disabled:cursor-default disabled:opacity-60 sm:w-auto"
            >
              {join.submitted
                ? t('promoJoin.submitted')
                : join.submitting
                  ? t('promoJoin.submitting')
                  : t('promoJoin.submit')}
            </button>
            <p className="text-[13px] text-[#687186]">
              <Trans
                i18nKey="promoJoin.slotsHint"
                values={{ six: join.sixSlots.length, twelve: ALL_SLOTS.length }}
              />
            </p>
          </div>
        </form>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={join.profileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={join.handleProfileChange}
      />
      <input
        ref={join.coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={join.handleCoverChange}
      />
      <input
        ref={join.introVideoRef}
        type="file"
        accept="video/mp4"
        className="sr-only"
        onChange={join.handleIntroVideoChange}
      />
      <input
        ref={join.sixSlotInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={join.handleSixSlotFile}
      />
      <input
        ref={join.twelveSlotInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={join.handleTwelveSlotFile}
      />
      <input
        ref={join.sixVideoInputRef}
        type="file"
        accept="video/mp4"
        multiple
        className="sr-only"
        onChange={join.handleSixVideos}
      />
      <input
        ref={join.twelveVideoInputRef}
        type="file"
        accept="video/mp4"
        multiple
        className="sr-only"
        onChange={join.handleTwelveVideos}
      />
    </div>
  );
});

PromoJoinContent.displayName = 'PromoJoinContent';

export default PromoJoinContent;
