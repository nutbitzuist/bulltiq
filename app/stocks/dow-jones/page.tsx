import { Metadata } from "next";
import { StockListClient } from "@/components/stocks/stock-list-client";
import dowJonesData from "@/data/dow-jones.json";
import type { Stock } from "@/types";

export const metadata: Metadata = {
    title: "หุ้น Dow Jones - รายชื่อหุ้นทั้งหมดในดัชนี Dow Jones Industrial Average",
    description:
        "ดูข้อมูลหุ้นทั้ง 30 ตัวในดัชนี Dow Jones Industrial Average พร้อมราคาล่าสุด, การเปลี่ยนแปลง, มูลค่าตลาด และบทวิเคราะห์ภาษาไทย",
    keywords: ["Dow Jones", "DJIA", "หุ้นอเมริกา", "ดัชนี Dow Jones", "หุ้นสหรัฐ"],
};

export default function DowJonesPage() {
    const stocks = dowJonesData as Stock[];

    return (
        <StockListClient
            stocks={stocks}
            activeIndex="dow-jones"
            title="หุ้น Dow Jones"
            description="ดัชนี Dow Jones Industrial Average ประกอบด้วยบริษัทชั้นนำ 30 แห่งในสหรัฐอเมริกา ซึ่งเป็นดัชนีหุ้นที่เก่าแก่และมีชื่อเสียงที่สุดในโลก"
        />
    );
}
