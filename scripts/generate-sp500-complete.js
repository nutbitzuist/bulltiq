/**
 * Complete S&P 500 Constituents
 * Source: Wikipedia (January 2026)
 * Total: 503 stocks
 */

const fs = require('fs');

// All 503 S&P 500 tickers from Wikipedia
const SP500_TICKERS = [
    'MMM', 'AOS', 'ABT', 'ABBV', 'ACN', 'ADBE', 'AMD', 'AES', 'AFL', 'A',
    'APD', 'ABNB', 'AKAM', 'ALB', 'ARE', 'ALGN', 'ALLE', 'LNT', 'ALL', 'GOOGL',
    'GOOG', 'MO', 'AMZN', 'AMCR', 'AEE', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK',
    'AMP', 'AME', 'AMGN', 'APH', 'ADI', 'AON', 'APA', 'APO', 'AAPL', 'AMAT',
    'APP', 'APTV', 'ACGL', 'ADM', 'ARES', 'ANET', 'AJG', 'AIZ', 'T', 'ATO',
    'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'AXON', 'BKR', 'BALL', 'BAC', 'BAX',
    'BDX', 'BRK.B', 'BBY', 'TECH', 'BIIB', 'BLK', 'BX', 'XYZ', 'BK', 'BA',
    'BKNG', 'BSX', 'BMY', 'AVGO', 'BR', 'BRO', 'BF.B', 'BLDR', 'BG', 'BXP',
    'CHRW', 'CDNS', 'CPT', 'CPB', 'COF', 'CAH', 'CCL', 'CARR', 'CVNA', 'CAT',
    'CBOE', 'CBRE', 'CDW', 'COR', 'CNC', 'CNP', 'CF', 'CRL', 'SCHW', 'CHTR',
    'CVX', 'CMG', 'CB', 'CHD', 'CI', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG',
    'CLX', 'CME', 'CMS', 'KO', 'CTSH', 'COIN', 'CL', 'CMCSA', 'FIX', 'CAG',
    'COP', 'ED', 'STZ', 'CEG', 'COO', 'CPRT', 'GLW', 'CPAY', 'CTVA', 'CSGP',
    'COST', 'CTRA', 'CRH', 'CRWD', 'CCI', 'CSX', 'CMI', 'CVS', 'DHR', 'DRI',
    'DDOG', 'DVA', 'DAY', 'DECK', 'DE', 'DELL', 'DAL', 'DVN', 'DXCM', 'FANG',
    'DLR', 'DG', 'DLTR', 'D', 'DPZ', 'DASH', 'DOV', 'DOW', 'DHI', 'DTE',
    'DUK', 'DD', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'ELV', 'EME',
    'EMR', 'ETR', 'EOG', 'EPAM', 'EQT', 'EFX', 'EQIX', 'EQR', 'ERIE', 'ESS',
    'EL', 'EG', 'EVRG', 'ES', 'EXC', 'EXE', 'EXPE', 'EXPD', 'EXR', 'XOM',
    'FFIV', 'FDS', 'FICO', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FSLR', 'FE',
    'FISV', 'F', 'FTNT', 'FTV', 'FOXA', 'FOX', 'BEN', 'FCX', 'GRMN', 'IT',
    'GE', 'GEHC', 'GEV', 'GEN', 'GNRC', 'GD', 'GIS', 'GM', 'GPC', 'GILD',
    'GPN', 'GL', 'GDDY', 'GS', 'HAL', 'HIG', 'HAS', 'HCA', 'DOC', 'HSIC',
    'HSY', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HWM', 'HPQ',
    'HUBB', 'HUM', 'HBAN', 'HII', 'IBM', 'IEX', 'IDXX', 'ITW', 'INCY', 'IR',
    'PODD', 'INTC', 'IBKR', 'ICE', 'IFF', 'IP', 'INTU', 'ISRG', 'IVZ', 'INVH',
    'IQV', 'IRM', 'JBHT', 'JBL', 'JKHY', 'J', 'JNJ', 'JCI', 'JPM', 'KVUE',
    'KDP', 'KEY', 'KEYS', 'KMB', 'KIM', 'KMI', 'KKR', 'KLAC', 'KHC', 'KR',
    'LHX', 'LH', 'LRCX', 'LW', 'LVS', 'LDOS', 'LEN', 'LII', 'LLY', 'LIN',
    'LYV', 'LMT', 'L', 'LOW', 'LULU', 'LYB', 'MTB', 'MPC', 'MAR', 'MRSH',
    'MLM', 'MAS', 'MA', 'MTCH', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'META',
    'MET', 'MTD', 'MGM', 'MCHP', 'MU', 'MSFT', 'MAA', 'MRNA', 'MOH', 'TAP',
    'MDLZ', 'MPWR', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MSCI', 'NDAQ', 'NTAP',
    'NFLX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NKE', 'NI', 'NDSN', 'NSC', 'NTRS',
    'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'NVR', 'NXPI', 'ORLY', 'OXY', 'ODFL',
    'OMC', 'ON', 'OKE', 'ORCL', 'OTIS', 'PCAR', 'PKG', 'PLTR', 'PANW', 'PSKY',
    'PH', 'PAYX', 'PAYC', 'PYPL', 'PNR', 'PEP', 'PFE', 'PCG', 'PM', 'PSX',
    'PNW', 'PNC', 'POOL', 'PPG', 'PPL', 'PFG', 'PG', 'PGR', 'PLD', 'PRU',
    'PEG', 'PTC', 'PSA', 'PHM', 'PWR', 'QCOM', 'DGX', 'Q', 'RL', 'RJF',
    'RTX', 'O', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RVTY', 'HOOD', 'ROK',
    'ROL', 'ROP', 'ROST', 'RCL', 'SPGI', 'CRM', 'SNDK', 'SBAC', 'SLB', 'STX',
    'SRE', 'NOW', 'SHW', 'SPG', 'SWKS', 'SJM', 'SW', 'SNA', 'SOLV', 'SO',
    'LUV', 'SWK', 'SBUX', 'STT', 'STLD', 'STE', 'SYK', 'SMCI', 'SYF', 'SNPS',
    'SYY', 'TMUS', 'TROW', 'TTWO', 'TPR', 'TRGP', 'TGT', 'TEL', 'TDY', 'TER',
    'TSLA', 'TXN', 'TPL', 'TXT', 'TMO', 'TJX', 'TKO', 'TTD', 'TSCO', 'TT',
    'TDG', 'TRV', 'TRMB', 'TFC', 'TYL', 'TSN', 'USB', 'UBER', 'UDR', 'ULTA',
    'UNP', 'UAL', 'UPS', 'URI', 'UNH', 'UHS', 'VLO', 'VTR', 'VLTO', 'VRSN',
    'VRSK', 'VZ', 'VRTX', 'VTRS', 'VICI', 'V', 'VST', 'VMC', 'WRB', 'GWW',
    'WAB', 'WMT', 'DIS', 'WBD', 'WM', 'WAT', 'WEC', 'WFC', 'WELL', 'WST',
    'WDC', 'WY', 'WSM', 'WMB', 'WTW', 'WDAY', 'WYNN', 'XEL', 'XYL', 'YUM',
    'ZBRA', 'ZBH', 'ZTS'
];

