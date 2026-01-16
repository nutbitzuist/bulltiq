import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TradingViewWidget } from "@/components/charts/tradingview-widget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    formatCurrency,
    formatMarketCap,
    formatPercent,
    formatNumber,
    getSectorTh,
    getChangeColorClass,
    cn,
} from "@/lib/utils";
import { UI_TEXT } from "@/lib/constants";
import { TrendingUp, TrendingDown, ArrowLeft, ExternalLink, BarChart3, Globe, FileText } from "lucide-react";
import sp500Data from "@/data/sp500.json";
import nasdaq100Data from "@/data/nasdaq100.json";
import dowJonesData from "@/data/dow-jones.json";
import type { Stock } from "@/types";
import { ShareButton } from "@/components/stocks/share-button";
import { getCompanyWebsite } from "@/lib/company-websites";

// Combine all stocks for lookup
const allStocks = [...sp500Data, ...nasdaq100Data, ...dowJonesData] as Stock[];

// Get unique stocks by ticker
const stockMap = new Map<string, Stock>();
allStocks.forEach((stock) => {
    if (!stockMap.has(stock.ticker)) {
        stockMap.set(stock.ticker, stock);
    }
});

interface PageProps {
    params: { ticker: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const stock = stockMap.get(params.ticker.toUpperCase());

    if (!stock) {
        return {
            title: "ไม่พบหุ้น",
        };
    }

    return {
        title: `${stock.ticker} - ${stock.nameTh || stock.name} | วิเคราะห์หุ้น`,
        description: `วิเคราะห์หุ้น ${stock.ticker} (${stock.name}) ราคาล่าสุด ${formatCurrency(stock.price)} กราฟ ข้อมูลพื้นฐาน และบทวิเคราะห์ภาษาไทย`,
        keywords: [
            stock.ticker,
            `หุ้น${stock.ticker}`,
            stock.name,
            stock.nameTh || "",
            "หุ้นอเมริกา",
            "วิเคราะห์หุ้น",
        ],
    };
}

export function generateStaticParams() {
    return Array.from(stockMap.keys()).map((ticker) => ({
        ticker,
    }));
}

// Statistics grid data
function getStatistics(stock: Stock) {
    return [
        { label: UI_TEXT.high52w, value: formatCurrency(stock.high52w) },
        { label: UI_TEXT.low52w, value: formatCurrency(stock.low52w) },
        { label: UI_TEXT.peRatio, value: stock.pe?.toFixed(2) || "N/A" },
        { label: UI_TEXT.eps, value: stock.eps ? `$${stock.eps.toFixed(2)}` : "N/A" },
        {
            label: UI_TEXT.dividendYield,
            value: stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : "N/A",
        },
        { label: UI_TEXT.beta, value: stock.beta?.toFixed(2) || "N/A" },
        { label: UI_TEXT.volume, value: formatNumber(stock.volume) },
        { label: UI_TEXT.marketCap, value: formatMarketCap(stock.marketCap) },
    ];
}

// Related stocks
function getRelatedStocks(stock: Stock): Stock[] {
    return Array.from(stockMap.values())
        .filter((s) => s.sector === stock.sector && s.ticker !== stock.ticker)
        .slice(0, 4);
}

// Format analysis with bold headings
function renderFormattedAnalysis(analysisTh: string) {
    // Section header patterns in Thai
    const headerPatterns = [
        "ETF นี้คืออะไร? ลงทุนในอะไร?",
        "บริษัทนี้คืออะไร? ลงทุนในอะไร?",
        "กองทุนนี้คืออะไร ทำอะไร",
        "กองทุนนี้คืออะไร",
        "ประวัติและความเป็นมา",
        "กลยุทธ์การลงทุนและวิธีการทำงาน",
        "ค่าใช้จ่ายและต้นทุน",
        "ผลการดำเนินงาน",
        "องค์ประกอบภายใน (Holdings Analysis)",
        "ข้อดีและจุดเด่น",
        "ความเสี่ยง",
        "การเปรียบเทียบกับทางเลือกอื่น",
        "วิธีการซื้อขายและข้อควรรู้",
        "สรุปและมุมมอง",
        "สรุป",
        "โมเดลธุรกิจและแหล่งรายได้",
        "โมเดลธุรกิจ",
        "ผลประกอบการและฐานะการเงิน",
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

export default function StockDetailPage({ params }: PageProps) {
    const ticker = params.ticker.toUpperCase();
    const stock = stockMap.get(ticker);

    if (!stock) {
        notFound();
    }

    const isPositive = stock.changePercent >= 0;
    const statistics = getStatistics(stock);
    const relatedStocks = getRelatedStocks(stock);

    // Check if analysis is a placeholder
    const hasRealAnalysis = stock.analysisTh &&
        !stock.analysisTh.includes("กำลังอยู่ระหว่างการจัดทำ") &&
        stock.analysisTh.length > 150;

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-text-secondary hover:text-accent-blue">
                        หน้าแรก
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <Link href="/stocks" className="text-text-secondary hover:text-accent-blue">
                        หุ้น
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <span className="font-semibold">{stock.ticker}</span>
                </nav>

                {/* Back Button */}
                <Link href="/stocks/sp500" className="inline-block mb-6">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับไปรายการหุ้น
                    </Button>
                </Link>

                {/* Stock Header */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex gap-4">
                                {/* Logo Placeholder */}
                                <div className="w-16 h-16 bg-white border-2 border-black flex items-center justify-center text-xl font-bold rounded-lg shadow-brutal-sm">
                                    {stock.ticker.slice(0, 2)}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold font-display">{stock.ticker}</h1>
                                        <Badge variant="info">{getSectorTh(stock.sector)}</Badge>
                                    </div>
                                    <p className="text-xl text-text-secondary mb-4">
                                        {stock.nameTh || stock.name}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-4xl font-bold font-display">
                                            {formatCurrency(stock.price)}
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
                                            {formatCurrency(Math.abs(stock.change))} ({formatPercent(stock.changePercent)})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={getCompanyWebsite(ticker)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <Globe className="w-4 h-4 mr-2" />
                                        เว็บไซต์บริษัท
                                    </Button>
                                </a>
                                <ShareButton stockName={stock.name} ticker={stock.ticker} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* External Links Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-accent-blue text-white px-3 py-1 border-2 border-black">🔗</span>
                        ลิงก์ข้อมูลเพิ่มเติม
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <a
                            href={`https://finance.yahoo.com/quote/${ticker}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "bg-white border-3 border-black p-4 shadow-brutal-md",
                                "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                "transition-all duration-200 flex items-center gap-3"
                            )}
                        >
                            <BarChart3 className="w-6 h-6 text-purple-600" />
                            <div>
                                <div className="font-bold">Yahoo Finance</div>
                                <div className="text-sm text-text-secondary">ข้อมูลราคา & ข่าว</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </a>

                        <a
                            href={`https://www.google.com/finance/quote/${ticker}:NASDAQ`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "bg-white border-3 border-black p-4 shadow-brutal-md",
                                "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                "transition-all duration-200 flex items-center gap-3"
                            )}
                        >
                            <Globe className="w-6 h-6 text-blue-600" />
                            <div>
                                <div className="font-bold">Google Finance</div>
                                <div className="text-sm text-text-secondary">ภาพรวมบริษัท</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </a>

                        <a
                            href={`https://www.tradingview.com/symbols/${ticker}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "bg-white border-3 border-black p-4 shadow-brutal-md",
                                "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                "transition-all duration-200 flex items-center gap-3"
                            )}
                        >
                            <BarChart3 className="w-6 h-6 text-green-600" />
                            <div>
                                <div className="font-bold">TradingView</div>
                                <div className="text-sm text-text-secondary">กราฟ & เทคนิคอล</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </a>

                        <a
                            href={`https://stockanalysis.com/stocks/${ticker.toLowerCase()}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "bg-white border-3 border-black p-4 shadow-brutal-md",
                                "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                "transition-all duration-200 flex items-center gap-3"
                            )}
                        >
                            <FileText className="w-6 h-6 text-orange-600" />
                            <div>
                                <div className="font-bold">Stock Analysis</div>
                                <div className="text-sm text-text-secondary">งบการเงิน</div>
                            </div>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                        </a>
                    </div>
                </div>

                {/* TradingView Chart */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-black text-white px-3 py-1">📊</span>
                        กราฟราคา
                    </h2>
                    <TradingViewWidget symbol={stock.ticker} height={500} />
                </div>

                {/* Key Statistics */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary px-3 py-1 border-2 border-black">📈</span>
                        ข้อมูลสำคัญ
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statistics.map((stat) => (
                            <Card key={stat.label} interactive={false} className="p-4">
                                <div className="text-sm text-text-secondary mb-1">{stat.label}</div>
                                <div className="text-xl font-bold font-display">{stat.value}</div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Thai Analysis */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-accent-purple text-white px-3 py-1 border-2 border-black">📝</span>
                        บทวิเคราะห์ภาษาไทย
                    </h2>
                    <Card interactive={false}>
                        <CardContent className="p-6">
                            {hasRealAnalysis ? (
                                <div className="max-w-none">
                                    {renderFormattedAnalysis(stock.analysisTh!)}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📊</div>
                                    <h3 className="text-xl font-bold mb-2">กำลังจัดทำบทวิเคราะห์</h3>
                                    <p className="text-text-secondary mb-4">
                                        บทวิเคราะห์สำหรับ {stock.name} ({stock.ticker}) กำลังอยู่ระหว่างการจัดทำ
                                    </p>
                                    <p className="text-sm text-text-secondary">
                                        ในระหว่างนี้ท่านสามารถดูข้อมูลจากลิงก์ภายนอกด้านบน
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Related Stocks */}
                {relatedStocks.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-success text-white px-3 py-1 border-2 border-black">🔗</span>
                            {UI_TEXT.relatedStocks} ({getSectorTh(stock.sector)})
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedStocks.map((related) => {
                                const relatedPositive = related.changePercent >= 0;
                                return (
                                    <Link
                                        key={related.ticker}
                                        href={`/stocks/${related.ticker}`}
                                        className={cn(
                                            "bg-white border-3 border-black p-4 shadow-brutal-md",
                                            "hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm",
                                            "transition-all duration-200"
                                        )}
                                    >
                                        <div className="font-bold font-display text-lg">{related.ticker}</div>
                                        <div className="text-sm text-text-secondary truncate mb-2">
                                            {related.nameTh || related.name}
                                        </div>
                                        <div className="font-semibold">{formatCurrency(related.price)}</div>
                                        <div
                                            className={cn(
                                                "text-sm font-semibold",
                                                getChangeColorClass(related.changePercent)
                                            )}
                                        >
                                            {relatedPositive ? "▲" : "▼"} {formatPercent(related.changePercent)}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
