const fs = require('fs');

const filePath = 'scripts/batch17-analyses.js';
let content = fs.readFileSync(filePath, 'utf8');

// Strategy:
// 1. Remove "module.exports = {" at the start
// 2. Remove all "};"
// 3. Trim whitespace
// 4. Wrap everything in "module.exports = { ... };"

// Remove header
content = content.replace('module.exports = {', '');

// Let's replace "};" with ","
content = content.replace(/};/g, ',');

// Now we have a bunch of keys and objects separated by commas.
// Wrap it back.
content = `module.exports = {
${content}
};`;

try {
    fs.writeFileSync(filePath, content);
    console.log('Fix successful!');
} catch (e) {
    console.error('Fix failed:', e.message);
}
