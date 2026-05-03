/**
 * ONE-TIME SCRIPT: Prepare templates by replacing hardcoded values with {{PLACEHOLDER}} codes.
 * 
 * Run this once: node prepare-templates.js
 * 
 * After running, the templates in documents/templates/ will contain {{FISH}}, {{PASPORT}}, etc.
 * The runtime documentGenerator.ts will just do simple {{PLACEHOLDER}} → value replacement.
 */

const fs = require('fs');
const PizZip = require('pizzip');
const path = require('path');

function normalizeXml(xml) {
  let result = xml.replace(/<w:proofErr[^/]*\/>/g, '');
  result = result.replace(/<w:r\s+[^>]*>/g, '<w:r>');
  result = result.replace(/<w:rPr\s+[^>]*>/g, '<w:rPr>');
  result = result.replace(/<w:iCs\/>/g, '');
  result = result.replace(/<w:bCs\/>/g, '');
  
  let changed = true;
  let iterations = 0;
  
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    result = result.replace(
      /(<w:r>)(<w:rPr>[^]*?<\/w:rPr>)(?:<w:[^/]*\/>)*<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>\s*<w:r>\2(?:<w:[^/]*\/>)*<w:t[^>]*>([^<]*)<\/w:t><\/w:r>/g,
      (_m, rOpen, rPr, tAttrs, t1, t2) => {
        changed = true;
        const p = t1.includes(' ') || t2.includes(' ') || tAttrs.includes('preserve');
        return `${rOpen}${rPr}<w:t${p ? ' xml:space="preserve"' : tAttrs}>${t1}${t2}</w:t></w:r>`;
      }
    );
  }
  
  changed = true;
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    result = result.replace(
      /<w:r>(?:<w:[^/]*\/>)*<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>\s*<w:r>(?:<w:[^/]*\/>)*<w:t[^>]*>([^<]*)<\/w:t><\/w:r>/g,
      (_m, tAttrs, t1, t2) => {
        if (_m.includes('<w:rPr>')) return _m;
        changed = true;
        const p = t1.includes(' ') || t2.includes(' ') || tAttrs.includes('preserve');
        return `<w:r><w:t${p ? ' xml:space="preserve"' : tAttrs}>${t1}${t2}</w:t></w:r>`;
      }
    );
  }
  
  console.log(`  Merged in ${iterations} iterations`);
  return result;
}

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

