import React from 'react';

const Badge = ({ children, className = '', ...props }) => {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
