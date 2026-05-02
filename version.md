# 📋 Yoshlar Ittifoqi — Qarz Monitoring Tizimi: Versiya Tarixi

> **Bu faylni har bir sessiya boshida o'qing!**
> Loyihada nima qilingan, qayerga kelingan — hammasi shu yerda.

---

## Loyiha haqida qisqacha

- **Nomi:** Yoshlar Ittifoqi Qarz Monitoring Dashboard
- **Maqsad:** ~900 yoshga berilgan uy-joy qarzlarini (63 mlrd so'm) kuzatish va boshqarish
- **Texnologiya:** Next.js 16 (App Router) + TypeScript + PostgreSQL + Prisma 7 + TailwindCSS 4
- **Repo:** https://github.com/ybehruzbek/yoshlar.git
- **Lokal joylashuv:** `e:\yoshlar\dashboard-app\`

---

## Muhim fayllar

| Fayl | Vazifasi |
|------|----------|
| `version.md` | **SHU FAYL** — har doim avval o'qi |
| `implementation_plan.md` | To'liq loyiha dizayn hujjati (25 sahifa, DB schema, hujjat shablonlar) |
| `dashboard-app/` | Asosiy Next.js ilovasi |
| `dashboard-app/.env` | PostgreSQL ulanish, NextAuth sozlamalar (gitignore'da) |
| `dashboard-app/prisma/schema.prisma` | 12 ta Prisma model |
| `dashboard-app/prisma.config.ts` | Prisma 7 konfiguratsiya (DATABASE_URL shu yerda) |
| `dashboard-app/lib/prisma.ts` | PrismaClient singleton (@prisma/adapter-pg) |
| `dashboard-app/app/globals.css` | Barcha CSS (~34KB) |
| `hujjatlar-namunalari/` | Haqiqiy hujjat namunalari (docx, pdf, xlsx) |

---

## Versiya tarixi

### v0.4.0 — Auth tizimi: Login, Logout, Route Protection (2026-05-03)

**Nima qilindi:**
- ✅ **Login sahifasi** (`/login`) — premium glassmorphism dizayn, animated background, logo, statistikalar
- ✅ **NextAuth v5** — Credentials provider, JWT session strategy
- ✅ **Route protection** — `proxy.ts` (Next.js 16 formati) orqali barcha sahifalar himoyalangan
- ✅ **Authorized callback** — login bo'lmaganlar `/login` ga redirect, kirganlar `/login` dan `/ `ga redirect
- ✅ **Sidebar user menu** — haqiqiy foydalanuvchi nomi va roli ko'rsatiladi (useSession)
- ✅ **Logout tugmasi** — sidebar footer da `signOut` bilan chiqish
- ✅ **Seed script** — PostgreSQL uchun tuzatildi, admin + operator yaratildi
- ✅ **SessionProvider** — `layout.tsx` ga qo'shildi
- ✅ **auth.ts** — PrismaAdapter olib tashlandi (Credentials bilan kerak emas), dynamic import (edge runtime uchun)
- GitHub ga push qilindi: commit `cf1639b`

**Login ma'lumotlari:**
- Admin: `admin@yoshlar.uz` / `admin123`
- Operator: `operator@yoshlar.uz` / `operator123`

**Rollar:** admin, operator, viewer

**Yaratilgan/o'zgartirilgan fayllar:**
- `app/login/page.tsx` — [YANGI] Login sahifasi UI
- `proxy.ts` — [YANGI] Route protection (eski middleware.ts o'rniga)
- `auth.ts` — Qayta yozildi (dynamic import, authorized callback)
- `app/layout.tsx` — SessionProvider qo'shildi
- `components/layout/Sidebar.tsx` — useSession, logout, user menu
- `prisma/seed.ts` — PostgreSQL adapter bilan, admin + operator
- `app/globals.css` — Login CSS, user menu CSS qo'shildi

---

### v0.3.0 — PostgreSQL migratsiya (2026-05-03)

**Nima qilindi:**
- SQLite dan PostgreSQL ga to'liq migratsiya
- `@prisma/adapter-better-sqlite3` → `@prisma/adapter-pg` almashtirildi
- PostgreSQL 17.6 da `yoshlar_db` bazasi yaratildi
- Parol: `3785` (postgres foydalanuvchisi)
- `prisma migrate dev --name init` — 12 jadval yaratildi
- `.env` fayl yaratildi: `DATABASE_URL="postgresql://postgres:3785@localhost:5432/yoshlar_db"`
- Keraksiz paketlar o'chirildi: `better-sqlite3`, `@prisma/adapter-better-sqlite3`
- Yangi paketlar: `@prisma/adapter-pg`, `pg`
- GitHub ga push qilindi: commit `ba4110e`

**O'zgartirilgan fayllar:**
- `prisma/schema.prisma` — provider: sqlite → postgresql
- `lib/prisma.ts` — adapter-pg bilan
- `prisma.config.ts` — dotenv + DATABASE_URL
- `package.json` — dependency o'zgarishlar
- `.env` — yaratildi (gitignore'da)

---

### v0.2.0 — Dashboard + Qarzdorlar (oldingi sessiyalar)

**Tayyor sahifalar:**
1. ✅ **Dashboard** (`/`) — 4 stat karta, 3 progress bar, bar chart (Bank/Payme), donut chart, jadvallar
2. ✅ **Qarzdorlar** (`/debtors`) — infinite scroll, qidiruv, filtr, Excel import (rasmlar bilan), o'chirish
3. ✅ **Qarzdor profili** (`/debtors/[id]`) — shaxsiy ma'lumotlar, qarz kartalari, to'lovlar tarixi

**Tayyor infratuzilma:**
- NextAuth v5 (Credentials) — `auth.ts`
- Dark/Light mode — `ThemeContext.tsx`
- Sidebar navigatsiya (8 ta sahifa) — `Sidebar.tsx`
- Excel import mexanizmi — `lib/actions/import.ts` (preview + commit)
- Paginated fetch — `lib/actions/fetchDebtors.ts`
- Pul formatlash — `lib/utils/format.ts`

**Placeholder sahifalar (hali kodlanmagan):**
- ⚠️ `/payments` — To'lovlar
- ⚠️ `/documents` — Hujjatlar
- ⚠️ `/court` — Sud bo'limi
- ⚠️ `/calendar` — Kalendar
- ⚠️ `/reports` — Hisobotlar
- ⚠️ `/kpi` — KPI

---

### v0.1.0 — Boshlang'ich commit (oldingi sessiyalar)

- Next.js 16 loyihasi yaratildi
- Prisma schema yozildi (12 model)
- Dashboard dizayni (dark glassmorphism)
- 18 ta commit

---

## Qolgan ishlar (TODO)

### Ustuvorlik 1 — Asosiy funksionallik
- [x] Login sahifasi UI ✅ v0.4.0
- [x] Route protection (proxy.ts) ✅ v0.4.0
- [x] Session boshqaruvi (useSession, logout) ✅ v0.4.0
- [ ] To'lovlar sahifasi (`/payments`) — jadval, filtr, yuklab olish
- [ ] Hujjatlar markazi (`/documents`) — shablon tanlash, hujjat yaratish (Word/PDF)
- [ ] Qarzdor profili: to'lov jadvali avtomatik hisoblash (20 yil / 7 yil)

### Ustuvorlik 2 — Huquqiy va analitik
- [ ] Sud bo'limi (`/court`) — bosqichlar, statistika
- [ ] Kalendar (`/calendar`) — oylik ko'rinish, eslatmalar
- [ ] Hisobotlar (`/reports`) — Excel/PDF eksport, prognoz
- [ ] KPI (`/kpi`) — rahbariyat dashboardi

### Ustuvorlik 3 — Qo'shimcha
- [ ] Bulk hujjat yaratish (ZIP)
- [ ] SMS xabarnomalar (Eskiz.uz)
- [ ] iBank to'lov import
- [ ] Jarima hisoblash moduli
- [ ] Audit trail (faollik logi)
- [ ] Foydalanuvchi boshqaruvi

---

## PostgreSQL ma'lumotlari

```
Host: localhost
Port: 5432
Database: yoshlar_db
User: postgres
Password: 3785
Connection: postgresql://postgres:3785@localhost:5432/yoshlar_db
```

## Git

```
Remote: https://github.com/ybehruzbek/yoshlar.git
Branch: main
Oxirgi commit: cf1639b (feat: login/logout, route protection)
```
