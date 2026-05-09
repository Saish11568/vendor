const fs = require('fs');
const path = require('path');

function restoreTemplates(originalDir, brokenDir) {
  const files = fs.readdirSync(originalDir);
  for (const file of files) {
    const origPath = path.join(originalDir, file);
    const brokenPath = path.join(brokenDir, file);
    
    if (fs.statSync(origPath).isDirectory()) {
      if (fs.existsSync(brokenPath)) {
        restoreTemplates(origPath, brokenPath);
      }
    } else if (origPath.endsWith('.tsx') || origPath.endsWith('.ts')) {
      if (!fs.existsSync(brokenPath)) continue;
      
      const origContent = fs.readFileSync(origPath, 'utf8');
      let brokenContent = fs.readFileSync(brokenPath, 'utf8');
      
      // We only care if there are template literals in the original
      const templateRegex = /\$\{([^}]+)\}/g;
      let match;
      const templates = [];
      while ((match = templateRegex.exec(origContent)) !== null) {
        templates.push(match[0]); // e.g. ${product.id}
      }
      
      if (templates.length > 0) {
        // The broken file has `${` or `₹{` where the template used to be, and the closing `}` might be gone or present.
        // Let's just find where they used to be.
        // Actually, since the broken file might have `₹{` or `${`, and missing the closing brace, a simple sequential replace is risky if there are other `{`.
        // Better: restore the line from the original file if the original line had a `${`.
        
        const origLines = origContent.split('\n');
        const brokenLines = brokenContent.split('\n');
        
        let changed = false;
        
        for (let i = 0; i < origLines.length; i++) {
          if (i >= brokenLines.length) break;
          
          if (origLines[i].includes('${')) {
            // The original line has a template. Did the broken line lose it?
            // If the broken line has no `${`, or has a malformed one, we just restore the line, 
            // EXCEPT we want to preserve the `$` -> `₹` conversion if we made it.
            // But restoring the original line is 100% safe. We can just re-apply the ₹ conversion safely later.
            // Let's just completely replace the broken line with the original line, 
            // EXCEPT if the broken line has changes we want to keep.
            // BUT wait, I made manual logic changes to page.tsx, product/[id]/page.tsx, login/page.tsx!
            // I don't want to revert the logic changes!
            // What if I just use regex to replace `\$\{[^}]*\}` or `\$\{` or `₹\{` with the templates sequentially?
          }
        }
      }
    }
  }
}
