import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trophy, Camera, Heart, Wallet, Compass,
  ShoppingBag, Banknote, Percent,
  Package, Clock, Truck, CheckCircle2,
  Images, Layers, BookImage,
  Image, CloudDownload,
} from 'lucide-react';

// Maps string identifiers to lucide icons (defaults to Trophy if not found)
const STAT_ICONS = {
  trophy: Trophy,
  camera: Camera,
  heart: Heart,
  wallet: Wallet,
  compass: Compass,
  images: Images,
  layers: Layers,
  book: BookImage,
  ShoppingBag,
  Banknote,
  Percent,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  Image,
  CloudDownload,
};

const DashboardStatCard = memo(
  ({ labelKey, value, iconBg, iconColor, icon, className = '' }) => {
    const { t } = useTranslation();
    const Icon = STAT_ICONS[icon] ?? Trophy;

    return (
      <article
        className={`flex h-full flex-col rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-4 shadow-sm sm:p-5 ${className}`}
      >
        <div
          className={`mb-3 flex size-9 items-center justify-center rounded-lg sm:mb-3.5 sm:size-10 ${iconBg}`}
        >
          <Icon size={20} className={iconColor} aria-hidden="true" />
        </div>
        <p className="min-h-8 text-[12px] font-medium uppercase leading-4 tracking-[0.6px] text-[#494453] sm:min-h-0 sm:text-[13px] lg:text-[14px]">
          {t(labelKey)}
        </p>
        <p className="mt-auto pt-2 text-[26px] font-bold tracking-[-0.64px] text-[#161c27] sm:text-[28px] sm:leading-9 lg:text-[30px]">
          {value}
        </p>
      </article>
    );
  },
);

DashboardStatCard.displayName = 'DashboardStatCard';

export default DashboardStatCard;
