const fs = require('fs');
const path = require('path');

const filePath = '/Users/nut/Downloads/Bulltiq/scripts/batch23-analyses.js';
let content = fs.readFileSync(filePath, 'utf8');

// Debug: count occurrences
const startMatches = content.match(/"analysisTh":\s*"/g);
console.log(`Found ${startMatches ? startMatches.length : 0} start quotes`);

// We want to replace "analysisTh": " with "analysisTh": `
// And replace the final " at the end of the analysis with `
// The structure is:
// "TICKER": {
//     "ticker": "TICKER",
//     "analysisTh": "CONTENT
// ...
// CONTENT"
// },

// Split by ticker blocks
const parts = content.split(/("\w+":\s*{)/);
let newContent = '';

for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (part.includes('"analysisTh": "')) {
        // Find the "analysisTh": "
        const startIdx = part.indexOf('"analysisTh": "');
        const contentStart = startIdx + '"analysisTh": "'.length;

        // Find the closing " before the last },
        const endIdx = part.lastIndexOf('"');

        if (startIdx !== -1 && endIdx !== -1 && endIdx > contentStart) {
            const before = part.substring(0, startIdx);
            const body = part.substring(contentStart, endIdx);
            const after = part.substring(endIdx + 1);

            part = before + '"analysisTh": `' + body + '`' + after;
        }
    }
    newContent += part;
}

fs.writeFileSync(filePath, newContent);
console.log('Finished fixing batch23-analyses.js');
