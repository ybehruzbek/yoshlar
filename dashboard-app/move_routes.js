const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const dashboardDir = path.join(appDir, '(dashboard)');

if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

// Routes to move
const routes = ['debtors', 'payments', 'documents', 'court', 'calendar', 'reports', 'kpi'];

// Also move the root page.tsx and loading.tsx
const rootFiles = ['page.tsx', 'loading.tsx'];

routes.forEach(route => {
  const oldPath = path.join(appDir, route);
  const newPath = path.join(dashboardDir, route);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${route} to (dashboard)/${route}`);
  }
});

rootFiles.forEach(file => {
  const oldPath = path.join(appDir, file);
  const newPath = path.join(dashboardDir, file);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${file} to (dashboard)/${file}`);
  }
});

console.log("Move complete.");
