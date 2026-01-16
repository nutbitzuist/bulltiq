const fs = require('fs');
const path = require('path');

const filePaths = [
    path.join(__dirname, 'batch8-analyses.js'),
    path.join(__dirname, 'batch9-analyses.js'),
    path.join(__dirname, 'batch10-analyses.js')
];

const TIMESTAMP_FOOTER = 'วิเคราะห์เมื่อ: มกราคม 2026'; // Newlines will be added relative to format

const HEADER_MAPPINGS = {
    'บริษัทนี้คืออะไร ทำอะไร?': 'บริษัทนี้คืออะไร ทำอะไร',
    'โมเดลธุรกิจ': 'โมเดลธุรกิจและการหารายได้',
    'โมเดลธุรกิจและรายได้': 'โมเดลธุรกิจและการหารายได้',
    'จุดเด่นและสิ่งที่น่าสนใจ': 'จุดเด่น',
    'ความเสี่ยงที่ต้องระวัง': 'ความเสี่ยง'
};

function cleanGeneric(text) {
    let cleaned = text;

    // 1. Remove Markdown Bold (**text**)
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');

    // 2. Remove Markdown Headers (## text)
    cleaned = cleaned.replace(/^#{1,3}\s+(.*)$/gm, '$1');

    // 3. Remove Markdown Bullets (- item)
    cleaned = cleaned.replace(/^\s*-\s+/gm, '');

    // 4. Standardize Headers
    for (const [oldHeader, newHeader] of Object.entries(HEADER_MAPPINGS)) {
        const escapedOld = oldHeader.replace('?', '\\?');
        const regex = new RegExp(`^${escapedOld}\\s*$`, 'gm');
        cleaned = cleaned.replace(regex, newHeader);
    }

    // 5. Add Footer if not present
    if (!cleaned.includes('วิเคราะห์เมื่อ: มกราคม 2026')) {
        cleaned = cleaned.trim() + '\n\n' + TIMESTAMP_FOOTER;
    }

    return cleaned;
}

function processFile(filePath) {
    console.log(`Processing ${filePath}...`);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf8');
    let newFileContent = fileContent;
    let changed = false;

    // Strategy: Identify if the file uses backticks or double quotes predominantly for analysisTh
    // But strictly, we should replace any occurrence.

    // 1. Handle double quoted strings: "analysisTh": "..."
    //    Content inside is escaped JSON string ( \n instead of actual newline )
    newFileContent = newFileContent.replace(/"analysisTh":\s*"([^"]*)"/g, (match, p1) => {
        // p1 is the raw string content. newlines are likely represented as characters \ and n.
        // We need to unescape them to process with regex that expects multiline (^ $)
        // Simple unescape: replace \\n with \n
        let unescaped = p1.replace(/\\n/g, '\n');
        let cleaned = cleanGeneric(unescaped);

        if (cleaned !== unescaped) {
            changed = true;
            // Re-escape: replace \n with \\n
            let reescaped = cleaned.replace(/\n/g, '\\n');
            return `"analysisTh": "${reescaped}"`;
        }
        return match;
    });

    // 2. Handle backticked strings: "analysisTh": `...`
    //    Content is literal newlines.
    newFileContent = newFileContent.replace(/"analysisTh":\s*`([^`]*)`/g, (match, p1) => {
        let cleaned = cleanGeneric(p1);
        if (cleaned !== p1) {
            changed = true;
            return `"analysisTh": \`${cleaned}\``;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, newFileContent, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`No changes needed for ${filePath}`);
    }
}

filePaths.forEach(fp => {
    processFile(fp);
});
