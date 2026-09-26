import React, { forwardRef, useState } from 'react';
import { Upload } from 'lucide-react';

/**
 * A reusable Dropzone component for file uploads with a dashed border.
 */
const Dropzone = forwardRef(
  (
    { label, sublabel, accept, error, className = '', id, onChange, ...props },
    ref,
  ) => {
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('');
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-[#fafafa] p-6 transition-colors hover:bg-gray-50 ${error ? 'border-red-400' : 'border-[#d1d5db]'} ${className}`}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          ref={ref}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="mb-2 size-6 text-gray-400" />
          <span className="text-[14px] font-medium text-[#4b5563]">
            {fileName ? fileName : label}
          </span>
          {!fileName && sublabel && (
            <span className="mt-1 text-[12px] text-[#9ca3af]">{sublabel}</span>
          )}
        </div>
      </div>
    );
  },
);

Dropzone.displayName = 'Dropzone';

export default Dropzone;
