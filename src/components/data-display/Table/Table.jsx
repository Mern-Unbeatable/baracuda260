import React from 'react';
import { cn } from '@/shared/utils/cn';

const Table = React.forwardRef(
  ({ className = '', wrapperClassName = '', ...props }, ref) => (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-xl bg-white',
        wrapperClassName,
      )}
    >
      <table
        ref={ref}
        className={cn('w-full border-collapse text-left text-sm', className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ className = '', ...props }, ref) => (
  <tbody ref={ref} className={className} {...props} />
));
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef(
  ({ className = '', isHeader = false, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        isHeader
          ? 'bg-[#f6fbff]'
          : 'border-b border-[#e4e4e4] transition-colors hover:bg-black/[0.02]',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(
  ({ className = '', align = 'left', ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'px-6.5 py-3 text-[16px] font-normal leading-6 text-black whitespace-nowrap',
        align === 'center'
          ? 'text-center'
          : align === 'right'
            ? 'text-right'
            : 'text-left',
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(
  ({ className = '', align = 'left', ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'px-6.5 py-6 text-[16px] leading-6 text-[#0c0c0c] align-middle',
        align === 'center'
          ? 'text-center'
          : align === 'right'
            ? 'text-right'
            : 'text-left',
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
