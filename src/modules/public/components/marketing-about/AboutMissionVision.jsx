import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ImgIcon, Shell } from '@/shared/site-chrome';
import { ABOUT_ASSETS } from '@/modules/public/data/aboutAssets';

const MissionVisionCard = memo(({ title, children, highlight }) => (
  <article className="flex h-full flex-col gap-4 rounded-2xl bg-[#fde8e9] p-6 sm:p-8">
    <h2 className="text-[32px] font-extrabold text-[#0d0d14] sm:text-[40px] xl:text-[48px]">
      {title}
    </h2>
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="flex flex-col gap-5 text-[16px] leading-normal text-[#6b7280] sm:text-[20px]">
        {children}
      </div>
      <div className="flex items-center gap-2">
        <ImgIcon src={ABOUT_ASSETS.fire} size={24} />
        <p className="text-[16px] text-[#fd9400] sm:text-[20px]">{highlight}</p>
      </div>
    </div>
  </article>
));
MissionVisionCard.displayName = 'MissionVisionCard';

const AboutMissionVision = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="bg-white pb-16 sm:pb-20 xl:pb-25">
      <Shell>
        <div className="grid gap-5 lg:grid-cols-2">
          <MissionVisionCard title={t('about.mission.title')} highlight={t('about.mission.highlight')}>
            <p>{t('about.mission.p1')}</p>
            <p>{t('about.mission.p2')}</p>
          </MissionVisionCard>

          <MissionVisionCard title={t('about.vision.title')} highlight={t('about.vision.highlight')}>
            <p>{t('about.vision.p1')}</p>
          </MissionVisionCard>
        </div>
      </Shell>
    </section>
  );
});

AboutMissionVision.displayName = 'AboutMissionVision';

export default AboutMissionVision;
