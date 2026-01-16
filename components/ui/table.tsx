"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// Table
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <div className="w-full overflow-x-auto border-3 border-black shadow-brutal-md">
            <table
                ref={ref}
                className={cn("w-full caption-bottom text-sm", className)}
                {...props}
            />
        </div>
    )
);
Table.displayName = "Table";

// Table Header
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn("bg-primary", className)} {...props} />
    )
);
TableHeader.displayName = "TableHeader";

// Table Body
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody
            ref={ref}
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    )
);
TableBody.displayName = "TableBody";

// Table Row
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-b-2 border-black bg-white",
                "hover:bg-primary/10 transition-colors",
                className
            )}
            {...props}
        />
    )
);
TableRow.displayName = "TableRow";

// Table Head Cell
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean;
    sortDirection?: "asc" | "desc" | null;
    onSort?: () => void;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
    ({ className, children, sortable, sortDirection, onSort, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-12 px-4 text-left align-middle font-bold text-black",
                "border-b-2 border-black",
                sortable && "cursor-pointer select-none hover:bg-primary-dark",
                className
            )}
            onClick={sortable ? onSort : undefined}
            {...props}
        >
            <div className="flex items-center gap-2">
                {children}
                {sortable && (
                    <span className="ml-1">
                        {sortDirection === "asc" ? (
                            <ArrowUp className="w-4 h-4" />
                        ) : sortDirection === "desc" ? (
                            <ArrowDown className="w-4 h-4" />
                        ) : (
                            <ArrowUpDown className="w-4 h-4 opacity-50" />
                        )}
                    </span>
                )}
            </div>
        </th>
    )
);
TableHead.displayName = "TableHead";

// Table Cell
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn("p-4 align-middle", className)}
            {...props}
        />
    )
);
TableCell.displayName = "TableCell";

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
