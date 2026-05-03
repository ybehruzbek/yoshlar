const fs = require('fs');
const PizZip = require('pizzip');

// Import numberToWordsUz inline
function numberToWordsUz(num) {
  if (num === 0) return "nol";
  const ones = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
  const tens = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
  const scales = ["", "ming", "million", "milliard", "trillion"];
  function getHundreds(n) {
    let result = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;
    if (h > 0) result += ones[h] + " yuz ";
    if (t > 0) result += tens[t] + " ";
    if (o > 0) result += ones[o] + " ";
    return result.trim();
  }
  let result = "";
  let scaleIndex = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = getHundreds(chunk);
      result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + result;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  return result.trim();
}

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
  
  return result;
}

// Test: Generate a full document
const data = {
  FISH: 'CHORIYEV AKBARALI URALOVICH',
  PASPORT: 'AB 1234567',
  JSHSHIR: '12345678901234',
  SHARTNOMA_SANA: '2020-yil 15-yanvar',
  NOTARIUS: 'Raximov Sardor Shodmonovich',
  SHARTNOMA_RAQAMI: '202500001234567-son',
  QARZ_MUDDATI: "15 (o'n besh)",
  OTKAZILGAN_SANA: '2020-yil 20-yanvar',
  TOLOV_BOSHLANISH_SANA: '2020-yil 15-fevral',
  HOLAT_SANASI: '2026-yil 3-may',
  TALABNOMA_SANA: '2026-yil 1-aprel',
  BUGUNGI_SANA: '2026-yil 3-may',
  OGOHLANTIRISH_XATLARI: '(2022-yil 10-mart, 2023-yil 5-iyun sanalari)',
  QARZ_SUMMASI: '50 000 000',
  QARZ_QOLDIQ: '30 000 000',
  OYLIK_TOLOV: '250 000',
  MANZIL: 'Toshkent shahri, Sergeli tumani, Gulbahor MFY, 10-uy',
};

data.QARZ_SUMMA_SOZ = numberToWordsUz(Number(data.QARZ_SUMMASI.replace(/[^0-9]/g, "")));
data.QOLDIQ_SOZ = numberToWordsUz(Number(data.QARZ_QOLDIQ.replace(/[^0-9]/g, "")));
data.OYLIK_TOLOV_SOZ = numberToWordsUz(Number(data.OYLIK_TOLOV.replace(/[^0-9]/g, "")));

function replaceText(xml, find, replace) {
  if (!find || replace === undefined || replace === null) return xml;
  return xml.split(find).join(replace);
}

const zip = new PizZip(fs.readFileSync("documents/templates/Da'vo ariza.docx", 'binary'));
let docXml = zip.file('word/document.xml').asText();
docXml = normalizeXml(docXml);

// Do all replacements
docXml = replaceText(docXml, "KADIROV ODIL MURATOVICH", data.FISH.toUpperCase());
docXml = replaceText(docXml, "AD 1114901", data.PASPORT);
docXml = replaceText(docXml, "31602870171169", data.JSHSHIR);
docXml = replaceText(docXml, "2019-yil 20-mart", data.SHARTNOMA_SANA);
docXml = replaceText(docXml, "2019-yil 26-mart", data.OTKAZILGAN_SANA);
docXml = replaceText(docXml, "2019-yil 20-apreldan", data.TOLOV_BOSHLANISH_SANA + "dan");
docXml = replaceText(docXml, "2019-yil 20-aprel", data.TOLOV_BOSHLANISH_SANA);
docXml = replaceText(docXml, "2025-yil 15-dekabr", data.HOLAT_SANASI);
docXml = replaceText(docXml, "2025-yil 19-noyabr", data.TALABNOMA_SANA);
docXml = replaceText(docXml, "2025-yil ____-dekabr", data.BUGUNGI_SANA);
docXml = replaceText(docXml, "notarius Tursunkulova Kamila Ruslanovna", "notarius " + data.NOTARIUS);
docXml = replaceText(docXml, "201900043001468-son", data.SHARTNOMA_RAQAMI);

// Loan term - split across formatting boundaries
const muddatMatch = data.QARZ_MUDDATI.match(/^(\d+)\s*\(([^)]+)\)$/);
if (muddatMatch) {
  docXml = replaceText(docXml, " 20 ", ` ${muddatMatch[1]} `);
  docXml = replaceText(docXml, "yigirma", muddatMatch[2]);
}

docXml = replaceText(docXml, "(2021-yil 18-fevral, 2022-yil 4-mart, 2022-yil 16-iyun, 2023-yil 9-avgust, 2024-yil 27-iyul, 2025-yil 1-aprel sanalari)", data.OGOHLANTIRISH_XATLARI);

// Money - try both apostrophe variants
docXml = replaceText(docXml, "68 590 000 (oltmish sakkiz million besh yuz to\u2018qson ming) so\u2018m", `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
docXml = replaceText(docXml, "68 590 000 (oltmish sakkiz million besh yuz to'qson ming) so'm", `${data.QARZ_SUMMASI} (${data.QARZ_SUMMA_SOZ}) so'm`);
docXml = replaceText(docXml, "22 863 280 (yigirma ikki million sakkiz yuz oltmish uch ming ikki yuz sakson) so\u2018m", `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
docXml = replaceText(docXml, "22 863 280 (yigirma ikki million sakkiz yuz oltmish uch ming ikki yuz sakson) so'm", `${data.QARZ_QOLDIQ} (${data.QOLDIQ_SOZ}) so'm`);
docXml = replaceText(docXml, "285 791 (ikki yuz sakson besh ming yetti yuz to\u2018qson bir) so\u2018m", `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);
docXml = replaceText(docXml, "285 791 (ikki yuz sakson besh ming yetti yuz to'qson bir) so'm", `${data.OYLIK_TOLOV} (${data.OYLIK_TOLOV_SOZ}) so'm`);

docXml = replaceText(docXml, "Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko\u2018chasi 30-uy", data.MANZIL);
docXml = replaceText(docXml, "Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko'chasi 30-uy", data.MANZIL);

// Save
zip.file('word/document.xml', docXml);
const buf = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync('documents/templates/final_test.docx', buf);
console.log('SUCCESS! File saved:', buf.length, 'bytes');

// Verify
const zip2 = new PizZip(buf);
const check = zip2.file('word/document.xml').asText();
console.log('Contains CHORIYEV:', check.includes('CHORIYEV AKBARALI URALOVICH'));
console.log('Contains old KADIROV:', check.includes('KADIROV'));
console.log('Contains AB 1234567:', check.includes('AB 1234567'));
console.log('Contains notarius Raximov:', check.includes('notarius Raximov'));
console.log('Contains new sum:', check.includes('50 000 000'));
console.log('Contains old sum:', check.includes('68 590 000'));
