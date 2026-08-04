import React, { memo } from 'react';
import { useSEO } from '../../hooks/useSEO';
import AdminCategoriesContent from '../../components/adminCategories/AdminCategoriesContent';

const Categories = memo(() => {
  useSEO({
    title: 'Categories',
    description:
      'Admin taxonomy — shape the places your photographers’ work can belong on My12Photos.',
    keywords: ['categories', 'taxonomy', 'admin', 'My12Photos'],
  });

  return <AdminCategoriesContent />;
});

Categories.displayName = 'Categories';

export default Categories;
