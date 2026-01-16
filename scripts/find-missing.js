const fs = require('fs');
const data = require('../data/sp500.json');

const pending = data.filter(stock => stock.analysisTh.includes('กำลังอยู่ระหว่างการจัดทำ'));

console.log('Total pending:', pending.length);
console.log('Tickers:', pending.map(s => s.ticker).join(', '));
