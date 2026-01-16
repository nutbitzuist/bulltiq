"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndexData {
    symbol: string;
    name: string;
    nameTh: string;
    value: number;
    change: number;
    changePercent: number;
}

interface MarketApiResponse {
    success: boolean;
    data: IndexData[];
    timestamp: string;
    note?: string;
    error?: string;
}

// Index links for navigation
const indexLinks: Record<string, string> = {
    "^GSPC": "/stocks/sp500",
    "^IXIC": "/stocks/nasdaq100",
    "^DJI": "/stocks/dow-jones",
};

export function MarketOverview() {
    const [marketData, setMarketData] = useState<IndexData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/market");
            const result: MarketApiResponse = await response.json();

            if (result.data && result.data.length > 0) {
                setMarketData(result.data);
                setLastUpdated(new Date().toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                }));
                setError(result.success ? null : result.error || null);
            }
        } catch (err) {
            setError("ไม่สามารถโหลดข้อมูลได้");
            console.error("Failed to fetch market data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="bg-black text-white px-3 py-1">📊</span>
                        ภาพรวมตลาด
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                        {lastUpdated && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                อัปเดต: {lastUpdated}
                            </span>
                        )}
                        <button
                            onClick={fetchData}
                            disabled={loading}
                            className={cn(
                                "p-1.5 border-2 border-black bg-white hover:bg-gray-100 transition-colors",
                                loading && "opacity-50 cursor-not-allowed"
                            )}
                            title="รีเฟรช"
                        >
                            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {/* Delay notice */}
                <div className="text-xs text-text-secondary mb-4 flex items-center gap-1">
                    <span className="bg-primary/30 px-2 py-0.5 border border-primary/50 rounded">
                        ⏱️ ข้อมูลล่าช้า 15 นาที
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loading && marketData.length === 0 ? (
                        // Loading skeleton
                        [1, 2, 3].map((i) => (
                            <Card key={i} className="p-6 animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="h-6 w-24 bg-gray-200 mb-2"></div>
                                        <div className="h-4 w-16 bg-gray-200"></div>
                                    </div>
                                    <div className="h-9 w-9 bg-gray-200"></div>
                                </div>
                                <div className="h-10 w-32 bg-gray-200 mb-2"></div>
                                <div className="h-6 w-24 bg-gray-200"></div>
                            </Card>
                        ))
                    ) : (
                        marketData.map((index) => {
                            const isPositive = index.change >= 0;
                            const linkHref = indexLinks[index.symbol] || "/stocks";

                            return (
                                <Link key={index.symbol} href={linkHref}>
                                    <Card className="p-6 cursor-pointer hover:shadow-brutal-md hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{index.name}</h3>
                                                <p className="text-sm text-text-secondary">{index.nameTh}</p>
                                            </div>
                                            <div
                                                className={cn(
                                                    "p-2 border-2 border-black",
                                                    isPositive ? "bg-success/20" : "bg-danger/20"
                                                )}
                                            >
                                                {isPositive ? (
                                                    <TrendingUp className="w-5 h-5 text-success" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5 text-danger" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-3xl font-bold font-display mb-2">
                                            {index.value > 0
                                                ? index.value.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })
                                                : "—"
                                            }
                                        </div>

                                        <div
                                            className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1 font-semibold",
                                                "border-2 border-black",
                                                isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                            )}
                                        >
                                            {isPositive ? "▲" : "▼"}
                                            {index.value > 0
                                                ? `${Math.abs(index.change).toFixed(2)} (${isPositive ? "+" : ""}${index.changePercent.toFixed(2)}%)`
                                                : "—"
                                            }
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })
                    )}
                </div>

                {error && (
                    <div className="mt-4 text-center text-sm text-text-secondary">
                        ⚠️ {error} - กำลังแสดงข้อมูลสำรอง
                    </div>
                )}
            </div>
        </section>
    );
}
