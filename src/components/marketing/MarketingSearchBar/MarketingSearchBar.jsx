import React, { memo } from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

const MarketingSearchBar = memo(
  ({ value, onChange, onSubmit, placeholder, ariaLabel, className = '' }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
      className={`group flex w-full items-center gap-3 rounded-lg border-0 bg-[#F6F7F8] px-4 py-3 transition focus-within:ring-2 focus-within:ring-[#4048cd]/30 ${className}`.trim()}
    >
      <Search
        size={20}
        className="shrink-0 text-[#9ca3af] transition-colors group-focus-within:text-[#4048cd]"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="flex-1 flex min-w-0"
        inputClassName="min-w-0 flex-1 w-full bg-transparent text-[16px] text-[#374151] outline-none placeholder:text-[#9ca3af]"
      />
    </form>
  ),
);

MarketingSearchBar.displayName = 'MarketingSearchBar';

export default MarketingSearchBar;
