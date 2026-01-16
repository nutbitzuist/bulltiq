"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    const pages = React.useMemo(() => {
        const items: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            items.push(1);

            if (currentPage > 3) {
                items.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                items.push(i);
            }

            if (currentPage < totalPages - 2) {
                items.push("...");
            }

            items.push(totalPages);
        }

        return items;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <nav
            className={cn("flex items-center justify-center gap-2", className)}
            aria-label="Pagination"
        >
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="หน้าก่อนหน้า"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                ก่อนหน้า
            </Button>

            <div className="flex items-center gap-1">
                {pages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span className="px-2 text-text-secondary">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "w-10 h-10 font-semibold border-2 border-black transition-all",
                                    currentPage === page
                                        ? "bg-primary shadow-brutal-sm translate-x-[-2px] translate-y-[-2px]"
                                        : "bg-white hover:bg-primary/20"
                                )}
                                aria-current={currentPage === page ? "page" : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="หน้าถัดไป"
            >
                ถัดไป
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </nav>
    );
}

export { Pagination };
