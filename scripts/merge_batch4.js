const fs = require('fs');
const path = require('path');

const part1Path = path.join(__dirname, 'etf-batch4-analyses.js');
const part2Path = path.join(__dirname, 'etf-batch4-part2.js');

try {
    const part1 = require(part1Path);
    const part2 = require(part2Path);

    const merged = { ...part1, ...part2 };
    const count = Object.keys(merged).length;

    console.log(`Merging ${Object.keys(part1).length} + ${Object.keys(part2).length} = ${count} items.`);

    const content = `module.exports = ${JSON.stringify(merged, null, 4)};`;

    // Write back to main file
    fs.writeFileSync(part1Path, content, 'utf8');
    console.log(`Successfully merged into ${part1Path}`);

    // Delete part 2
    fs.unlinkSync(part2Path);
    console.log(`Deleted temporary file ${part2Path}`);

} catch (error) {
    console.error('Error merging files:', error);
}
