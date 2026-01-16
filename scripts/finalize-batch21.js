const fs = require('fs');

try {
    const parts = [
        'scripts/batch21-analyses.js',
        'scripts/temp_batch21_part2.js',
        'scripts/temp_batch21_part3.js',
        'scripts/temp_batch21_part4.js'
    ];

    let combinedParts = [];

    function cleanContent(c) {
        c = c.replace(/module\.exports\s*=\s*{/, '');
        c = c.trim();
        if (c.endsWith('};')) c = c.slice(0, -2);
        else if (c.endsWith('}')) c = c.slice(0, -1);
        if (!c.trim().endsWith(',')) c += ',';
        return c;
    }

    parts.forEach(p => {
        let content = fs.readFileSync(p, 'utf8');
        combinedParts.push(cleanContent(content));
    });

    const finalContent = `module.exports = {
${combinedParts.join('\n')}
};`;

    fs.writeFileSync('scripts/batch21-analyses.js', finalContent);
    console.log('Successfully assembled scripts/batch21-analyses.js');

    parts.slice(1).forEach(p => fs.unlinkSync(p));

} catch (e) {
    console.error('Error assembling file:', e);
    process.exit(1);
}
