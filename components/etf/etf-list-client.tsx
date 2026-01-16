"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { TabNav } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { INDEX_TABS } from "@/lib/constants";
import { cn, formatCurrency, formatPercent, formatNumber, getChangeColorClass } from "@/lib/utils";
import { TrendingUp, TrendingDown, RotateCcw, LayoutGrid, List } from "lucide-react";
import type { ETF } from "@/types";

interface ETFListClientProps {
    etfs: ETF[];
}

type ViewMode = "card" | "list";
type SortField = "ticker" | "price" | "changePercent" | "aum" | "expenseRatio";
type SortDirection = "asc" | "desc";

export function ETFListClient({ etfs }: ETFListClientProps) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>("card");
    const [sortField, setSortField] = useState<SortField>("aum");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const perPage = viewMode === "card" ? 12 : 25;

    // Filter and sort ETFs
    const filteredETFs = useMemo(() => {
        let result = [...etfs];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (etf) =>
                    etf.ticker.toLowerCase().includes(searchLower) ||
                    etf.name.toLowerCase().includes(searchLower) ||
                    etf.nameTh?.toLowerCase().includes(searchLower)
            );
        }

        // Sort
        result.sort((a, b) => {
            let aVal = a[sortField] as number | string;
            let bVal = b[sortField] as number | string;

            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = (bVal as string).toLowerCase();
            }

            if (sortDirection === "asc") {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            }
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        });

        return result;
    }, [etfs, search, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredETFs.length / perPage);
    const paginatedETFs = filteredETFs.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    // Stats
    const gainers = filteredETFs.filter((e) => e.changePercent > 0).length;
    const losers = filteredETFs.filter((e) => e.changePercent < 0).length;

    const resetFilters = () => {
        setSearch("");
        setCurrentPage(1);
        setSortField("aum");
        setSortDirection("desc");
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
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
                        href: tab.id === "etf" ? "/etf" : tab.id === "all" ? "/stocks" : `/stocks/${tab.id}`,
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

                        {/* Sort Dropdown */}
                        <div className="w-48">
                            <label className="text-sm font-semibold mb-1 block">เรียง</label>
                            <Select
                                options={[
                                    { value: "aum-desc", label: "AUM (สูง→ต่ำ)" },
                                    { value: "aum-asc", label: "AUM (ต่ำ→สูง)" },
                                    { value: "price-desc", label: "ราคา (สูง→ต่ำ)" },
                                    { value: "price-asc", label: "ราคา (ต่ำ→สูง)" },
                                    { value: "changePercent-desc", label: "เปลี่ยนแปลง (บวก)" },
                                    { value: "changePercent-asc", label: "เปลี่ยนแปลง (ลบ)" },
                                    { value: "expenseRatio-asc", label: "Expense Ratio (ต่ำ)" },
                                    { value: "expenseRatio-desc", label: "Expense Ratio (สูง)" },
                                    { value: "ticker-asc", label: "ชื่อ A→Z" },
                                ]}
                                value={`${sortField}-${sortDirection}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split("-");
                                    setSortField(field as SortField);
                                    setSortDirection(direction as SortDirection);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <Button variant="outline" onClick={resetFilters}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            รีเซ็ต
                        </Button>

                        {/* View Mode Toggle */}
                        <div className="flex border-2 border-black">
                            <button
                                onClick={() => {
                                    setViewMode("list");
                                    setCurrentPage(1);
                                }}
                                className={cn(
                                    "p-2 transition-colors",
                                    viewMode === "list"
                                        ? "bg-black text-white"
                                        : "bg-white text-black hover:bg-gray-100"
                                )}
                                title="แสดงเป็นรายการ"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setViewMode("card");
                                    setCurrentPage(1);
                                }}
                                className={cn(
                                    "p-2 transition-colors border-l-2 border-black",
                                    viewMode === "card"
                                        ? "bg-black text-white"
                                        : "bg-white text-black hover:bg-gray-100"
                                )}
                                title="แสดงเป็นการ์ด"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <span className="px-3 py-1 bg-white border-2 border-black">
                        แสดง <span className="font-bold">{filteredETFs.length}</span> กองทุน
                    </span>
                    <span className="px-3 py-1 bg-success/20 border-2 border-success text-success font-semibold">
                        ▲ {gainers} ตัว
                    </span>
                    <span className="px-3 py-1 bg-danger/20 border-2 border-danger text-danger font-semibold">
                        ▼ {losers} ตัว
                    </span>
                </div>

                {/* ETF List - Card or Table View */}
                {viewMode === "card" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "ticker" ? sortDirection : null}
                                    onSort={() => handleSort("ticker")}
                                    className="w-[80px]"
                                >
                                    สัญลักษณ์
                                </TableHead>
                                <TableHead className="min-w-[200px]">
                                    ชื่อ
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "price" ? sortDirection : null}
                                    onSort={() => handleSort("price")}
                                    className="text-right w-[100px]"
                                >
                                    ราคา
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "changePercent" ? sortDirection : null}
                                    onSort={() => handleSort("changePercent")}
                                    className="text-right w-[120px]"
                                >
                                    เปลี่ยนแปลง
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "aum" ? sortDirection : null}
                                    onSort={() => handleSort("aum")}
                                    className="text-right hidden md:table-cell w-[120px]"
                                >
                                    AUM
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "expenseRatio" ? sortDirection : null}
                                    onSort={() => handleSort("expenseRatio")}
                                    className="text-right hidden lg:table-cell w-[100px]"
                                >
                                    Expense Ratio
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedETFs.map((etf) => {
                                const isPositive = etf.changePercent >= 0;

                                return (
                                    <TableRow key={etf.ticker}>
                                        <TableCell className="w-[80px]">
                                            <Link
                                                href={`/etf/${etf.ticker}`}
                                                className="font-bold font-display text-lg hover:text-accent-blue"
                                            >
                                                {etf.ticker}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="min-w-[200px]">
                                            <Link href={`/etf/${etf.ticker}`} className="hover:text-accent-blue">
                                                <div className="font-semibold truncate max-w-[200px]">{etf.nameTh || etf.name}</div>
                                                <div className="text-sm text-text-secondary">{etf.category}</div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-display font-semibold w-[100px]">
                                            {formatCurrency(etf.price)}
                                        </TableCell>
                                        <TableCell className="text-right w-[120px]">
                                            <div
                                                className={cn(
                                                    "inline-flex items-center gap-1 px-2 py-1 font-semibold",
                                                    "border-2 border-black",
                                                    isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                                )}
                                            >
                                                {isPositive ? (
                                                    <TrendingUp className="w-4 h-4" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4" />
                                                )}
                                                {formatPercent(etf.changePercent)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell font-semibold w-[120px]">
                                            ${formatNumber(etf.aum)}
                                        </TableCell>
                                        <TableCell className="text-right hidden lg:table-cell w-[100px]">
                                            {(etf.expenseRatio * 100).toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