// Company name mapping (partial - will generate rest)
const COMPANY_NAMES = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc. Class A',
    'GOOG': 'Alphabet Inc. Class C',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'BRK.B': 'Berkshire Hathaway Inc.',
    'UNH': 'UnitedHealth Group Inc.',
    'XOM': 'Exxon Mobil Corporation',
    'JNJ': 'Johnson & Johnson',
    'V': 'Visa Inc.',
    'JPM': 'JPMorgan Chase & Co.',
    'PG': 'Procter & Gamble Co.',
    'MA': 'Mastercard Inc.',
    'HD': 'The Home Depot Inc.',
    'CVX': 'Chevron Corporation',
    'ABBV': 'AbbVie Inc.',
    'MRK': 'Merck & Co. Inc.',
    'LLY': 'Eli Lilly and Company',
    'AVGO': 'Broadcom Inc.',
    'PEP': 'PepsiCo Inc.',
    'KO': 'The Coca-Cola Company',
    'COST': 'Costco Wholesale Corp.',
    'TMO': 'Thermo Fisher Scientific',
    'ADBE': 'Adobe Inc.',
    'WMT': 'Walmart Inc.',
    'MCD': "McDonald's Corporation",
    'CSCO': 'Cisco Systems Inc.',
    'ACN': 'Accenture plc',
    'ABT': 'Abbott Laboratories',
    'VZ': 'Verizon Communications Inc.',
    'CRM': 'Salesforce Inc.',
    'DHR': 'Danaher Corporation',
    'NKE': 'Nike Inc.',
    'CMCSA': 'Comcast Corporation',
    'TXN': 'Texas Instruments Inc.',
    'NFLX': 'Netflix Inc.',
    'PM': 'Philip Morris International',
    'NEE': 'NextEra Energy Inc.',
    'INTC': 'Intel Corporation',
    'AMD': 'Advanced Micro Devices Inc.',
    'QCOM': 'QUALCOMM Inc.',
    'ORCL': 'Oracle Corporation',
    'IBM': 'IBM Corporation',
    'CAT': 'Caterpillar Inc.',
    'GS': 'Goldman Sachs Group Inc.',
    'BA': 'Boeing Company',
    'SBUX': 'Starbucks Corporation',
    'BLK': 'BlackRock Inc.',
    'MS': 'Morgan Stanley',
    'AMGN': 'Amgen Inc.',
    'GE': 'General Electric Co.',
    'DE': 'Deere & Company',
    'HON': 'Honeywell International Inc.',
    'LOW': "Lowe's Companies Inc.",
    'UPS': 'United Parcel Service Inc.',
    'RTX': 'RTX Corporation',
    'LMT': 'Lockheed Martin Corporation',
    'BKNG': 'Booking Holdings Inc.',
    'INTU': 'Intuit Inc.',
    'ISRG': 'Intuitive Surgical Inc.',
    'GILD': 'Gilead Sciences Inc.',
    'AXP': 'American Express Co.',
    'MDLZ': 'Mondelez International Inc.',
    'MMM': '3M Company',
    'DIS': 'The Walt Disney Company',
    'T': 'AT&T Inc.',
    'BAC': 'Bank of America Corp.',
    'C': 'Citigroup Inc.',
    'WFC': 'Wells Fargo & Company',
    'F': 'Ford Motor Company',
    'GM': 'General Motors Company',
    'PYPL': 'PayPal Holdings Inc.',
    'SCHW': 'Charles Schwab Corp.',
    'PNC': 'PNC Financial Services',
    'USB': 'U.S. Bancorp',
    'UBER': 'Uber Technologies Inc.',
    'ABNB': 'Airbnb Inc.',
    'SQ': 'Block Inc.',
    'COIN': 'Coinbase Global Inc.',
    'HOOD': 'Robinhood Markets Inc.',
    'PLTR': 'Palantir Technologies Inc.',
    'SNOW': 'Snowflake Inc.',
    'DDOG': 'Datadog Inc.',
    'CRWD': 'CrowdStrike Holdings Inc.',
    'ZS': 'Zscaler Inc.',
    'PANW': 'Palo Alto Networks Inc.',
    'FTNT': 'Fortinet Inc.',
    'NOW': 'ServiceNow Inc.',
    'WDAY': 'Workday Inc.',
    'SMCI': 'Super Micro Computer Inc.'
};

