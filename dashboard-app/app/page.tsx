"use client";
import { useState } from "react";

const NAV = [
  { icon: "📊", label: "Dashboard", badge: null, active: true },
  { icon: "👥", label: "Qarzdorlar", badge: "900", active: false },
  { icon: "💳", label: "To'lovlar", badge: null, active: false },
  { icon: "📄", label: "Hujjatlar", badge: null, active: false },
  { icon: "⚖️", label: "Sud bo'limi", badge: "12", badgeColor: "yellow", active: false },
  { icon: "📅", label: "Kalendar", badge: null, active: false },
  { icon: "📈", label: "Hisobotlar", badge: null, active: false },
  { icon: "🎯", label: "KPI", badge: null, active: false },
];

const MONTHS = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
const PAYMENTS = [1820,2100,1650,2450,1900,2800,2200,3100,2600,2900,3400,2100];
const MAX_PAY = Math.max(...PAYMENTS);

const COLORS = {
  faol: { color: "#10b981", pct: 71 },
  kechikkan: { color: "#f59e0b", pct: 18 },
  sudda: { color: "#ef4444", pct: 7 },
  tolangan: { color: "#3b82f6", pct: 4 },
};

const LATE = [
  { name: "KADIROV ODIL M.", days: 182, sum: "22 577 489", risk: 94, type: "20 yil" },
  { name: "RUZIYEV SHERBEK SH.", days: 156, sum: "17 562 520", risk: 87, type: "20 yil" },
  { name: "BURIYEVA XULKAR T.", days: 134, sum: "46 017 598", risk: 82, type: "7 yil" },
  { name: "SODIQOV ANVAR SH.", days: 98, sum: "15 570 080", risk: 71, type: "20 yil" },
  { name: "ARALOV QUVONCH J.", days: 76, sum: "38 377 038", risk: 65, type: "7 yil" },
];

const UPCOMING = [
  { name: "MAMATKULOVA SHAHLOHON", sum: "290 000", sana: "2026-04-22", tur: "20 yil" },
  { name: "BOLTAYEV FURQAT B.", sum: "290 000", sana: "2026-04-23", tur: "20 yil" },
  { name: "NAYIMOV AZIZBEK E.", sum: "783 916", sana: "2026-04-24", tur: "7 yil" },
  { name: "TURSUNOV DAVRON D.", sum: "290 000", sana: "2026-04-25", tur: "20 yil" },
  { name: "YUSUPOV ILXOM U.", sum: "290 000", sana: "2026-04-26", tur: "20 yil" },
];

