import React, { useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { useApi } from '@/shared/hooks/useApi';
import { httpMethods } from '@/shared/lib/httpMethods';
import API_ENDPOINTS from '@/shared/lib/httpEndpoint';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all customer orders.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search
            size={16}
            className="text-gray-400 shrink-0"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search orders..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-5 py-20 text-center"
                  >
                    <div className="flex justify-center">
                      <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-5 py-20 text-center text-red-400 text-sm"
                  >
                    Failed to load orders. Please try again.
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, i) => (
                  <tr
                    key={order.id ?? order._id ?? i}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
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
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {order.status ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-5 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <ShoppingCart
                        size={36}
                        className="text-gray-200"
                        aria-hidden="true"
                      />
                      <p>No orders yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