// Sector mapping
const SECTOR_MAP = {
    'Technology': ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'NVDA', 'AVGO', 'ADBE', 'CSCO', 'ACN', 'CRM', 'TXN', 'INTC', 'AMD', 'QCOM', 'ORCL', 'IBM', 'NOW', 'INTU', 'AMAT', 'ADI', 'KLAC', 'LRCX', 'SNPS', 'CDNS', 'MCHP', 'MU', 'NXPI', 'FTNT', 'PANW', 'CRWD', 'ZS', 'DDOG', 'WDAY', 'SMCI', 'DELL', 'HPQ', 'HPE', 'IT', 'GEN', 'KEYS', 'SWKS', 'MPWR', 'ON', 'ANET', 'FFIV', 'AKAM', 'EPAM', 'CTSH', 'GDDY', 'JKHY', 'CDW', 'BR', 'FIS', 'FISV', 'GPN', 'PYPL', 'APP', 'COIN', 'HOOD', 'PLTR', 'AXON'],
    'Healthcare': ['UNH', 'JNJ', 'LLY', 'ABBV', 'MRK', 'TMO', 'ABT', 'DHR', 'PFE', 'AMGN', 'GILD', 'ISRG', 'MDT', 'SYK', 'BMY', 'VRTX', 'REGN', 'ELV', 'CI', 'HUM', 'CNC', 'MOH', 'CVS', 'MCK', 'CAH', 'COR', 'BSX', 'EW', 'IDXX', 'DXCM', 'PODD', 'HOLX', 'MTD', 'IQV', 'A', 'BDX', 'ZBH', 'BAX', 'BIIB', 'MRNA', 'INCY', 'RVTY', 'TECH', 'GEHC', 'HCA', 'UHS', 'DVA', 'LH', 'DGX', 'HSIC', 'ALGN', 'WST', 'STE', 'RMD', 'COO'],
    'Financials': ['JPM', 'V', 'MA', 'BAC', 'WFC', 'GS', 'MS', 'BLK', 'SCHW', 'AXP', 'C', 'USB', 'PNC', 'TFC', 'BK', 'CME', 'ICE', 'SPGI', 'MCO', 'NDAQ', 'MSCI', 'CB', 'PGR', 'MET', 'PRU', 'AIG', 'AFL', 'ALL', 'TRV', 'HIG', 'CINF', 'L', 'AJG', 'MMC', 'AON', 'BRO', 'WTW', 'GL', 'ACGL', 'RJF', 'HOOD', 'COIN', 'CFG', 'KEY', 'HBAN', 'RF', 'FITB', 'MTB', 'NTRS', 'STT', 'BX', 'KKR', 'APO', 'ARES', 'IBKR', 'SYF', 'DFS', 'COF', 'AMP', 'ERIE', 'WRB', 'AIZ', 'RE'],
    'Consumer Discretionary': ['AMZN', 'TSLA', 'HD', 'MCD', 'NKE', 'LOW', 'SBUX', 'BKNG', 'TJX', 'CMG', 'MAR', 'HLT', 'RCL', 'NCLH', 'CCL', 'LVS', 'WYNN', 'MGM', 'DRI', 'YUM', 'DPZ', 'ORLY', 'AZO', 'ROST', 'ULTA', 'LULU', 'BBY', 'DECK', 'GRMN', 'POOL', 'TPR', 'RL', 'CPRT', 'KMX', 'GPC', 'LKQ', 'APTV', 'LEA', 'F', 'GM', 'CVNA', 'DASH', 'UBER', 'ABNB', 'EBAY', 'ETSY', 'DHI', 'LEN', 'NVR', 'PHM', 'TOL', 'BLDR', 'WSM', 'RH'],
    'Communication Services': ['META', 'GOOGL', 'GOOG', 'NFLX', 'DIS', 'CMCSA', 'VZ', 'T', 'TMUS', 'CHTR', 'EA', 'TTWO', 'WBD', 'PARA', 'FOX', 'FOXA', 'NWS', 'NWSA', 'OMC', 'IPG', 'LYV', 'MTCH', 'Z', 'ZG'],
    'Industrials': ['CAT', 'GE', 'HON', 'UPS', 'RTX', 'BA', 'LMT', 'DE', 'UNP', 'CSX', 'NSC', 'FDX', 'GD', 'NOC', 'HII', 'TDG', 'TXT', 'LHX', 'MMM', 'EMR', 'ITW', 'ETN', 'ROK', 'AME', 'PH', 'CMI', 'PCAR', 'FAST', 'IR', 'SNA', 'SWK', 'TT', 'CARR', 'OTIS', 'DOV', 'IEX', 'NDSN', 'ROP', 'GNRC', 'VRSK', 'CPRT', 'URI', 'CTAS', 'PAYX', 'ADP', 'PAYC', 'RSG', 'WM', 'WCN', 'ODFL', 'JBHT', 'CHRW', 'EXPD', 'XPO', 'FTV', 'J', 'JCI', 'TDY', 'HWM', 'WAB', 'GWW', 'MLM', 'VMC', 'PWR', 'EME', 'FIX', 'DAY', 'HUBB', 'TRMB', 'AXON', 'LDOS'],
    'Consumer Staples': ['PG', 'PEP', 'KO', 'COST', 'WMT', 'PM', 'MO', 'MDLZ', 'CL', 'KMB', 'GIS', 'K', 'CPB', 'SJM', 'HSY', 'HRL', 'MKC', 'CAG', 'TSN', 'KR', 'SYY', 'ADM', 'BG', 'WBA', 'TGT', 'DG', 'DLTR', 'KDP', 'MNST', 'STZ', 'TAP', 'BF.B', 'CLX', 'CHD', 'EL', 'COR', 'KVUE'],
    'Energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'PXD', 'DVN', 'FANG', 'HES', 'HAL', 'BKR', 'KMI', 'WMB', 'OKE', 'TRGP', 'EQT', 'APA', 'CTRA'],
    'Utilities': ['NEE', 'DUK', 'SO', 'D', 'AEP', 'SRE', 'EXC', 'XEL', 'PCG', 'WEC', 'ES', 'ED', 'PEG', 'DTE', 'EIX', 'ETR', 'AEE', 'FE', 'CNP', 'CMS', 'LNT', 'EVRG', 'NI', 'PNW', 'NRG', 'CEG', 'VST', 'AWK', 'ATO'],
    'Real Estate': ['PLD', 'AMT', 'EQIX', 'CCI', 'PSA', 'SPG', 'O', 'DLR', 'WELL', 'VICI', 'EQR', 'AVB', 'ESS', 'MAA', 'VTR', 'ARE', 'UDR', 'EXR', 'REG', 'KIM', 'FRT', 'BXP', 'CPT', 'HST', 'INVH', 'IRM', 'SBAC', 'DOC'],
    'Materials': ['LIN', 'APD', 'SHW', 'ECL', 'FCX', 'NUE', 'NEM', 'DOW', 'DD', 'PPG', 'ALB', 'CTVA', 'CF', 'MOS', 'FMC', 'VMC', 'MLM', 'BALL', 'AVY', 'IP', 'PKG', 'WRK', 'STLD', 'SW', 'CE', 'EMN', 'IFF', 'AMCR', 'SEE']
};

