# Yoshlar Ittifoqi — Qarz Monitoring Tizimi
## To'liq Dizayn Hujjati (Haqiqiy Fayllar Asosida)

---

## 1. LOYIHA HAQIDA

**O'zbekiston Yoshlar Ittifoqi Toshkent Shahar Hududiy Kengashi** ~900 nafar yoshlarga uy-joy qarz bergan.

| Parametr | Ma'lumot |
|----------|---------|
| Jami berilgan qarz | ~63 mlrd so'm |
| Qarzdorlar soni | ~900 kishi |
| Manzil | Toshkent sh., Olmazor tumani, Universitet ko'chasi 2-uy |
| Bank | "O'zmilliybank" AJ Mirzo Ulug'bek BXM |
| Hisob raqam | 2021 2000 8001 5554 1006 |
| STIR | 201 068 898 |

### Qarz turlari:

| Tur | Muddat | Foiz | Oylik to'lov |
|-----|--------|------|-------------|
| **20 yillik** | 240 oy | 0% | Belgilangan: 1-oy boshqacha, keyingi oylar bir xil |
| **7 yillik** | 84 oy | Foizli (~7% yillik) | Asosiy qarz + foiz (kamayib boruvchi) |

**7 yillik foiz formulasi** (fayldan aniqlangan — oddiy foiz, kamayib boruvchi):
- Har oy: Asosiy to'lov = Qarz / 84 (doimiy)
- Foiz = Qolgan qarz × (yillik foiz / 12)
- Jami to'lov = Asosiy + Foiz
- Misol: 44,193,943 so'm qarz → Asosiy: 526,118.37 + Foiz: 257,798 = 783,916.37 so'm/oy

---

## 2. EXCEL FAYLLAR TUZILISHI

### Ro'yxat 20 yillik.xlsx / Ro'yxat 7 yillik.xlsx

Sarlavha: **"Uy-joy qarzdorlik ro'yxati 20-yillik / 7-yillik"**

| # | Ustun nomi (Excelda) | Tizim maydoni |
|---|----------------------|---------------|
| 1 | T/r. | tartib_raqam |
| 2 | Rasmi | rasm (foto) |
| 3 | Pasport bo'yicha manzili | manzil |
| 4 | F.I.O. | fish |
| 5 | Pasport seriyasi va raqami | pasport |
| 6 | Tug'ilgan vaqti | tugilgan_sana |
| 7 | JShShIR | jshshir (PINFL) |
| 8 | Olingan qarz summasi | qarz_summasi |
| 9 | Olingan qarz summasi matnda | qarz_matnda |
| 10 | Qarz shartnomasi tasdiqlangan sana | shartnoma_sana |
| 11 | Tasdiqlagan notarius | notarius |
| 12 | Shartnoma reestr raqami | reestr_raqam |
| 13 | Qarzdorlik holati sanasi | holat_sanasi |
| 14 | Muddati o'tkan qarz summasi | muddat_otgan_summa |
| 15 | Muddati o'tkan qarz summasi matnda | muddat_otgan_matnda |
| 16 | Telefon raqami | telefon |
| 17 | Ogohlantirish xati yuborilgan sana va raqami | ogohlantirish |
| 18 | Sudga chiqarilganligi haqida ma'lumot | sud_holati |

---

## 3. HUJJATLAR TAHLILI

Haqiqiy fayllardan 5 turdagi hujjat aniqlandi:

### A. TALABNOMA (Talabnoma uy-joy.docx)
Qarzdorga yuboriluvchi rasmiy talab xati.

**Tarkibi:**
- Sarlavha: Qarzdor manzili
- Asosiy matn: Shartnoma ma'lumotlari, to'lanmagan summa, muddat
- Kvitansiya: Bank rekvizitlari, to'lov summasi, to'lov maqsadi
- Imzo: Kengash raisi Sh.M.Anvarov

