const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'app', '(dashboard)');

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update imports:
      // Replace "../../" with "../../../" first to avoid double replacement
      content = content.replace(/from\s+["']\.\.\/\.\.\/(.*?)["']/g, 'from "../../../$1"');
      // Then replace "../" with "../../" (but avoid touching the ones we just updated)
      // Actually, a safer regex matches EXACTLY "../" not preceded by "../"
      content = content.replace(/from\s+["']\.\.\/([^.](?:.*?))["']/g, 'from "../../$1"');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixImports(dashboardDir);
console.log("Fixed imports in (dashboard)");
