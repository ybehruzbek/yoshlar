"use client";
import { useState } from "react";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target, Bell, ArrowUpRight, ArrowDownRight,
  CurrencyCircleDollar, WarningCircle, Export, FilePlus, Eye,
  CaretRight, TrendUp, CheckCircle, Clock, Gavel,
} from "@phosphor-icons/react";



/* ─── NAV ─── */
const NAV = [
  { icon: ChartBar, label: "Dashboard", badge: null, active: true },
  { icon: Users, label: "Qarzdorlar", badge: "900", active: false },
  { icon: CreditCard, label: "To'lovlar", badge: null, active: false },
  { icon: FileText, label: "Hujjatlar", badge: null, active: false },
  { icon: Scales, label: "Sud bo'limi", badge: "12", badgeColor: "yellow", active: false },
  { icon: CalendarBlank, label: "Kalendar", badge: null, active: false },
  { icon: ChartLineUp, label: "Hisobotlar", badge: null, active: false },
  { icon: Target, label: "KPI", badge: null, active: false },
];

/* ─── CHART DATA ─── */
const MONTHS = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
const PAYMENTS = [
  { bank: 1100, payme: 720 },
  { bank: 1300, payme: 800 },
  { bank: 1000, payme: 650 },
  { bank: 1500, payme: 950 },
  { bank: 1200, payme: 700 },
  { bank: 1700, payme: 1100 },
  { bank: 1400, payme: 800 },
  { bank: 1900, payme: 1200 },
  { bank: 1600, payme: 1000 },
  { bank: 1800, payme: 1100 },
  { bank: 2100, payme: 1300 },
  { bank: 1300, payme: 800 }
];
const MAX_VAL = 3500; // Adjusted for double bars

const STATUS_COLORS: Record<string, { color: string; pct: number }> = {
  Faol: { color: "#30d158", pct: 71 },
  Kechikkan: { color: "#ff9f0a", pct: 18 },
  Sudda: { color: "#ff453a", pct: 7 },
  "To'langan": { color: "#0071e3", pct: 4 },
};

/* ─── TABLE DATA ─── */
const LATE = [
  { name: "Kadirov Odil M.", days: 182, sum: "22 577 489", risk: 94, type: "20 yil" },
  { name: "Ruziyev Sherbek Sh.", days: 156, sum: "17 562 520", risk: 87, type: "20 yil" },
  { name: "Buriyeva Xulkar T.", days: 134, sum: "46 017 598", risk: 82, type: "7 yil" },
  { name: "Sodiqov Anvar Sh.", days: 98, sum: "15 570 080", risk: 71, type: "20 yil" },
  { name: "Aralov Quvonch J.", days: 76, sum: "38 377 038", risk: 65, type: "7 yil" },
];

const UPCOMING = [
  { name: "Mamatkulova Shahlohon", sum: "290 000", date: "22-apr", tur: "20 yil" },
  { name: "Boltayev Furqat B.", sum: "290 000", date: "23-apr", tur: "20 yil" },
  { name: "Nayimov Azizbek E.", sum: "783 916", date: "24-apr", tur: "7 yil" },
  { name: "Tursunov Davron D.", sum: "290 000", date: "25-apr", tur: "20 yil" },
  { name: "Yusupov Ilxom U.", sum: "290 000", date: "26-apr", tur: "20 yil" },
];

const formatSum = (val: number) => {
  const short = val >= 1000 ? (val / 1000).toFixed(1) + " mlrd" : val + " mln";
  const full = (val * 1000000).toLocaleString('fr-FR');
  return `${short} (${full} so'm)`;
};

