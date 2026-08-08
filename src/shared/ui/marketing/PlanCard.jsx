import React, { memo } from 'react';
import { ImgIcon } from '@/shared/site-chrome';
import MarketingCard from './MarketingCard';
import MarketingButton from './MarketingButton';

const PlanCard = memo(
  ({
    id,
    icon,
    checkIcon,
    title,
    description,
    features = [],
    prize,
    prizeSuffix,
    popular = false,
    popularLabel,
    ctaLabel,
    ctaIcon,
    onCta,
    className = '',
  }) => (
    <MarketingCard
      id={id}
      variant="default"
      className={`relative flex h-full scroll-mt-35 flex-col justify-between p-8 ${className}`.trim()}
    >
      {popular && popularLabel ? (
        <span className="absolute left-1/2 -top-3 -translate-x-1/2 rounded-full bg-[#4048cd] px-3 py-1 text-[10px] font-extrabold leading-3.75 tracking-[0.5px] text-white">
          {popularLabel}
        </span>
      ) : null}
      <div className="flex flex-col gap-4">
        <div className="flex h-14.25 w-14 items-center justify-center rounded-lg bg-[#fde8e9]">
          <ImgIcon src={icon} size={32} />
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-[28px] font-semibold capitalize leading-7 text-(--primary-text-heading-color)">
              {title}
            </h3>
            <p className="text-[16px] font-normal leading-normal text-(--primary-text-color)">
              {description}
            </p>
          </div>
          {features.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {features.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-[14px] font-normal leading-5 text-[#111827]"
                >
                  <ImgIcon src={checkIcon} size={13} />
                  {label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {prize != null ? (
          <p className="text-[16px] font-normal leading-normal text-[#1b1e56]">
            <span className="text-[32px] font-medium leading-normal text-[#4048cd]">{prize}</span>
            {prizeSuffix}
          </p>
        ) : null}
      </div>
      {ctaLabel ? (
        <MarketingButton type="button" className="mt-6 w-full" icon={ctaIcon} onClick={onCta}>
          {ctaLabel}
        </MarketingButton>
      ) : null}
    </MarketingCard>
  ),
);

PlanCard.displayName = 'PlanCard';

export default PlanCard;
