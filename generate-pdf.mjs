import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, Header, ImageRun } from 'docx';
import { writeFileSync } from 'fs';

const TEAL = "1A5276";
const TEAL_LIGHT = "D6EAF8";
const GRAY = "F2F3F4";
const DARK = "1C2833";

const h1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
  border: { bottom: { color: TEAL, size: 8, space: 4, style: BorderStyle.SINGLE } },
  shading: { type: ShadingType.CLEAR, fill: TEAL_LIGHT },
  run: { color: TEAL, bold: true, size: 28 }
});

const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 26, color: TEAL })],
  spacing: { before: 300, after: 150 },
  border: { bottom: { color: TEAL, size: 4, space: 2, style: BorderStyle.SINGLE } }
});

const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: DARK })],
  spacing: { before: 200, after: 100 }
});

const p = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22 })],
  spacing: { after: 100 }
});

const bullet = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22 })],
  bullet: { level: 0 },
  spacing: { after: 80 }
});

const bold = (text) => new TextRun({ text, bold: true, size: 22 });
const normal = (text) => new TextRun({ text, size: 22 });

const makeTable = (headers, rows, colWidths) => new Table({
  width: { size: 9500, type: WidthType.DXA },
  rows: [
    new TableRow({
      tableHeader: true,
      children: headers.map(h => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })], alignment: AlignmentType.CENTER })],
        shading: { type: ShadingType.CLEAR, fill: TEAL },
        margins: { top: 80, bottom: 80, left: 100, right: 100 }
      }))
    }),
    ...rows.map((row, i) => new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20 })], alignment: AlignmentType.LEFT })],
        shading: { type: ShadingType.CLEAR, fill: i % 2 === 0 ? 'FFFFFF' : GRAY },
        margins: { top: 60, bottom: 60, left: 100, right: 100 }
      }))
    }))
  ]
});

