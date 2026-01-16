import { Metadata } from "next";
import { StockListClient } from "@/components/stocks/stock-list-client";
import sp500Data from "@/data/sp500.json";
import nasdaq100Data from "@/data/nasdaq100.json";
import dowJonesData from "@/data/dow-jones.json";
import type { Stock } from "@/types";

export const metadata: Metadata = {
    title: "ค้นหาหุ้น - S&P 500, NASDAQ 100, Dow Jones",
    description: "ค้นหาหุ้นในดัชนี S&P 500, NASDAQ 100 และ Dow Jones พร้อมบทวิเคราะห์ภาษาไทย",
};

// Combine all stocks and deduplicate
const allStocksMap = new Map<string, Stock>();
[...sp500Data, ...nasdaq100Data, ...dowJonesData].forEach((stock) => {
    if (!allStocksMap.has(stock.ticker)) {
        allStocksMap.set(stock.ticker, stock as Stock);
    }
});
const allStocks = Array.from(allStocksMap.values());

interface PageProps {
    searchParams: { search?: string };
}

export default function StocksSearchPage({ searchParams }: PageProps) {
    const searchQuery = searchParams.search || "";

    return (
        <StockListClient
            stocks={allStocks}
            activeIndex="all"
            title="ค้นหาหุ้น"
            description="ค้นหาหุ้นในทุกดัชนี พร้อมบทวิเคราะห์ภาษาไทย"
            initialSearch={searchQuery}
        />
    );
}
