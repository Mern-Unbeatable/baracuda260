import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminReportDetailContent from '@/portals/admin/views/AdminReportDetailContent';

const ReportDetail = memo(() => {
  useSEO({
    title: 'Report Details',
    description: 'Review a reported submission and take moderation action on My12Photos.',
    keywords: ['report', 'moderation', 'admin', 'My12Photos'],
  });

  return <AdminReportDetailContent />;
});

ReportDetail.displayName = 'ReportDetail';

export default ReportDetail;
