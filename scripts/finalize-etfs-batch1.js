const fs = require('fs');
const path = require('path');

const part1 = require('./etf-batch1-analyses'); // existing part 1
const part2 = require('./temp_etf_part2');
const part3 = require('./temp_etf_part3');
const part4 = require('./temp_etf_part4');

const combined = {
    ...part1,
    ...part2,
    ...part3,
    ...part4
};

const outputPath = path.join(__dirname, 'etf-batch1-analyses.js');
const content = `module.exports = ${JSON.stringify(combined, null, 4)};`;

fs.writeFileSync(outputPath, content);
console.log('Successfully finalized etf-batch1-analyses.js with ' + Object.keys(combined).length + ' ETFs');
