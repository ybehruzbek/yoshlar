const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace all id String @id @default(cuid()) to id Int @id @default(autoincrement())
content = content.replace(/id\s+String\s+@id\s+@default\(cuid\(\)\)/g, 'id           Int        @id @default(autoincrement())');

// Replace foreign keys String to Int
content = content.replace(/debtorId\s+String/g, 'debtorId     Int');
content = content.replace(/loanId\s+String/g, 'loanId       Int');
content = content.replace(/paymentId\s+String\?/g, 'paymentId    Int?');
content = content.replace(/batchId\s+String\?/g, 'batchId      Int?');
content = content.replace(/shablonId\s+String\?/g, 'shablonId    Int?');
// User IDs might also be needed? The schema has `userId String?`. We changed User.id to Int.
content = content.replace(/userId\s+String\?/g, 'userId       Int?');
content = content.replace(/documentId\s+String\?/g, 'documentId   Int?');

fs.writeFileSync(schemaPath, content);
console.log("Updated schema.prisma successfully.");
