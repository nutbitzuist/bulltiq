// Stock Types
export interface Stock {
    ticker: string;
    name: string;
    nameTh?: string;
    price: number;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    high52w: number;
    low52w: number;
    pe?: number;
    eps?: number;
    dividendYield?: number;
    beta?: number;
    sector: string;
    industry: string;
    description?: string;
    descriptionTh?: string;
    analysisTh?: string;
    logoUrl?: string;
    indexMembership?: ("sp500" | "nasdaq100")[];
}

// ETF Types
export interface ETF {
    ticker: string;
    name: string;
    nameTh?: string;
    price: number;
    change: number;
    changePercent: number;
    aum: number;
    expenseRatio: number;
    category: string;
    description?: string;
    descriptionTh?: string;
    analysisTh?: string;
    volume: number;
    high52w: number;
    low52w: number;
}

// Market Index Types
export interface MarketIndex {
    name: string;
    nameTh: string;
    value: number;
    change: number;
    changePercent: number;
}

// Blog Types
export interface BlogPost {
    id: string;
    slug: string;
    titleTh: string;
    excerptTh: string;
    imageUrl: string;
    category: "education" | "analysis" | "sector" | "market-update";
    publishedAt: string;
    author: string;
}

// Sector Type
export type Sector =
    | "Technology"
    | "Healthcare"
    | "Financials"
    | "Consumer Discretionary"
    | "Communication Services"
    | "Industrials"
    | "Consumer Staples"
    | "Energy"
    | "Utilities"
    | "Real Estate"
    | "Materials";

// Market Cap Range
export type MarketCapRange = "mega" | "large" | "mid" | "small" | "all";

// Sort Options
export type SortField = "ticker" | "name" | "price" | "changePercent" | "marketCap" | "volume";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

// Filter State
export interface FilterState {
    search: string;
    sector: Sector | "all";
    marketCap: MarketCapRange;
}

// Pagination
export interface PaginationState {
    page: number;
    perPage: number;
    total: number;
}