// Create reverse lookup for sectors
function getSector(ticker) {
    for (const [sector, tickers] of Object.entries(SECTOR_MAP)) {
        if (tickers.includes(ticker)) return sector;
    }
    return 'Other';
}

// Generate price data
function generatePriceData(ticker, index) {
    const hash = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const basePrice = (hash % 400) + 30 + Math.random() * 80;
    const change = (Math.random() - 0.5) * basePrice * 0.04;
    const marketCapBase = [3000, 2500, 2000, 1500, 1000, 800, 600, 400, 300, 200, 150, 100, 80, 60, 50, 40, 30, 25, 20, 15];
    const mcIndex = Math.min(Math.floor(index / 25), 19);
    const marketCap = (marketCapBase[mcIndex] + Math.random() * 50) * 1e9;

    return {
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round((change / basePrice) * 10000) / 100,
        marketCap: Math.round(marketCap),
        volume: Math.round(Math.random() * 30000000 + 2000000),
        high52w: Math.round(basePrice * (1.2 + Math.random() * 0.3) * 100) / 100,
        low52w: Math.round(basePrice * (0.6 + Math.random() * 0.2) * 100) / 100,
        pe: Math.round((15 + Math.random() * 40) * 100) / 100,
        eps: Math.round((basePrice / (20 + Math.random() * 20)) * 100) / 100,
        dividendYield: Math.round(Math.random() * 4 * 100) / 100,
        beta: Math.round((0.7 + Math.random() * 0.8) * 100) / 100
    };
}

