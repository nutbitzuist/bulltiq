import { NextResponse } from "next/server";
import { fetchIndexQuotes } from "@/lib/yahoo-finance";

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
    try {
        const indices = await fetchIndexQuotes();

        return NextResponse.json({
            success: true,
            data: indices,
            timestamp: new Date().toISOString(),
            note: "Data is delayed 15 minutes during market hours",
        });
    } catch (error) {
        console.error("Failed to fetch market data:", error);

        // Return fallback data if API fails
        return NextResponse.json({
            success: false,
            data: [
                {
                    symbol: "^GSPC",
                    name: "S&P 500",
                    nameTh: "เอสแอนด์พี 500",
                    value: 0,
                    change: 0,
                    changePercent: 0,
                },
                {
                    symbol: "^IXIC",
                    name: "NASDAQ",
                    nameTh: "แนสแดก",
                    value: 0,
                    change: 0,
                    changePercent: 0,
                },
                {
                    symbol: "^DJI",
                    name: "DOW JONES",
                    nameTh: "ดาวโจนส์",
                    value: 0,
                    change: 0,
                    changePercent: 0,
                },
            ],
            error: "Failed to fetch live data",
            timestamp: new Date().toISOString(),
        });
    }
}
