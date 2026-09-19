import React, { useEffect } from "react";
import { Briefcase, Plus } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const CaseStudies = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.CASE_STUDIES.LIST);
  }, [execute]);

  const caseStudies = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (cs) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {cs.title ?? "Case Study"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {cs.client ?? cs.industry ?? ""}
      </p>
    </>
  );

  const headerActions = (
    <button
      type="button"
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
    >
      <Plus size={16} aria-hidden="true" />
      New Case Study
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Case Studies" 
        subtitle="Manage your published case studies." 
        actions={headerActions}
      />

      <AdminDataList
        data={caseStudies}
        loading={loading}
        error={error}
        emptyIcon={Briefcase}
        emptyMessage="No case studies yet."
        searchPlaceholder="Search case studies..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default CaseStudies;