// ===============================================
// DA'VO ARIZA TEMPLATE
// ===============================================
function prepareDavoAriza() {
  console.log("\n=== Da'vo ariza ===");
  const filePath = path.join(__dirname, "documents/templates/Da'vo ariza.docx");
  
  const zip = new PizZip(fs.readFileSync(filePath, 'binary'));
  let xml = zip.file('word/document.xml').asText();
  console.log('  Raw size:', xml.length);
  
  xml = normalizeXml(xml);
  console.log('  Normalized size:', xml.length);
  
  // Replace all hardcoded values with placeholders
  const replacements = [
    // Names (handle all known names)
    ["KADIROV ODIL MURATOVICH", "{{FISH}}"],
    
    // Passport & JSHSHIR
    ["AD 1114901", "{{PASPORT}}"],
    ["31602870171169", "{{JSHSHIR}}"],
    
    // Dates
    ["2019-yil 20-martda", "{{SHARTNOMA_SANA}}da"],
    ["2019-yil 20-mart", "{{SHARTNOMA_SANA}}"],
    ["2019-yil 26-mart", "{{OTKAZILGAN_SANA}}"],
    ["2019-yil 20-apreldan", "{{TOLOV_BOSHLANISH_SANA}}dan"],
    ["2019-yil 20-aprel", "{{TOLOV_BOSHLANISH_SANA}}"],
    ["2025-yil 15-dekabr", "{{HOLAT_SANASI}}"],
    ["2025-yil 19-noyabr", "{{TALABNOMA_SANA}}"],
    ["2025-yil ____-dekabr", "{{BUGUNGI_SANA}}"],
    
    // Notarius
    ["notarius Tursunkulova Kamila Ruslanovna", "notarius {{NOTARIUS}}"],
    
    // Contract
    ["201900043001468-son", "{{SHARTNOMA_RAQAMI}}"],
    
    // Warning letters
    ["(2021-yil 18-fevral, 2022-yil 4-mart, 2022-yil 16-iyun, 2023-yil 9-avgust, 2024-yil 27-iyul, 2025-yil 1-aprel sanalari)", "{{OGOHLANTIRISH_XATLARI}}"],
    
    // Loan term — split across italic/non-italic
    [" 20 ", " {{QARZ_MUDDATI_RAQAM}} "],
    ["yigirma", "{{QARZ_MUDDATI_SOZ}}"],
    
    // Address
    ["Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko\u2018chasi 30-uy", "{{MANZIL}}"],
    ["Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko'chasi 30-uy", "{{MANZIL}}"],
    
    // Tuman info
    ["Uchtepa tumanlararo", "{{TUMAN}} tumanlararo"],
  ];
  
  // Money amounts — need to find exact apostrophe used
  // After normalization, text should be contiguous. Find exact string.
  const moneyReplacements = [
    // Qarz summasi
    { find: "68 590 000", replace: "{{QARZ_SUMMASI}}" },
    // Qarz qoldiq
    { find: "22 863 280", replace: "{{QARZ_QOLDIQ}}" },
    // Oylik to'lov
    { find: "285 791", replace: "{{OYLIK_TOLOV}}" },
  ];
  
  // Apply text replacements
  for (const [find, replace] of replacements) {
    const before = xml;
    xml = replaceAll(xml, find, replace);
    if (xml !== before) {
      console.log(`  ✓ Replaced: "${find.substring(0, 50)}" → "${replace}"`);
    } else {
      console.log(`  ✗ NOT FOUND: "${find.substring(0, 50)}"`);
    }
  }
  
  // For money amounts, we need to replace the FULL phrase including word form and so'm
  // Find the text around each number to get the complete replacement target
  for (const m of moneyReplacements) {
    const idx = xml.indexOf(m.find);
    if (idx >= 0) {
      // Find the enclosing <w:t> content
      const tStart = xml.lastIndexOf('>', idx) + 1;
      const tEnd = xml.indexOf('<', idx);
      const fullText = xml.substring(tStart, tEnd);
      console.log(`  Money context for ${m.find}: "${fullText.substring(0, 80)}..."`);
      
      // Just replace the number itself — the word form will be a separate placeholder
      xml = replaceAll(xml, m.find, m.replace);
      console.log(`  ✓ Replaced number: ${m.find} → ${m.replace}`);
    } else {
      console.log(`  ✗ Money NOT FOUND: ${m.find}`);
    }
  }
  
  // Now replace the Uzbek word-form descriptions that appear in parentheses
  // These are in italic <w:i/> runs after the numbers
  const wordFormReplacements = [
    ["oltmish sakkiz million besh yuz to\u2018qson ming", "{{QARZ_SUMMA_SOZ}}"],
    ["oltmish sakkiz million besh yuz to'qson ming", "{{QARZ_SUMMA_SOZ}}"],
    ["ikki yuz sakson besh ming yetti yuz to\u2018qson bir", "{{OYLIK_TOLOV_SOZ}}"],
    ["ikki yuz sakson besh ming yetti yuz to'qson bir", "{{OYLIK_TOLOV_SOZ}}"],
    ["yigirma ikki million sakkiz yuz oltmish uch ming ikki yuz sakson", "{{QOLDIQ_SOZ}}"],
    ["so\u2018m", "so'm"],
  ];
  
  for (const [find, replace] of wordFormReplacements) {
    const before = xml;
    xml = replaceAll(xml, find, replace);
    if (xml !== before) {
      console.log(`  ✓ Word form: "${find.substring(0, 50)}" → "${replace}"`);
    }
  }
  
  // Save
  zip.file('word/document.xml', xml);
  const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(filePath, buf);
  console.log(`  SAVED: ${filePath} (${buf.length} bytes)`);
  
  // Verify
  const verify = new PizZip(buf).file('word/document.xml').asText();
  const placeholders = ['{{FISH}}', '{{PASPORT}}', '{{JSHSHIR}}', '{{SHARTNOMA_SANA}}', '{{NOTARIUS}}', 
    '{{SHARTNOMA_RAQAMI}}', '{{QARZ_SUMMASI}}', '{{QARZ_QOLDIQ}}', '{{OYLIK_TOLOV}}', '{{MANZIL}}',
    '{{BUGUNGI_SANA}}', '{{OGOHLANTIRISH_XATLARI}}'];
  console.log('\n  Verification:');
  for (const p of placeholders) {
    const count = (verify.match(new RegExp(p.replace(/[{}]/g, '\\$&'), 'g')) || []).length;
    console.log(`  ${count > 0 ? '✓' : '✗'} ${p} (${count}x)`);
  }
}

