import { Metadata } from "next";
import { StockListClient } from "@/components/stocks/stock-list-client";
import sp500Data from "@/data/sp500.json";
import type { Stock } from "@/types";

export const metadata: Metadata = {
    title: "หุ้น S&P 500 - รายชื่อหุ้นทั้งหมดในดัชนี S&P 500",
    description:
        "ดูข้อมูลหุ้นทั้ง 500 ตัวในดัชนี S&P 500 พร้อมราคาล่าสุด, การเปลี่ยนแปลง, มูลค่าตลาด และบทวิเคราะห์ภาษาไทย",
    keywords: ["S&P 500", "หุ้นอเมริกา", "ดัชนี S&P 500", "หุ้นสหรัฐ", "รายชื่อหุ้น"],
};

export default function SP500Page() {
    const stocks = sp500Data as Stock[];

    return (
        <StockListClient
            stocks={stocks}
            activeIndex="sp500"
            title="หุ้น S&P 500"
            description="ข้อมูลหุ้นทั้งหมดในดัชนี S&P 500 ซึ่งประกอบด้วยบริษัทที่ใหญ่ที่สุด 500 แห่งในสหรัฐอเมริกา"
        />
    );
}