/* ─── DONUT CHART ─── */
function DonutChart() {
  const size = 160;
  const r = 58;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const entries = Object.entries(STATUS_COLORS);
  let offset = 0;
  const segments = entries.map(([, v]) => {
    const len = (v.pct / 100) * circ;
    const seg = { da: `${len - 4} ${circ - len + 4}`, off: -offset, color: v.color };
    offset += len;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <div className="donut-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f2" strokeWidth={18} />
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={18}
              strokeDasharray={s.da} strokeDashoffset={s.off}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="donut-total">900</div>
          <div className="donut-total-label">jami</div>
        </div>
      </div>
      <div className="legend">
        {entries.map(([key, v]) => (
          <div className="legend-row" key={key}>
            <div className="legend-dot" style={{ background: v.color }} />
            <div className="legend-name">{key}</div>
            <div className="legend-val">{Math.round(900 * v.pct / 100)}</div>
            <div className="legend-pct">{v.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── RISK BAR ─── */
function RiskBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="risk-bar-wrap">
      <div className="risk-bar-bg">
        <div className="risk-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <div className="risk-num" style={{ color }}>{value}</div>
    </div>
  );
}
const riskColor = (v: number) => v >= 80 ? "#ff453a" : v >= 60 ? "#ff6723" : v >= 40 ? "#ff9f0a" : "#30d158";

/* ═══════════ NAV ITEM RENDERER ═══════════ */
function NavItem({ item }: { item: typeof NAV[0] }) {
  const Icon = item.icon;
  return (
    <div className={`nav-item ${item.active ? "active" : ""}`}>
      <span className="nav-icon"><Icon size={20} weight={item.active ? "fill" : "regular"} /></span>
      {item.label}
      {item.badge && (
        <span className={`nav-badge ${"badgeColor" in item && item.badgeColor === "yellow" ? "yellow" : ""}`}>
          {item.badge}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════ */
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("yillik");

  return (
    <div className="layout">
      {/* ═══ SIDEBAR ═══ */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <div className="logo-icon"><Gavel size={22} weight="fill" /></div>
            <div>
              <div className="logo-title">Yoshlar Ittifoqi</div>
              <div className="logo-sub">Qarz Monitoring</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Asosiy</div>
          {NAV.slice(0, 4).map(item => <NavItem key={item.label} item={item} />)}
          <div className="nav-label">Huquqiy</div>
          {NAV.slice(4, 6).map(item => <NavItem key={item.label} item={item} />)}
          <div className="nav-label">Tahlil</div>
          {NAV.slice(6).map(item => <NavItem key={item.label} item={item} />)}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">A</div>
            <div>
              <div className="user-name">Admin</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-title">Bosh sahifa</div>
          </div>
          <div className="topbar-actions">
            <button className="topbar-btn btn-ghost">
              <Export size={16} weight="bold" /> Excel
            </button>
            <button className="topbar-btn btn-primary">
              <FilePlus size={16} weight="bold" /> Hujjat yaratish
            </button>
            <div className="notif-btn">
              <Bell size={18} />
              <div className="notif-dot" />
            </div>
          </div>
        </div>

        <div className="content">


          {/* ── Alert ── */}
          <div className="alert-bar">
            <WarningCircle size={22} weight="fill" color="#ff9f0a" />
            <span><strong>12 ta qarzdor</strong> sudga berildi — hujjatlarni ko&apos;rib chiqing</span>
            <span className="alert-link">Ko&apos;rish <CaretRight size={14} weight="bold" /></span>
          </div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">63 400 000 000 <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>so&apos;m</span></div>
              <div className="stat-label">Jami berilgan qarz</div>
              <div className="stat-footer">Qoldiq: <strong>51.2 mlrd so&apos;m</strong></div>
            </div>

            <div className="stat-card">
              <div className="stat-value">900</div>
              <div className="stat-label">Jami qarzdorlar</div>
              <div className="stat-footer">20 yillik: <strong>640</strong> · 7 yillik: <strong>260</strong></div>
            </div>

            <div className="stat-card">
              <div className="stat-value">287 000 000 <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>so&apos;m</span></div>
              <div className="stat-label">Bu oyda kutilgan</div>
              <div className="stat-footer">Kelgan: <strong>198 mln</strong> · Qolgan: 89 mln</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">163</div>
              <div className="stat-label">Muddati o&apos;tganlar</div>
              <div className="stat-footer">Jami qarz: <strong>8 400 000 000 so&apos;m</strong></div>
            </div>
          </div>

          {/* ── Overview cards ── */}
          <div className="overview-row">
            <div className="overview-card">
              <div className="overview-label">To&apos;lov faolligi (aprel)</div>
              <div className="overview-value">68.9%</div>
              <div className="overview-bar">
                <div className="overview-bar-bg">
                  <div className="overview-bar-fill" style={{ width: "68.9%", background: "#0071e3" }} />
                </div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-label">To&apos;langan (jami)</div>
              <div className="overview-value">12.2 mlrd</div>
              <div className="overview-bar">
                <div className="overview-bar-bg">
                  <div className="overview-bar-fill" style={{ width: "19%", background: "#30d158" }} />
                </div>
              </div>
            </div>
            <div className="overview-card">
              <div className="overview-label">Sudda (faol ishlar)</div>
              <div className="overview-value">12 ta</div>
              <div className="overview-bar">
                <div className="overview-bar-bg">
                  <div className="overview-bar-fill" style={{ width: "1.3%", background: "#ff453a" }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="charts-row">
            <div className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Oylik tushum</div>
                  <div className="card-sub">So&apos;m (mlrd) · 2025–2026</div>
                </div>
                <div className="tabs">
                  {(["oylik","yillik"] as const).map(t => (
                    <button key={t} className={`tab ${activeTab === t ? "active" : ""}`}
                      onClick={() => setActiveTab(t)}>
                      {t === "oylik" ? "Oylik" : "12 oy"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-legend">
                <div className="legend-item"><div className="legend-box" style={{ background: "#1d1d1f" }} /> Bank</div>
                <div className="legend-item"><div className="legend-box" style={{ background: "#0071e3" }} /> Payme</div>
              </div>
              <div className="bar-chart">
                {PAYMENTS.map((v, i) => (
                  <div className="bar-col" key={i}>
                    <div className="bar-group">
                      <div className="bar bank" style={{ 
                        height: `${(v.bank / MAX_VAL) * 150}px`
                      }}>
                        <div className="bar-tooltip">{formatSum(v.bank)}</div>
                      </div>
                      <div className="bar payme" style={{ 
                        height: `${(v.payme / MAX_VAL) * 150}px`
                      }}>
                        <div className="bar-tooltip">{formatSum(v.payme)}</div>
                      </div>
                    </div>
                    <div className="bar-label">{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Holat taqsimoti</div>
                  <div className="card-sub">Jami 900 ta qarzdor</div>
                </div>
              </div>
              <DonutChart />
            </div>
          </div>

          {/* ── Tables ── */}
          <div className="tables-row">
            <div className="table-card">
              <div className="card-head">
                <div>
                  <div className="card-title">Eng ko&apos;p kechikkanlar</div>
                  <div className="card-sub">Muddati o&apos;tgan kunlar bo&apos;yicha</div>
                </div>
                <button className="topbar-btn btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }}>
                  Barchasi <CaretRight size={14} weight="bold" />
                </button>
              </div>
              <table>
                <thead>
                  <tr><th>F.I.O</th><th>Kun</th><th>Summa</th><th>Xavf</th><th></th></tr>
                </thead>
                <tbody>
                  {LATE.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <div className="debtor-name">{r.name}</div>
                        <div className="debtor-sub">{r.type}</div>
                      </td>
                      <td><span className="day-chip">{r.days}</span></td>
                      <td><span className="amount">{r.sum}</span></td>
                      <td style={{ minWidth: 110 }}><RiskBar value={r.risk} color={riskColor(r.risk)} /></td>
                      <td><div className="action-btn"><FileText size={16} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-card">
              <div className="card-head">
                <div>
                  <div className="card-title">Yaqinda to&apos;lov muddati</div>
                  <div className="card-sub">Kelasi 7 kun ichida</div>
                </div>
                <button className="topbar-btn btn-ghost" style={{ fontSize: 12, padding: "7px 14px" }}>
                  Kalendar <CaretRight size={14} weight="bold" />
                </button>
              </div>
              <table>
                <thead>
                  <tr><th>F.I.O</th><th>Sana</th><th>Summa</th><th>Tur</th><th></th></tr>
                </thead>
                <tbody>
                  {UPCOMING.map((r, i) => (
                    <tr key={i}>
                      <td><div className="debtor-name">{r.name}</div></td>
                      <td><span className="badge badge-yellow">{r.date}</span></td>
                      <td><span className="amount">{r.sum}</span></td>
                      <td>
                        <span className={`badge ${r.tur === "7 yil" ? "badge-blue" : "badge-gray"}`}>{r.tur}</span>
                      </td>
                      <td><div className="action-btn"><Eye size={16} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
