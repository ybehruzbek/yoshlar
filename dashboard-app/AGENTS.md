<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🔴 MUHIM: Har bir sessiya boshida bajarilishi kerak

## 1. Avval version.md ni o'qi
```
Fayl: e:\yoshlar\version.md
```
Bu faylda loyihaning to'liq tarixi, qayerga kelingani, qanday texnologiyalar ishlatilgani, qolgan ishlar ro'yxati bor.
**Har qanday ish boshlashdan OLDIN shu faylni o'qi.**

## 2. Ish tugaganda version.md ni yangilayman
Har bir sessiyada qilgan ishlarim:
- Yangi versiya yoziladi (nima qilindi, qaysi fayllar o'zgartirildi)
- TODO ro'yxati yangilanadi
- Git commit ma'lumotlari yoziladi

## 3. Loyiha tuzilishi
- **Asosiy ilova:** `dashboard-app/` (Next.js 16 + TypeScript)
- **Baza:** PostgreSQL 17 (`yoshlar_db`) + Prisma 7
- **To'liq dizayn hujjati:** `implementation_plan.md`
- **Hujjat namunalari:** `hujjatlar-namunalari/`

## 4. Muhim texnik qarorlar
- **Prisma 7** ishlatilmoqda — `url` schema.prisma da EMAS, `prisma.config.ts` da
- **PrismaClient** yaratishda `@prisma/adapter-pg` adapter KERAK
- **Til:** Interfeys faqat O'zbek tilida
- **CSS:** globals.css da (~34KB) — Vanilla CSS + TailwindCSS
