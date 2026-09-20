import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

const AdminDataTable = ({
  columns,
  data,
  loading,
  error,
  emptyIcon: EmptyIcon,
  emptyMessage = "No items found.",
  renderRow,
  searchPlaceholder,
  onSearchChange,
  searchValue,
  keyExtractor = (item, index) => item?.id ?? item?._id ?? index
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {searchPlaceholder && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <Search
            size={16}
            className="text-gray-400 shrink-0"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className="flex-1"
            inputClassName="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent border-none p-0 focus:ring-0"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
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
                  colSpan={columns.length}
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
                  colSpan={columns.length}
                  className="px-5 py-20 text-center text-red-400 text-sm"
                >
                  Failed to load data. Please try again.
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  {renderRow(item, index)}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-20 text-center"
                >
                  <div className="flex flex-col items-center gap-3 text-gray-400">
                    {EmptyIcon && (
                      <EmptyIcon
                        size={36}
                        className="text-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataTable;