**O'zgaruvchilar:**
```
{{MANZIL}} — Qarzdor manzili
{{FISH}} — Qarzdor F.I.O.
{{SHARTNOMA_SANA}} — Shartnoma sanasi
{{NOTARIUS_TUMAN}} — Notarius tumani
{{REESTR_RAQAM}} — Shartnoma reestr raqami
{{QARZ_SUMMASI}} — Berilgan qarz (raqamda)
{{QARZ_SUMMASI_MATN}} — Berilgan qarz (so'zda)
{{MUDDAT}} — 20 yil / 7 yil
{{BIRINCHI_OY_TOLOV}} — Birinchi oylik to'lov
{{KEYINGI_OY_TOLOV}} — Keyingi oylar to'lov
{{HOLAT_SANA}} — Qarzdorlik holati sanasi
{{MUDDAT_OTGAN}} — Muddati o'tgan summa (raqamda)
{{MUDDAT_OTGAN_MATN}} — Muddati o'tgan summa (so'zda)
{{BANK_NOMI}} — Bank nomi
{{HISOB_RAQAM}} — Hisob raqami
{{BANK_KODI}} — Bank kodi
{{STIR}} — STIR
{{TOLOV_MAQSADI}} — To'lov maqsadi matni
{{TALABNOMA_SANA}} — Talabnoma sanasi
```

---

### B. ARIZA — Sud buyrug'i (Da'vo ariza.docx)
Sudga beriladigan asosiy ariza.

**Tarkibi:**
- Sudga sarlavha: "Fuqarolik ishlari bo'yicha Mirzo Ulug'bek tumanlararo sudiga"
- Undiruvchi ma'lumotlari (Yoshlar Ittifoqi)
- Qarzdor ma'lumotlari: F.I.O., manzil, pasport, JSHSHIR
- Ariza matni: shartnoma tarixi, to'lovlar tarixi, qarzdorlik summasi
- So'rov qismi: sud buyrug'i chiqarilsin
- Ilovalar ro'yxati (11 ta hujjat)

**O'zgaruvchilar (talabnomadagilardan + qo'shimcha):**
```
{{PASPORT}} — Pasport seriya va raqami
{{JSHSHIR}} — JSHSHIR raqami
{{NOTARIUS_FISH}} — Notarius F.I.O.
{{BOSHLANG_SANA}} — To'lovlar boshlangan sana (shartnoma + 15 kun)
{{OGOHLANTIRISH_SANALAR}} — Yuborilgan ogohlantirish xatlar sanasi
{{BANK_QARZDOR}} — Qarzdor bank nomi (O'zsanoatqurilishbank)
{{SUB_BANK}} — Qarzdor bank filiali
{{ARIZA_SANA}} — Ariza sanasi
```

---

### C. APELLYATSIYA ILOVALAR (3 ta ilova)
Sud jarayonida apellyatsiya shikoyatiga qo'shimcha hujjatlar.

**1-ilova** — Shartnoma ma'lumotlari tasdiqlovchi
**2-ilova** — To'lovlar jadvali va bajarilishi
**3-ilova** — Qarzdorlik hisob-kitobi

---

### D. AKT SVERKA (Akt sverka.PDF)
Ikki tomon o'rtasidagi hisoblarni solishtirish dalolatnomasi (Akt sверки).

---

### E. IJRO VARAQASI (Ижро варақаси.pdf)
Sud ijrosi uchun ijro varaqi (sud tomonidan chiqariladi, tizimda saqlanadi).

---

## 4. SAHIFALAR

### 4.1 Login (`/`)
- Email + parol
- Yoshlar Ittifoqi logotipi
- Premium dark glassmorphism dizayn

---

### 4.2 Dashboard (`/dashboard`)

**4 ta statistika kartasi:**
| Karta | Ma'lumot |
|-------|---------|
| Jami qarz qoldig'i | Barcha qarzdorlar qoldig'i yig'indisi |
| Jami qarzdorlar | 20 yillik + 7 yillik soni |
| Bu oyda kutilgan | Joriy oy to'lov summasi |
| Muddati o'tganlar | Kechikkan qarzdorlar soni + summasi |

**Grafiklar:**
- Oylik tushum trendi (Line chart, 12 oy)
- 20 yillik vs 7 yillik taqsimot (Donut chart)

**Tezkor jadvallar:**
- Kelasi 7 kunda to'lov muddati (ism, summa, sana, tur)
- Muddati o'tganlar (ism, kechikkan kun, summa, holat)

---

### 4.3 Qarzdorlar Ro'yxati (`/debtors`)

**Toolbar:** Qidiruv + Filtr (tur, holat, tuman) + Excel yuklash + Eksport

