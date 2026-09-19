import React, { useEffect } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const Jobs = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.JOBS.LIST);
  }, [execute]);

  const jobs = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (job) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {job.title ?? "Job"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {job.location ?? job.type ?? ""}
      </p>
    </>
  );

  const headerActions = (
    <button
      type="button"
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
    >
      <Plus size={16} aria-hidden="true" />
      Post Job
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Jobs" 
        subtitle="Post and manage job listings." 
        actions={headerActions}
      />

      <AdminDataList
        data={jobs}
        loading={loading}
        error={error}
        emptyIcon={ClipboardList}
        emptyMessage="No job listings yet."
        searchPlaceholder="Search jobs..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default Jobs;
