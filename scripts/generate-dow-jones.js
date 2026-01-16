/**
 * Dow Jones Industrial Average (DJIA) - 30 Stocks
 * The oldest and most well-known stock market index
 */

const fs = require('fs');

// Dow Jones 30 Constituents (as of 2026)
const DJIA_STOCKS = [
    { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { ticker: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'AXP', name: 'American Express Co.', sector: 'Financials' },
    { ticker: 'BA', name: 'Boeing Company', sector: 'Industrials' },
    { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials' },
    { ticker: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { ticker: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology' },
    { ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy' },
    { ticker: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services' },
    { ticker: 'GS', name: 'Goldman Sachs Group Inc.', sector: 'Financials' },
    { ticker: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'HON', name: 'Honeywell International Inc.', sector: 'Industrials' },
    { ticker: 'IBM', name: 'IBM Corporation', sector: 'Technology' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
    { ticker: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples' },
    { ticker: 'MCD', name: "McDonald's Corporation", sector: 'Consumer Discretionary' },
    { ticker: 'MMM', name: '3M Company', sector: 'Industrials' },
    { ticker: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare' },
    { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { ticker: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { ticker: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
    { ticker: 'SHW', name: 'Sherwin-Williams Company', sector: 'Materials' },
    { ticker: 'TRV', name: 'Travelers Companies Inc.', sector: 'Financials' },
    { ticker: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
    { ticker: 'V', name: 'Visa Inc.', sector: 'Financials' },
    { ticker: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services' },
    { ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' }
];

// Generate price data
function generatePriceData(ticker, index) {
    const hash = ticker.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const basePrice = (hash % 350) + 80 + Math.random() * 100;
    const change = (Math.random() - 0.5) * basePrice * 0.03;

    // DJIA stocks are large cap, so higher market caps
    const marketCap = (200 + Math.random() * 500 + (30 - index) * 30) * 1e9;

    return {
        price: Math.round(basePrice * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round((change / basePrice) * 10000) / 100,
        marketCap: Math.round(marketCap),
        volume: Math.round(Math.random() * 25000000 + 5000000),
        high52w: Math.round(basePrice * 1.25 * 100) / 100,
        low52w: Math.round(basePrice * 0.75 * 100) / 100,
        pe: Math.round((18 + Math.random() * 25) * 100) / 100,
        eps: Math.round((basePrice / (22 + Math.random() * 15)) * 100) / 100,
        dividendYield: Math.round((1 + Math.random() * 3) * 100) / 100,
        beta: Math.round((0.8 + Math.random() * 0.5) * 100) / 100
    };
}

// Load existing analyses
let existingAnalyses = {};
try {
    const sp500 = require('../data/sp500.json');
    sp500.forEach(s => {
        if (s.analysisTh && s.analysisTh.length > 300) {
            existingAnalyses[s.ticker] = s.analysisTh;
        }
    });
} catch (e) { }

try {
    const batchAnalyses = require('./batch1-analyses.js');
    Object.assign(existingAnalyses, batchAnalyses);
} catch (e) { }

console.log('Generating Dow Jones data...');
const djiaData = DJIA_STOCKS.map((stock, index) => {
    const priceData = generatePriceData(stock.ticker, index);

    return {
        ticker: stock.ticker,
        name: stock.name,
        nameTh: stock.name,
        ...priceData,
        sector: stock.sector,
        industry: stock.sector,
        description: `${stock.name} เป็นหนึ่งใน 30 หุ้นในดัชนี Dow Jones Industrial Average`,
        analysisTh: existingAnalyses[stock.ticker] || `บทวิเคราะห์สำหรับ ${stock.name} (${stock.ticker}) กำลังอยู่ระหว่างการจัดทำ กรุณากลับมาเยี่ยมชมอีกครั้ง`
    };
});

fs.writeFileSync('./data/dow-jones.json', JSON.stringify(djiaData, null, 2));
console.log(`✅ Dow Jones: ${djiaData.length} stocks written`);

module.exports = { DJIA_STOCKS };
