import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';
import AdminPageHeader from '@/portals/admin/components/shared/AdminPageHeader';
import AdminDataTable from '@/portals/admin/components/shared/AdminDataTable';
import AdminStatusBadge from '@/portals/admin/components/shared/AdminStatusBadge';

const COLUMNS = ["Order ID", "Customer", "Date", "Items", "Total", "Status"];

const Orders = () => {
  const { data, loading, error, execute } = useApi(httpMethods.get);

  useEffect(() => {
    execute(API_ENDPOINTS.ORDERS.LIST);
  }, [execute]);

  const orders = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const getStatusVariant = (status) => {
    const s = (status || "").toLowerCase();
    if (s === 'completed' || s === 'active' || s === 'paid') return 'success';
    if (s === 'pending' || s === 'processing') return 'warning';
    if (s === 'cancelled' || s === 'failed') return 'error';
    return 'default';
  };

  const renderRow = (order) => (
    <>
      <td className="px-5 py-4 text-gray-700">
        {order.id ?? order._id ?? "—"}
      </td>
      <td className="px-5 py-4 text-gray-700">
        {order.customer ?? order.customerName ?? "—"}
      </td>
      <td className="px-5 py-4 text-gray-500">
        {order.date ?? order.createdAt ?? "—"}
      </td>
      <td className="px-5 py-4 text-gray-700">
        {order.items ?? order.itemCount ?? "—"}
      </td>
      <td className="px-5 py-4 text-gray-700">
        {order.total != null ? `$${order.total}` : "—"}
      </td>
      <td className="px-5 py-4">
        <AdminStatusBadge status={order.status} variant={getStatusVariant(order.status)} />
      </td>
    </>
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Orders" 
        subtitle="View and manage all customer orders." 
      />

      <AdminDataTable
        columns={COLUMNS}
        data={orders}
        loading={loading}
        error={error}
        emptyIcon={ShoppingCart}
        emptyMessage="No orders yet."
        searchPlaceholder="Search orders..."
        renderRow={renderRow}
      />
    </div>
  );
};

export default Orders;
