import React, { memo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Internal paths use react-router Link; # / http(s) use a plain anchor.
 */
const AppLink = memo(({ href = '#', children, ...props }) => {
  if (!href || href === '#' || /^https?:\/\//.test(href)) {
    return (
      <a href={href || '#'} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  );
});

AppLink.displayName = 'AppLink';

export default AppLink;
