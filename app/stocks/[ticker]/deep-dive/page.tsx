import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Target } from "lucide-react";
import sp500Data from "@/data/sp500.json";
import nasdaq100Data from "@/data/nasdaq100.json";
import dowJonesData from "@/data/dow-jones.json";
import type { Stock } from "@/types";

// Import deep dive analyses
import deepDiveAnalyses from "@/data/deep-dive-analyses.json";

const allStocks = [...sp500Data, ...nasdaq100Data, ...dowJonesData] as Stock[];
const stockMap = new Map<string, Stock>();
allStocks.forEach((stock) => {
    if (!stockMap.has(stock.ticker)) {
        stockMap.set(stock.ticker, stock);
    }
});

interface DeepDiveAnalysis {
    ticker: string;
    title: string;
    subtitle: string;
    sections: {
        id: string;
        title: string;
        icon: string;
        content: string[];
    }[];
    verdict: {
        rating: "bullish" | "neutral" | "bearish";
        summary: string;
        buyZone: string;
        cautionZone: string;
    };
    updatedAt: string;
}

const deepDiveMap = new Map<string, DeepDiveAnalysis>();
(deepDiveAnalyses as DeepDiveAnalysis[]).forEach((analysis) => {
    deepDiveMap.set(analysis.ticker, analysis);
});

