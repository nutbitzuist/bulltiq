const fs = require('fs');

const TOP_ETFS = [
    { ticker: 'SPY' }, { ticker: 'VOO' }, { ticker: 'IVV' }, { ticker: 'VTI' }, { ticker: 'QQQ' },
    { ticker: 'VEA' }, { ticker: 'IEFA' }, { ticker: 'VWO' }, { ticker: 'AGG' }, { ticker: 'BND' },
    { ticker: 'VIG' }, { ticker: 'VYM' }, { ticker: 'SCHD' }, { ticker: 'VNQ' }, { ticker: 'XLF' },
    { ticker: 'XLK' }, { ticker: 'XLE' }, { ticker: 'XLV' }, { ticker: 'XLI' }, { ticker: 'XLY' },
    { ticker: 'XLP' }, { ticker: 'XLU' }, { ticker: 'XLB' }, { ticker: 'XLRE' }, { ticker: 'XLC' },
    { ticker: 'IWM' }, { ticker: 'IWF' }, { ticker: 'IWD' }, { ticker: 'DIA' }, { ticker: 'VGT' },
    { ticker: 'VHT' }, { ticker: 'VFH' }, { ticker: 'VCR' }, { ticker: 'VDC' }, { ticker: 'VDE' },
    { ticker: 'VPU' }, { ticker: 'VIS' }, { ticker: 'VAW' }, { ticker: 'VOX' }, { ticker: 'ARKK' },
    { ticker: 'ARKW' }, { ticker: 'ARKG' }, { ticker: 'ARKF' }, { ticker: 'ARKQ' }, { ticker: 'SOXX' },
    { ticker: 'SMH' }, { ticker: 'XBI' }, { ticker: 'IBB' }, { ticker: 'GLD' }, { ticker: 'SLV' },
    { ticker: 'USO' }, { ticker: 'UNG' }, { ticker: 'TLT' }, { ticker: 'SHY' }, { ticker: 'IEF' },
    { ticker: 'LQD' }, { ticker: 'HYG' }, { ticker: 'JNK' }, { ticker: 'EMB' }, { ticker: 'VCIT' },
    { ticker: 'VCSH' }, { ticker: 'VXUS' }, { ticker: 'EFA' }, { ticker: 'EEM' }, { ticker: 'IEMG' },
    { ticker: 'VGK' }, { ticker: 'EWJ' }, { ticker: 'FXI' }, { ticker: 'MCHI' }, { ticker: 'EWZ' },
    { ticker: 'INDA' }, { ticker: 'VTV' }, { ticker: 'VUG' }, { ticker: 'MGK' }, { ticker: 'MGV' },
    { ticker: 'VBK' }, { ticker: 'VBR' }, { ticker: 'VO' }, { ticker: 'VOE' }, { ticker: 'VOT' },
    { ticker: 'VB' }, { ticker: 'SDY' }, { ticker: 'DVY' }, { ticker: 'HDV' }, { ticker: 'DGRO' },
    { ticker: 'NOBL' }, { ticker: 'JEPI' }, { ticker: 'JEPQ' }, { ticker: 'QYLD' }, { ticker: 'XYLD' },
    { ticker: 'RSP' }, { ticker: 'MTUM' }, { ticker: 'QUAL' }, { ticker: 'USMV' }, { ticker: 'VLUE' },
    { ticker: 'SIZE' }
];

function checkCoverage() {
    let covered = new Set();

    // Check Batch 1
    if (fs.existsSync('etf-batch1-analyses.js')) {
        const b1 = require('./etf-batch1-analyses.js');
        Object.keys(b1).forEach(k => covered.add(k));
    }
    // Check Batch 2
    if (fs.existsSync('etf-batch2-analyses.js')) {
        const b2 = require('./etf-batch2-analyses.js');
        Object.keys(b2).forEach(k => covered.add(k));
    }

    // Check Top ETFs JSON if exists
    if (fs.existsSync('data/top-etfs.json')) {
        try {
            const existing = JSON.parse(fs.readFileSync('data/top-etfs.json', 'utf8'));
            existing.forEach(s => {
                if (s.analysisTh && s.analysisTh.length > 300 && !s.analysisTh.includes("กำลังอยู่ระหว่างการจัดทำ")) {
                    covered.add(s.ticker);
                }
            });
        } catch (e) { }
    }

    const missing = TOP_ETFS.filter(e => !covered.has(e.ticker));

    console.log(`Total ETFs in Master List: ${TOP_ETFS.length}`);
    console.log(`Covered: ${covered.size}`);
    console.log(`Missing: ${missing.length}`);
    console.log(`Missing Tickers: ${missing.map(e => e.ticker).join(', ')}`);
}

checkCoverage();
