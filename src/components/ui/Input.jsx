import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, type = 'text', className = '', inputClassName, labelClassName, ...props }, ref) => {
  const handleInput = (e) => {
    // If it's a number field or mobile number field, prevent non-numeric input
    if (type === 'tel' || type === 'number') {
      e.target.value = e.target.value.replace(/[^0-9+()-\s]/g, '');
    }
    if (props.onInput) {
      props.onInput(e);
    }
  };

  const defaultInputClass = `w-full rounded-[4px] border bg-white px-3.5 py-3 text-[14px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition focus:ring-1 ${
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-[#e2e8f0] focus:border-[#4048cd] focus:ring-[#4048cd]'
  }`;

  const defaultLabelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#111827]";

  return (
    <div className={className}>
      {label && (
        <label className={labelClassName !== undefined ? labelClassName : defaultLabelClass}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type === 'number' ? 'text' : type} // Use text internally to avoid browser spin buttons while keeping our custom validation
        onInput={handleInput}
        className={inputClassName !== undefined ? inputClassName : defaultInputClass}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error.message}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
