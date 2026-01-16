import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TradingViewWidget } from "@/components/charts/tradingview-widget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    formatCurrency,
    formatPercent,
    formatNumber,
    cn,
} from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowLeft, FileText } from "lucide-react";
import { ShareButton } from "@/components/stocks/share-button";
import topETFsData from "@/data/top-etfs.json";
import type { ETF } from "@/types";

const etfMap = new Map<string, ETF>();
(topETFsData as ETF[]).forEach((etf) => {
    etfMap.set(etf.ticker, etf);
});

function renderFormattedAnalysis(analysisTh: string) {
    // Section header patterns in Thai
    const headerPatterns = [
        "บริษัทนี้คืออะไร ทำอะไร",
        "กองทุนนี้คืออะไร ทำอะไร",
        "กองทุนนี้คืออะไร",
        "ประวัติและความเป็นมา",
        "โมเดลธุรกิจและแหล่งรายได้",
        "โมเดลธุรกิจ",
        "ผลประกอบการและฐานะการเงิน",
        "ความเสี่ยง",
        "สรุปและมุมมอง",
        "สรุป",
        "องค์ประกอบหลัก",
        "ข้อดีและข้อเสีย",
        "ผลตอบแทนในอดีต",
        "การเติบโตและโอกาส",
        "จุดเด่น",
        "โอกาส",
        "ลูกค้าคือใคร",
        "ทำไมถึงน่าสนใจ",
    ];

    const lines = analysisTh.split('\n');
    const elements: JSX.Element[] = [];

    lines.forEach((line, i) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Strict header check: MUST be one of the known patterns exactly, or start with pattern and be short
        const isHeader = headerPatterns.some(pattern =>
            trimmedLine === pattern ||
            (trimmedLine.startsWith(pattern) && trimmedLine.length < pattern.length + 20)
        );

        if (isHeader) {
            elements.push(
                <h3 key={i} className="text-xl font-bold text-black mt-8 mb-4 first:mt-0 bg-[#FFD700] px-3 py-1.5 inline-block rounded-sm shadow-sm">
                    {trimmedLine}
                </h3>
            );
        } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("• ")) {
            elements.push(
                <li key={i} className="ml-6 mb-2 text-text-secondary">
                    {trimmedLine.replace(/^[-•]\s*/, "")}
                </li>
            );
        } else {
            elements.push(
                <p key={i} className="mb-4 text-text-secondary leading-relaxed text-base">
                    {trimmedLine}
                </p>
            );
        }
    });

    // Add analysis date and warning
    elements.push(
        <div key="footer" className="mt-8 pt-4 border-t-2 border-black/10">
            <div className="text-sm text-text-secondary flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4" />
                <span>วิเคราะห์เมื่อ: 16 มกราคม 2026</span>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
                <p className="font-bold flex items-center gap-2">
                    <span>⚠️</span> คำเตือน:
                </p>
                <p>
                    ข้อมูลนี้มีไว้เพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำในการลงทุน กรุณาศึกษาข้อมูลเพิ่มเติมก่อนตัดสินใจลงทุน
                </p>
            </div>
        </div>
    );

    return elements;
}

interface PageProps {
    params: { ticker: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const etf = etfMap.get(params.ticker.toUpperCase());

    if (!etf) {
        return { title: "ไม่พบกองทุน ETF" };
    }

    return {
        title: `${etf.ticker} - ${etf.nameTh || etf.name} | วิเคราะห์ ETF`,
        description: `วิเคราะห์กองทุน ${etf.ticker} (${etf.name}) ราคาล่าสุด ${formatCurrency(etf.price)} AUM, Expense Ratio และบทวิเคราะห์ภาษาไทย`,
        keywords: [etf.ticker, `กองทุน${etf.ticker}`, etf.name, "ETF", "กองทุน ETF"],
    };
}

export function generateStaticParams() {
    return Array.from(etfMap.keys()).map((ticker) => ({ ticker }));
}

function getStatistics(etf: ETF) {
    return [
        { label: "สูงสุด 52 สัปดาห์", value: formatCurrency(etf.high52w) },
        { label: "ต่ำสุด 52 สัปดาห์", value: formatCurrency(etf.low52w) },
        { label: "ปริมาณซื้อขาย", value: formatNumber(etf.volume) },
        { label: "AUM", value: `$${formatNumber(etf.aum)}` },
        { label: "Expense Ratio", value: `${(etf.expenseRatio * 100).toFixed(2)}%` },
        { label: "ประเภท", value: etf.category },
    ];
}

export default function ETFDetailPage({ params }: PageProps) {
    const ticker = params.ticker.toUpperCase();
    const etf = etfMap.get(ticker);

    if (!etf) {
        notFound();
    }

    const isPositive = etf.changePercent >= 0;
    const statistics = getStatistics(etf);

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-text-secondary hover:text-accent-blue">
                        หน้าแรก
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <Link href="/etf" className="text-text-secondary hover:text-accent-blue">
                        ETF
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <span className="font-semibold">{etf.ticker}</span>
                </nav>

                {/* Back Button */}
                <Link href="/etf" className="inline-block mb-6">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับไปรายการ ETF
                    </Button>
                </Link>

                {/* ETF Header */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold font-display">{etf.ticker}</h1>
                                    <Badge variant="info">{etf.category}</Badge>
                                </div>
                                <p className="text-xl text-text-secondary mb-4">
                                    {etf.nameTh || etf.name}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-bold font-display">
                                        {formatCurrency(etf.price)}
                                    </span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 text-lg font-bold",
                                            "border-3 border-black",
                                            isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                                        )}
                                    >
                                        {isPositive ? (
                                            <TrendingUp className="w-5 h-5" />
                                        ) : (
                                            <TrendingDown className="w-5 h-5" />
                                        )}
                                        {formatCurrency(Math.abs(etf.change))} ({formatPercent(etf.changePercent)})
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <ShareButton
                                    stockName={etf.name}
                                    ticker={etf.ticker}
                                    url={`https://bulltiq.com/etf/${etf.ticker}`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* TradingView Chart */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-3 py-1">📊</span>
                        กราฟราคา
                    </h2>
                    <TradingViewWidget symbol={`AMEX:${etf.ticker}`} height={500} />
                </div>

                {/* Key Statistics */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary px-3 py-1 border-2 border-black">📈</span>
                        ข้อมูลสำคัญ
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {statistics.map((stat) => (
                            <Card key={stat.label} interactive={false} className="p-4">
                                <div className="text-sm text-text-secondary mb-1">{stat.label}</div>
                                <div className="text-xl font-bold font-display">{stat.value}</div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Thai Analysis */}
                {etf.analysisTh && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-accent-purple text-white px-3 py-1 border-2 border-black">📝</span>
                            บทวิเคราะห์ภาษาไทย
                        </h2>
                        <Card interactive={false}>
                            <CardContent className="p-6">
                                {renderFormattedAnalysis(etf.analysisTh)}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
