const fs = require('fs');
const path = require('path');
const dataDir = '/Users/nut/Downloads/Bulltiq/data';
const scriptsDir = '/Users/nut/Downloads/Bulltiq/scripts';

// Load master lists
const sp500 = JSON.parse(fs.readFileSync(path.join(dataDir, 'sp500.json'), 'utf8'));
const nasdaq = JSON.parse(fs.readFileSync(path.join(dataDir, 'nasdaq100.json'), 'utf8'));
const dow = JSON.parse(fs.readFileSync(path.join(dataDir, 'dow-jones.json'), 'utf8'));

console.log('=== MASTER LIST COUNTS ===');
console.log('S&P 500:', sp500.length);
console.log('NASDAQ 100:', nasdaq.length);
console.log('Dow Jones 30:', dow.length);

// Get unique tickers
const sp500Tickers = new Set(sp500.map(s => s.ticker));
const nasdaqTickers = new Set(nasdaq.map(s => s.ticker));
const dowTickers = new Set(dow.map(s => s.ticker));

// Find overlaps
const nasdaqInSP = [...nasdaqTickers].filter(t => sp500Tickers.has(t));
const dowInSP = [...dowTickers].filter(t => sp500Tickers.has(t));
const nasdaqInDow = [...nasdaqTickers].filter(t => dowTickers.has(t));

console.log('\n=== OVERLAPS ===');
console.log('NASDAQ in S&P 500:', nasdaqInSP.length);
console.log('Dow in S&P 500:', dowInSP.length);
console.log('NASDAQ in Dow:', nasdaqInDow.length);

// Calculate unique total
const allUnique = new Set([...sp500Tickers, ...nasdaqTickers, ...dowTickers]);
console.log('\n=== UNIQUE TOTAL ===');
console.log('Unique stocks across all indices:', allUnique.size);

// Check which stocks have analyses
const batchFiles = fs.readdirSync(scriptsDir).filter(f =>
    f.match(/^batch\d+-analyses\.js$/) || f.match(/^nasdaq-batch\d+-analyses\.js$/)
);

let stocksWithAnalysis = new Set();
batchFiles.forEach(f => {
    try {
        const mod = require(path.join(scriptsDir, f));
        Object.keys(mod).forEach(ticker => {
            if (mod[ticker].analysisTh && mod[ticker].analysisTh.length > 100) {
                stocksWithAnalysis.add(ticker);
            }
        });
    } catch (e) {
        // Try to count manually via regex
        try {
            const content = fs.readFileSync(path.join(scriptsDir, f), 'utf8');
            const matches = content.match(/"([A-Z]{1,5})":\s*\{/g);
            if (matches) {
                matches.forEach(m => {
                    const ticker = m.match(/"([A-Z]{1,5})"/)[1];
                    stocksWithAnalysis.add(ticker);
                });
            }
        } catch (e2) { }
    }
});

console.log('\n=== STOCKS WITH ANALYSIS ===');
console.log('Total stocks with analysis:', stocksWithAnalysis.size);

// Find missing by index
const missingSP500 = [...sp500Tickers].filter(t => !stocksWithAnalysis.has(t));
const missingNasdaq = [...nasdaqTickers].filter(t => !stocksWithAnalysis.has(t));
const missingDow = [...dowTickers].filter(t => !stocksWithAnalysis.has(t));

console.log('\n=== MISSING BY INDEX ===');
console.log('Missing S&P 500:', missingSP500.length);
console.log('Missing NASDAQ 100:', missingNasdaq.length);
console.log('Missing Dow Jones:', missingDow.length);

// Show all missing NASDAQ (should be small)
if (missingNasdaq.length > 0) {
    console.log('\nMissing NASDAQ tickers:', missingNasdaq.join(', '));
}

// Show all missing Dow
if (missingDow.length > 0) {
    console.log('\nMissing Dow tickers:', missingDow.join(', '));
}

// Show first 100 missing S&P 500
if (missingSP500.length > 0) {
    console.log('\nFirst 100 missing S&P 500:', missingSP500.slice(0, 100).join(', '));
}

// List all batch files with counts
console.log('\n=== BATCH FILE BREAKDOWN ===');
batchFiles.forEach(f => {
    try {
        const content = fs.readFileSync(path.join(scriptsDir, f), 'utf8');
        const matches = content.match(/"([A-Z]{1,5})":\s*\{/g);
        console.log(f + ':', matches ? matches.length : 0, 'stocks');
    } catch (e) {
        console.log(f + ': ERROR');
    }
});
