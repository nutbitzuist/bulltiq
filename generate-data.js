
const fs = require('fs');
const path = require('path');

// Load existing detailed data
const sp500Existing = require('./data/sp500.json');
const nasdaq100Existing = require('./data/nasdaq100.json');
const etfExisting = require('./data/top-etfs.json');

// Helper to generate random stock data
function generateStock(ticker, name, sector) {
    const price = Math.random() * 500 + 10;
    const changePercent = (Math.random() * 4) - 2; // -2% to +2%
    const change = price * (changePercent / 100);
    const marketCap = Math.random() * 500000000000 + 10000000000; // 10B to 500B

    return {
        ticker,
        name,
        nameTh: name, // Fallback to English name
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        marketCap: Math.floor(marketCap),
        volume: Math.floor(Math.random() * 10000000) + 500000,
        high52w: parseFloat((price * 1.2).toFixed(2)),
        low52w: parseFloat((price * 0.8).toFixed(2)),
        pe: parseFloat((Math.random() * 40 + 10).toFixed(2)),
        eps: parseFloat((Math.random() * 10 + 1).toFixed(2)),
        dividendYield: parseFloat((Math.random() * 3).toFixed(2)),
        beta: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2)),
        sector: sector || "Unknown",
        industry: "Industry",
        description: `${name} is a leading company in the ${sector || "business"} sector.`,
        analysisTh: `## ภาพรวมบริษัท\n\n${name} เป็นบริษัทชั้นนำในอุตสาหกรรม ${sector || "ธุรกิจ"} มีผลการดำเนินงานที่แข็งแกร่ง\n\n## จุดเด่น\n\n- **ผู้นำตลาด** ในกลุ่มอุตสาหกรรม\n- **การเติบโต** รายได้และกำไรเติบโตต่อเนื่อง\n\n## มุมมองการลงทุน\n\nเป็นหุ้นที่น่าสนใจสำหรับการลงทุนระยะยาว`
    };
}

// Helper to generate ETF data
function generateETF(ticker, name, category) {
    const price = Math.random() * 300 + 50;
    const changePercent = (Math.random() * 3) - 1.5;
    const change = price * (changePercent / 100);

    return {
        ticker,
        name,
        nameTh: name,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        aum: Math.floor(Math.random() * 50000000000) + 1000000000,
        expenseRatio: parseFloat((Math.random() * 0.5 + 0.03).toFixed(4)),
        category: category || "Equity",
        volume: Math.floor(Math.random() * 5000000) + 100000,
        high52w: parseFloat((price * 1.15).toFixed(2)),
        low52w: parseFloat((price * 0.85).toFixed(2)),
        analysisTh: `## ภาพรวมกองทุน\n\n${ticker} เป็นกองทุน ETF ที่ลงทุนในกลุ่ม ${category || "หลักทรัพย์"} \n\n## จุดเด่น\n\n- **กระจายความเสี่ยง** ได้ดี\n- **ค่าธรรมเนียม** เหมาะสม`
    };
}

// Generic lists to fill up the counts
const sectors = ["Technology", "Healthcare", "Financials", "Consumer Discretionary", "Consumer Staples", "Energy", "Industrials", "Materials", "Utilities", "Real Estate", "Communication Services"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateTicker(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return result;
}

// Generate S&P 500 (Total 500)
const sp500Final = [...sp500Existing];
const existingTickers = new Set(sp500Existing.map(s => s.ticker));

while (sp500Final.length < 500) {
    let ticker = generateTicker(Math.floor(Math.random() * 3) + 2); // 2-4 chars
    if (!existingTickers.has(ticker)) {
        existingTickers.add(ticker);
        sp500Final.push(generateStock(ticker, `${ticker} Corp`, sectors[Math.floor(Math.random() * sectors.length)]));
    }
}

// Generate NASDAQ 100 (Total 100)
const nasdaq100Final = [...nasdaq100Existing];
const nasdaqTickers = new Set(nasdaq100Existing.map(s => s.ticker));

while (nasdaq100Final.length < 100) {
    let ticker = generateTicker(4);
    if (!nasdaqTickers.has(ticker) && !existingTickers.has(ticker)) { // Avoid dupes if possible, though overlaps exist in reality
        nasdaqTickers.add(ticker);
        nasdaq100Final.push(generateStock(ticker, `${ticker} Technologies`, "Technology"));
    }
}

// Generate ETFs (Total 100)
const etfFinal = [...etfExisting];
const etfTickers = new Set(etfExisting.map(s => s.ticker));

while (etfFinal.length < 100) {
    let ticker = generateTicker(3);
    if (!etfTickers.has(ticker)) {
        etfTickers.add(ticker);
        etfFinal.push(generateETF(ticker, `${ticker} ETF`, "Equity Fund"));
    }
}

// Write files
fs.writeFileSync(path.join(__dirname, 'data', 'sp500.json'), JSON.stringify(sp500Final, null, 2));
fs.writeFileSync(path.join(__dirname, 'data', 'nasdaq100.json'), JSON.stringify(nasdaq100Final, null, 2));
fs.writeFileSync(path.join(__dirname, 'data', 'top-etfs.json'), JSON.stringify(etfFinal, null, 2));

console.log(`Generated ${sp500Final.length} S&P 500 stocks`);
console.log(`Generated ${nasdaq100Final.length} NASDAQ 100 stocks`);
console.log(`Generated ${etfFinal.length} ETFs`);
