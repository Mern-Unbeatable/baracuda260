import React, { useEffect } from "react";
import { Mail, Search } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all incoming and outgoing emails.
          </p>
        </div>
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
            placeholder="Search emails..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
            <Mail size={36} className="text-red-200" aria-hidden="true" />
            <p className="text-sm">Failed to load emails. Please try again.</p>
          </div>
        ) : emails.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {emails.map((email, i) => (
              <li key={email.id ?? email._id ?? i} className="px-5 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {email.subject ?? email.from ?? email.title ?? "Email"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {email.from ?? email.email ?? ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <Mail size={36} className="text-gray-200" aria-hidden="true" />
            <p className="text-sm">No emails yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emails;
