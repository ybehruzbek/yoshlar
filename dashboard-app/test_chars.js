const fs = require('fs');
const PizZip = require('pizzip');

const zip = new PizZip(fs.readFileSync("documents/templates/Da'vo ariza.docx", 'binary'));
let xml = zip.file('word/document.xml').asText();

// Find the EXACT address text in XML (may span multiple w:t elements)
let i = xml.indexOf('Jurjoniy MFY');
if (i >= 0) {
  console.log('XML around address:');
  console.log(xml.substring(i - 200, i + 300));
}

// Find where "30-uy" is
console.log('\n---');
i = xml.indexOf('30-uy');
if (i >= 0) {
  console.log('Around 30-uy:', xml.substring(i - 200, i + 50));
}

// What is the qoldiq text?
console.log('\n---');
i = xml.indexOf('{{QARZ_QOLDIQ}}');
if (i >= 0) {
  console.log('Around QARZ_QOLDIQ:', xml.substring(i, i + 400));
}
