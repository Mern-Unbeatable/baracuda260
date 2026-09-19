import React, { forwardRef } from 'react';

const Button = forwardRef(({ children, variant = 'primary', className = '', unstyled = false, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-[4px] transition uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#ee1c25] hover:bg-[#d01820] text-white',
    secondary: 'bg-[#f5f5f5] hover:bg-[#e5e5e5] text-[#111827]',
    outline: 'border border-[#e2e8f0] bg-white hover:bg-[#f8f9fa] text-[#111827]',
  };

  const finalClass = unstyled ? className : `${baseClasses} ${variants[variant] || ''} ${className}`;

  return (
    <button
      ref={ref}
      className={finalClass}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