const divider = () => new Paragraph({
  border: { bottom: { color: 'CCCCCC', size: 4, space: 4, style: BorderStyle.SINGLE } },
  spacing: { before: 200, after: 200 }
});

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 22, color: DARK }
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1000, bottom: 1000, left: 1200, right: 1000 }
      }
    },
    children: [

      // TITLE
      new Paragraph({
        children: [new TextRun({ text: "O'ZBEKISTON YOSHLAR ITTIFOQI", bold: true, size: 32, color: TEAL })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "TOSHKENT SHAHAR HUDUDIY KENGASHI", bold: true, size: 28, color: TEAL })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Qarz Monitoring Tizimi", bold: true, size: 36, color: DARK })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "To'liq Texnik Dizayn Hujjati", size: 24, color: "666666", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      divider(),

      // SECTION 1
      new Paragraph({ children: [new TextRun({ text: "1. LOYIHA HAQIDA", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),

      p("O'zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi ~900 nafar yoshlarga uy-joy qarz bergan. Bu tizim — barcha qarzdorlarni boshqarish, to'lovlarni kuzatish, hujjatlar yaratish va monitoring qilish uchun yagona platforma."),

      new Paragraph({ spacing: { after: 100 } }),

      makeTable(
        ["Parametr", "Ma'lumot"],
        [
          ["Jami berilgan qarz", "~63 mlrd so'm"],
          ["Qarzdorlar soni", "~900 kishi"],
          ["Tashkilot manzili", "Toshkent sh., Olmazor tumani, Universitet ko'chasi 2-uy"],
          ["Bank", '"O\'zmilliybank" AJ Mirzo Ulug\'bek BXM'],
          ["Hisob raqam", "2021 2000 8001 5554 1006"],
          ["Bank kodi", "00450"],
          ["STIR", "201 068 898"],
        ]
      ),

      new Paragraph({ spacing: { after: 200 } }),
      h3("Qarz turlari:"),

      makeTable(
        ["Tur", "Muddat", "Foiz", "To'lov tartibi"],
        [
          ["20 yillik", "240 oy", "0% (foizsiz)", "Har oy belgilangan summa (1-oy boshqacha)"],
          ["7 yillik", "84 oy", "Foizli (~7% yillik)", "Asosiy qarz + kamayib boruvchi foiz"],
        ]
      ),

      new Paragraph({ spacing: { after: 100 } }),
      new Paragraph({
        children: [
          bold("7 yillik foiz formulasi: "),
          normal("Asosiy to'lov = Qarz / 84 (doimiy) + Foiz = Qolgan qarz × (yillik foiz / 12). "),
          normal("Misol: 44.1 mln so'm qarz → Asosiy: 526,118 + Foiz: 257,798 = 783,916 so'm/oy")
        ],
        spacing: { after: 200 }
      }),

      divider(),

      // SECTION 2 — EXCEL
      new Paragraph({ children: [new TextRun({ text: "2. EXCEL FAYLLAR TUZILISHI", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),
      p("Tizimga yuklash uchun quyidagi ustunli Excel fayl tayyorlanadi:"),
      new Paragraph({ spacing: { after: 100 } }),

      makeTable(
        ["#", "Excel ustun nomi", "Tizim maydoni", "Izoh"],
        [
          ["1", "T/r.", "tartib_raqam", "Tartib raqami"],
          ["2", "Rasmi", "rasm", "Qarzdor fotosurati"],
          ["3", "Pasport bo'yicha manzili", "manzil", "To'liq manzil"],
          ["4", "F.I.O.", "fish", "To'liq ism-sharif"],
          ["5", "Pasport seriyasi va raqami", "pasport", "Masalan: AD1234567"],
          ["6", "Tug'ilgan vaqti", "tugilgan_sana", "Sana formati"],
          ["7", "JShShIR", "jshshir", "14 raqamli PINFL"],
          ["8", "Olingan qarz summasi", "qarz_summasi", "Raqamda"],
          ["9", "Olingan qarz summasi matnda", "qarz_matnda", "So'zda"],
          ["10", "Qarz shartnomasi tasdiqlangan sana", "shartnoma_sana", "Yil-oy-kun"],
          ["11", "Tasdiqlagan notarius", "notarius", "F.I.O. va idora"],
          ["12", "Shartnoma reestr raqami", "reestr_raqam", "Masalan: 201900043001468"],
          ["13", "Qarzdorlik holati sanasi", "holat_sanasi", "Hisobot sanasi"],
          ["14", "Muddati o'tkan qarz summasi", "muddat_otgan_summa", "Raqamda"],
          ["15", "Muddati o'tkan qarz summasi matnda", "muddat_otgan_matnda", "So'zda"],
          ["16", "Telefon raqami", "telefon", "+998XXXXXXXXX"],
          ["17", "Ogohlantirish xati yuborilgan sana va raqami", "ogohlantirish", "Sana va raqam"],
          ["18", "Sudga chiqarilganligi haqida ma'lumot", "sud_holati", "Matn yoki bo'sh"],
        ]
      ),

      divider(),

      // SECTION 3 — HUJJATLAR
      new Paragraph({ children: [new TextRun({ text: "3. TIZIMDA YARATILADIGAN HUJJATLAR", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),
      p("Tizim quyidagi 5 turdagi hujjatni avtomatik yaratadi. Foydalanuvchi faqat qarzdorni tanlaydi — barcha ma'lumotlar avtomatik to'ldiriladi."),
      new Paragraph({ spacing: { after: 100 } }),

      makeTable(
        ["#", "Hujjat nomi", "Maqsad", "Format"],
        [
          ["1", "Talabnoma", "Qarzdorga yuboriladi — bank rekvizitlari + kvitansiya bilan", "Word / PDF"],
          ["2", "Sud arizasi (buyruq berish)", "Sudga beriladigan asosiy ariza, 11 ta ilova ro'yxati bilan", "Word / PDF"],
          ["3", "Apellyatsiya 1-ilova", "Shartnoma ma'lumotlari tasdiqlovchi", "Word / PDF"],
          ["4", "Apellyatsiya 2-ilova", "To'lovlar jadvali va bajarilishi", "Word / PDF"],
          ["5", "Apellyatsiya 3-ilova", "Qarzdorlik hisob-kitobi", "Word / PDF"],
        ]
      ),

      new Paragraph({ spacing: { after: 200 } }),
      h3("Hujjatlarda ishlatiladigan o'zgaruvchilar:"),
      new Paragraph({ spacing: { after: 100 } }),

      makeTable(
        ["O'zgaruvchi", "To'ldiriladigan ma'lumot"],
        [
          ["{{FISH}}", "Qarzdor F.I.O. (katta harf)"],
          ["{{PASPORT}}", "Pasport seriya va raqami"],
          ["{{JSHSHIR}}", "JSHSHIR (14 raqam)"],
          ["{{MANZIL}}", "Pasport bo'yicha manzil"],
          ["{{TELEFON}}", "Telefon raqami"],
          ["{{QARZ_SUMMASI}}", "Berilgan qarz (raqamda)"],
          ["{{QARZ_MATNDA}}", "Berilgan qarz (so'zda)"],
          ["{{QARZ_TURI}}", '"20 (yigirma) yil muddatga foizsiz"'],
          ["{{SHARTNOMA_SANA}}", "Shartnoma tasdiqlangan sana"],
          ["{{NOTARIUS}}", "Notarius F.I.O. va idora"],
          ["{{REESTR_RAQAM}}", "Shartnoma reestr raqami"],
          ["{{OYLIK_TOLOV_1}}", "Birinchi oy to'lov summasi"],
          ["{{OYLIK_TOLOV}}", "Keyingi oylar to'lov summasi"],
          ["{{BOSHLASH_SANA}}", "To'lov boshlash sanasi"],
          ["{{HOLAT_SANA}}", "Qarzdorlik holati sanasi"],
          ["{{MUDDAT_OTGAN}}", "Muddati o'tgan summa (raqam)"],
          ["{{MUDDAT_OTGAN_MATN}}", "Muddati o'tgan summa (matn)"],
          ["{{BANK_NOMI}}", '"O\'zmilliybank" AJ Mirzo Ulug\'bek BXM'],
          ["{{HISOB_RAQAM}}", "2021 2000 8001 5554 1006"],
          ["{{BANK_KODI}}", "00450"],
          ["{{STIR}}", "201 068 898"],
          ["{{TASHKILOT}}", "O'ZBEKISTON YOSHLAR ITTIFOQI TOSHKENT SHAHAR HUDUDIY KENGASHI"],
          ["{{TASHKILOT_MANZIL}}", "Toshkent shahri, Olmazor tumani, Universitet ko'chasi 2-uy"],
          ["{{RAIS}}", "Sh.M.Anvarov"],
          ["{{BUGUN}}", "Hozirgi sana (avtomatik)"],
        ]
      ),

      divider(),

      // SECTION 4 — SAHIFALAR
      new Paragraph({ children: [new TextRun({ text: "4. TIZIM SAHIFALAR", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),

      makeTable(
        ["Sahifa", "URL", "Tavsif"],
        [
          ["Kirish", "/", "Login — email va parol"],
          ["Bosh sahifa", "/dashboard", "Umumiy statistika va grafiklar"],
          ["Qarzdorlar", "/debtors", "Barcha qarzdorlar ro'yxati, qidiruv, filtr"],
          ["Qarzdor profili", "/debtors/[id]", "Bitta qarzdorning to'liq ma'lumoti"],
          ["Excel yuklash", "/debtors/upload", "Qarzdorlarni Excel orqali tizimga yuklash"],
          ["To'lovlar", "/payments", "Barcha kelib tushgan to'lovlar"],
          ["To'lov yuklash", "/payments/upload", "iBank Excel orqali to'lovlarni yuklash"],
          ["Hujjatlar", "/documents", "Hujjat yaratish va saqlash markazi"],
          ["Shablonlar", "/documents/templates", "Hujjat shablonlarini boshqarish"],
          ["Kalendar", "/calendar", "To'lov muddatlari va eslatmalar"],
          ["Hisobotlar", "/reports", "Excel/PDF hisobotlar yaratish"],
          ["Sozlamalar", "/settings", "Tizim va foydalanuvchi sozlamalari"],
        ]
      ),

      new Paragraph({ spacing: { after: 200 } }),

      // Dashboard
      h3("4.1 Bosh Sahifa (Dashboard)"),
      p("4 ta asosiy statistika kartasi:"),
      makeTable(
        ["Karta", "Ko'rsatiladigan ma'lumot", "Rang"],
        [
          ["Jami qarz qoldig'i", "Barcha qarzdorlar qoldig'i yig'indisi", "Ko'k"],
          ["Jami qarzdorlar", "20 yillik + 7 yillik soni", "Yashil"],
          ["Bu oyda kutilgan to'lov", "Joriy oy to'lov summasi", "Sariq"],
          ["Muddati o'tganlar", "Kechikkan qarzdorlar soni va summasi", "Qizil"],
        ]
      ),

      new Paragraph({ spacing: { after: 200 } }),

      h3("4.2 Qarzdorlar Ro'yxati"),
      makeTable(
        ["Ustun", "Ta'rif"],
        [
          ["T/r", "Tartib raqami"],
          ["F.I.O", "To'liq ism (katta harf)"],
          ["Pasport", "Pasport seriya va raqami"],
          ["JSHSHIR", "14 raqamli identifikator"],
          ["Telefon", "Aloqa raqami"],
          ["Qarz turi", "20 yillik / 7 yillik"],
          ["Qarz summasi", "Boshlang'ich qarz (so'm)"],
          ["Muddati o'tgan", "Kechikkan summa (so'm)"],
          ["Holat sanasi", "Qarzdorlik hisobi sanasi"],
          ["Holat", "Faol / Kechikkan / Sudda / To'langan"],
          ["Amallar", "Ko'rish / Hujjat yaratish"],
        ]
      ),

      new Paragraph({ spacing: { after: 200 } }),

      h3("4.3 Qarzdor Profili (To'liq)"),
      p("Chap ustun — shaxsiy va qarz ma'lumotlari, progress bar, keyingi to'lov sanasi."),
      p("O'ng ustun — to'lovlar tarixi jadvali."),
      p("Pastki qism — yaratilgan hujjatlar va zametkalar (eslatmalar)."),
      p("Harakatlar: Hujjat yaratish (5 tur), Ma'lumotni tahrirlash, Ogohlantirish belgilash, Sudga berildi belgilash."),

      new Paragraph({ spacing: { after: 200 } }),

      h3("4.4 Hujjat Yaratish Jarayoni"),
      makeTable(
        ["Bosqich", "Tavsif"],
        [
          ["1. Tanlash", "Hujjat turini va qarzdorni tanlash"],
          ["2. To'ldirish", "Tizim barcha {{o'zgaruvchi}}larni avtomatik to'ldiradi"],
          ["3. Ko'rish", "Hujjatni ekranda oldindan ko'rish (preview)"],
          ["4. Yuklab olish", "Word (.docx) yoki PDF formatida yuklab olish"],
          ["5. Saqlash", "Hujjat tizimda saqlanadi va qayta yuklab olinishi mumkin"],
        ]
      ),

      divider(),

      // SECTION 5 — HISOBOTLAR
      new Paragraph({ children: [new TextRun({ text: "5. HISOBOTLAR", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),

      makeTable(
        ["Hisobot", "Filtrlash", "Format"],
        [
          ["Umumiy qarzdorlar ro'yxati", "Sana, qarz turi, holat", "Excel, PDF"],
          ["Muddati o'tganlar", "Sana, tuman, summa diapazoni", "Excel, PDF"],
          ["Oylik tushum hisoboti", "Oy/Yil, to'lov usuli", "Excel, PDF"],
          ["Individual qarzdor hisoboti", "Qarzdor tanlash, sana diapazoni", "Excel, PDF, Word"],
          ["Vipiska (to'lov tarixi)", "Qarzdor + sana diapazoni", "Word, PDF"],
        ]
      ),

      divider(),

      // SECTION 6 — TEXNOLOGIYA
      new Paragraph({ children: [new TextRun({ text: "6. TEXNOLOGIYA", bold: true, size: 28, color: TEAL })], spacing: { before: 300, after: 200 } }),

      makeTable(
        ["Qatlam", "Texnologiya", "Sabab"],
        [
          ["Frontend", "Next.js 15 (App Router)", "Zamonaviy, tezkor, SSR imkoniyati"],
          ["UI/Styling", "Vanilla CSS", "To'liq nazorat, premium dizayn"],
          ["Backend", "Next.js API Routes", "Alohida server kerak emas"],
          ["Ma'lumotlar bazasi", "PostgreSQL + Prisma ORM", "Ishonchli, Excel import/export uchun qulay"],
          ["Autentifikatsiya", "NextAuth.js", "Login/Logout, rol-ga asoslangan ruxsat"],
          ["Excel", "SheetJS (xlsx)", "Excel fayllarni o'qish va yozish"],
          ["Word yaratish", "docx (npm)", "Word hujjatlar yaratish"],
          ["PDF yaratish", "@react-pdf/renderer", "PDF hujjatlar yaratish"],
          ["Grafiklar", "Recharts", "Statistika va monitoring grafiklar"],
          ["Deploy", "VPS (PM2 + Nginx)", "Linux serverda ishlatish"],
        ]
      ),

      divider(),

      // SECTION 7 — SAVOLLAR
      new Paragraph({ children: [new TextRun({ text: "7. TIZIMNI BOSHLASH UCHUN KERAKLI MA'LUMOTLAR", bold: true, size: 28, color: "C0392B" })], spacing: { before: 300, after: 200 } }),

      new Paragraph({
        children: [new TextRun({ text: "Quyidagi savollarga javob berish orqali tizim ishlab chiqilishini boshlash mumkin:", size: 22, italics: true, color: "666666" })],
        spacing: { after: 200 }
      }),

      makeTable(
        ["#", "Savol", "Nima uchun kerak"],
        [
          ["1", "Deploy qayerda bo'ladi? VPS (Linux server) mi yoki Vercel mi?", "Server arxitekturasini aniqlash uchun"],
          ["2", "Tizimdan necha kishi foydalanadi? (Admin, Operator, faqat ko'ruvchi)", "Foydalanuvchi rollari va ruxsatlarni sozlash uchun"],
          ["3", "iBank dan yuklab olinadigan Excel faylning ustunlari qanday? (Namuna fayl bering)", "Oylik to'lovlarni avtomatik moslashtirish uchun"],
          ["4", "Hujjatlar faqat O'zbek tilida chiqsinmi? Yoki Rus tili ham kerakmi?", "Hujjat shablonlari tilini belgilash uchun"],
          ["5", "Kengash raisi ismi-sharifi va lavozimi o'zgaradimi yoki doim 'Sh.M.Anvarov' bo'ladimi?", "Hujjat shablonlarida avtomatik to'ldirish uchun"],
          ["6", "Shartnoma sanasidan boshlab to'lov jadvalini tizim o'zi hisoblashi kerakmi?", "Foiz va oylik to'lov hisoblash modulini qurish uchun"],
          ["7", "Eslatmalar SMS yoki email orqali yuborilsinmi? (ixtiyoriy)", "Bildirishnoma tizimini qurish uchun"],
        ]
      ),

      new Paragraph({ spacing: { after: 400 } }),

      divider(),

      // FOOTER
      new Paragraph({
        children: [new TextRun({ text: "Hujjat tayyorlandi: 2026-yil 20-aprel | Loyiha: Yoshlar Ittifoqi Qarz Monitoring Tizimi", size: 18, color: "999999", italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 }
      }),
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
writeFileSync('hujjatlar-namunalari/LOYIHA-HUJJATI.docx', buffer);
console.log("✅ Hujjat yaratildi: hujjatlar-namunalari/LOYIHA-HUJJATI.docx");
