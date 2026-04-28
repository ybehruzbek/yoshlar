import mammoth from 'mammoth';
import { readdir } from 'fs/promises';
import { join } from 'path';

const dir = 'hujjatlar-namunalari';
const files = await readdir(dir);
const docxFiles = files.filter(f => f.endsWith('.docx'));

for (const file of docxFiles) {
  console.log('\n\n========================================');
  console.log('FILE: ' + file);
  console.log('========================================');
  try {
    const result = await mammoth.extractRawText({ path: join(dir, file) });
    console.log(result.value);
  } catch(e) {
    console.error('ERROR:', e.message);
  }
}
