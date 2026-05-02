const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');
const routes = ['debtors', 'payments', 'documents', 'court', 'calendar', 'reports', 'kpi', 'page.tsx', 'loading.tsx'];

routes.forEach(route => {
  const oldPath = path.join(appDir, route);
  if (fs.existsSync(oldPath)) {
    try {
      fs.rmSync(oldPath, { recursive: true, force: true });
      console.log(`Deleted ${oldPath}`);
    } catch (e) {
      console.error(`Could not delete ${oldPath}: ${e.message}`);
    }
  }
});
