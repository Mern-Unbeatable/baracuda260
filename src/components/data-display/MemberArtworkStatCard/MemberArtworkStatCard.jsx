import { useTranslation } from 'react-i18next';
import React, { memo } from 'react';
import { BookImage, Camera, Images, Layers, Trophy } from 'lucide-react';

const ICONS = {
  images: Images,
  camera: Camera,
  layers: Layers,
  book: BookImage,
  trophy: Trophy,
};

const MemberArtworkStatCard = memo(({ labelKey, value, icon, iconBg, iconColor }) => {
  const { t } = useTranslation();
  const Icon = ICONS[icon] ?? Images;

  return (
    <article className="flex min-h-[118px] flex-col justify-between rounded-2xl border border-[rgba(203,195,213,0.1)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[14px]">
          {t(labelKey)}
        </p>
        <span className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={18} className={iconColor} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-[28px] font-bold leading-none tracking-[-0.64px] text-[#161c27] sm:text-[32px]">
        {value}
      </p>
    </article>
  );
});

MemberArtworkStatCard.displayName = 'MemberArtworkStatCard';

export default MemberArtworkStatCard;
