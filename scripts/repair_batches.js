const fs = require('fs');
const path = require('path');

const filePaths = [
    path.join(__dirname, 'batch8-analyses.js'),
    path.join(__dirname, 'batch9-analyses.js'),
    path.join(__dirname, 'batch10-analyses.js')
];

const TIMESTAMP_FOOTER = 'วิเคราะห์เมื่อ: มกราคม 2026';

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

    return cleaned;
}

function processFile(filePath) {
    console.log(`Repairing ${filePath}...`);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf8');
    let newFileContent = fileContent;
    let changed = false;

    // Regex to find the BROKEN pattern:
    // "analysisTh": " ... \n\nวิเคราะห์เมื่อ: มกราคม 2026" ... "
    // We look for the specific footer marking the split.
    // The first part ends with the footer and a quote.
    // The second part follows immediately until a quote followed by a comma, newline, or closing brace (end of value).

    // Note: the original code replaced `\n` with literal newline, did modifications, then put back `\\n`.
    // The broken file has `\n\n` before the footer AS LITERAL CHARACTERS `\` `n` `\` `n` ?
    // Let's check the step 610 output: `... \\n\nวิเคราะห์เมื่อ ...`
    // It has literal backslash n, AND actual newline?
    // `cleanGeneric` added `\n\n` (actual newlines).
    // Then the replace function did: `reescaped = cleaned.replace(/\n/g, '\\n');`
    // So it converted actual newlines to `\\n`.
    // So the file should have `\\n\\nวิเคราะห์เมื่อ...`.
    // Let's verify Step 610 again.
    // Line 4: `...ถูกมองว่าเป็น \\n\nวิเคราะห์เมื่อ...`
    // Wait, `view_file` output renders `\n` as newline.
    // But raw text `\\n` is `\` and `n`.
    // Inspecting snippet: `...เป็น \\n` (newline) `วิเคราะห์เมื่อ...`.
    // This implies there is a mix.

    // To be safe, we search for `วิเคราะห์เมื่อ: มกราคม 2026"` (footer + quote)
    // And we capture everything before it in the value, and everything after it until the end of the value.

    // Regex:
    // "analysisTh":\s*" (Start)
    // ([\s\S]*?) (Group 1: Pre-footer content)
    // (?:\\n)+วิเคราะห์เมื่อ: มกราคม 2026" (The inserted footer and closing quote - loose match on newlines)
    // ([\s\S]*?) (Group 2: The orphan content)
    // "(?=\s*[\},]) (End check: quote followed by comma or closing brace)

    const repairRegex = /"analysisTh":\s*"([\s\S]*?)(?:\\n)*\s*วิเคราะห์เมื่อ: มกราคม 2026"([\s\S]*?)"(?=\s*[\},])/g;

    newFileContent = newFileContent.replace(repairRegex, (match, part1, part2) => {
        changed = true;
        console.log("Found broken segment, repairing...");

        // Reconstruct the full string.
        // part1 ends with the split point. The split point consumed a quote.
        // So we add `"` back.
        // But wait, if part1 ends with `\\`, then adding `"` makes `\\"` (escaped quote). Correct.

        // We concatenate: part1 + "\"" + part2
        let fullContent = part1 + "\"" + part2;

        // Now we need to unescape `\\n` to `\n` to process it properly
        let unescaped = fullContent.replace(/\\n/g, '\n');

        // Clean it
        let cleaned = cleanGeneric(unescaped);

        // Add footer correctly at the END
        if (!cleaned.includes(TIMESTAMP_FOOTER)) {
            cleaned = cleaned.trim() + '\n\n' + TIMESTAMP_FOOTER;
        } else {
            // Ensure it's at the end if it's already there (it might be duplicated if we ran multiple times?)
            // With our regex, we consumed the footer. So `fullContent` shouldn't have it unless part2 had it.
            // But part2 shouldn't.
            // In any case, safe to add.
        }

        // Re-escape newlines and double quotes?
        // Double quotes inside `fullContent` (part1/part2) are already escaped `\"`.
        // EXCEPT the one we just restored `\"`.
        // So valid.
        // Do we need to escape `"` in `cleaned`?
        // `cleanGeneric` doesn't touch quotes.
        // `replace` converts `\n` to `\\n`.

        let reescaped = cleaned.replace(/\n/g, '\\n');

        // Return formatted field
        return `"analysisTh": "${reescaped}"`;
    });

    // ALSO: Use the correct regex to process any UNBROKEN strings (that might have been skipped or need update)
    // This helps if some files weren't broken or had different patterns.
    // Correct regex for JSON strings: /"analysisTh":\s*"((?:[^"\\]|\\.)*)"/g

    let secondaryChange = false;
    newFileContent = newFileContent.replace(/"analysisTh":\s*"((?:[^"\\]|\\.)*)"/g, (match, p1) => {
        // Check if it already has the footer in the right place
        // unescape
        let unescaped = p1.replace(/\\n/g, '\n');

        // If it doesn't have footer, or needs cleaning
        // But we shouldn't double-clean if already done.
        // Check for footer.
        if (!unescaped.includes(TIMESTAMP_FOOTER)) {
            // Process
            let cleaned = cleanGeneric(unescaped);
            if (!cleaned.includes(TIMESTAMP_FOOTER)) {
                cleaned = cleaned.trim() + '\n\n' + TIMESTAMP_FOOTER;
            }
            if (cleaned !== unescaped) {
                secondaryChange = true;
                let reescaped = cleaned.replace(/\n/g, '\\n');
                return `"analysisTh": "${reescaped}"`;
            }
        }
        return match;
    });

    if (changed || secondaryChange) {
        fs.writeFileSync(filePath, newFileContent, 'utf8');
        console.log(`Repaired/Updated ${filePath}`);
    } else {
        console.log(`No repair needed for ${filePath}`);
    }
}

filePaths.forEach(fp => {
    // Run repair
    processFile(fp);
});
