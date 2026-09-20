import React from 'react';
import GlobalAdminPageHeader from '@/components/common/AdminPageHeader/AdminPageHeader';

const AdminPageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-center justify-between">
      <GlobalAdminPageHeader title={title} description={subtitle} />
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};

export default AdminPageHeader;