**Jadval ustunlari:**
```
T/r | F.I.O | Pasport | JSHSHIR | Telefon | Tur |
Qarz summasi | Muddati o'tgan | Holat_sana | Holat | Amallar
```

**Holat badge-lari:**
- 🟢 Faol — to'lovlar vaqtida
- 🔴 Kechikkan — muddati o'tgan qarz bor
- ⚫ Sudda — sudga berilgan
- ✅ To'langan — qarz to'liq yopilgan

**Qator rangi:** Kechikkanlar — och qizil fon

---

### 4.4 Qarzdor Profili (`/debtors/[id]`)

**Chap ustun — Shaxsiy ma'lumotlar:**
```
F.I.O (katta harfda)
Pasport: AA 1234567
JSHSHIR: 12345678901234
Telefon: +998 XX XXX XX XX
Manzil: (to'liq manzil)
──────────────────────
QARZ MA'LUMOTLARI
Turi: 20 yillik (foizsiz)
Shartnoma sanasi: YYYY-yil DD-oy
Reestr raqami: 20190XXXXXXXXX
Notarius: F.I.O va idora
──────────────────────
Berilgan summa: XX,XXX,XXX so'm
To'langan: XX,XXX,XXX so'm
Qoldiq: XX,XXX,XXX so'm
Progress bar: XX%
──────────────────────
Oylik to'lov: XXX,XXX so'm
Keyingi to'lov sanasi: DD.MM.YYYY
──────────────────────
Muddati o'tgan: XX,XXX,XXX so'm
```

**O'ng ustun — To'lovlar tarixi jadvali:**
Sana | Summa | Usul | Izoh | Kim kiritdi

**Pastki qism — Hujjatlar va Zametkalar:**

*Hujjatlar tab:*
- Talabnomalar, Ariza, Apellyatsiya ilovalar, Akt sverka, Ijro varaqi
- Har birida: Sana, tur, yuklab olish, ko'rish

