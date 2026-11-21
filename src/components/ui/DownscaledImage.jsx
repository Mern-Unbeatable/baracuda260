import React, { forwardRef, useEffect, useState } from 'react';

/**
 * Card/grid image loader that never keeps full-resolution bitmaps on screen.
 *
 * Why: favourite-photos lag came from decoding full /uploads originals into
 * multi-megapixel GPU textures inside a nested scroll container.
 *
 * Strategy: fetch once → decode/resize with createImageBitmap → show a small
 * object URL. If CORS/decode fails, fall back to a normal <img src>.
 */
const DownscaledImage = forwardRef(
  (
    {
      src,
      alt = '',
      maxWidth = 736,
      className = '',
      width,
      height,
      sizes,
      loading = 'lazy',
      decoding = 'async',
      ...rest
    },
    ref,
  ) => {
    const [displaySrc, setDisplaySrc] = useState('');

    useEffect(() => {
      if (!src) {
        setDisplaySrc('');
        return undefined;
      }

      let cancelled = false;
      let objectUrl = '';
      setDisplaySrc('');

      const run = async () => {
        try {
          const response = await fetch(src, {
            mode: 'cors',
            credentials: 'omit',
          });
          if (!response.ok || cancelled) {
            if (!cancelled) setDisplaySrc(src);
            return;
          }

          const blob = await response.blob();
          if (cancelled || !blob.type.startsWith('image/')) {
            if (!cancelled) setDisplaySrc(src);
            return;
          }

          let bitmap;
          try {
            bitmap = await createImageBitmap(blob, {
              resizeWidth: maxWidth,
              resizeQuality: 'medium',
            });
          } catch {
            bitmap = await createImageBitmap(blob);
          }
          if (cancelled) {
            bitmap.close();
            return;
          }

          const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1;
          const targetW = Math.max(1, Math.round(bitmap.width * scale));
          const targetH = Math.max(1, Math.round(bitmap.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            bitmap.close();
            if (!cancelled) setDisplaySrc(src);
            return;
          }
          ctx.drawImage(bitmap, 0, 0, targetW, targetH);
          bitmap.close();

          const outBlob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b), 'image/webp', 0.8);
          });
          if (!outBlob || cancelled) {
            if (!cancelled) setDisplaySrc(src);
            return;
          }

          objectUrl = URL.createObjectURL(outBlob);
          if (!cancelled) setDisplaySrc(objectUrl);
        } catch {
          if (!cancelled) setDisplaySrc(src);
        }
      };

      run();

      return () => {
        cancelled = true;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [src, maxWidth]);

    return (
      <img
        ref={ref}
        src={displaySrc || undefined}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        className={className}
        {...rest}
      />
    );
  },
);

DownscaledImage.displayName = 'DownscaledImage';

export default DownscaledImage;
