"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { TabNav } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { INDEX_TABS } from "@/lib/constants";
import { cn, formatCurrency, formatPercent, formatNumber, getChangeColorClass } from "@/lib/utils";
import { TrendingUp, TrendingDown, RotateCcw } from "lucide-react";
import type { ETF } from "@/types";

interface ETFListClientProps {
    etfs: ETF[];
}

export function ETFListClient({ etfs }: ETFListClientProps) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    // Filter ETFs
    const filteredETFs = useMemo(() => {
        if (!search) return etfs;

        const searchLower = search.toLowerCase();
        return etfs.filter(
            (etf) =>
                etf.ticker.toLowerCase().includes(searchLower) ||
                etf.name.toLowerCase().includes(searchLower) ||
                etf.nameTh?.toLowerCase().includes(searchLower)
        );
    }, [etfs, search]);

    // Pagination
    const totalPages = Math.ceil(filteredETFs.length / perPage);
    const paginatedETFs = filteredETFs.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const resetFilters = () => {
        setSearch("");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">ETF ยอดนิยม</h1>
                    <p className="text-text-secondary">
                        กองทุน ETF ที่ได้รับความนิยมสูงสุดสำหรับนักลงทุนรายย่อย
                    </p>
                </div>

                {/* Tab Navigation */}
                <TabNav
                    tabs={INDEX_TABS.map((tab) => ({
                        ...tab,
                        href: tab.id === "etf" ? "/etf" : `/stocks/${tab.id}`,
                    }))}
                    activeTab="etf"
                    className="mb-6"
                />

                {/* Filters */}
                <div className="bg-surface border-3 border-black shadow-brutal-md p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <SearchInput
                                placeholder="ค้นหา ETF... (SPY, QQQ, VOO)"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <Button variant="outline" onClick={resetFilters}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            รีเซ็ต
                        </Button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <span className="px-3 py-1 bg-white border-2 border-black">
                        แสดง <span className="font-bold">{filteredETFs.length}</span> กองทุน
                    </span>
                </div>

                {/* ETF Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {paginatedETFs.map((etf) => {
                        const isPositive = etf.changePercent >= 0;

                        return (
                            <Link
                                key={etf.ticker}
                                href={`/etf/${etf.ticker}`}
                                className={cn(
                                    "bg-white border-3 border-black p-5 shadow-brutal-md",
                                    "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                    "transition-all duration-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-bold text-xl font-display">{etf.ticker}</div>
                                        <div className="text-sm text-text-secondary truncate max-w-[180px]">
                                            {etf.nameTh || etf.name}
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "p-1.5 border-2 border-black",
                                            isPositive ? "bg-success/20" : "bg-danger/20"
                                        )}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="w-4 h-4 text-success" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-danger" />
                                        )}
                                    </div>
                                </div>

                                <div className="text-2xl font-bold mb-2">
                                    {formatCurrency(etf.price)}
                                </div>

                                <div
                                    className={cn(
                                        "inline-flex items-center text-sm font-semibold mb-3",
                                        getChangeColorClass(etf.changePercent)
                                    )}
                                >
                                    {isPositive ? "▲" : "▼"} {formatPercent(etf.changePercent)}
                                </div>

                                <div className="text-xs text-text-secondary space-y-1 border-t-2 border-black pt-3">
                                    <div className="flex justify-between">
                                        <span>AUM:</span>
                                        <span className="font-semibold">${formatNumber(etf.aum)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Expense Ratio:</span>
                                        <span className="font-semibold">{(etf.expenseRatio * 100).toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ประเภท:</span>
                                        <span className="font-semibold">{etf.category}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>
        </div>
    );
}
