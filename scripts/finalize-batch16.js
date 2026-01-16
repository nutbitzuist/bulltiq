const fs = require('fs');

try {
    let p1 = fs.readFileSync('scripts/batch16-analyses.js', 'utf8').trim(); // Part 1
    let p2 = fs.readFileSync('scripts/temp_batch16_part2.js', 'utf8').trim();
    let p3 = fs.readFileSync('scripts/temp_batch16_part3.js', 'utf8').trim();
    let p4 = fs.readFileSync('scripts/temp_batch16_part4.js', 'utf8').trim();

    // Ensure p1 ends with comma if it's not the end
    if (p1.endsWith('}')) p1 += ',';
    // Ensure p2 ends with comma
    if (p2.endsWith('}')) p2 += ',';
    // Ensure p3 ends with comma
    if (p3.endsWith('}')) p3 += ',';

    const finalContent = `${p1}\n${p2}\n${p3}\n${p4}`;

    fs.writeFileSync('scripts/batch16-analyses.js', finalContent);
    console.log('Successfully assembled scripts/batch16-analyses.js');

    // Cleanup items (optional, but good practice)
    fs.unlinkSync('scripts/temp_batch16_part2.js');
    fs.unlinkSync('scripts/temp_batch16_part3.js');
    fs.unlinkSync('scripts/temp_batch16_part4.js');

} catch (e) {
    console.error('Error assembling file:', e);
    process.exit(1);
}
