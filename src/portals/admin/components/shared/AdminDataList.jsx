import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

const AdminDataList = ({
  data,
  loading,
  error,
  emptyIcon: EmptyIcon,
  emptyMessage = "No items found.",
  renderItem,
  searchPlaceholder,
  onSearchChange,
  searchValue,
  keyExtractor = (item, index) => item?.id ?? item?._id ?? index
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
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
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
          {EmptyIcon && <EmptyIcon size={36} className="text-red-200" aria-hidden="true" />}
          <p className="text-sm">Failed to load data. Please try again.</p>
        </div>
      ) : data && data.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <li key={keyExtractor(item, index)} className="px-5 py-4">
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          {EmptyIcon && <EmptyIcon size={36} className="text-gray-200" aria-hidden="true" />}
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDataList;
