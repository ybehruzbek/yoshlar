const fs = require('fs');
const PizZip = require('pizzip');

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
    const newResult = result.replace(
      /(<w:r>)(<w:rPr>[^]*?<\/w:rPr>)(?:<w:[^/]*\/>)*<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>\s*<w:r>\2(?:<w:[^/]*\/>)*<w:t[^>]*>([^<]*)<\/w:t><\/w:r>/g,
      (_m, rOpen, rPr, tAttrs, t1, t2) => {
        changed = true;
        const p = t1.includes(' ') || t2.includes(' ') || tAttrs.includes('preserve');
        return `${rOpen}${rPr}<w:t${p ? ' xml:space="preserve"' : tAttrs}>${t1}${t2}</w:t></w:r>`;
      }
    );
    result = newResult;
  }
  
  changed = true;
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    const newResult = result.replace(
      /<w:r>(?:<w:[^/]*\/>)*<w:t([^>]*)>([^<]*)<\/w:t><\/w:r>\s*<w:r>(?:<w:[^/]*\/>)*<w:t[^>]*>([^<]*)<\/w:t><\/w:r>/g,
      (_m, tAttrs, t1, t2) => {
        if (_m.includes('<w:rPr>')) return _m;
        changed = true;
        const p = t1.includes(' ') || t2.includes(' ') || tAttrs.includes('preserve');
        return `<w:r><w:t${p ? ' xml:space="preserve"' : tAttrs}>${t1}${t2}</w:t></w:r>`;
      }
    );
    result = newResult;
  }
  
  console.log(`  Normalization: ${iterations} iterations`);
  return result;
}

function testTemplate(name, targets) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TESTING: ${name}`);
  console.log(`${'='.repeat(60)}`);
  
  const zip = new PizZip(fs.readFileSync(`documents/templates/${name}`, 'binary'));
  const raw = zip.file('word/document.xml').asText();
  console.log(`  Raw XML: ${raw.length} chars`);
  
  const normalized = normalizeXml(raw);
  console.log(`  Normalized: ${normalized.length} chars`);
  
  let allFound = true;
  for (const t of targets) {
    const found = normalized.includes(t);
    console.log(`  ${found ? '✓' : '✗'} "${t.substring(0, 70)}"`);
    if (!found) allFound = false;
  }
  
  // XML validity
  let tags = [];
  let error = null;
  const regex = /<\/?([a-zA-Z0-9:]+)[^>]*>/g;
  let match;
  while ((match = regex.exec(normalized)) !== null) {
    if (match[0].endsWith('/>')) continue;
    if (match[0].startsWith('</')) {
      if (tags.length === 0) { error = 'Closing without opening: ' + match[1]; break; }
      const last = tags.pop();
      if (last !== match[1]) { error = `Mismatch: </${last}> vs </${match[1]}> at ${match.index}`; break; }
    } else if (!match[0].startsWith('<?')) {
      tags.push(match[1]);
    }
  }
  if (!error && tags.length > 0) error = 'Unclosed: ' + tags.slice(-3).join(', ');
  
  console.log(`  XML: ${error ? 'BROKEN - ' + error : 'VALID ✓'}`);
  
  // Generate test document
  let testXml = normalized;
  testXml = testXml.split('KADIROV ODIL MURATOVICH').join('CHORIYEV AKBARALI URALOVICH');
  testXml = testXml.split('MUXAMMEDOV JAMSHID AKBAROVICH').join('CHORIYEV AKBARALI URALOVICH');
  testXml = testXml.split('notarius Tursunkulova Kamila Ruslanovna').join('notarius Raximov Sardor');
  testXml = testXml.split('201900043001468-son').join('202500001234567-son');
  testXml = testXml.split('201901137004736-son').join('202500001234567-son');
  testXml = testXml.split('2019-yil 20-mart').join('2020-yil 15-yanvar');
  testXml = testXml.split('AD 1114901').join('AB 1234567');
  testXml = testXml.split('31602870171169').join('12345678901234');
  testXml = testXml.split('2025-yil ____-dekabr').join('2026-yil 3-may');
  testXml = testXml.split('20 (yigirma) yil').join('15 (o\'n besh) yil');
  
  zip.file('word/document.xml', testXml);
  const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = `documents/templates/test_${name}`;
  fs.writeFileSync(outPath, buf);
  console.log(`  Output: ${outPath} (${buf.length} bytes)`);
  
  // Verify readable
  const zip2 = new PizZip(buf);
  const check = zip2.file('word/document.xml').asText();
  console.log(`  Re-read OK: ${check.includes('CHORIYEV AKBARALI URALOVICH')}`);
  
  return allFound && !error;
}

const davoOk = testTemplate("Da'vo ariza.docx", [
  'KADIROV ODIL MURATOVICH',
  'AD 1114901',
  '31602870171169',
  '2019-yil 20-mart',
  'notarius Tursunkulova Kamila Ruslanovna',
  '201900043001468-son',
  '2019-yil 26-mart',
  '2019-yil 20-aprel',
  '2025-yil ____-dekabr',
  '68 590 000',
  '22 863 280',
  '285 791',
  '20 (yigirma) yil',
  '2021-yil 18-fevral, 2022-yil 4-mart',
]);

const talabOk = testTemplate("Talabnoma uy-joy.docx", [
  'MUXAMMEDOV JAMSHID AKBAROVICH',
  '201901137004736-son',
]);

console.log(`\n${'='.repeat(60)}`);
console.log(`RESULT: Da'vo ariza ${davoOk ? '✓ PASS' : '✗ FAIL'} | Talabnoma ${talabOk ? '✓ PASS' : '✗ FAIL'}`);
