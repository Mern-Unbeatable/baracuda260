import { Upload } from 'lucide-react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

const getMediaKind = (file) => {
  if (file?.type?.startsWith('image/')) return 'image';
  if (file?.type?.startsWith('video/')) return 'video';
  return null;
};

/**
 * A reusable Dropzone component for file uploads with a dashed border.
 * Once an image or video is chosen it shows a preview with Change / Remove.
 */
const Dropzone = forwardRef(
  (
    {
      label,
      sublabel,
      accept,
      error,
      className = '',
      previewClassName = 'max-h-64 w-full',
      changeLabel = 'Change',
      removeLabel = 'Remove',
      id,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const mediaKind = getMediaKind(file);

    useEffect(() => {
      if (!file || !getMediaKind(file)) {
        setPreview(null);
        return undefined;
      }
      const url = URL.createObjectURL(file);
      setPreview({ file, url });
      return () => URL.revokeObjectURL(url);
    }, [file]);

    // The object URL is created after render, so ignore one left over from a previous file.
    const previewUrl = file && preview?.file === file ? preview.url : '';

    const setRefs = (node) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const handleChange = (e) => {
      setFile(e.target.files?.[0] ?? null);
      if (onChange) {
        onChange(e);
      }
    };

    const handleRemove = () => {
      const input = inputRef.current;
      if (!input) return;
      input.value = '';
      handleChange({ target: input, type: 'change' });
    };

    const hasPreview = Boolean(previewUrl);
    const borderClass = error ? 'border-red-400' : 'border-[#d1d5db]';

    return (
      <div
        className={
          hasPreview
            ? `relative flex flex-col gap-3 rounded-lg border-2 bg-[#fafafa] p-3 ${borderClass}`
            : `relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#fafafa] p-6 transition-colors hover:bg-gray-50 ${borderClass} ${className}`
        }
      >
        <input
          id={id}
          type="file"
          accept={accept}
          ref={setRefs}
          onChange={handleChange}
          className={
            hasPreview
              ? 'sr-only'
              : 'absolute inset-0 h-full w-full cursor-pointer opacity-0'
          }
          {...props}
        />

        {hasPreview ? (
          <>
            <div className="flex justify-center overflow-hidden rounded-md bg-black/5">
              {mediaKind === 'video' ? (
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className={`bg-black object-contain ${previewClassName}`}
                >
                  <track kind="captions" />
                </video>
              ) : (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className={`object-cover ${previewClassName}`}
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-[13px] font-medium text-[#4b5563]">
                {file.name}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <label
                  htmlFor={id}
                  className="cursor-pointer rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition hover:bg-gray-50"
                >
                  {changeLabel}
                </label>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-1.5 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                >
                  {removeLabel}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="mb-2 size-6 text-gray-400" />
            <span className="text-[14px] font-medium text-[#4b5563]">
              {file ? file.name : label}
            </span>
            {!file && sublabel && (
              <span className="mt-1 text-[12px] text-[#9ca3af]">
                {sublabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Dropzone.displayName = 'Dropzone';

export default Dropzone;
