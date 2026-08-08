import React, { memo } from 'react';
import { useSEO } from '@/shared/hooks/useSEO';
import AdminCommentContent from '@/modules/admin/views/AdminCommentContent';

const Comment = memo(() => {
  useSEO({
    title: 'Comment Management',
    description:
      'Admin comment management — review and moderate user comments on My12Photos.',
    keywords: ['comments', 'moderation', 'admin', 'My12Photos'],
  });

  return <AdminCommentContent />;
});

Comment.displayName = 'AdminComment';

export default Comment;
