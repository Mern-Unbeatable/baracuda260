import React, { memo } from 'react';
import { CARD_SHOWCASE } from '@/shared/ui/sectionStyles';

const VARIANT = {
  default: 'rounded-[20px] border border-black/16 bg-white',
  subtle:
    'rounded-xl border border-black/10 bg-white transition duration-200 hover:border-black/20 hover:shadow-sm',
  showcase: CARD_SHOWCASE,
  filled: 'rounded-2xl border border-black/20 bg-white',
  inset: 'rounded-[20px] border border-black/15 bg-white',
};

const MarketingCard = memo(
  ({ as: Tag = 'article', variant = 'default', className = '', children, ...rest }) => (
    <Tag
      className={[VARIANT[variant] ?? VARIANT.default, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  ),
);

MarketingCard.displayName = 'MarketingCard';

export default MarketingCard;
