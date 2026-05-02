const fs = require('fs');
const path = require('path');

const filesToClean = [
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  path.join(__dirname, 'app', '(dashboard)', 'debtors', '[id]', 'DebtorProfileClient.tsx'),
  path.join(__dirname, 'components', 'dashboard', 'DashboardClient.tsx')
];

for (const fullPath of filesToClean) {
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove DashboardLayout imports
    content = content.replace(/import\s*{\s*DashboardLayout\s*}\s*from\s*['"](.*?)DashboardLayout['"];\n?/g, '');
    
    // Replace <DashboardLayout title="..."> with <>
    content = content.replace(/<DashboardLayout[^>]*>/g, '<>');
    content = content.replace(/<\/DashboardLayout>/g, '</>');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Cleaned ${fullPath}`);
  }
}
