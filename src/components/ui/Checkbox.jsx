import React, { forwardRef } from 'react';

const Checkbox = forwardRef(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="mt-1 size-4 rounded border-[#d1d5db] text-[#ee1c25] focus:ring-[#ee1c25] cursor-pointer"
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="text-[10px] leading-[15px] text-[#9ca3af] mt-0.5 cursor-pointer"
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-[11px] text-red-500">{error.message}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
