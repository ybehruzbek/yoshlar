const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const dashboardDir = path.join(appDir, '(dashboard)');

if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

const routes = ['debtors', 'payments', 'documents', 'court', 'calendar', 'reports', 'kpi'];
const rootFiles = ['page.tsx', 'loading.tsx'];

routes.forEach(route => {
  const oldPath = path.join(appDir, route);
  const newPath = path.join(dashboardDir, route);
  if (fs.existsSync(oldPath)) {
    fs.cpSync(oldPath, newPath, { recursive: true });
    console.log(`Copied ${route}`);
  }
});

rootFiles.forEach(file => {
  const oldPath = path.join(appDir, file);
  const newPath = path.join(dashboardDir, file);
  if (fs.existsSync(oldPath)) {
    fs.cpSync(oldPath, newPath);
    console.log(`Copied ${file}`);
  }
});

console.log("Copy complete. You can now manually delete the original files if needed, or tell the user to stop the server so I can delete them.");
