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

### v0.5.0 — RBAC, Hujjat Shablonlari va Audit Loglar (2026-05-03)

**Nima qilindi:**
- ✅ **RBAC (Rollar):** `Super Admin`, `Buxgalter`, `Yurist` rollari joriy etildi va `auth.ts` middleware orqali ruxsatlar o'rnatildi.
- ✅ **Hujjat shablonlari:** `.docx` shablonlarni yuklash, `{{FISH}}` kabi placeholderlarni avtomatik aniqlash va boshqarish. `documents/templates` sahifasi (faqat Admin uchun).
- ✅ **Hujjatlar tarixi:** Yaratilgan avtomatik hujjatlarni kuzatish uchun `documents` sahifasi tayyorlandi.
- ✅ **Audit Loglar:** Tizimdagi har bir xatti-harakatni IP, User Agent va davomiyligi bilan log qilish. `navigator.sendBeacon` orqali ishonchli sahifa kuzatuv (`usePageTracker`).
- ✅ **Foydalanuvchi boshqaruvi:** `admin/users` sahifasida xodimlarni qo'shish, rolini o'zgartirish va bloklash.
- ✅ **Fuqaro portali (`/fuqaro`):** Loginsiz ochiq tizim. JSHSHIR orqali izlash, read-only ma'lumotlar va qarz holatini ko'rish.
- GitHub ga push qilindi: commit `9b560f8`

**Rollar va ruxsatlar:**
- **Super Admin (`admin@yoshlar.uz`):** Barcha sahifalar, loglar, users, templates boshqaruvi.
- **Buxgalter (`buxgalter@yoshlar.uz`):** Dashboard, Qarzdorlar, To'lovlar, Hisobotlar.
- **Yurist (`yurist@yoshlar.uz`):** Dashboard, Qarzdorlar, Sud, Hujjatlar.

**Yaratilgan/o'zgartirilgan fayllar:**
- `prisma/schema.prisma` — UserRole, AuditType enumlar qo'shildi. Template va AuditLog kengaytirildi.
- `lib/rbac.ts` — [YANGI] Ruxsatnomalar matritsasi va helperlar.
- `lib/utils/auditLogger.ts` — [YANGI] Server side log yozuvchi.
- `hooks/usePageTracker.ts` — [YANGI] Client side sahifa davomiyligi va navigatsiyani kuzatuvchi.
- `app/api/...` — templates, users, audit, fuqaro API route'lari.
- `app/(dashboard)/admin/...` — Users va Logs boshqaruv UI.
- `app/fuqaro/page.tsx` — [YANGI] Fuqarolar ochiq portali.

---

### v0.7.0 — Shablon Tizimi Qayta Yozildi + Qo'llanma (2026-05-04)

**Nima qilindi:**
- ✅ **Shablon yuklash tizimi qayta yozildi:** Vizual editor (brauzerda matn tanlash) o'rniga ishonchli usulga o'tildi — admin Word faylda o'zi `{{FISH}}`, `{{PASPORT}}` yozadi va platformaga yuklaydi.
- ✅ **Avtomatik placeholder topish:** Yuklangan `.docx` fayldan barcha `{{...}}` o'zgaruvchilar avtomatik topiladi va chiroyli modal oynada ko'rsatiladi.
- ✅ **Shablon tayyorlash qo'llanmasi:** Accordion ko'rinishidagi to'liq qo'llanma qo'shildi — barcha o'zgaruvchilar 4 kategoriyada jadvallarda, misollar va muhim eslatmalar bilan.
- ✅ **O'chirish modali:** Shablonni o'chirishda chiroyli tasdiqlash oynasi (qizil ikonka, "Ortga qaytarib bo'lmaydi" ogohlantirishi).
- ✅ **Sana ustuni:** Jadvalga "Sana" (createdAt) ustuni qo'shildi.
- ✅ **Backend API lar:** `preview`, `save-with-replacements`, `replace` endpoint'lari yaratildi.
- ✅ **Shablon fayllar tiklandi:** `Da'vo ariza.docx` va `Talabnoma uy-joy.docx` backuplardan qayta tiklandi.

**Qo'llanmadagi o'zgaruvchilar (25+ ta):**
- 👤 Shaxsiy: `{{FISH}}`, `{{PASPORT}}`, `{{JSHSHIR}}`, `{{MANZIL}}`
- 💰 Moliyaviy: `{{QARZ_SUMMASI}}`, `{{QARZ_SUMMA_SOZ}}`, `{{QARZ_QOLDIQ}}`, `{{QOLDIQ_SOZ}}`, `{{OYLIK_TOLOV}}`, `{{OYLIK_TOLOV_SOZ}}`, `{{QARZ_MUDDATI_RAQAM}}`, `{{QARZ_MUDDATI_SOZ}}`
- 📄 Shartnoma: `{{SHARTNOMA_SANA}}`, `{{SHARTNOMA_RAQAMI}}`, `{{NOTARIUS}}`, `{{OTKAZILGAN_SANA}}`, `{{TOLOV_BOSHLANISH_SANA}}`, `{{HOLAT_SANASI}}`, `{{DAVOGAR_MANZIL}}`, `{{TUMAN}}`, `{{NOTARIAL_TUMAN}}`
- 📅 Sanalar: `{{TALABNOMA_SANA}}`, `{{BUGUNGI_SANA}}`, `{{OGOHLANTIRISH_XATLARI}}`, `{{BANK_FILIALI}}`

