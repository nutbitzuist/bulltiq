const fs = require('fs');
const path = require('path');

const part1 = require('./temp_nasdaq_part1');
const part2 = require('./temp_nasdaq_part2');
const part3 = require('./temp_nasdaq_part3');

const combined = {
    ...part1,
    ...part2,
    ...part3
};

const outputPath = path.join(__dirname, 'nasdaq-batch1-analyses.js');
const content = `module.exports = ${JSON.stringify(combined, null, 4)};`;

fs.writeFileSync(outputPath, content);
console.log('Successfully created nasdaq-batch1-analyses.js with ' + Object.keys(combined).length + ' stocks');
