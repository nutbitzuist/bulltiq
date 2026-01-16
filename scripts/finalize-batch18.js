const fs = require('fs');

try {
    let p1 = fs.readFileSync('scripts/batch18-analyses.js', 'utf8').trim(); // Part 1
    let p2 = fs.readFileSync('scripts/temp_batch18_part2.js', 'utf8').trim();
    let p3 = fs.readFileSync('scripts/temp_batch18_part3.js', 'utf8').trim();
    let p4 = fs.readFileSync('scripts/temp_batch18_part4.js', 'utf8').trim();

    // Fix P1: Remove trailing "};" if present
    if (p1.endsWith('};')) {
        p1 = p1.substring(0, p1.length - 2);
    } else if (p1.endsWith('}')) {
        // If it ends with just }, it might be the closing brace of the last object or the module.
        // Assuming specific format from write_to_file, we should be careful.
        // In Part 1, we wrote "module.exports = { ... };"
        // So stripping last 2 chars is correct.
        p1 = p1.substring(0, p1.length - 2);
    }

    // Ensure comma
    if (!p1.trim().endsWith(',')) p1 += ',';

    // P2, P3, P4 are just object contents like "KEY": { ... };
    // But wait, in previous steps I wrote them as "KEY": { ... };
    // The previous concatenation script replaced "};" with ",".
    // Let's use a regex replace strategy to be safe and robust.

    function cleanPart(content) {
        // Remove module.exports if present (only P1)
        content = content.replace('module.exports = {', '');
        // Replace "};" at the end of blocks with ","
        content = content.replace(/};/g, ',');
        return content;
    }

    // Re-read to start fresh with clean logic
    p1 = fs.readFileSync('scripts/batch18-analyses.js', 'utf8');
    p2 = fs.readFileSync('scripts/temp_batch18_part2.js', 'utf8');
    p3 = fs.readFileSync('scripts/temp_batch18_part3.js', 'utf8');
    p4 = fs.readFileSync('scripts/temp_batch18_part4.js', 'utf8');

    let combined = cleanPart(p1) + '\n' + cleanPart(p2) + '\n' + cleanPart(p3) + '\n' + cleanPart(p4);

    // Wrap
    const finalContent = `module.exports = {
${combined}
};`;

    fs.writeFileSync('scripts/batch18-analyses.js', finalContent);
    console.log('Successfully assembled scripts/batch18-analyses.js');

    // Cleanup
    fs.unlinkSync('scripts/temp_batch18_part2.js');
    fs.unlinkSync('scripts/temp_batch18_part3.js');
    fs.unlinkSync('scripts/temp_batch18_part4.js');

} catch (e) {
    console.error('Error assembling file:', e);
    process.exit(1);
}
