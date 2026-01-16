const fs = require('fs');
const path = require('path');

const part1 = require('./temp_batch28_part1');
const part2 = require('./temp_batch28_part2');
const part3 = require('./temp_batch28_part3');
const part4 = require('./temp_batch28_part4');

const combined = {
    ...part1,
    ...part2,
    ...part3,
    ...part4
};

const outputPath = path.join(__dirname, 'batch28-analyses.js');
const content = `module.exports = ${JSON.stringify(combined, null, 4)};`;

fs.writeFileSync(outputPath, content);
console.log('Successfully created batch28-analyses.js with ' + Object.keys(combined).length + ' stocks');
