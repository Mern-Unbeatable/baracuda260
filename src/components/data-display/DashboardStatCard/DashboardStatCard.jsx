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
  ({ labelKey, value, iconBg, iconColor, icon }) => {
    const { t } = useTranslation();
    const Icon = STAT_ICONS[icon] ?? Trophy;

    return (
      <article className="flex flex-col rounded-2xl border border-[rgba(203,195,213,0.2)] bg-white p-5 shadow-sm sm:p-6">
        <div
          className={`mb-4 flex size-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon size={22} className={iconColor} aria-hidden="true" />
        </div>
        <p className="text-[13px] font-medium uppercase tracking-[0.6px] text-[#494453] sm:text-[16px] sm:leading-4">
          {t(labelKey)}
        </p>
        <p className="mt-2 text-[28px] font-bold tracking-[-0.64px] text-[#161c27] sm:text-[32px] sm:leading-10">
          {value}
        </p>
      </article>
    );
  },
);

DashboardStatCard.displayName = 'DashboardStatCard';

export default DashboardStatCard;