**Yaratilgan/o'zgartirilgan fayllar:**
- `app/(dashboard)/documents/templates/page.tsx` — to'liq qayta yozildi (yuklash + qo'llanma + o'chirish modal)
- `app/api/templates/route.ts` — admin roli ruxsati qo'shildi
- `app/api/templates/preview/route.ts` — [YANGI] mammoth.js bilan Word→HTML preview
- `app/api/templates/save-with-replacements/route.ts` — [YANGI] kontekst-asosida aqlli almashtirish
- `app/api/templates/replace/route.ts` — [YANGI] oddiy almashtirish
- `components/templates/TemplateEditor.tsx` — [YANGI] vizual editor (hozir ishlatilmaydi, zaxirada)
- `app/globals.css` — `.tpl-placeholder`, `.tpl-highlight` CSS qo'shildi
- `documents/templates/Da'vo ariza.docx` — tiklandi
- `documents/templates/Talabnoma uy-joy.docx` — tiklandi
- GitHub ga push qilindi: commit `a70ec42`

---
### v0.4.0 — Auth tizimi: Login, Logout, Route Protection (2026-05-03)

**Nima qilindi:**
- ✅ **Login sahifasi** (`/login`) — premium qora dizayn (dashboardga moslashtirildi)
- ✅ **NextAuth v5** — Credentials provider, JWT session strategy
- ✅ **Route protection** — `proxy.ts` (Next.js 16 formati) orqali barcha sahifalar himoyalangan
- ✅ **Authorized callback** — login bo'lmaganlar `/login` ga redirect, kirganlar `/login` dan `/ `ga redirect
- ✅ **Sidebar user menu** — haqiqiy foydalanuvchi nomi va roli ko'rsatiladi (useSession)
- ✅ **Logout tugmasi** — sidebar footer da `signOut` bilan chiqish
- ✅ **Seed script** — PostgreSQL uchun tuzatildi, admin + operator yaratildi
- ✅ **SessionProvider** — `layout.tsx` ga qo'shildi
- ✅ **auth.ts** — PrismaAdapter olib tashlandi (Credentials bilan kerak emas), dynamic import (edge runtime uchun)
- ✅ **Skeleton Loading** — barcha sahifalar uchun navigatsiya vaqtida ko'rsatiladigan skeleton ekranlar qo'shildi
- GitHub ga push qilindi: commit `cf1639b`, `8aa6852`

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

### v0.6.0 — UI/UX & Apple Style Standardization

**Bajarilgan ishlar:**
- 🎨 **Dizayn Konsepsiyasi:** Loyiha uchun Apple-style (Bento Grid) dizayn tili to'liq tasdiqlandi va hujjatlashtirildi (`README.md`).
- 🔄 **CSS Tozalash:** `tailwindcss` olib tashlandi. PostCSS kompilatsiya xatolari bartaraf etildi. Loyiha faqatgina toza CSS modul/sinflari asosida qurildi.
- 🔧 **Global CSS tuzatishlar:** `.modal-backdrop`, `.btn-secondary`, `.table-responsive`, `.page-header`, `.badge-*` kabi 15+ missing klasslar `globals.css` ga qo'shildi.
- 🧩 **Placeholder sahifalar yangilandi:** `/payments`, `/court`, `/calendar`, `/reports`, `/kpi` kabi bo'sh sahifalar oddiy textdan professional "Tez kunda" (Coming Soon) vizual holatiga o'tkazildi (Dizayn tizimiga moslashtirildi).
- 🧑‍💻 **Fuqaro Portali (`/fuqaro`):** Tailwind klasslaridan to'liq custom CSS (`.fuqaro-*`) ga o'tkazildi.
- 🚧 **Sidebar Skeleton va RBAC:** `Sidebar.tsx` da yuklanish holati uchun `SidebarSkeleton` qo'shildi. Ma'lumotlar bazasidagi `admin` roliga nisbatan sezgirlik muammosi `normalizeRole()` funksiyasi orqali bartaraf etildi (to'g'ridan-to'g'ri bo'sh sidebar ko'rinishining oldi olindi).
- 👤 **Profil Kartasi:** Sidebardagi foydalanuvchi profiliga Apple style (glassmorphism, subtle gradients, and soft hover state) tatbiq etildi.
- 📐 **Sidebar Bo'shliqlari:** "ASOSIY MENYU" va "MA'MURIYAT" bo'limlari tepasidagi keraksiz padding va marginlar olib tashlanib, ixchamlashtirildi.
- 📄 **Shablonlar Sahifasi (`/documents/templates`):** Tailwind'dan tozalash ishlari doirasida to'liq Bento Grid va Apple Style qoidalariga asoslanib noldan qayta dizayn qilindi.


---

## Qolgan ishlar (TODO)

### Ustuvorlik 1 — Asosiy funksionallik
- [x] Login sahifasi UI ✅ v0.4.0
- [x] Route protection (proxy.ts) ✅ v0.4.0
- [x] Session boshqaruvi (useSession, logout) ✅ v0.4.0
- [ ] To'lovlar sahifasi (`/payments`) — jadval, filtr, yuklab olish
- [x] Hujjatlar markazi (`/documents`) — shablon tanlash, hujjat yaratish (Word/PDF) ✅ v0.5.0
- [x] Shablon boshqaruvi (yuklash, qo'llanma, o'chirish) ✅ v0.7.0
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
- [x] Audit trail (faollik logi) ✅ v0.5.0
- [x] Foydalanuvchi boshqaruvi ✅ v0.5.0

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
Oxirgi commit: a70ec42 (feat: Shablon tizimini qayta yozish)
```
