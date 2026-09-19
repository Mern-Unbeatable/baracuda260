import React, { useEffect } from "react";
import { Mail } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const Emails = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.EMAILS.LIST);
  }, [execute]);

  const emails = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (email) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {email.subject ?? email.from ?? email.title ?? "Email"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {email.date ?? email.createdAt ?? ""}
      </p>
    </>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Emails" 
        subtitle="Manage all incoming and outgoing emails." 
      />

      <AdminDataList
        data={emails}
        loading={loading}
        error={error}
        emptyIcon={Mail}
        emptyMessage="No emails yet."
        searchPlaceholder="Search emails..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default Emails;
