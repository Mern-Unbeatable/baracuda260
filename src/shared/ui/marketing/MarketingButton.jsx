import React, { memo } from 'react';
import { ImgIcon } from '@/shared/site-chrome';
import { FOCUS_RING } from './sectionStyles';

const VARIANT = {
  primary: [
    'inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[#ee1c25] px-6 py-3 text-[16px] font-bold text-white',
    'transition hover:bg-[#d91921] active:scale-[0.98]',
    FOCUS_RING,
  ].join(' '),
  primaryLg: [
    'inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-8 py-3.5 text-[16px] font-bold text-white',
    'transition hover:bg-[#d91921]',
    FOCUS_RING,
  ].join(' '),
  ghost: [
    'inline-flex items-center gap-2 text-[14px] font-bold text-[#e31837]',
    'transition hover:text-[#c41430]',
    FOCUS_RING,
  ].join(' '),
  outline: [
    'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-[#0d0d14]',
    'transition hover:border-black/25 hover:bg-[#fafafa]',
    FOCUS_RING,
  ].join(' '),
};

const MarketingButton = memo(
  ({
    variant = 'primary',
    icon,
    iconSize = 16,
    className = '',
    children,
    as: Component = 'button',
    ...rest
  }) => (
    <Component
      className={[VARIANT[variant] ?? VARIANT.primary, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
      {icon ? <ImgIcon src={icon} size={iconSize} /> : null}
    </Component>
  ),
);

MarketingButton.displayName = 'MarketingButton';

export default MarketingButton;
