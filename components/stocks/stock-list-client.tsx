"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { TabNav } from "@/components/ui/tabs";
import { SearchInput } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { INDEX_TABS, SECTORS, UI_TEXT } from "@/lib/constants";
import { cn, formatCurrency, formatMarketCap, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, RotateCcw, LayoutGrid, List } from "lucide-react";
import type { Stock, SortField, SortDirection } from "@/types";

interface StockListClientProps {
    stocks: Stock[];
    activeIndex: string;
    title: string;
    description: string;
    initialSearch?: string;
}

type ViewMode = "list" | "card";

export function StockListClient({
    stocks,
    activeIndex,
    title,
    description,
    initialSearch = "",
}: StockListClientProps) {
    // State
    const [search, setSearch] = useState(initialSearch);
    const [sector, setSector] = useState("all");
    const [sortField, setSortField] = useState<SortField>("marketCap");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(25);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    // Update search when initialSearch prop changes
    useEffect(() => {
        if (initialSearch) {
            setSearch(initialSearch);
        }
    }, [initialSearch]);

    // Filter and sort stocks
    const filteredStocks = useMemo(() => {
        let result = [...stocks];

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(
                (stock) =>
                    stock.ticker.toLowerCase().includes(searchLower) ||
                    stock.name.toLowerCase().includes(searchLower) ||
                    stock.nameTh?.toLowerCase().includes(searchLower)
            );
        }

        // Sector filter
        if (sector !== "all") {
            result = result.filter((stock) => stock.sector === sector);
        }

        // Sort
        result.sort((a, b) => {
            let aVal: number | string = a[sortField] as number | string;
            let bVal: number | string = b[sortField] as number | string;

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
    }, [stocks, search, sector, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredStocks.length / perPage);
    const paginatedStocks = filteredStocks.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    // Stats
    const gainers = filteredStocks.filter((s) => s.changePercent > 0).length;
    const losers = filteredStocks.filter((s) => s.changePercent < 0).length;

    // Handle sort
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
        setCurrentPage(1);
    };

    // Reset filters
    const resetFilters = () => {
        setSearch("");
        setSector("all");
        setSortField("marketCap");
        setSortDirection("desc");
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-text-secondary">{description}</p>
                </div>

                {/* Tab Navigation */}
                <TabNav
                    tabs={INDEX_TABS.map((tab) => ({
                        ...tab,
                        href: tab.id === "etf" ? "/etf" : `/stocks/${tab.id}`,
                    }))}
                    activeTab={activeIndex}
                    className="mb-6"
                />

                {/* Filters */}
                <div className="bg-surface border-3 border-black shadow-brutal-md p-4 mb-6">
                    {/* Quick Filter Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Button
                            variant={!search && sector === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => { resetFilters(); }}
                        >
                            ทั้งหมด
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => {
                                setSortField("changePercent");
                                setSortDirection("desc");
                                setCurrentPage(1);
                            }}
                            className={cn(
                                sortField === "changePercent" && sortDirection === "desc"
                                    ? "ring-2 ring-black ring-offset-2"
                                    : ""
                            )}
                        >
                            ▲ บวก
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                                setSortField("changePercent");
                                setSortDirection("asc");
                                setCurrentPage(1);
                            }}
                            className={cn(
                                sortField === "changePercent" && sortDirection === "asc"
                                    ? "ring-2 ring-black ring-offset-2"
                                    : ""
                            )}
                        >
                            ▼ ลบ
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            รีเซ็ต
                        </Button>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* View Mode Toggle */}
                        <div className="flex border-2 border-black">
                            <button
                                onClick={() => setViewMode("list")}
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
                                onClick={() => setViewMode("card")}
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

                    {/* Search, Sort, and Filter Row */}
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <SearchInput
                                placeholder={UI_TEXT.searchPlaceholder}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="w-40">
                            <label className="text-sm font-semibold mb-1 block">เรียง</label>
                            <Select
                                options={[
                                    { value: "marketCap-desc", label: "มูลค่าตลาด (สูง→ต่ำ)" },
                                    { value: "marketCap-asc", label: "มูลค่าตลาด (ต่ำ→สูง)" },
                                    { value: "price-desc", label: "ราคา (สูง→ต่ำ)" },
                                    { value: "price-asc", label: "ราคา (ต่ำ→สูง)" },
                                    { value: "changePercent-desc", label: "เปลี่ยนแปลง (บวก)" },
                                    { value: "changePercent-asc", label: "เปลี่ยนแปลง (ลบ)" },
                                    { value: "ticker-asc", label: "ชื่อ A→Z" },
                                    { value: "ticker-desc", label: "ชื่อ Z→A" },
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

                        {/* Sector Filter */}
                        <div className="w-40">
                            <label className="text-sm font-semibold mb-1 block">หมวด</label>
                            <Select
                                options={SECTORS.map((s) => ({ value: s.value, label: s.label }))}
                                value={sector}
                                onChange={(e) => {
                                    setSector(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <span className="px-3 py-1 bg-white border-2 border-black">
                        แสดง <span className="font-bold">{filteredStocks.length}</span> หุ้น
                    </span>
                    <span className="px-3 py-1 bg-success/20 border-2 border-success text-success font-semibold">
                        ▲ {gainers} ตัว
                    </span>
                    <span className="px-3 py-1 bg-danger/20 border-2 border-danger text-danger font-semibold">
                        ▼ {losers} ตัว
                    </span>
                </div>

                {/* Stock List - Switch between Card and Table View */}
                {viewMode === "card" ? (
                    /* Card View */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {paginatedStocks.map((stock) => {
                            const isPositive = stock.changePercent >= 0;

                            return (
                                <Link key={stock.ticker} href={`/stocks/${stock.ticker}`}>
                                    <Card className="h-full hover:shadow-brutal-md hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold font-display text-xl">{stock.ticker}</span>
                                                <div
                                                    className={cn(
                                                        "flex items-center gap-1 px-2 py-0.5 text-sm font-semibold border-2 border-black",
                                                        isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                                    )}
                                                >
                                                    {isPositive ? (
                                                        <TrendingUp className="w-3 h-3" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3" />
                                                    )}
                                                    {formatPercent(stock.changePercent)}
                                                </div>
                                            </div>
                                            <div className="text-sm text-text-secondary line-clamp-1 mb-2">
                                                {stock.nameTh || stock.name}
                                            </div>
                                            <div className="mt-auto">
                                                <div className="font-display font-bold text-lg">
                                                    {formatCurrency(stock.price)}
                                                </div>
                                                <div className="text-xs text-text-secondary">
                                                    {formatMarketCap(stock.marketCap)}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    /* Table View */
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "ticker" ? sortDirection : null}
                                    onSort={() => handleSort("ticker")}
                                    className="w-[80px]"
                                >
                                    {UI_TEXT.symbol}
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "name" ? sortDirection : null}
                                    onSort={() => handleSort("name")}
                                    className="min-w-[200px]"
                                >
                                    {UI_TEXT.company}
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "price" ? sortDirection : null}
                                    onSort={() => handleSort("price")}
                                    className="text-right w-[100px]"
                                >
                                    {UI_TEXT.price}
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "changePercent" ? sortDirection : null}
                                    onSort={() => handleSort("changePercent")}
                                    className="text-right w-[120px]"
                                >
                                    {UI_TEXT.change}
                                </TableHead>
                                <TableHead
                                    sortable
                                    sortDirection={sortField === "marketCap" ? sortDirection : null}
                                    onSort={() => handleSort("marketCap")}
                                    className="text-right hidden md:table-cell w-[100px]"
                                >
                                    {UI_TEXT.marketCap}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedStocks.map((stock) => {
                                const isPositive = stock.changePercent >= 0;

                                return (
                                    <TableRow key={stock.ticker}>
                                        <TableCell className="w-[80px]">
                                            <Link
                                                href={`/stocks/${stock.ticker}`}
                                                className="font-bold font-display text-lg hover:text-accent-blue"
                                            >
                                                {stock.ticker}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="min-w-[200px]">
                                            <Link href={`/stocks/${stock.ticker}`} className="hover:text-accent-blue">
                                                <div className="font-semibold truncate max-w-[200px]">{stock.nameTh || stock.name}</div>
                                                <div className="text-sm text-text-secondary">{stock.sector}</div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-display font-semibold w-[100px]">
                                            {formatCurrency(stock.price)}
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
                                                {formatPercent(stock.changePercent)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell font-semibold w-[100px]">
                                            {formatMarketCap(stock.marketCap)}
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

