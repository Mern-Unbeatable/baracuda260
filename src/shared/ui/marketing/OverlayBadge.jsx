import React, { memo } from 'react';

const OverlayBadge = memo(({ children, className = '' }) => (
  <span className={className}>{children}</span>
));

OverlayBadge.displayName = 'OverlayBadge';

export default OverlayBadge;
