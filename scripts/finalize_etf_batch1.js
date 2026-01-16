const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, 'etf-batch1-analyses.js');
const SOURCE_FILE = path.join(__dirname, 'temp_etf_part4.js');

const TIMESTAMP_FOOTER = 'วิเคราะห์เมื่อ: มกราคม 2026';

function cleanContent(text) {
    let cleaned = text;
    // Remove Markdown formatting
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1'); // bold
    cleaned = cleaned.replace(/^#{1,3}\s+(.*)$/gm, '$1'); // headers
    cleaned = cleaned.replace(/^\s*-\s+/gm, ''); // bullets

    // Ensure footer
    if (!cleaned.includes(TIMESTAMP_FOOTER)) {
        cleaned = cleaned.trim() + '\n\n' + TIMESTAMP_FOOTER;
    }
    return cleaned;
}

// Load existing
let batch1 = {};
if (fs.existsSync(TARGET_FILE)) {
    batch1 = require(TARGET_FILE);
}

// Load drafts
const drafts = require(SOURCE_FILE);
const targets = ['XLK', 'XLE', 'XLV', 'XLI', 'XLY'];

let updatedCount = 0;

targets.forEach(ticker => {
    if (drafts[ticker] && drafts[ticker].analysisTh) {
        let content = drafts[ticker].analysisTh;
        let cleaned = cleanContent(content);

        batch1[ticker] = {
            ticker: ticker,
            analysisTh: cleaned
        };
        updatedCount++;
        console.log(`Processed ${ticker}`);
    } else {
        console.log(`Missing draft for ${ticker}`);
    }
});

if (updatedCount > 0) {
    // Write back
    const fileContent = `module.exports = ${JSON.stringify(batch1, null, 4)};`;
    fs.writeFileSync(TARGET_FILE, fileContent, 'utf8');
    console.log(`Updates saved to ${TARGET_FILE}`);
} else {
    console.log("No updates made.");
}