interface PageProps {
    params: { ticker: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const ticker = params.ticker.toUpperCase();
    const stock = stockMap.get(ticker);
    const deepDive = deepDiveMap.get(ticker);

    if (!stock || !deepDive) {
        return { title: "ไม่พบบทวิเคราะห์เชิงลึก" };
    }

    return {
        title: `${ticker} Deep Dive | วิเคราะห์เชิงลึก ${stock.nameTh || stock.name}`,
        description: deepDive.subtitle,
    };
}

export function generateStaticParams() {
    return Array.from(deepDiveMap.keys()).map((ticker) => ({ ticker }));
}


function renderContent(content: string[]) {
    return content.map((paragraph, i) => {
        // Check for headers (lines starting with emoji or special markers)
        if (paragraph.startsWith("🟢") || paragraph.startsWith("🔵") || paragraph.startsWith("🔴")) {
            const color = paragraph.startsWith("🟢") ? "bg-green-100 border-green-500" :
                paragraph.startsWith("🔵") ? "bg-blue-100 border-blue-500" :
                    "bg-red-100 border-red-500";
            return (
                <div key={i} className={`p-4 border-l-4 ${color} my-4 rounded-r`}>
                    <p className="font-bold text-lg">{paragraph}</p>
                </div>
            );
        }

        // Check for bullet points
        if (paragraph.startsWith("•") || paragraph.startsWith("-") || paragraph.startsWith("→")) {
            return (
                <li key={i} className="ml-6 mb-2 text-text-secondary list-none">
                    {paragraph}
                </li>
            );
        }

        // Check for emphasis (lines with just numbers or stats)
        if (paragraph.match(/^[A-Z0-9].*:.*$/)) {
            return (
                <p key={i} className="mb-2 font-medium text-text-primary">
                    {paragraph}
                </p>
            );
        }

        // Regular paragraph
        return (
            <p key={i} className="mb-4 text-text-secondary leading-relaxed">
                {paragraph}
            </p>
        );
    });
}

export default function DeepDivePage({ params }: PageProps) {
    const ticker = params.ticker.toUpperCase();
    const stock = stockMap.get(ticker);
    const deepDive = deepDiveMap.get(ticker);

    if (!stock) {
        notFound();
    }

    if (!deepDive) {
        return (
            <div className="min-h-screen bg-background py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <nav className="mb-6 flex items-center gap-2 text-sm">
                        <Link href={`/stocks/${ticker}`} className="text-text-secondary hover:text-accent-blue flex items-center gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            กลับไปหน้าหุ้น {ticker}
                        </Link>
                    </nav>

                    <Card className="text-center py-16 border-3 border-black shadow-brutal-md">
                        <CardContent>
                            <div className="text-6xl mb-6">🕵️‍♂️</div>
                            <h1 className="text-3xl font-bold font-display mb-4">
                                กำลังเจาะลึกข้อมูล {stock.name}
                            </h1>
                            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                                ทีมงาน AI ของเรากำลังรวบรวมข้อมูลเชิงลึก 10 มิติสำหรับหุ้นตัวนี้อยู่
                                โปรดกลับมาติดตามใหม่อีกครั้งเร็วๆ นี้
                            </p>
                            <Link href={`/stocks/${ticker}`}>
                                <Button variant="primary" size="lg" className="border-2 border-black">
                                    กลับไปดูข้อมูลพื้นฐาน
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const isPositive = stock.changePercent >= 0;
    const verdictColors = {
        bullish: "bg-green-100 border-green-500 text-green-800",
        neutral: "bg-yellow-100 border-yellow-500 text-yellow-800",
        bearish: "bg-red-100 border-red-500 text-red-800",
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm flex-wrap">
                    <Link href="/" className="text-text-secondary hover:text-accent-blue">
                        หน้าแรก
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <Link href="/stocks" className="text-text-secondary hover:text-accent-blue">
                        หุ้น
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <Link href={`/stocks/${ticker}`} className="text-text-secondary hover:text-accent-blue">
                        {ticker}
                    </Link>
                    <span className="text-text-secondary">&gt;</span>
                    <span className="font-semibold">Deep Dive</span>
                </nav>

                {/* Back Button */}
                <Link href={`/stocks/${ticker}`} className="inline-block mb-6">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับไปหน้าหลัก {ticker}
                    </Button>
                </Link>

                {/* Header */}
                <Card className="mb-8 bg-gradient-to-r from-accent-purple/10 to-accent-blue/10">
                    <CardContent className="p-6">
                        <Badge variant="info" className="mb-4">
                            🔬 Deep Dive Analysis
                        </Badge>
                        <h1 className="text-3xl font-bold font-display mb-2">
                            {deepDive.title}
                        </h1>
                        <p className="text-lg text-text-secondary mb-4">
                            {deepDive.subtitle}
                        </p>

                        {/* Price Info */}
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="text-2xl font-bold">
                                {formatCurrency(stock.price)}
                            </span>
                            <span className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 text-sm font-bold border-2 border-black",
                                isPositive ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
                            )}>
                                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                            </span>
                            <span className="text-sm text-text-secondary">
                                อัปเดต: {deepDive.updatedAt}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="mb-8">
                    <CardContent className="p-4">
                        <h3 className="font-bold mb-3">📑 สารบัญ</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {deepDive.sections.map((section, i) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="text-sm text-text-secondary hover:text-accent-blue hover:underline"
                                >
                                    {i + 1}. {section.title}
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sections */}
                {deepDive.sections.map((section, index) => (
                    <Card key={section.id} id={section.id} className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-black text-white px-3 py-1 text-sm font-bold">
                                    {index + 1}
                                </span>
                                <h2 className="text-xl font-bold font-display">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="prose max-w-none">
                                {renderContent(section.content)}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Verdict Card */}
                <Card className={cn("mb-8 border-l-4", verdictColors[deepDive.verdict.rating])}>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            สรุปมุมมองและกรอบราคา
                        </h2>
                        <p className="text-text-secondary mb-4">{deepDive.verdict.summary}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-50 border-2 border-green-500 p-4 rounded">
                                <div className="text-sm text-green-700 font-bold mb-1">
                                    🎯 โซนสะสมเชิงโครงสร้าง
                                </div>
                                <div className="text-lg font-bold text-green-800">
                                    {deepDive.verdict.buyZone}
                                </div>
                            </div>
                            <div className="bg-red-50 border-2 border-red-500 p-4 rounded">
                                <div className="text-sm text-red-700 font-bold mb-1">
                                    ⚠️ โซนต้องระวัง Valuation
                                </div>
                                <div className="text-lg font-bold text-red-800">
                                    {deepDive.verdict.cautionZone}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Disclaimer */}
                <Card className="bg-yellow-50 border-yellow-400">
                    <CardContent className="p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ คำเตือน:</strong> บทวิเคราะห์นี้จัดทำขึ้นเพื่อการศึกษาเท่านั้น ไม่ถือเป็นคำแนะนำในการลงทุน
                            การตัดสินใจลงทุนควรพิจารณาจากหลายปัจจัยและความเสี่ยงที่ยอมรับได้ของแต่ละบุคคล
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
