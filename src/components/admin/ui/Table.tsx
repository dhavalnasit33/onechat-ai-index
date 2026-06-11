import React from "react";

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = "", ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full border-collapse font-sans text-sm text-[var(--admin-text)] ${className}`}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <thead ref={ref} className={`bg-[var(--admin-surface-2)] ${className}`} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <tbody ref={ref} className={`&_tr:last-child_td:border-0 ${className}`} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", ...props }, ref) => (
    <tfoot
      ref={ref}
      className={`border-t border-[var(--admin-border-subtle)] bg-[var(--admin-surface-2)] font-medium [&>tr]:last:border-b-0 ${className}`}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", ...props }, ref) => (
    <tr
      ref={ref}
      className={`transition-colors hover:bg-[var(--admin-surface-2)] data-[state=selected]:bg-[var(--admin-surface-2)] ${className}`}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <th
      ref={ref}
      className={`h-11 px-4 text-left align-middle font-semibold text-xs uppercase tracking-[0.06em] text-[var(--admin-text-dim)] border-b border-[var(--admin-border-subtle)] ${className}`}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", ...props }, ref) => (
    <td
      ref={ref}
      className={`p-4 align-middle border-b border-[var(--admin-border-subtle)] ${className}`}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";
