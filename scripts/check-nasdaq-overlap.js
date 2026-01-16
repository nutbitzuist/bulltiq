const fs = require('fs');

const sp500 = JSON.parse(fs.readFileSync('data/sp500.json', 'utf8'));
const sp500Map = new Map();
sp500.forEach(s => {
    if (s.analysisTh && s.analysisTh.length > 500) {
        sp500Map.set(s.ticker, s.analysisTh);
    }
});

const NASDAQ100_TICKERS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'COST', 'ADBE',
    'AMD', 'NFLX', 'PEP', 'INTC', 'CSCO', 'CMCSA', 'TMUS', 'TXN', 'QCOM', 'AMGN',
    'INTU', 'ISRG', 'SBUX', 'HON', 'MDLZ', 'GILD', 'ADP', 'VRTX', 'REGN', 'ADI',
    'BKNG', 'LRCX', 'KLAC', 'MU', 'SNPS', 'CDNS', 'MELI', 'PANW', 'MAR', 'ORLY',
    'MNST', 'AEP', 'CTAS', 'FTNT', 'KDP', 'MRVL', 'ABNB', 'LULU', 'ADSK', 'KHC',
    'PAYX', 'DXCM', 'CPRT', 'CHTR', 'WDAY', 'MRNA', 'BIIB', 'EXC', 'AZN', 'XEL',
    'ODFL', 'CSX', 'PCAR', 'ROST', 'IDEXX', 'DLTR', 'FAST', 'CSGP', 'EA', 'CRWD',
    'CTSH', 'VRSK', 'CEG', 'BKR', 'WBD', 'TEAM', 'DDOG', 'ILMN', 'ANSS', 'FANG',
    'ZS', 'ENPH', 'SIRI', 'LCID', 'RIVN', 'JD', 'PDD', 'ALGN', 'GEHC', 'ON',
    'GFS', 'TTWO', 'CDW', 'WBA', 'EBAY', 'NXPI', 'PYPL', 'ZM', 'SPLK', 'OKTA'
];

// Correct 'IDEXX' -> 'IDXX' based on previous file view which had 'IDXX'
// Actually looking at the list in previous step: line 72 is { ticker: 'IDXX', ... }
// My manual copy above used IDEXX? Let's double check. Ah, looking at the file dump:
// 72:     { ticker: 'IDXX', name: 'IDEXX Laboratories', sector: 'Healthcare' },
// so ticket is IDXX.

// Also list has 'SIRI', 'LCID', 'RIVN', 'JD', 'PDD', 'TEAM', 'ZS', 'ENPH' ...
// Let's filter which ones are NOT in sp500Map.

const missing = [];
const found = [];

NASDAQ100_TICKERS.forEach(t => {
    if (t === 'IDEXX') t = 'IDXX'; // Fix potential typo in my manual array if needed
    if (!sp500Map.has(t)) {
        missing.push(t);
    } else {
        found.push(t);
    }
});

console.log(`Total NASDAQ100: ${NASDAQ100_TICKERS.length}`);
console.log(`Found in S&P 500: ${found.length}`);
console.log(`Missing (Needs Analysis): ${missing.length}`);
console.log('Missing Tickers:', missing.join(', '));
