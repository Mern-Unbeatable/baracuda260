import React, { useEffect } from "react";
import { BarChart3, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { httpMethods } from "../../services/httpMethods";
import { API_ENDPOINTS } from "../../services/httpEndpoint";

const STAT_CONFIG = [
  {
    key: "revenue",
    label: "Total Revenue",
    icon: DollarSign,
    format: (v) => (v != null ? `$${Number(v).toLocaleString()}` : "—"),
  },
  {
    key: "orders",
    label: "Total Orders",
    icon: ShoppingCart,
    format: (v) => (v != null ? Number(v).toLocaleString() : "—"),
  },
  {
    key: "leads",
    label: "Total Leads",
    icon: Users,
    format: (v) => (v != null ? Number(v).toLocaleString() : "—"),
  },
  {
    key: "conversionRate",
    label: "Conversion Rate",
    icon: BarChart3,
    format: (v) => (v != null ? `${v}%` : "—"),
  },
];

const StatCard = ({ label, value, icon: Icon, loading }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
      <Icon size={22} className="text-orange-500" aria-hidden="true" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {loading ? (
        <span className="mt-1 block w-16 h-7 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const {
    data: statsData,
    loading,
    error,
    execute: fetchStats,
  } = useApi(httpMethods.get);

  useEffect(() => {
    fetchStats(API_ENDPOINTS.ADMIN.STATS);
  }, [fetchStats]);

  const stats = statsData?.data ?? statsData ?? {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load dashboard stats:{" "}
          {error?.message ?? "Please try again later."}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CONFIG.map(({ key, label, icon, format }) => (
          <StatCard
            key={label}
            label={label}
            value={format(stats[key])}
            icon={icon}
            loading={loading}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="text-sm text-gray-400 text-center py-10">
          Connect your backend to see live data.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