// Load existing analyses
let existingAnalyses = {};
try {
    const existing = require('../data/sp500.json');
    existing.forEach(s => {
        if (s.analysisTh && s.analysisTh.length > 300) {
            existingAnalyses[s.ticker] = s.analysisTh;
        }
    });
    console.log(`Loaded ${Object.keys(existingAnalyses).length} existing analyses`);
} catch (e) {
    console.log('No existing analyses found');
}

for (let i = 1; i <= 30; i++) {
    try {
        const batch = require(`./batch${i}-analyses.js`);
        // Extract analysis string if it's an object structure
        Object.keys(batch).forEach(ticker => {
            const item = batch[ticker];
            if (typeof item === 'string') {
                existingAnalyses[ticker] = item;
            } else if (item && item.analysisTh) {
                existingAnalyses[ticker] = item.analysisTh;
            }
        });
        console.log(`Added batch ${i} analyses`);
    } catch (e) {
        // Ignore if a batch file doesn't exist yet, but log errors for debugging
        // console.error(`Error loading batch ${i}:`, e.message);
    }
}

// Generate complete S&P 500 data
console.log('Generating complete S&P 500 data...');
const sp500Data = SP500_TICKERS.map((ticker, index) => {
    const priceData = generatePriceData(ticker, index);
    const sector = getSector(ticker);
    const name = COMPANY_NAMES[ticker] || `${ticker} Corporation`;

    return {
        ticker,
        name,
        nameTh: name,
        ...priceData,
        sector,
        industry: sector,
        description: `${name} เป็นบริษัทชั้นนำในกลุ่ม ${sector}`,
        analysisTh: existingAnalyses[ticker] || `บทวิเคราะห์สำหรับ ${name} (${ticker}) กำลังอยู่ระหว่างการจัดทำ กรุณากลับมาเยี่ยมชมอีกครั้ง`
    };
});

fs.writeFileSync('./data/sp500.json', JSON.stringify(sp500Data, null, 2));
console.log(`✅ S&P 500: ${sp500Data.length} stocks written`);

module.exports = { SP500_TICKERS, COMPANY_NAMES, SECTOR_MAP };
