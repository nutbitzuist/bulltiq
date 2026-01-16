const fs = require('fs');

try {
    const parts = [
        'scripts/batch20-analyses.js',
        'scripts/temp_batch20_part2.js',
        'scripts/temp_batch20_part3.js',
        'scripts/temp_batch20_part4.js'
    ];

    let combinedParts = [];

    // Helper to clean content
    function cleanContent(c) {
        // Remove module.exports header
        c = c.replace(/module\.exports\s*=\s*{/, '');
        // Remove surrounding newlines/spaces
        c = c.trim();
        // Remove last closing brace set (either "};" or "}")
        if (c.endsWith('};')) c = c.slice(0, -2);
        else if (c.endsWith('}')) c = c.slice(0, -1);
        // Ensure trailing comma for safe joining
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

    fs.writeFileSync('scripts/batch20-analyses.js', finalContent);
    console.log('Successfully assembled scripts/batch20-analyses.js');

    // Cleanup
    parts.slice(1).forEach(p => fs.unlinkSync(p));

} catch (e) {
    console.error('Error assembling file:', e);
    process.exit(1);
}
