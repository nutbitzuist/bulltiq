const fs = require('fs');

const filePath = 'scripts/batch15-analyses.js';
let content = fs.readFileSync(filePath, 'utf8');

// The file likely looks like:
// module.exports = { ... };
// "ETN": { ... };
// ...

// We want:
// module.exports = { ... , "ETN": { ... } ... };

// Strategy:
// 1. Remove "module.exports = {" at the start
// 2. Remove all "};"
// 3. Trim whitespace
// 4. Wrap everything in "module.exports = { ... };"

// Remove header
content = content.replace('module.exports = {', '');

// Remove all closing braces that are followed by semi-colons or just closing the object
// But wait, the inner objects end with "},". 
// The "};" appears at the end of each PART.
// So replacing "};" with "," is a good approximation, but we need to watch out for the last one.

// Let's replace "};" with ","
content = content.replace(/};/g, ',');

// Now we have a bunch of keys and objects separated by commas.
// Wrap it back.
content = `module.exports = {
${content}
};`;

// There might be double commas or trailing commas, but JS tolerates trailing commas.
// However, let's try to load it to verify.

try {
    fs.writeFileSync(filePath, content);
    const check = require('./batch15-analyses.js');
    console.log('Fix successful! Loaded keys:', Object.keys(check).length);
    if (Object.keys(check).length !== 20) {
        console.error('Warning: Expected 20 keys, got ' + Object.keys(check).length);
        // Debug prints
        console.log('Keys found:', Object.keys(check));
    }
} catch (e) {
    console.error('Fix failed, still invalid syntax:', e.message);
}
