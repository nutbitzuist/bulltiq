const fs = require('fs');
const path = require('path');

const sp500 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sp500.json'), 'utf8'));

const unanalyzed = sp500.filter(stock => {
    return !stock.analysisTh || stock.analysisTh.length < 500; // Assuming deep analysis is long
}).map(s => s.ticker);

console.log("Total unanalyzed (or short analysis):", unanalyzed.length);
console.log("Next 20 candidates:", unanalyzed.slice(0, 20).join(', '));
