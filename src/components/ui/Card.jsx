import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-[#f5f5f5] p-6 sm:p-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
