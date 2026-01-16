import { Metadata } from "next";
import { ETFListClient } from "@/components/etf/etf-list-client";
import topETFsData from "@/data/top-etfs.json";
import type { ETF } from "@/types";

export const metadata: Metadata = {
    title: "ETF ยอดนิยม - กองทุน ETF ที่นักลงทุนไทยควรรู้จัก",
    description:
        "ดูข้อมูลกองทุน ETF ยอดนิยม เช่น SPY, QQQ, VOO, VTI พร้อมราคาล่าสุด, Expense Ratio, AUM และบทวิเคราะห์ภาษาไทย",
    keywords: ["ETF", "กองทุน ETF", "SPY", "QQQ", "VOO", "VTI", "ลงทุน ETF", "ETF อเมริกา"],
};

export default function ETFPage() {
    const etfs = topETFsData as ETF[];

    return <ETFListClient etfs={etfs} />;
}
