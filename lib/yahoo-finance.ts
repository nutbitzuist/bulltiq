/**
 * Yahoo Finance API Client
 * Uses Yahoo Finance public API for real-time stock and index data
 * Data is delayed 15 minutes during market hours
 */

export interface YahooQuote {
    symbol: string;
    shortName: string;
    longName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketVolume: number;
    regularMarketTime: number;
    marketCap?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    trailingPE?: number;
    epsTrailingTwelveMonths?: number;
    dividendYield?: number;
    beta?: number;
}

export interface IndexQuote {
    symbol: string;
    name: string;
    nameTh: string;
    value: number;
    change: number;
    changePercent: number;
}

// Index symbols mapping
const INDEX_SYMBOLS = {
    "^GSPC": { name: "S&P 500", nameTh: "เอสแอนด์พี 500" },
    "^IXIC": { name: "NASDAQ", nameTh: "แนสแดก" },
    "^DJI": { name: "DOW JONES", nameTh: "ดาวโจนส์" },
} as const;

// Cache for API responses
const cache = new Map<string, { data: unknown; expiry: number }>();

function getCached<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
        return cached.data as T;
    }
    cache.delete(key);
    return null;
}

function setCache<T>(key: string, data: T, ttlMs: number = 60000): void {
    cache.set(key, { data, expiry: Date.now() + ttlMs });
}

/**
 * Fetch quotes from Yahoo Finance API
 * Uses the query1 endpoint which is publicly accessible
 */
export async function fetchYahooQuotes(symbols: string[]): Promise<YahooQuote[]> {
    const cacheKey = `yahoo:${symbols.sort().join(",")}`;
    const cached = getCached<YahooQuote[]>(cacheKey);
    if (cached) return cached;

    try {
        const symbolsParam = symbols.join(",");
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            console.error(`Yahoo Finance API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        const quotes = data.quoteResponse?.result || [];

        setCache(cacheKey, quotes, 60000); // 1 minute cache
        return quotes;
    } catch (error) {
        console.error("Yahoo Finance API error:", error);
        return [];
    }
}

/**
 * Fetch index quotes (S&P 500, NASDAQ, Dow Jones)
 */
export async function fetchIndexQuotes(): Promise<IndexQuote[]> {
    const indexSymbols = Object.keys(INDEX_SYMBOLS);
    const quotes = await fetchYahooQuotes(indexSymbols);

    return quotes.map((quote) => {
        const symbolKey = quote.symbol as keyof typeof INDEX_SYMBOLS;
        const indexInfo = INDEX_SYMBOLS[symbolKey] || { name: quote.symbol, nameTh: quote.symbol };

        return {
            symbol: quote.symbol,
            name: indexInfo.name,
            nameTh: indexInfo.nameTh,
            value: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
        };
    });
}

/**
 * Fetch single stock quote
 */
export async function fetchStockQuote(ticker: string): Promise<YahooQuote | null> {
    const quotes = await fetchYahooQuotes([ticker]);
    return quotes[0] || null;
}

/**
 * Fetch multiple stock quotes
 */
export async function fetchMultipleStockQuotes(tickers: string[]): Promise<Map<string, YahooQuote>> {
    // Yahoo has a limit of ~50 symbols per request, so we batch
    const batchSize = 50;
    const results = new Map<string, YahooQuote>();

    for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        const quotes = await fetchYahooQuotes(batch);

        quotes.forEach((quote) => {
            results.set(quote.symbol, quote);
        });
    }

    return results;
}

export { INDEX_SYMBOLS };
