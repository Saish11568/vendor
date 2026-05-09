const fs = require('fs');

const storePath = 'd:/jcer/lib/store.ts';
let content = fs.readFileSync(storePath, 'utf8');

// Replace unsplash URLs to add compression
content = content.replace(/(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+.*?fit=crop)(?!&q=60&auto=format)/g, '$1&q=60&auto=format');

fs.writeFileSync(storePath, content);
console.log('Unsplash URLs optimized in store.ts');
