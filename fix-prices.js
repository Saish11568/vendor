const fs = require('fs');

const storePath = 'd:/jcer/lib/store.ts';
let content = fs.readFileSync(storePath, 'utf8');

// Replace prices: multiply by 80
content = content.replace(/(originalPrice|price):\s*([\d\.]+)/g, (match, key, val) => {
  const newPrice = (parseFloat(val) * 80).toFixed(2);
  // remove trailing .00 if needed, but let's keep it to 2 decimals or rounded.
  return `${key}: ${Math.round(parseFloat(newPrice))}`;
});

// Also replace total orders prices if any
content = content.replace(/total:\s*([\d\.]+)/g, (match, val) => {
  const newPrice = (parseFloat(val) * 80).toFixed(2);
  return `total: ${Math.round(parseFloat(newPrice))}`;
});

content = content.replace(/\$/g, '₹');

fs.writeFileSync(storePath, content);
console.log('Prices in store.ts updated to Rupees.');
