import React, { forwardRef } from 'react';

/**
 * A highly optimized Image component that standardizes best practices for performance.
 *
 * By default, images are lazily loaded and asynchronously decoded to prevent blocking the main thread.
 * For above-the-fold/hero images, pass `priority={true}` to prioritize fetching and skip lazy loading.
 */
const Image = forwardRef(
  ({ priority = false, alt = '', className = '', ...props }, ref) => {
    if (priority) {
      return (
        <img
          ref={ref}
          alt={alt}
          className={className}
          fetchpriority="high"
          loading="eager"
          decoding="sync"
          {...props}
        />
      );
    }

    return (
      <img
        ref={ref}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        {...props}
      />
    );
  },
);

Image.displayName = 'Image';

export default Image;
