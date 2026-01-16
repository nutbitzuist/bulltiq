import { Metadata } from "next";
import { StockListClient } from "@/components/stocks/stock-list-client";
import nasdaq100Data from "@/data/nasdaq100.json";
import type { Stock } from "@/types";

export const metadata: Metadata = {
    title: "หุ้น NASDAQ 100 - รายชื่อหุ้นทั้งหมดในดัชนี NASDAQ 100",
    description:
        "ดูข้อมูลหุ้นทั้ง 100 ตัวในดัชนี NASDAQ 100 พร้อมราคาล่าสุด, การเปลี่ยนแปลง, มูลค่าตลาด และบทวิเคราะห์ภาษาไทย",
    keywords: ["NASDAQ 100", "หุ้นอเมริกา", "ดัชนี NASDAQ", "หุ้นเทคโนโลยี", "รายชื่อหุ้น"],
};

export default function Nasdaq100Page() {
    const stocks = nasdaq100Data as Stock[];

    return (
        <StockListClient
            stocks={stocks}
            activeIndex="nasdaq100"
            title="หุ้น NASDAQ 100"
            description="ข้อมูลหุ้นทั้งหมดในดัชนี NASDAQ 100 ซึ่งประกอบด้วยบริษัทเทคโนโลยีและนวัตกรรมชั้นนำ"
        />
    );
}
