import fs from 'fs';
import PizZip from 'pizzip';

function createFuzzyRegex(text) {
    return new RegExp(text.split('').map(c => {
        if (c === ' ') return '\\s*(?:<[^>]*>)*\\s*';
        if (/[-\/\\^$*+?.()|[\]{}]/.test(c)) return '\\' + c + '(?:<[^>]*>)*';
        return c + '(?:<[^>]*>)*';
    }).join(''), 'g');
}

function processTemplate(filename, replacements) {
    if (!fs.existsSync(filename)) return;
    const content = fs.readFileSync(filename, "binary");
    const zip = new PizZip(content);
    let docXml = zip.file("word/document.xml").asText();

    for (const { regex, text, tag } of replacements) {
        const r = regex ? regex : createFuzzyRegex(text);
        docXml = docXml.replace(r, tag);
    }

    zip.file("word/document.xml", docXml);
    const buf = zip.generate({ type: "nodebuffer", compression: "DEFLATE" });
    fs.writeFileSync(filename, buf);
    console.log(`Processed ${filename}`);
}

const davoReplacements = [
    // Pre-existing hard matches
    { regex: /K(?:<[^>]*>)*A(?:<[^>]*>)*D(?:<[^>]*>)*I(?:<[^>]*>)*R(?:<[^>]*>)*O(?:<[^>]*>)*V(?:\s|<[^>]*>)*O(?:<[^>]*>)*D(?:<[^>]*>)*I(?:<[^>]*>)*L(?:\s|<[^>]*>)*M(?:<[^>]*>)*U(?:<[^>]*>)*R(?:<[^>]*>)*A(?:<[^>]*>)*T(?:<[^>]*>)*O(?:<[^>]*>)*V(?:<[^>]*>)*I(?:<[^>]*>)*C(?:<[^>]*>)*H/g, tag: "{FISH}" },
    { text: "AD 1114901", tag: "{PASPORT}" },
    { text: "31602870171169", tag: "{JSHSHIR}" },
    { text: "Toshkent shahri, Uchtepa tumani, Jurjoniy MFY, Zamaxshariy ko‘chasi 30-uy", tag: "{MANZIL}" },
    { regex: /6(?:<[^>]*>)*8(?:\s|<[^>]*>)*5(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>).*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, tag: "{QARZ_SUMMASI} ({QARZ_SUMMA_SOZ}) so'm" },
    { regex: /2(?:<[^>]*>)*2(?:\s|<[^>]*>)*8(?:<[^>]*>)*6(?:<[^>]*>)*3(?:\s|<[^>]*>)*2(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>).*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, tag: "{QARZ_QOLDIQ} ({QOLDIQ_SOZ}) so'm" },
    { regex: /2(?:<[^>]*>)*8(?:<[^>]*>)*5(?:\s|<[^>]*>)*7(?:<[^>]*>)*9(?:<[^>]*>)*1(?:<[^>]*>).*?so(?:<[^>]*>)*(?:‘|'|.)(?:<[^>]*>)*m/g, tag: "{OYLIK_TOLOV} ({OYLIK_TOLOV_SOZ}) so'm" },
    
    // New specific replacements based on the document text
    { text: "2019-yil 20-mart", tag: "{SHARTNOMA_SANA}" },
    { text: "Toshkent shahar Olmazor tumani 2-son davlat notarial idorasida", tag: "{NOTARIUS_IDORASI}da" },
    { text: "notarius Tursunkulova Kamila Ruslanovna", tag: "notarius {NOTARIUS}" },
    { text: "201900043001468", tag: "{SHARTNOMA_RAQAMI}" },
    { text: "20 (yigirma) yil", tag: "{QARZ_MUDDATI}" },
    { text: "2019-yil 26-mart", tag: "{OTKAZILGAN_SANA}" },
    { text: "ATIB “Ipoteka banki” Yashnobod filialida", tag: "{BANK_FILIALI}" },
    { text: "2019-yil 20-aprel", tag: "{TOLOV_BOSHLANISH_SANA}" },
    { text: "2025-yil 15-dekabr", tag: "{HOLAT_SANASI}" },
    { regex: /\(2021-yil 18-fevral.*?sanalari\)/g, tag: "({OGOHLANTIRISH_XATLARI})" },
    { text: "2025-yil 19-noyabr", tag: "{TALABNOMA_SANA}" },
    { text: "2025-yil ____-dekabr", tag: "{BUGUNGI_SANA}" },
];

const talabnomaReplacements = [
    { regex: /M(?:<[^>]*>)*U(?:<[^>]*>)*X(?:<[^>]*>)*A(?:<[^>]*>)*M(?:<[^>]*>)*M(?:<[^>]*>)*E(?:<[^>]*>)*D(?:<[^>]*>)*O(?:<[^>]*>)*V(?:\s|<[^>]*>)*J(?:<[^>]*>)*A(?:<[^>]*>)*M(?:<[^>]*>)*S(?:<[^>]*>)*H(?:<[^>]*>)*I(?:<[^>]*>)*D(?:\s|<[^>]*>)*A(?:<[^>]*>)*K(?:<[^>]*>)*B(?:<[^>]*>)*A(?:<[^>]*>)*R(?:<[^>]*>)*O(?:<[^>]*>)*V(?:<[^>]*>)*I(?:<[^>]*>)*C(?:<[^>]*>)*H/g, tag: "{FISH}" },
    { text: "Toshkent shahar, Yunusobod tumani,Markaz 4-kvartal, Qashqar MFY, 31-uy,26-xonadonda", tag: "{MANZIL}" },
    { text: "Toshkent shahar, Yunusobod tumani, Markaz 4-kvartal, Qashqar MFY, 31-uy, 26-xonadonda", tag: "{MANZIL}" }, // Just in case space differs
    { text: "2019-yil 13-dekabr", tag: "{SHARTNOMA_SANA}" },
    { text: "Toshkent shahar, Yashnobod tumani 7-son davlat notarial idorasida", tag: "{NOTARIUS_IDORASI}da" },
    { text: "201901137004736", tag: "{SHARTNOMA_RAQAMI}" },
    { text: "20 (yigirma) yil", tag: "{QARZ_MUDDATI}" },
    { text: "2019-yil 15-dekabr", tag: "{TOLOV_BOSHLANISH_SANA}" },
    { regex: /6(?:<[^>]*>)*9(?:\s|<[^>]*>)*6(?:<[^>]*>)*5(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>).*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, tag: "{QARZ_SUMMASI} ({QARZ_SUMMA_SOZ}) so'm" },
    { regex: /2(?:<[^>]*>)*2(?:\s|<[^>]*>)*3(?:<[^>]*>)*8(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>).*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, tag: "{QARZ_QOLDIQ} ({QOLDIQ_SOZ}) so'm" },
    { regex: /3(?:<[^>]*>)*4(?:<[^>]*>)*6(?:\s|<[^>]*>)*4(?:<[^>]*>)*8(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>).*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, tag: "{OYLIK_TOLOV} ({OYLIK_TOLOV_SOZ}) so'm" },
    { regex: /2(?:<[^>]*>)*9(?:<[^>]*>)*0(?:\s|<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>)*,(?:<[^>]*>)*0(?:<[^>]*>)*0(?:<[^>]*>).*?t(?:<[^>]*>)*i(?:<[^>]*>)*y(?:<[^>]*>)*i(?:<[^>]*>)*n/g, tag: "{OYLIK_TOLOV} ({OYLIK_TOLOV_SOZ}) so'm" },
    { text: "2026-yil 15-aprel", tag: "{HOLAT_SANASI}" }
];

try {
    processTemplate("documents/templates/Da'vo ariza.docx", davoReplacements);
    processTemplate("documents/templates/Talabnoma uy-joy.docx", talabnomaReplacements);
} catch(e) {
    console.error("Error processing templates:", e);
}
