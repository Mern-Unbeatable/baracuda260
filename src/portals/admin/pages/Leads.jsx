import React, { useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const Leads = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.LEADS.LIST);
  }, [execute]);

  const leads = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (lead) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {lead.name ?? lead.fullName ?? "Lead"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {lead.email ?? ""}
      </p>
    </>
  );

  const headerActions = (
    <button
      type="button"
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
    >
      <UserPlus size={16} aria-hidden="true" />
      Add Lead
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Leads" 
        subtitle="Track and manage your sales leads." 
        actions={headerActions}
      />

      <AdminDataList
        data={leads}
        loading={loading}
        error={error}
        emptyIcon={Users}
        emptyMessage="No leads yet."
        searchPlaceholder="Search leads..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default Leads;
