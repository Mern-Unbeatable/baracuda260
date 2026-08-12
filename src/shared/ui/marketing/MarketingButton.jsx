import React, { memo } from 'react';
import { ImgIcon } from '@/shared/site-chrome';
import {
  ACTION_BTN_GHOST,
  ACTION_BTN_PRIMARY,
  ACTION_BTN_SECONDARY,
} from '@/shared/ui/actionStyles';
import { FOCUS_RING } from './sectionStyles';

const VARIANT = {
  primary: [ACTION_BTN_PRIMARY, FOCUS_RING].join(' '),
  primaryLg: [
    'inline-flex items-center gap-2 rounded-full bg-[#ee1c25] px-6 py-2.5 text-[16px] font-bold leading-tight text-white',
    'transition hover:bg-[#d91921]',
    FOCUS_RING,
  ].join(' '),
  secondary: [ACTION_BTN_SECONDARY, FOCUS_RING].join(' '),
  ghost: [
    'inline-flex items-center gap-2 text-[14px] font-bold text-[#e31837]',
    'transition hover:text-[#c41430]',
    FOCUS_RING,
  ].join(' '),
  outline: [ACTION_BTN_GHOST, 'text-sm', FOCUS_RING].join(' '),
  muted: [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#4048cd]/20 bg-[#ecedfa] px-5 py-2 text-[15px] font-semibold leading-tight text-[#4048cd]',
    'transition hover:bg-[#e0e2f5]',
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
