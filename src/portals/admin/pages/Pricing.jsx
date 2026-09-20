import React, { useEffect } from "react";
import { DollarSign, Plus } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataList from '@/portals/admin/components/shared/AdminDataList';

const Pricing = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.PRICING.LIST);
  }, [execute]);

  const plans = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const renderItem = (plan) => (
    <>
      <p className="text-sm font-medium text-gray-800">
        {plan.name ?? plan.title ?? "Plan"}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        {plan.price != null ? `$${plan.price}` : ""}
      </p>
    </>
  );

  const headerActions = (
    <button
      type="button"
      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
    >
      <Plus size={16} aria-hidden="true" />
      Add Plan
    </button>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Pricing" 
        subtitle="Manage your pricing plans and tiers." 
        actions={headerActions}
      />

      <AdminDataList
        data={plans}
        loading={loading}
        error={error}
        emptyIcon={DollarSign}
        emptyMessage="No pricing plans yet."
        searchPlaceholder="Search plans..."
        renderItem={renderItem}
      />
    </div>
  );
};

export default Pricing;