function DonutChart() {
  const size = 140;
  const r = 52;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const entries = Object.entries(COLORS);
  let offset = 0;
  const segments = entries.map(([, v]) => {
    const len = (v.pct / 100) * circ;
    const seg = { dasharray: `${len - 2} ${circ - len + 2}`, dashoffset: -offset, color: v.color };
    offset += len;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <div className="donut-svg" style={{ width: size, height: size, position: "relative" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2540" strokeWidth={18} />
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={18}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="donut-total">900</div>
          <div className="donut-total-label">jami</div>
        </div>
      </div>
      <div className="legend" style={{ width: "100%" }}>
        {Object.entries(COLORS).map(([key, v]) => (
          <div className="legend-item" key={key}>
            <div className="legend-dot" style={{ background: v.color }} />
            <div className="legend-name">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
            <div className="legend-val" style={{ color: v.color }}>{Math.round(900 * v.pct / 100)}</div>
            <div className="legend-pct">{v.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

const riskColor = (v: number) => v >= 80 ? "#ef4444" : v >= 60 ? "#f97316" : v >= 40 ? "#f59e0b" : "#10b981";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("yillik");
  const now = new Date();
  const dateStr = now.toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <div className="logo-icon">🏛️</div>
            <div className="logo-text">
              <div className="logo-title">Yoshlar Ittifoqi</div>
              <div className="logo-sub">Qarz Monitoring</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Asosiy</div>
          {NAV.slice(0, 4).map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={`nav-badge ${(item as any).badgeColor === "yellow" ? "yellow" : ""}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
          <div className="nav-label" style={{ marginTop: 8 }}>Huquqiy</div>
          {NAV.slice(4, 6).map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className={`nav-badge ${(item as any).badgeColor === "yellow" ? "yellow" : ""}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
          <div className="nav-label" style={{ marginTop: 8 }}>Tahlil</div>
          {NAV.slice(6).map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
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

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">Bosh sahifa</div>
          <div className="topbar-date">{dateStr}</div>
          <button className="topbar-btn btn-ghost">📥 Excel yuklash</button>
          <button className="topbar-btn btn-primary">📄 Hujjat yaratish</button>
          <div className="notif-btn">🔔<div className="notif-dot" /></div>
        </div>

        <div className="content">
          {/* ALERT */}
          <div className="alert-bar">
            ⚠️ <span><strong>12 ta qarzdor</strong> sudga berildi — hujjatlarni ko'rib chiqing</span>
            <span style={{ marginLeft: "auto", fontSize: 12, cursor: "pointer", color: "#f59e0b" }}>Ko'rish →</span>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-glow" style={{ background: "#3b82f6" }} />
              <div className="stat-header">
                <div className="stat-icon-wrap" style={{ background: "rgba(59,130,246,0.12)" }}>💰</div>
                <div className="stat-change change-up">↑ 8.2%</div>
              </div>
              <div className="stat-value" style={{ color: "#3b82f6" }}>63.4 mlrd</div>
              <div className="stat-label">Jami berilgan qarz</div>
              <div className="stat-sub">Qoldiq: <strong style={{ color: "#e8eaf0" }}>51.2 mlrd so'm</strong></div>
            </div>

            <div className="stat-card">
              <div className="stat-glow" style={{ background: "#10b981" }} />
              <div className="stat-header">
                <div className="stat-icon-wrap" style={{ background: "rgba(16,185,129,0.12)" }}>👥</div>
                <div className="stat-change change-up">+14 yangi</div>
              </div>
              <div className="stat-value" style={{ color: "#10b981" }}>900</div>
              <div className="stat-label">Jami qarzdorlar</div>
              <div className="stat-sub">20 yillik: <strong style={{ color: "#e8eaf0" }}>640</strong> · 7 yillik: <strong style={{ color: "#e8eaf0" }}>260</strong></div>
            </div>

            <div className="stat-card">
              <div className="stat-glow" style={{ background: "#f59e0b" }} />
              <div className="stat-header">
                <div className="stat-icon-wrap" style={{ background: "rgba(245,158,11,0.12)" }}>📅</div>
                <div className="stat-change change-down">↓ 3.1%</div>
              </div>
              <div className="stat-value" style={{ color: "#f59e0b" }}>287 mln</div>
              <div className="stat-label">Bu oyda kutilgan</div>
              <div className="stat-sub">Kelgan: <strong style={{ color: "#e8eaf0" }}>198 mln</strong> · Qolgan: 89 mln</div>
            </div>

            <div className="stat-card">
              <div className="stat-glow" style={{ background: "#ef4444" }} />
              <div className="stat-header">
                <div className="stat-icon-wrap" style={{ background: "rgba(239,68,68,0.12)" }}>⚠️</div>
                <div className="stat-change change-down">+7 bu oy</div>
              </div>
              <div className="stat-value" style={{ color: "#ef4444" }}>163</div>
              <div className="stat-label">Muddati o'tganlar</div>
              <div className="stat-sub">Jami qarz: <strong style={{ color: "#e8eaf0" }}>8.4 mlrd so'm</strong></div>
            </div>
          </div>

          {/* MINI WIDGETS */}
          <div className="top-row">
            <div className="mini-card">
              <div className="mini-icon" style={{ background: "rgba(59,130,246,0.12)" }}>📤</div>
              <div style={{ flex: 1 }}>
                <div className="mini-label">To'lov faolligi (aprel)</div>
                <div className="mini-val" style={{ color: "#3b82f6" }}>68.9%</div>
                <div className="progress-wrap">
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: "68.9%", background: "#3b82f6" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mini-card">
              <div className="mini-icon" style={{ background: "rgba(16,185,129,0.12)" }}>✅</div>
              <div style={{ flex: 1 }}>
                <div className="mini-label">To'langan (jami)</div>
                <div className="mini-val" style={{ color: "#10b981" }}>12.2 mlrd</div>
                <div className="progress-wrap">
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: "19%", background: "#10b981" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mini-card">
              <div className="mini-icon" style={{ background: "rgba(239,68,68,0.12)" }}>⚖️</div>
              <div style={{ flex: 1 }}>
                <div className="mini-label">Sudda (faol ishlar)</div>
                <div className="mini-val" style={{ color: "#ef4444" }}>12 ta</div>
                <div className="progress-wrap">
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: "1.3%", background: "#ef4444" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="charts-row">
            <div className="chart-card">
              <div className="card-header">
                <div>
                  <div className="card-title">Oylik tushum</div>
                  <div className="card-sub">So'm (mlrd) · 2025–2026</div>
                </div>
                <div className="chart-tabs">
                  {["oylik","yillik"].map(t => (
                    <button key={t} className={`chart-tab ${activeTab === t ? "active" : ""}`}
                      onClick={() => setActiveTab(t)}>
                      {t === "oylik" ? "Oylik" : "12 oy"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bar-chart">
                {PAYMENTS.map((v, i) => (
                  <div className="bar-wrap" key={i}>
                    <div className="bar-val">{(v / 1000).toFixed(1)}</div>
                    <div className="bar" style={{
                      height: `${(v / MAX_PAY) * 120}px`,
                      background: i === 11
                        ? "rgba(59,130,246,0.3)"
                        : `linear-gradient(to top, #3b82f6, #14b8a6)`,
                      border: i === 11 ? "1px dashed #3b82f6" : "none"
                    }} />
                    <div className="bar-label">{MONTHS[i]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <div className="card-header">
                <div>
                  <div className="card-title">Holat taqsimoti</div>
                  <div className="card-sub">Jami 900 ta qarzdor</div>
                </div>
              </div>
              <DonutChart />
            </div>
          </div>

          {/* TABLES */}
          <div className="tables-row">
            {/* Late payers */}
            <div className="table-card">
              <div className="card-header">
                <div>
                  <div className="card-title">🔴 Eng ko'p kechikkanlar</div>
                  <div className="card-sub">Muddati o'tgan kunlar bo'yicha</div>
                </div>
                <button className="topbar-btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}>
                  Barchasi →
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>F.I.O</th>
                      <th>Kun</th>
                      <th>Summa (so'm)</th>
                      <th>Xavf</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {LATE.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <div className="debtor-name">{r.name}</div>
                          <div className="debtor-id">{r.type}</div>
                        </td>
                        <td><span className="day-num">{r.days}</span></td>
                        <td><span className="amount">{r.sum}</span></td>
                        <td style={{ minWidth: 90 }}>
                          <RiskBar value={r.risk} color={riskColor(r.risk)} />
                        </td>
                        <td>
                          <div className="action-btn">📄</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming */}
            <div className="table-card">
              <div className="card-header">
                <div>
                  <div className="card-title">🟡 Yaqinda to'lov muddati</div>
                  <div className="card-sub">Kelasi 7 kun ichida</div>
                </div>
                <button className="topbar-btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}>
                  Kalendar →
                </button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>F.I.O</th>
                      <th>Sana</th>
                      <th>Summa (so'm)</th>
                      <th>Tur</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {UPCOMING.map((r, i) => (
                      <tr key={i}>
                        <td><div className="debtor-name">{r.name}</div></td>
                        <td>
                          <span className="badge badge-yellow">
                            {new Date(r.sana).toLocaleDateString("uz-UZ", { month: "short", day: "numeric" })}
                          </span>
                        </td>
                        <td><span className="amount">{r.sum}</span></td>
                        <td>
                          <span className={`badge ${r.tur === "7 yil" ? "badge-blue" : "badge-gray"}`}>
                            {r.tur}
                          </span>
                        </td>
                        <td>
                          <div className="action-btn">👁️</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
