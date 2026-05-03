const fs = require('fs');
const PizZip = require('pizzip');

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

// Fix Da'vo ariza
console.log("=== Final fixes for Da'vo ariza ===");
const zip1 = new PizZip(fs.readFileSync("documents/templates/Da'vo ariza.docx", 'binary'));
let xml1 = zip1.file('word/document.xml').asText();

// 1. Address: spans w:br, so replace the parts separately
const addrFixes1 = [
  // Replace the first part (before line break)
  ["Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko\u2018chasi ", "{{MANZIL}} "],
  // Replace the second part (after line break) 
  ["30-uy)", "{{_ADDR_END}})"],
];

for (const [find, replace] of addrFixes1) {
  const before = xml1;
  xml1 = replaceAll(xml1, find, replace);
  console.log(xml1 !== before ? `  ✓ ${find.substring(0,40)} → ${replace}` : `  ✗ NOT: ${find.substring(0,40)}`);
}

// Remove the line break between address parts and the empty addr end marker
xml1 = replaceAll(xml1, '{{_ADDR_END}}', '');

// 2. Fix the QOLDIQ_SOZ: "{{QARZ_MUDDATI_SOZ}} ikki million..." should be "{{QOLDIQ_SOZ}}"
xml1 = replaceAll(xml1, 
  '{{QARZ_MUDDATI_SOZ}} ikki million sakkiz yuz oltmish uch ming ikki yuz sakson',
  '{{QOLDIQ_SOZ}}'
);
console.log('  ✓ Fixed QOLDIQ_SOZ');

zip1.file('word/document.xml', xml1);
const buf1 = zip1.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync("documents/templates/Da'vo ariza.docx", buf1);
console.log(`  Saved (${buf1.length} bytes)`);

// Verify all placeholders
const verify1 = new PizZip(buf1).file('word/document.xml').asText();
const all = ['{{FISH}}', '{{PASPORT}}', '{{JSHSHIR}}', '{{SHARTNOMA_SANA}}', '{{NOTARIUS}}', 
  '{{SHARTNOMA_RAQAMI}}', '{{QARZ_SUMMASI}}', '{{QARZ_SUMMA_SOZ}}', '{{QARZ_QOLDIQ}}', '{{QOLDIQ_SOZ}}',
  '{{OYLIK_TOLOV}}', '{{OYLIK_TOLOV_SOZ}}', '{{MANZIL}}', '{{BUGUNGI_SANA}}', 
  '{{OGOHLANTIRISH_XATLARI}}', '{{OTKAZILGAN_SANA}}', '{{TOLOV_BOSHLANISH_SANA}}',
  '{{HOLAT_SANASI}}', '{{TALABNOMA_SANA}}', '{{QARZ_MUDDATI_RAQAM}}', '{{QARZ_MUDDATI_SOZ}}',
  '{{TUMAN}}', '{{DAVOGAR_MANZIL}}', '{{NOTARIAL_TUMAN}}'];
console.log('\nDa\'vo ariza verification:');
let allOk = true;
for (const p of all) {
  const count = (verify1.match(new RegExp(p.replace(/[{}]/g, '\\$&'), 'g')) || []).length;
  console.log(`  ${count > 0 ? '✓' : '✗'} ${p} (${count}x)`);
  if (count === 0) allOk = false;
}
console.log(allOk ? '\n✅ ALL PLACEHOLDERS FOUND!' : '\n⚠ Some placeholders missing');

// Also fix Talabnoma addresses
console.log("\n=== Final fixes for Talabnoma ===");
const zip2 = new PizZip(fs.readFileSync("documents/templates/Talabnoma uy-joy.docx", 'binary'));
let xml2 = zip2.file('word/document.xml').asText();

// Check remaining unfixed items
let plain2 = xml2.replace(/<[^>]*>/g, '');
// Find JSHSHIR
let jshshirIdx = plain2.indexOf('JSHSHIR');
if (jshshirIdx >= 0) {
  console.log('  JSHSHIR context:', plain2.substring(jshshirIdx, jshshirIdx + 50));
}

// Find tuman
let tumanIdx = plain2.indexOf('Olmazor');
while (tumanIdx >= 0) {
  console.log('  Olmazor context:', plain2.substring(tumanIdx - 20, tumanIdx + 60));
  tumanIdx = plain2.indexOf('Olmazor', tumanIdx + 1);
}

// Find remaining address
const addr1 = plain2.indexOf('Yunusobod');
if (addr1 >= 0) {
  console.log('  Yunusobod context:', plain2.substring(addr1 - 30, addr1 + 80));
}

zip2.file('word/document.xml', xml2);
const buf2 = zip2.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync("documents/templates/Talabnoma uy-joy.docx", buf2);

const verify2 = new PizZip(buf2).file('word/document.xml').asText();
const talabPlaceholders = ['{{FISH}}', '{{PASPORT}}', '{{SHARTNOMA_RAQAMI}}', '{{SHARTNOMA_SANA}}', 
  '{{QARZ_SUMMASI}}', '{{QARZ_SUMMA_SOZ}}', '{{QARZ_QOLDIQ}}', '{{QOLDIQ_SOZ}}',
  '{{OYLIK_TOLOV}}', '{{OYLIK_TOLOV_SOZ}}', '{{MANZIL}}', '{{TOLOV_BOSHLANISH_SANA}}',
  '{{HOLAT_SANASI}}', '{{DAVOGAR_MANZIL}}'];
console.log('\nTalabnoma verification:');
for (const p of talabPlaceholders) {
  const count = (verify2.match(new RegExp(p.replace(/[{}]/g, '\\$&'), 'g')) || []).length;
  console.log(`  ${count > 0 ? '✓' : '✗'} ${p} (${count}x)`);
}
