/**
 * Apply Batch Analyses to Stock Data
 * Updates sp500.json, nasdaq100.json, dow-jones.json, and top-etfs.json with new analyses
 */

const fs = require('fs');
const path = require('path');

// Load all batch analyses
let batchAnalyses = {};
try {
    Object.assign(batchAnalyses, require('./batch1-analyses.js'));
    console.log('Loaded batch1 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch2-analyses.js'));
    console.log('Loaded batch2 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch3-analyses.js'));
    console.log('Loaded batch3 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch4-analyses.js'));
    console.log('Loaded batch4 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch5-analyses.js'));
    console.log('Loaded batch5 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch6-analyses.js'));
    console.log('Loaded batch6 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch7-analyses.js'));
    console.log('Loaded batch7 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch8-analyses.js'));
    console.log('Loaded batch8 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch9-analyses.js'));
    console.log('Loaded batch9 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./batch10-analyses.js'));
    console.log('Loaded batch10 analyses');
} catch (e) { }

// Load ETF analyses
try {
    Object.assign(batchAnalyses, require('./etf-batch1-analyses.js'));
    console.log('Loaded etf-batch1 analyses');
} catch (e) { }
try {
    Object.assign(batchAnalyses, require('./etf-batch2-analyses.js'));
    console.log('Loaded etf-batch2 analyses');
} catch (e) { }

// Load existing data
const sp500Path = path.join(__dirname, '../data/sp500.json');
const nasdaq100Path = path.join(__dirname, '../data/nasdaq100.json');
const dowJonesPath = path.join(__dirname, '../data/dow-jones.json');
const etfPath = path.join(__dirname, '../data/top-etfs.json');
const progressPath = path.join(__dirname, '../data/analysis-progress.json');

let sp500 = require(sp500Path);
let nasdaq100 = require(nasdaq100Path);
let dowJones = require(dowJonesPath);
let etf = require(etfPath);
let progress = require(progressPath);

let updatedCount = 0;
console.log('Keys in batchAnalyses:', Object.keys(batchAnalyses).length, 'keys');
console.log('Check UNH:', !!batchAnalyses['UNH']);
console.log('Check CMCSA:', !!batchAnalyses['CMCSA']);
console.log('Check ADBE:', !!batchAnalyses['ADBE']);
console.log('Check ANET:', !!batchAnalyses['ANET']);

// Update S&P 500
sp500 = sp500.map(stock => {
    if (batchAnalyses[stock.ticker]) {
        console.log(`✅ Updated ${stock.ticker}`);
        updatedCount++;
        return { ...stock, analysisTh: batchAnalyses[stock.ticker].analysisTh };
    }
    return stock;
});

// Update NASDAQ 100
nasdaq100 = nasdaq100.map(stock => {
    if (batchAnalyses[stock.ticker]) {
        console.log(`✅ Updated ${stock.ticker}`);
        updatedCount++;
        return { ...stock, analysisTh: batchAnalyses[stock.ticker].analysisTh };
    }
    return stock;
});

// Update Dow Jones
dowJones = dowJones.map(stock => {
    if (batchAnalyses[stock.ticker]) {
        console.log(`✅ Updated ${stock.ticker} (DJIA)`);
        updatedCount++;
        return { ...stock, analysisTh: batchAnalyses[stock.ticker].analysisTh };
    }
    return stock;
});

// Update ETFs
etf = etf.map(stock => {
    if (batchAnalyses[stock.ticker]) {
        console.log(`✅ Updated ${stock.ticker}`);
        updatedCount++;
        return { ...stock, analysisTh: batchAnalyses[stock.ticker].analysisTh };
    }
    return stock;
});

// Save updated files
fs.writeFileSync(sp500Path, JSON.stringify(sp500, null, 2));
fs.writeFileSync(nasdaq100Path, JSON.stringify(nasdaq100, null, 2));
fs.writeFileSync(dowJonesPath, JSON.stringify(dowJones, null, 2));
fs.writeFileSync(etfPath, JSON.stringify(etf, null, 2));

// Update progress tracker
const newlyCompleted = Object.keys(batchAnalyses);
progress.completedTickers = [...new Set([...progress.completedTickers, ...newlyCompleted])];
progress.lastUpdated = new Date().toISOString();

// Update batch status
if (progress.batches && progress.batches[0]) {
    progress.batches[0].status = 'completed';
    progress.batches[0].completedAt = new Date().toISOString();
}

fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updatedCount} stocks`);
console.log(`   Total completed: ${progress.completedTickers.length}`);
console.log(`   Remaining: ${700 - progress.completedTickers.length}`);
