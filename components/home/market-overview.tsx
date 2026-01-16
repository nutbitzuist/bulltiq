import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock market data
const marketData = [
    {
        name: "S&P 500",
        nameTh: "เอสแอนด์พี 500",
        value: 5234.50,
        change: 45.23,
        changePercent: 0.87,
    },
    {
        name: "NASDAQ",
        nameTh: "แนสแดก",
        value: 16432.10,
        change: 198.45,
        changePercent: 1.22,
    },
    {
        name: "DOW JONES",
        nameTh: "ดาวโจนส์",
        value: 38654.20,
        change: -45.80,
        changePercent: -0.12,
    },
];

export function MarketOverview() {
    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="bg-black text-white px-3 py-1">📊</span>
                    ภาพรวมตลาด
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {marketData.map((index) => {
                        const isPositive = index.change >= 0;

                        return (
                            <Card key={index.name} className="p-6">
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
                                    {index.value.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>

                                <div
                                    className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 font-semibold",
                                        "border-2 border-black",
                                        isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                    )}
                                >
                                    {isPositive ? "▲" : "▼"}
                                    {Math.abs(index.change).toFixed(2)} ({isPositive ? "+" : ""}
                                    {index.changePercent.toFixed(2)}%)
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
