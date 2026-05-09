const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace $ with ₹ only if it's NOT followed by {
      // Meaning avoid replacing ${variable}
      let newContent = content.replace(/\$(?!\{)/g, '₹');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

processDir('d:/jcer/app/(customer)');
processDir('d:/jcer/components');
console.log('Replaced all $ with ₹');
