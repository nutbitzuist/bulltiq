"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
    symbol: string;
    theme?: "light" | "dark";
    width?: string | number;
    height?: number;
}

function TradingViewWidgetComponent({
    symbol,
    theme = "light",
    width = "100%",
    height = 500,
}: TradingViewWidgetProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentContainer = container.current;
        if (!currentContainer) return;

        // Clear previous widget
        currentContainer.innerHTML = "";

        const script = document.createElement("script");
        script.src =
            "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: "D",
            timezone: "Asia/Bangkok",
            theme: theme,
            style: "1",
            locale: "th_TH",
            enable_publishing: false,
            allow_symbol_change: true,
            calendar: false,
            support_host: "https://www.tradingview.com",
        });

        currentContainer.appendChild(script);

        return () => {
            if (currentContainer) {
                currentContainer.innerHTML = "";
            }
        };
    }, [symbol, theme]);

    return (
        <div
            className="tradingview-widget-container border-3 border-black shadow-brutal-md overflow-hidden"
            style={{ height, width }}
        >
            <div
                ref={container}
                className="tradingview-widget-container__widget"
                style={{ height: "calc(100% - 32px)", width: "100%" }}
            />
            <div className="tradingview-widget-copyright bg-white px-2 py-1 text-xs text-text-secondary border-t-2 border-black">
                <a
                    href="https://www.tradingview.com/"
                    rel="noopener nofollow"
                    target="_blank"
                    className="hover:text-accent-blue"
                >
                    Track all markets on TradingView
                </a>
            </div>
        </div>
    );
}

export const TradingViewWidget = memo(TradingViewWidgetComponent);
