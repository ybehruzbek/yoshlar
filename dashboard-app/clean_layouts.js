const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'app', '(dashboard)');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'page.tsx' || file === 'loading.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove DashboardLayout imports
      content = content.replace(/import\s*{\s*DashboardLayout\s*}\s*from\s*['"](.*?)DashboardLayout['"];\n?/g, '');
      content = content.replace(/import\s*{\s*DashboardLayout\s*}\s*from\s*['"](.*?)DashboardLayout['"];\n?/g, ''); // twice just in case
      content = content.replace(/import\s+DashboardLayout\s+from\s*['"](.*?)DashboardLayout['"];\n?/g, '');
      
      // Remove <DashboardLayout title="..."> wrapping
      content = content.replace(/<DashboardLayout[^>]*>/g, '<>');
      content = content.replace(/<\/DashboardLayout>/g, '</>');
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Processed ${fullPath}`);
    }
  }
}

processDirectory(dashboardDir);
console.log("Finished removing DashboardLayout from pages and loading states.");