*Zametkalar tab:*
- Matn, sana, kim yozgan
- Eslatma belgilash (kalendar bilan bog'liq)

**Harakatlar tugmalari:**
- 📄 Hujjat yaratish (dropdown — 5 tur)
- ✏️ Ma'lumotni tahrirlash
- 📋 Ogohlantirish xati yuborildi (belgilash)
- ⚖️ Sudga berildi (belgilash)

---

### 4.5 Excel Yuklash — Qarzdorlar (`/debtors/upload`)

**3 bosqich:**
1. Fayl yuklash (drag & drop) — `.xlsx`, `.xls`
2. Ustunlar moslashuvi ko'rsatiladi (preview jadval)
3. Tasdiqlash → DB ga saqlash, xato qatorlar ko'rsatiladi

---

### 4.6 To'lovlar (`/payments`)

**Toolbar:** Sana filtri + Usul filtri + Qidiruv + "To'lov yuklash"

**Jadval:**
```
Sana | Qarzdor | Summa | Usul (Bank/Payme) | Holat | Batch
```

**Yuqori statistika:**
- Joriy oy jami tushum
- O'tgan oyga nisbatan farq (+/-)

---

### 4.7 To'lovlarni Yuklash — iBank (`/payments/upload`)

**4 bosqich:**
1. iBank Excel fayl yuklash
2. Avtomatik moslashtirish (F.I.O. yoki pasport bo'yicha)
3. Topilmaganlarni qo'lda tanlash
4. Tasdiqlash → To'lovlar saqlanadi, qarz qoldig'i yangilanadi

---

### 4.8 Hujjatlar Markazi (`/documents`)

**Sidebar — Hujjat turlari:**
1. 📋 Talabnoma (qarzdorlikni qoplash to'g'risida)
2. ⚖️ Sud arizasi (buyruq berish to'g'risida)
3. 📊 Apellyatsiya 1-ilova
4. 📊 Apellyatsiya 2-ilova
5. 📊 Apellyatsiya 3-ilova
6. 🤝 Akt sverka
7. 📜 Ijro varaqi (yuklash)

**Hujjat yaratish jarayoni:**
1. Hujjat turini tanlash
2. Qarzdorni qidirib topish
3. Ma'lumotlar avtomatik to'ldiriladi (shablondan)
4. Sana va qo'shimcha maydonlarni to'ldirish
5. Ko'rish (preview)
6. Word (.docx) yoki PDF yuklab olish

---

### 4.9 Shablonlar (`/documents/templates`)

Har bir shablon:
- Nomi, turi
- HTML/DOCX kontent (o'zgaruvchilar bilan)
- Tahrirlash imkoniyati
- Oldindan ko'rish

---

### 4.10 Kalendar (`/calendar`)

- Oylik kalendar ko'rinishi
- Har kunda: to'lov muddati bo'lgan qarzdorlar soni
- Rang: 🟢 To'langan | 🔴 Kechikkan | 🟡 Bugun/Ertaga | 🔵 Eslatma
- Eslatmalar: Matn + Sana + Qarzdorga bog'lash

---

### 4.11 Hisobotlar (`/reports`)

| Hisobot | Filtr | Format |
|---------|-------|--------|
| Umumiy qarzdorlar | Sana, tur | Excel, PDF |
| Muddati o'tganlar | Sana, tuman | Excel, PDF |
| Oylik tushum | Oy/Yil | Excel, PDF |
| Individual qarzdor | Qarzdor tanlash | Excel, PDF |
| Vipiska (to'lov tarixi) | Qarzdor + sana | Word, PDF |

---

### 4.12 Avtomatik To'lov Jadvali (`/debtors/[id]/schedule`)

Qarzdor ma'lumotlari kiritilganda tizim **to'liq 240 oylik (20 yil) yoki 84 oylik (7 yil) jadval** hisoblaydi.

**20 yillik jadval:**
- 1-oy: alohida summa (berilgan qarz - keyingi oylar × 239)
- 2–240 oy: doimiy oylik to'lov = `qarz_summasi / 240` (taxminan)

**7 yillik jadval (foizli):**
- Asosiy to'lov = `qarz_summasi / 84` (doimiy)
- Foiz = `qolgan_qarz × (foiz_stavka / 12)`
- Jami = Asosiy + Foiz (har oy kamayib boradi)

**Jadval ko'rinishi:**

| Oy | Sana | Asosiy | Foiz | Jami to'lov | Qoldiq |
|----|------|--------|------|-------------|--------|
| 1 | 15.01.2020 | 346,480 | 0 | 346,480 | 69,310,000 |
| 2 | 15.02.2020 | 290,000 | 0 | 290,000 | 69,020,000 |
| ... | ... | ... | ... | ... | ... |

- Har oy to'langan/to'lanmagan belgisi ko'rsatiladi
- Kechikkan oylar qizil rang bilan
- Excel ga eksport qilish mumkin

---

### 4.13 Ogohlantirish Tarixi (`/debtors/[id]` ichida tab)

Har bir qarzdorga yuborilgan barcha xatlar tizimda saqlanadi:

| Sana | Tur | Raqami | Kim yubordi | Holat |
|------|-----|--------|-------------|-------|
| 2022-03-04 | Ogohlantirish xati | OX-001/2022 | Operator1 | Yuborildi |
| 2025-11-20 | Talabnoma | TN-045/2025 | Operator2 | Yuborildi |
| 2026-04-15 | Sud arizasi | SA-012/2026 | Admin | Sudda |

**Belgilash tugmachalari (bir bosish):**
- ✉️ "Ogohlantirish xati yuborildi" → sana va raqam kiritiladi
- 📋 "Talabnoma yuborildi" → sana va raqam kiritiladi  
- ⚖️ "Sudga berildi" → sud nomi va sana kiritiladi
- 🏛️ "Ijro varaqi keldi" → sana kiritiladi

---

### 4.14 Sud Bo'limi (`/court`)

Sudga berilgan barcha qarzdorlar alohida sahifada:

**Statistika kartalar:**
- Jami sudda: XX ta
- Ijro varaqasi kutilmoqda: XX ta  
- Ijro jarayonida: XX ta

**Jadval:**

| F.I.O | Sudga berilgan sana | Sud nomi | Muddati o'tgan summa | Ijro varaqi | Holat |
|-------|--------------------|---------|--------------------|-------------|-------|

**Holat bosqichlari:**
1. 📤 Ariza berildi
2. ⏳ Sud buyrug'i kutilmoqda
3. 📄 Sud buyrug'i chiqdi
4. 🏛️ Ijro varaqi berildi
5. 💰 Ijro jarayonida
6. ✅ Yopildi

---

### 4.15 SMS Xabarnomalar (`/settings/sms`)

Avtomatik SMS yuborish (Eskiz.uz yoki Playmobile API):

| Holat | SMS matni | Qachon |
|-------|-----------|--------|
| 3 kun oldin | "Hurmatli [ISM], [SANA] kuni [SUMMA] so'm to'lov muddatingiz yaqinlashmoqda." | To'lov sanasidan 3 kun oldin |
| Muddati o'tgan | "Hurmatli [ISM], to'lov muddatingiz o'tdi. Iltimos [SUMMA] so'm qarzdorlikni to'lang." | Muddatdan 1 kun o'tgach |
| To'lov qabul | "Hurmatli [ISM], [SUMMA] so'm to'lovingiz qabul qilindi. Rahmat!" | To'lov kiritilganda |

**Sozlamalar:**
- SMS xabarnomani yoqish/o'chirish (global)
- Har bir xabar uchun alohida yoqish/o'chirish
- SMS tarixi (yuborilgan/xato)
- Qoldiq SMS kredit ko'rsatish

---

### 4.16 Xavf Darajasi — Risk Scoring (`/debtors` da ustun)

Har bir qarzdorga avtomatik **xavf balli (0–100)** hisoblanadi:

**Hisoblash formulasi:**
```
Xavf bali = (
  kechikkan_oylar × 20 +
  kechikkan_summa_foizi × 30 +
  ogohlantirish_soni × 10 +
  sudda_bo'lgan × 40
) → 0–100 ga normalizatsiya
```

**Darajalar:**

| Ball | Daraja | Rang | Tavsif |
|------|--------|------|--------|
| 0–25 | 🟢 Yaxshi | Yashil | Doim o'z vaqtida |
| 26–50 | 🟡 Diqqat | Sariq | 1–2 marta kechikkan |
| 51–75 | 🟠 Xavfli | To'q sariq | 3+ marta kechikkan |
| 76–100 | 🔴 Kritik | Qizil | Sudga berilgan / 3+ oy to'lamagan |

- Dashboard da: xavf darajasi bo'yicha taqsimot (donut chart)
- Filtr: faqat "Kritik" yoki "Xavfli" ni ko'rsatish

---

### 4.17 Prognoz va Analitika (`/reports/forecast`)

**Oylik tushum prognozi:**
- Kelasi 3 oy uchun kutilgan tushum (to'lov jadvalidan)
- Tarixiy to'lov foizi asosida real kutilgan tushum
- "Agar XX% kechiksa" — budjet kamomadi hisob-kitobi

**Ko'rsatkichlar:**

| Ko'rsatkich | Hisoblash |
|------------|----------|
| To'lov faolligi | To'langan / Kutilgan × 100% |
| Kechikish o'rtachasi | Kechikkan kunlar o'rtachasi |
| Xavf ostidagi summa | 3+ oy to'lamagan qarzdorlar summasi |
| Prognoz (3 oy) | Jadval summasi × tarixiy to'lov % |

**Grafik:** Prognoz vs Haqiqiy tushum (bar chart, 6 oy)

---

### 4.18 Bulk (Ommaviy) Hujjat Yaratish (`/documents/bulk`)

Bir vaqtda ko'p qarzdorga hujjat yaratish:

**Jarayon:**
1. Hujjat turini tanlash (Talabnoma / Sud arizasi ...)
2. Qarzdorlarni tanlash:
   - ☑️ Bittabittasini belgilash
   - Filtr: "Muddati o'tganlar" → barchasi avtomatik tanlanadi
   - "Barchani tanlash" tugmasi
3. "XX ta hujjat yaratish" tugmasi
4. Natija: barcha hujjatlar **ZIP arxivida** yuklab olinadi
5. Yoki: har birini alohida ko'rish va yuklab olish

**Muhim:** Har bir hujjat o'sha qarzdorning o'z ma'lumotlari bilan to'ldiriladi.

---

### 4.19 Ogohlantirish Belgilash (Tezkor amal)

Qarzdorlar ro'yxatida va profilida — bir tugma bilan belgilash:

**Ro'yxatda (inline):**
- Har bir qatorda: `[ Xat yuborildi ✓ ]` tugmasi
- Bosganda: modal ochiladi → Sana + raqam kiritiladi → Saqlanadi

**Profil sahifasida:**
- Timeline ko'rinishida barcha ogohlantirish tarixi
- Yangi belgilash qo'shish
- Hujjat bilan bog'lash (ixtiyoriy)

**Dashboard da:**
- "Ogohlantirish yuborilmagan kechikkanlar" — alohida widget

---

### 4.20 Qisman To'lov Hisoblash

Qarzdor belgilangan summadan **kam to'lasa** — tizim avtomatik hisoblab ko'rsatadi:

**Misol:**
```
Oylik to'lov: 290,000 so'm
Haqiqiy to'lov: 150,000 so'm
──────────────────────────────
Qisman to'langan: 150,000 so'm
Qoldiq (shu oy uchun): 140,000 so'm
Umumiy kechikkan qarz: oldingi + 140,000
```

**Ko'rinish — To'lov jadvalida:**

| Oy | Kerak | To'langan | Farq | Holat |
|----|-------|-----------|------|-------|
| Mart 2026 | 290,000 | 150,000 | -140,000 | ⚠️ Qisman |
| Aprel 2026 | 290,000 | 0 | -290,000 | ❌ To'lanmagan |
| May 2026 | 290,000 | 290,000 | 0 | ✅ To'liq |

**Qoidalar:**
- Qisman to'lov qoldiq oylik qarzga qo'shiladi
- Hujjatlarda "muddati o'tgan summa" jami yig'ilgan qoldiq bo'ladi
- Risk score qisman to'lovlarni ham hisobga oladi

---

### 4.21 Jarima Hisoblash (Penalty)

7 yillik foizli qarzlar uchun kechikish jarimasi (agar shartnomada ko'rsatilgan bo'lsa):

**Formula:**
```
Kunlik jarima = Kechikkan summa × (yillik jarima stavkasi / 365)
Jami jarima = Kunlik jarima × Kechikkan kunlar soni
```

**Profil sahifasida alohida blok:**
```
┌──────────────────────────────────┐
│  JARIMA HISOB-KITOBI              │
│  Kechikkan summa:  XX,XXX so'm   │
│  Kechikkan kun:    45 kun        │
│  Jarima stavkasi:  0.033%/kun    │
│  Jami jarima:      XX,XXX so'm   │
│  JAMI QARZ:        XX,XXX so'm   │
└──────────────────────────────────┘
```

- Hujjat (ariza, talabnoma) yaratganda jarima summasi ham avtomatik kiritiladi
- Jarima hisobini yoqish/o'chirish sozlamalardan (admin)
- Jarima stavkasini sozlamalardan o'zgartirish

---

### 4.22 To'lov Usuli Statistikasi

**Dashboard da widget:**

```
TO'LOV USULLARI (joriy yil)
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏦 Bank:   68%  ████████████████░░░░░
📱 Payme:  32%  ████████░░░░░░░░░░░░░
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bank:  XX,XXX,XXX so'm
Payme: XX,XXX,XXX so'm
```

**To'lovlar sahifasida:**
- Filtr: Bank / Payme / Hammasi
- Har oy bank vs payme solishtiruv grafigi (bar chart)
- Eksport: usul bo'yicha alohida Excel varaqlari

---

### 4.23 Rang Belgisi — Kechikish Darajasi

Qarzdorlar ro'yxatida har bir qator **muddati o'tgan davr** asosida rangilanadi:

| Holat | Rang | Qoida |
|-------|------|-------|
| ✅ Vaqtida | Oq fon | Kechikish yo'q |
| 🟡 Kechik | Och sariq | 1 oy to'lamagan |
| 🟠 Xavfli | Och to'q sariq | 2–4 oy to'lamagan |
| 🔴 Kritik | Och qizil | 5+ oy to'lamagan |
| ⚫ Sudda | Och kulrang | Sudga berilgan |

**Filtr "Rang bo'yicha":**
- Faqat qizillarni ko'rsat → bir bosish bilan bulk talabnoma chiqarish

**Qarzdor profilida:**
- Profil sarlavhasi rangi ham shu rangga moslanadi
- "Oxirgi X oy to'lamagan" — katta va aniq ko'rsatiladi

---

### 4.24 Faollik Logi — Audit Trail (`/settings/logs`)

Tizimda **kim, qachon, nimani** qildi — barchasi yozib boriladi:

**Log yozuvlari misoli:**

| Vaqt | Foydalanuvchi | Amal | Tafsilot |
|------|---------------|------|---------|
| 20.04.2026 14:32 | operator1 | To'lov kiritdi | Aliyev B. — 290,000 so'm |
| 20.04.2026 14:35 | operator1 | Hujjat yaratdi | Talabnoma — Karimov A. |
| 20.04.2026 15:01 | admin | Qarzdor tahrirladi | Ruziyev S. — telefon o'zgartirdi |
| 20.04.2026 15:20 | operator2 | Excel yukladi | 45 ta to'lov, 3 ta moslashmadi |

**Filtrlar:**
- Foydalanuvchi bo'yicha
- Amal turi bo'yicha (kiritdi / tahrirladi / o'chirdi / yukladi)
- Sana diapazoni

**Foyda:** Xato kiritish yuz berganda, kim qachon qilganini aniqlash. Admin uchun to'liq nazorat.

---

### 4.25 KPI Dashboard — Rahbariyat Uchun (`/dashboard/kpi`)

Rahbariyat uchun alohida ko'rinish — umumiy holat bir sahifada:

**Asosiy ko'rsatkichlar (yuqori qism — 6 ta karta):**

| Ko'rsatkich | Formula | Maqsad |
|------------|---------|--------|
| Yillik undirilgan | Jami to'lovlar (yil) | Maqsad: XX mlrd |
| Undirilish foizi | To'langan / Kutilgan × 100 | Maqsad: 85%+ |
| Faol qarzdorlar | Hozir to'layotganlar | 900 dan |
| Muddati o'tgan | Kechikkan qarzdorlar soni | Kamroq bo'lsin |
| Sud arizalari | Bu yilgi sud arizalar | Monitoring |
| O'rtacha kechikish | Kechikkan kunlar o'rtachasi | Kamroq bo'lsin |

**Grafiklar:**
- Oylik tushum (Line chart, 12 oy) — **Maqsad chizig'i bilan birga**
- Qarzdorlar holati (Donut: Faol / Kechikkan / Sudda / To'langan)
- Top 10 — eng ko'p kechikkanlar jadvali
- Viloyat / tuman bo'yicha taqsimot (bar chart)

**Eksport:** Butun KPI sahifasini PDF ga chiqarish — rahbariyatga taqdimot uchun

---

## 5. MA'LUMOTLAR BAZASI SXEMASI

```sql
-- Foydalanuvchilar
users: id, name, email, password_hash, role (admin/operator/viewer), created_at

-- Qarzdorlar
debtors: id, tartib_raqam, fish, manzil, pasport, tugilgan_sana, jshshir,
         telefon, created_at, updated_at

-- Qarzlar
loans: id, debtor_id, loan_type (20yil/7yil), qarz_summasi, qarz_matnda,
       shartnoma_sana, notarius, reestr_raqam, holat_sanasi,
       muddat_otgan_summa, oylik_tolov, foiz_stavka,
       status, risk_score, created_at

-- To'lov jadvali (avtomatik hisoblangan)
loan_schedule: id, loan_id, oy_raqam, tolov_sana, asosiy, foiz,
               jami, qoldiq, tolandi (bool), tolov_id

-- To'lovlar
payments: id, loan_id, summa, tolov_sana, usul (bank/payme),
          batch_id, maqsad, kim_kiritdi, created_at

-- Yuklash partiyalari
payment_batches: id, fayl_nomi, yuklangan_sana, jami, moslashdi, moslashmadi,
                 jami_summa, kim_yukladi

-- Hujjatlar
documents: id, loan_id, hujjat_turi, shablon_id, fayl_yoli,
           generated_data (JSON), holat, kim_yaratdi, created_at

-- Shablonlar
templates: id, nomi, turi, kontent (HTML), ozgaruvchilar (JSON),
           kim_yaratdi, updated_at

-- Zametkalar va eslatmalar
notes: id, debtor_id, user_id, matn, eslatma_sana, is_eslatma, created_at

-- Ogohlantirish tarixi
warnings: id, loan_id, user_id, turi (ogohlantirish/talabnoma/sud_arizasi/ijro_varaqi),
          sana, raqami, izoh, document_id, created_at

-- SMS tarixi
sms_logs: id, debtor_id, telefon, matn, sabab, holat (yuborildi/xato),
          yuborilgan_sana, created_at

-- Faollik logi (audit trail)
audit_logs: id, user_id, amal (create/update/delete/upload/generate),
            model (loans/payments/documents...), model_id,
            eski_qiymat (JSON), yangi_qiymat (JSON), ip_address, created_at

-- Jarima sozlamalari
penalty_settings: id, loan_type, stavka_yillik, faol (bool), updated_by, updated_at
```

---

## 6. HUJJAT O'ZGARUVCHILARI — TO'LIQ RO'YXAT

```
{{FISH}}                 → Qarzdor F.I.O. (katta harf)
{{FISH_KICHIK}}          → Qarzdor F.I.O. (oddiy)
{{PASPORT}}              → Pasport seriya + raqam
{{JSHSHIR}}              → JSHSHIR (14 raqam)
{{MANZIL}}               → Pasport bo'yicha manzil
{{TELEFON}}              → Telefon raqami
{{TUGILGAN_SANA}}        → Tug'ilgan sanasi

{{QARZ_TURI}}            → "20 (yigirma) yil muddatga foizsiz"
{{QARZ_SUMMASI}}         → Raqamda: 69 656 480,00
{{QARZ_MATNDA}}          → So'zda: (oltmish to'qqiz million...)
{{SHARTNOMA_SANA}}       → Shartnoma tasdiqlangan sana
{{NOTARIUS}}             → Notarius F.I.O.
{{NOTARIUS_IDORA}}       → Notarial idora nomi
{{REESTR_RAQAM}}         → Shartnoma reestr raqami

{{OYLIK_TOLOV_1}}        → Birinchi oy to'lov
{{OYLIK_TOLOV}}          → Keyingi oylar to'lov
{{BOSHLASH_SANA}}        → To'lov boshlash sanasi

{{HOLAT_SANA}}           → Qarzdorlik holati sanasi
{{MUDDAT_OTGAN}}         → Muddati o'tgan summa (raqam)
{{MUDDAT_OTGAN_MATN}}    → Muddati o'tgan summa (matn)

{{BANK_NOMI}}            → "O'zmilliybank" AJ Mirzo Ulug'bek BXM
{{HISOB_RAQAM}}          → 2021 2000 8001 5554 1006
{{BANK_KODI}}            → 00450
{{STIR}}                 → 201 068 898
{{TASHKILOT}}            → O'ZBEKISTON YOSHLAR ITTIFOQI TOSHKENT SHAHAR HUDUDIY KENGASHI
{{TASHKILOT_MANZIL}}     → Toshkent shahri, Olmazor tumani, Universitet ko'chasi 2-uy
{{RAIS}}                 → Sh.M.Anvarov

{{BUGUN}}                → Hozirgi sana
{{TALABNOMA_SANA}}       → Talabnoma/ariza sanasi
```

---

## 7. TEXNOLOGIYA

| Qatlam | Texnologiya |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Vanilla CSS (Custom Design System) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials) |
| Excel o'qish | SheetJS (xlsx) |
| Word yaratish | docx (npm) |
| PDF yaratish | @react-pdf/renderer |
| Charts | Recharts |
| SMS | Eskiz.uz API (yoki Playmobile) |
| Arxivlash | archiver (ZIP bulk hujjatlar) |
| Deploy | VPS (PM2 + Nginx) |

---

## 8. QABUL QILINGAN QARORLAR

1. **Deploy:** Boshlang'ich bosqichda lokal muhitda ishlaydi, yakunlangach VPS serverga joylanadi.
2. **Til:** Faqat O'zbek tili.
3. **Foydalanuvchilar:** Maksimal 5-10 kishi, lekin kelajakda kengayishiga moslashuvchan (scalable) arxitektura bo'ladi.
4. **Hujjatlar formati:** Talabnoma va arizalar ham Word (`.docx`), ham PDF formatida yuklanadigan bo'ladi.
5. **iBank Excel:** Keyinroq taqdim qilinadi, hozircha asosiy funksionalliklar qilinadi.

Loyihani kod yozish jarayoni boshlandi! 🚀
