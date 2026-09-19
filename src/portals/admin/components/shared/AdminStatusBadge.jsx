import React from 'react';

const AdminStatusBadge = ({ status, variant = 'default' }) => {
  const baseClasses = 'text-xs font-medium px-2 py-1 rounded-full';
  
  // You can extend these variants based on standard statuses (e.g. success, error, warning)
  const variantStyles = {
    default: 'text-gray-600 bg-gray-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-orange-600 bg-orange-100',
    error: 'text-red-600 bg-red-100',
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span className={`${baseClasses} ${style}`}>
      {status ?? "—"}
    </span>
  );
};

export default AdminStatusBadge;
