const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// lib/actions/debtors.ts
replaceInFile(
  path.join(__dirname, 'lib', 'actions', 'debtors.ts'),
  /export async function deleteDebtor\(id: string\)/g,
  'export async function deleteDebtor(id: number)'
);

// app/(dashboard)/debtors/DebtorsClient.tsx
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /id: string;/g,
  'id: number;'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /activeRowId: string \| null/g,
  'activeRowId: number | null'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /setActiveRowId\s*=\s*useState<string \| null>/g,
  'setActiveRowId = useState<number | null>'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /id: string, name: string/g,
  'id: number, name: string'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /handleViewProfile\s*=\s*\(id: string\)/g,
  'handleViewProfile = (id: number)'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', 'DebtorsClient.tsx'),
  /handleRowActionClick\s*=\s*\(e: React.MouseEvent, id: string\)/g,
  'handleRowActionClick = (e: React.MouseEvent, id: number)'
);

// lib/actions/fetchDebtors.ts
replaceInFile(
  path.join(__dirname, 'lib', 'actions', 'fetchDebtors.ts'),
  /id:\s*loan.debtor.id,/g,
  'id: loan.debtor.id,'
); // Should automatically be number now since Prisma generates it

// Check for debtor profile client
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', '[id]', 'DebtorProfileClient.tsx'),
  /id:\s*string;/g,
  'id: number;'
);
replaceInFile(
  path.join(__dirname, 'app', '(dashboard)', 'debtors', '[id]', 'DebtorProfileClient.tsx'),
  /debtorId:\s*string;/g,
  'debtorId: number;'
);
