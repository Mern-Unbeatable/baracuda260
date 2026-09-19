import React, { useEffect } from "react";
import { FileText, Plus } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const Blog = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.BLOG.LIST);
  }, [execute]);

  const posts = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (post) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {post.title ?? "Post"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {post.publishedAt ?? post.createdAt ?? ""}
      </p>
    </>
  );

  const headerActions = (
    <button
      type="button"
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
    >
      <Plus size={16} aria-hidden="true" />
      New Post
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Blog" 
        subtitle="Write and manage blog posts." 
        actions={headerActions}
      />

      <AdminDataList
        data={posts}
        loading={loading}
        error={error}
        emptyIcon={FileText}
        emptyMessage="No blog posts yet."
        searchPlaceholder="Search posts..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default Blog;
