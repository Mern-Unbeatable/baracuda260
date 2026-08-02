import React, { useEffect } from "react";
import { Users, Search, UserPlus } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage your sales leads.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-600/20"
        >
          <UserPlus size={16} aria-hidden="true" />
          Add Lead
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search
            size={16}
            className="text-gray-400 shrink-0"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search leads..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <Users size={36} className="text-red-200" aria-hidden="true" />
            <p className="text-sm">Failed to load leads. Please try again.</p>
          </div>
        ) : leads.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {leads.map((lead, i) => (
              <li key={lead.id ?? lead._id ?? i} className="px-5 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {lead.name ?? lead.fullName ?? "Lead"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {lead.email ?? ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Users size={36} className="text-gray-200" aria-hidden="true" />
            <p className="text-sm">No leads yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
