/**
 * Massive API Client for Stock Data
 * API Key: c1O7pWoTtpT3zaLcTM1b3nie8R_zUmxp
 * 
 * Documentation: https://docs.massive.com
 */

const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY || 'c1O7pWoTtpT3zaLcTM1b3nie8R_zUmxp';
const MASSIVE_BASE_URL = 'https://api.massive.com/v1';

interface MassiveStockQuote {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    high52w: number;
    low52w: number;
    pe: number;
    eps: number;
    dividendYield: number;
    beta: number;
    sector: string;
    industry: string;
}

interface MassiveApiResponse<T> {
    data: T;
    status: string;
    message?: string;
}

/**
 * Simple in-memory cache with TTL
 */
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
 * Make authenticated request to Massive API
 */
async function massiveRequest<T>(endpoint: string): Promise<T | null> {
    try {
        const response = await fetch(`${MASSIVE_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${MASSIVE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Massive API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const result = await response.json() as MassiveApiResponse<T>;
        return result.data;
    } catch (error) {
        console.error('Massive API request failed:', error);
        return null;
    }
}

/**
 * Get snapshot for a single stock
 */
export async function getStockSnapshot(ticker: string): Promise<MassiveStockQuote | null> {
    const cacheKey = `stock:${ticker}`;
    const cached = getCached<MassiveStockQuote>(cacheKey);
    if (cached) return cached;

    const data = await massiveRequest<MassiveStockQuote>(`/stocks/${ticker}/snapshot`);
    if (data) {
        setCache(cacheKey, data, 60000); // 1 minute cache
    }
    return data;
}

/**
 * Get snapshots for multiple stocks
 */
export async function getMultipleSnapshots(tickers: string[]): Promise<MassiveStockQuote[]> {
    const cacheKey = `stocks:${tickers.sort().join(',')}`;
    const cached = getCached<MassiveStockQuote[]>(cacheKey);
    if (cached) return cached;

    const tickerParam = tickers.join(',');
    const data = await massiveRequest<MassiveStockQuote[]>(`/stocks/snapshots?tickers=${tickerParam}`);

    if (data) {
        setCache(cacheKey, data, 60000); // 1 minute cache
    }
    return data || [];
}

/**
 * Get S&P 500 constituents
 */
export async function getSP500Constituents(): Promise<string[]> {
    const cacheKey = 'sp500:constituents';
    const cached = getCached<string[]>(cacheKey);
    if (cached) return cached;

    const data = await massiveRequest<{ tickers: string[] }>('/indices/sp500/constituents');

    if (data?.tickers) {
        setCache(cacheKey, data.tickers, 86400000); // 24 hour cache
        return data.tickers;
    }

    // Fallback to hardcoded list if API fails
    return SP500_TICKERS;
}

/**
 * Get NASDAQ 100 constituents
 */
export async function getNasdaq100Constituents(): Promise<string[]> {
    const cacheKey = 'nasdaq100:constituents';
    const cached = getCached<string[]>(cacheKey);
    if (cached) return cached;

    const data = await massiveRequest<{ tickers: string[] }>('/indices/nasdaq100/constituents');

    if (data?.tickers) {
        setCache(cacheKey, data.tickers, 86400000); // 24 hour cache
        return data.tickers;
    }

    // Fallback to hardcoded list if API fails
    return NASDAQ100_TICKERS;
}

/**
 * Get fundamentals for a stock
 */
export async function getStockFundamentals(ticker: string): Promise<Record<string, unknown> | null> {
    const cacheKey = `fundamentals:${ticker}`;
    const cached = getCached<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const data = await massiveRequest<Record<string, unknown>>(`/stocks/${ticker}/fundamentals`);

    if (data) {
        setCache(cacheKey, data, 3600000); // 1 hour cache
    }
    return data;
}

// Hardcoded S&P 500 tickers (top 100 by market cap) as fallback
const SP500_TICKERS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'UNH', 'XOM',
    'JNJ', 'V', 'JPM', 'PG', 'MA', 'HD', 'CVX', 'ABBV', 'MRK', 'LLY',
    'AVGO', 'PEP', 'KO', 'COST', 'TMO', 'ADBE', 'WMT', 'MCD', 'CSCO', 'ACN',
    'ABT', 'VZ', 'CRM', 'DHR', 'NKE', 'CMCSA', 'TXN', 'NFLX', 'PM', 'NEE',
    'INTC', 'AMD', 'QCOM', 'UNP', 'RTX', 'HON', 'LOW', 'BMY', 'UPS', 'ORCL',
    'AMGN', 'IBM', 'CAT', 'LIN', 'SPGI', 'GS', 'BA', 'SBUX', 'BLK', 'MS',
    'DE', 'ELV', 'PLD', 'MDT', 'ADP', 'INTU', 'GILD', 'AMT', 'SYK', 'CVS',
    'MDLZ', 'AXP', 'CI', 'ISRG', 'ADI', 'BKNG', 'TJX', 'MMC', 'CB', 'PGR',
    'VRTX', 'REGN', 'CME', 'SCHW', 'PYPL', 'DUK', 'SO', 'MO', 'CL', 'ZTS',
    'SLB', 'EOG', 'PNC', 'USB', 'TGT', 'BDX', 'AON', 'NOC', 'COP', 'ITW'
];

// Hardcoded NASDAQ 100 tickers as fallback
const NASDAQ100_TICKERS = [
    'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'COST',
    'ADBE', 'AMD', 'NFLX', 'PEP', 'INTC', 'CSCO', 'CMCSA', 'TMUS', 'TXN', 'QCOM',
    'AMGN', 'INTU', 'ISRG', 'SBUX', 'HON', 'MDLZ', 'GILD', 'ADP', 'VRTX', 'REGN',
    'ADI', 'BKNG', 'PYPL', 'LRCX', 'KLAC', 'MU', 'SNPS', 'CDNS', 'MELI', 'PANW',
    'MAR', 'ORLY', 'MNST', 'AEP', 'CTAS', 'FTNT', 'KDP', 'MRVL', 'ABNB', 'LULU',
    'ADSK', 'KHC', 'PAYX', 'DXCM', 'CPRT', 'CHTR', 'WDAY', 'MRNA', 'BIIB', 'EXC',
    'AZN', 'XEL', 'ODFL', 'CSX', 'PCAR', 'ROST', 'IDXX', 'DLTR', 'FAST', 'CSGP',
    'EA', 'CRWD', 'CTSH', 'VRSK', 'CEG', 'BKR', 'WBD', 'TEAM', 'DDOG', 'ILMN',
    'ANSS', 'FANG', 'ZS', 'ZM', 'ENPH', 'SIRI', 'LCID', 'RIVN', 'JD', 'PDD',
    'ALGN', 'GEHC', 'ON', 'GFS', 'TTWO', 'SPLK', 'CDW', 'WBA', 'EBAY', 'NXPI'
];

export { SP500_TICKERS, NASDAQ100_TICKERS };
