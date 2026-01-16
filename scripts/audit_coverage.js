const path = require('path');
const fs = require('fs');
const scriptsDir = __dirname;

// Load master lists
let sp500 = [], nasdaq = [], etfs = [];

try {
    const sp500Gen = require(path.join(scriptsDir, 'generate-stocks.js'));
    sp500 = sp500Gen.SP500_STOCKS || [];
} catch (e) { console.log('SP500 list error:', e.message); }

try {
    const nasdaqGen = require(path.join(scriptsDir, 'generate-nasdaq.js'));
    nasdaq = nasdaqGen.NASDAQ_100 || [];
} catch (e) { console.log('NASDAQ list error:', e.message); }

try {
    const etfGen = require(path.join(scriptsDir, 'generate-etfs.js'));
    etfs = etfGen.TOP_ETFS || [];
} catch (e) { console.log('ETF list error:', e.message); }

console.log('=== MASTER LIST COUNTS ===');
console.log('S&P 500:', sp500.length);
console.log('NASDAQ 100:', nasdaq.length);
console.log('ETFs:', etfs.length);

// Load all batch files
let stockAnalyses = new Set();
let etfAnalyses = new Set();

const batchFiles = fs.readdirSync(scriptsDir).filter(f =>
    (f.includes('batch') && f.endsWith('-analyses.js')) || f === 'top-stocks.json' || f === 'top-etfs.json'
);

console.log('\n=== BATCH FILES FOUND ===');
batchFiles.forEach(f => console.log(f));

batchFiles.forEach(f => {
    try {
        const filePath = path.join(scriptsDir, f);
        if (f.endsWith('.json')) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            data.forEach(item => {
                if (item.analysisTh && item.analysisTh.length > 100) {
                    if (f.includes('etf')) etfAnalyses.add(item.ticker);
                    else stockAnalyses.add(item.ticker);
                }
            });
        } else {
            const mod = require(filePath);
            Object.keys(mod).forEach(ticker => {
                if (mod[ticker].analysisTh && mod[ticker].analysisTh.length > 100) {
                    if (f.includes('etf')) etfAnalyses.add(ticker);
                    else stockAnalyses.add(ticker);
                }
            });
        }
    } catch (e) { console.log('Error loading', f, e.message); }
});

console.log('\n=== ANALYSES FOUND ===');
console.log('Stock analyses:', stockAnalyses.size);
console.log('ETF analyses:', etfAnalyses.size);

// Find missing
const sp500Tickers = sp500.map(s => s.ticker || s);
const nasdaqTickers = nasdaq.map(s => s.ticker || s);
const etfTickers = etfs.map(s => s.ticker || s);

const missingSP500 = sp500Tickers.filter(t => !stockAnalyses.has(t));
const missingNasdaq = nasdaqTickers.filter(t => !stockAnalyses.has(t));
const missingETFs = etfTickers.filter(t => !etfAnalyses.has(t));

console.log('\n=== MISSING ANALYSES ===');
console.log('Missing S&P 500:', missingSP500.length);
if (missingSP500.length > 0) console.log('  First 30:', missingSP500.slice(0, 30).join(', '));

console.log('Missing NASDAQ:', missingNasdaq.length);
if (missingNasdaq.length > 0) console.log('  First 30:', missingNasdaq.slice(0, 30).join(', '));

console.log('Missing ETFs:', missingETFs.length);
if (missingETFs.length > 0) console.log('  All:', missingETFs.join(', '));

// Show overlap
const overlap = nasdaqTickers.filter(t => sp500Tickers.includes(t));
console.log('\n=== OVERLAP (NASDAQ in S&P 500) ===');
console.log('Count:', overlap.length);
