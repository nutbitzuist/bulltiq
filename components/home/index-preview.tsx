"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatMarketCap, formatPercent, getChangeColorClass } from "@/lib/utils";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import type { Stock } from "@/types";

// Import mock data
import sp500Data from "@/data/sp500.json";
import nasdaq100Data from "@/data/nasdaq100.json";

const tabs = [
    { id: "sp500", label: "S&P 500", href: "/stocks/sp500" },
    { id: "nasdaq100", label: "NASDAQ 100", href: "/stocks/nasdaq100" },
];

export function IndexPreview() {
    const [activeTab, setActiveTab] = useState("sp500");

    const stocks = activeTab === "sp500" ? sp500Data : nasdaq100Data;
    const previewStocks = stocks.slice(0, 8) as Stock[];

    return (
        <section className="py-12 bg-surface border-y-3 border-black">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="bg-primary px-3 py-1 border-2 border-black">📈</span>
                        หุ้นยอดนิยม
                    </h2>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 font-semibold border-2 border-black transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary shadow-brutal-sm translate-x-[-2px] translate-y-[-2px]"
                                        : "bg-white hover:bg-primary/20"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stock Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {previewStocks.map((stock) => {
                        const isPositive = stock.changePercent >= 0;

                        return (
                            <Link
                                key={stock.ticker}
                                href={`/stocks/${stock.ticker}`}
                                className={cn(
                                    "bg-white border-3 border-black p-4",
                                    "shadow-brutal-md",
                                    "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                    "transition-all duration-200"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-bold text-lg font-display">{stock.ticker}</div>
                                        <div className="text-sm text-text-secondary truncate max-w-[120px]">
                                            {stock.nameTh || stock.name}
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

                                <div className="text-xl font-bold mb-1">
                                    {formatCurrency(stock.price)}
                                </div>

                                <div
                                    className={cn(
                                        "inline-flex items-center text-sm font-semibold",
                                        getChangeColorClass(stock.changePercent)
                                    )}
                                >
                                    {isPositive ? "▲" : "▼"} {formatPercent(stock.changePercent)}
                                </div>

                                <div className="text-xs text-text-secondary mt-2">
                                    มูลค่าตลาด: {formatMarketCap(stock.marketCap)}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link href={activeTab === "sp500" ? "/stocks/sp500" : "/stocks/nasdaq100"}>
                        <Button variant="primary" size="lg">
                            ดูทั้งหมด
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
