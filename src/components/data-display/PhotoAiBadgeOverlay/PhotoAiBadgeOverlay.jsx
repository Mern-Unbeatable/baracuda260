import React, { memo } from 'react';
import AiGeneratedPhotoBadge from '@/components/data-display/AiGeneratedPhotoBadge/AiGeneratedPhotoBadge';

/** Consistent on-image placement for the AI badge across cards, heroes, and upload previews. */
const PLACEMENT_CLASS = {
  'hero-end': 'absolute right-3 top-3 z-10 sm:right-6 sm:top-6',
  'card-end': 'absolute right-12 top-3 z-10',
  'preview-start': 'absolute bottom-2.5 left-2.5 z-10',
};

const PhotoAiBadgeOverlay = memo(({ show = false, placement = 'hero-end', size = 'sm', className = '' }) => {
  if (!show) return null;

  const positionClass = PLACEMENT_CLASS[placement] ?? PLACEMENT_CLASS['hero-end'];

  return (
    <AiGeneratedPhotoBadge
      variant="overlay"
      size={size}
      className={`pointer-events-none ${positionClass} ${className}`.trim()}
    />
  );
});

PhotoAiBadgeOverlay.displayName = 'PhotoAiBadgeOverlay';

export default PhotoAiBadgeOverlay;
