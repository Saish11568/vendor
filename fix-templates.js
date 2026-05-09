const fs = require('fs');
const path = require('path');

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // The powershell command probably replaced correctly the first part but failed the second.
      // So we have TEMP_DOLLAR_BRACKET_something
      // Actually the second replace was: -replace "TEMP_DOLLAR_BRACKET_(.*?)_TEMP_BRACKET", "`$`{$1}"
      // But maybe it just stripped the match?
      // Let's look at what's actually there.
      content = content.replace(/TEMP_DOLLAR_BRACKET_/g, '${');
      content = content.replace(/_TEMP_BRACKET/g, '}');
      
      // Also, my node script replaced $ with ₹. So maybe we have ₹{...} 
      content = content.replace(/₹\{/g, '${');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixDir('d:/jcer/app/(customer)');
fixDir('d:/jcer/components');
console.log('Fixed broken templates');