// ===============================================
// TALABNOMA TEMPLATE
// ===============================================
function prepareTalabnoma() {
  console.log("\n=== Talabnoma uy-joy ===");
  const filePath = path.join(__dirname, "documents/templates/Talabnoma uy-joy.docx");
  
  const zip = new PizZip(fs.readFileSync(filePath, 'binary'));
  let xml = zip.file('word/document.xml').asText();
  console.log('  Raw size:', xml.length);
  
  xml = normalizeXml(xml);
  console.log('  Normalized size:', xml.length);
  
  const replacements = [
    ["MUXAMMEDOV JAMSHID AKBAROVICH", "{{FISH}}"],
    ["201901137004736-son", "{{SHARTNOMA_RAQAMI}}"],
    ["2019-yil 13-dekabr", "{{SHARTNOMA_SANA}}"],
    ["2019-yil 15-dekabr", "{{TOLOV_BOSHLANISH_SANA}}"],
    ["2026-yil 15-aprel", "{{HOLAT_SANASI}}"],
    ["Toshkent shahar Olmazor tumani", "{{TUMAN}}"],
    ["Toshkent shahar, Yunusobod tumani,Markaz 4-kvartal, Qashqar MFY, 31-uy,26-xonadonda", "{{MANZIL}}"],
    ["Toshkent shahar, Yunusobod tumani, Markaz 4-kvartal, Qashqar MFY, 31-uy, 26-xonadonda", "{{MANZIL}}"],
  ];
  
  // Talabnoma money amounts (uses ʻ = U+02BB)
  const talabMoney = [
    ["69 656 480,00", "{{QARZ_SUMMASI}}"],
    ["22 386 480,00", "{{QARZ_QOLDIQ}}"],
    ["346 480,00", "{{OYLIK_TOLOV}}"],
    ["290 000,00", "{{OYLIK_TOLOV}}"],
    ["oltmish to\u02BBqqiz million olti yuz ellik olti ming to\u02BBrt yuz sakson", "{{QARZ_SUMMA_SOZ}}"],
    ["yigirma ikki million uch yuz sakson olti ming to\u02BBrt yuz sakson", "{{QOLDIQ_SOZ}}"],
    ["uch yuz qirq olti ming to\u02BBrt yuz sakson", "{{OYLIK_TOLOV_SOZ}}"],
    ["ikki yuz to\u02BBqson ming", "{{OYLIK_TOLOV_SOZ}}"],
    ["so\u02BBm", "so'm"],
  ];
  
  for (const [find, replace] of replacements) {
    const before = xml;
    xml = replaceAll(xml, find, replace);
    if (xml !== before) {
      console.log(`  ✓ Replaced: "${find.substring(0, 50)}" → "${replace}"`);
    } else {
      console.log(`  ✗ NOT FOUND: "${find.substring(0, 50)}"`);
    }
  }
  
  for (const [find, replace] of talabMoney) {
    const before = xml;
    xml = replaceAll(xml, find, replace);
    if (xml !== before) {
      console.log(`  ✓ Money: "${find.substring(0, 50)}" → "${replace}"`);
    } else {
      console.log(`  ✗ Money NOT FOUND: "${find.substring(0, 50)}"`);
    }
  }
  
  // Save
  zip.file('word/document.xml', xml);
  const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(filePath, buf);
  console.log(`  SAVED: ${filePath} (${buf.length} bytes)`);
  
  // Verify
  const verify = new PizZip(buf).file('word/document.xml').asText();
  const placeholders = ['{{FISH}}', '{{SHARTNOMA_RAQAMI}}', '{{SHARTNOMA_SANA}}', '{{QARZ_SUMMASI}}', '{{MANZIL}}'];
  console.log('\n  Verification:');
  for (const p of placeholders) {
    const count = (verify.match(new RegExp(p.replace(/[{}]/g, '\\$&'), 'g')) || []).length;
    console.log(`  ${count > 0 ? '✓' : '✗'} ${p} (${count}x)`);
  }
}

// Run both
prepareDavoAriza();
prepareTalabnoma();
console.log('\n✅ Done! Templates now use {{PLACEHOLDER}} codes.');
console.log('Now documentGenerator.ts just does simple {{CODE}} → value replacement.');
