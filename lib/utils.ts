import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format number as currency
export function formatCurrency(value: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

// Format number with abbreviation (K, M, B, T)
export function formatNumber(value: number): string {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toFixed(2);
}

// Format market cap
export function formatMarketCap(value: number): string {
    return `$${formatNumber(value)}`;
}

// Format percentage
export function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

// Format volume
export function formatVolume(value: number): string {
    return formatNumber(value);
}

// Get color class based on value (positive/negative)
export function getChangeColorClass(value: number): string {
    if (value > 0) return "text-success";
    if (value < 0) return "text-danger";
    return "text-text-secondary";
}

// Thai sector translations
export const sectorTranslations: Record<string, string> = {
    "Technology": "เทคโนโลยี",
    "Healthcare": "สุขภาพ",
    "Financials": "การเงิน",
    "Consumer Discretionary": "สินค้าไม่จำเป็น",
    "Communication Services": "บริการสื่อสาร",
    "Industrials": "อุตสาหกรรม",
    "Consumer Staples": "สินค้าจำเป็น",
    "Energy": "พลังงาน",
    "Utilities": "สาธารณูปโภค",
    "Real Estate": "อสังหาริมทรัพย์",
    "Materials": "วัตถุดิบ",
};

// Get Thai sector name
export function getSectorTh(sector: string): string {
    return sectorTranslations[sector] || sector;
}

// Date formatting
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
