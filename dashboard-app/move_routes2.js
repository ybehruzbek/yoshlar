const fs = require('fs-extra');
const path = require('path');

async function restructure() {
  const appDir = path.join(__dirname, 'app');
  const dashboardDir = path.join(appDir, '(dashboard)');

  await fs.ensureDir(dashboardDir);

  const routes = ['debtors', 'payments', 'documents', 'court', 'calendar', 'reports', 'kpi'];
  const rootFiles = ['page.tsx', 'loading.tsx'];

  for (const route of routes) {
    const oldPath = path.join(appDir, route);
    const newPath = path.join(dashboardDir, route);
    if (fs.existsSync(oldPath)) {
      await fs.copy(oldPath, newPath);
      // Wait a bit before trying to delete
      setTimeout(() => fs.remove(oldPath).catch(console.error), 1000);
      console.log(`Copied ${route}`);
    }
  }

  for (const file of rootFiles) {
    const oldPath = path.join(appDir, file);
    const newPath = path.join(dashboardDir, file);
    if (fs.existsSync(oldPath)) {
      await fs.copy(oldPath, newPath);
      setTimeout(() => fs.remove(oldPath).catch(console.error), 1000);
      console.log(`Copied ${file}`);
    }
  }
}

restructure().catch(console.error);
