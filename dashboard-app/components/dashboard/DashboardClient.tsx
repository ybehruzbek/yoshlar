"use client";

import { useState } from "react";
import {
  WarningCircle, CaretRight, FileText, Eye
} from "@phosphor-icons/react";

import { formatMoney } from "../../lib/utils/format";


const MONTHS = ["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];


export interface DashboardProps {
  totalLoanAmount: number;
  totalRemaining: number;
  totalDebtors: number;
  debtors20Years: number;
  debtors7Years: number;
  expectedThisMonth: number;
  paidThisMonth: number;
  remainingThisMonth: number;
  delayedCount: number;
  delayedAmount: number;
  
  paymentActivityPct: number;
  totalPaidPct: number;
  totalPaidAmount: number;
  courtActiveCount: number;
  courtActivePct: number;
  
  monthlyPayments: { bank: number; payme: number }[];
  statusColors: Record<string, { color: string; pct: number; count: number }>;
  
  lateDebtors: { name: string; days: number; sum: number; risk: number; type: string }[];
  upcomingSchedules: { name: string; sum: number; date: string; tur: string }[];
}

/* ─── DONUT CHART ─── */
function DonutChart({ data, total }: { data: DashboardProps["statusColors"], total: number }) {
  const size = 160;
  const r = 58;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const entries = Object.entries(data);
  let offset = 0;
  
  const segments = entries.map(([, v]) => {
    const len = (v.pct / 100) * circ;
    const seg = { da: `${Math.max(0, len - 4)} ${circ - Math.max(0, len - 4) + 4}`, off: -offset, color: v.color };
    offset += len;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <div className="donut-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-hover)" strokeWidth={18} />

          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={18}
              strokeDasharray={s.da} strokeDashoffset={s.off}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="donut-total">{total}</div>
          <div className="donut-total-label">jami</div>
        </div>
      </div>
      <div className="legend">
        {entries.map(([key, v]) => (
          <div className="legend-row" key={key}>
            <div className="legend-dot" style={{ background: v.color }} />
            <div className="legend-name">{key}</div>
            <div className="legend-val">{v.count}</div>
            <div className="legend-pct">{v.pct.toFixed(1)}%</div>
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

export function DashboardClient({ data }: { data: DashboardProps }) {
  const [activeTab, setActiveTab] = useState("yillik");

  // Calculate max value for chart scaling
  const maxPayment = Math.max(...data.monthlyPayments.flatMap(m => [m.bank, m.payme]), 1);
  // Add 10% padding to max
  const chartMax = maxPayment * 1.1;

  return (
    <>
      {/* ── Alert ── */}
      {data.courtActiveCount > 0 && (
        <div className="alert-bar">
          <WarningCircle size={22} weight="fill" color="#ff9f0a" />
          <span><strong>{data.courtActiveCount} ta qarzdor</strong> sudga berildi — hujjatlarni ko&apos;rib chiqing</span>
          <span className="alert-link">Ko&apos;rish <CaretRight size={14} weight="bold" /></span>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" title={formatMoney(data.totalLoanAmount)}>{formatMoney(data.totalLoanAmount)}</div>
          <div className="stat-label">Jami berilgan qarz</div>
          <div className="stat-footer">Qoldiq: <strong>{formatMoney(data.totalRemaining)}</strong></div>
        </div>


        <div className="stat-card">
          <div className="stat-value">{data.totalDebtors}</div>
          <div className="stat-label">Jami qarzdorlar</div>
          <div className="stat-footer">20 yillik: <strong>{data.debtors20Years}</strong> · 7 yillik: <strong>{data.debtors7Years}</strong></div>
        </div>

        <div className="stat-card">
          <div className="stat-value" title={formatMoney(data.expectedThisMonth)}>{formatMoney(data.expectedThisMonth)}</div>
          <div className="stat-label">Bu oyda kutilgan</div>
          <div className="stat-footer">Kelgan: <strong>{formatMoney(data.paidThisMonth)}</strong> · Qolgan: {formatMoney(data.remainingThisMonth)}</div>
        </div>


        <div className="stat-card">
          <div className="stat-value">{data.delayedCount}</div>
          <div className="stat-label">Muddati o&apos;tganlar</div>
          <div className="stat-footer">Jami qarz: <strong>{formatMoney(data.delayedAmount)}</strong></div>
        </div>

      </div>

      {/* ── Overview cards ── */}
      <div className="overview-row">
        <div className="overview-card">
          <div className="overview-label">To&apos;lov faolligi (bu oy)</div>
          <div className="overview-value">{data.paymentActivityPct.toFixed(1)}%</div>
          <div className="overview-bar">
            <div className="overview-bar-bg">
              <div className="overview-bar-fill" style={{ width: `${Math.min(data.paymentActivityPct, 100)}%`, background: "#0071e3" }} />
            </div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-label">To&apos;langan (jami)</div>
          <div className="overview-value">{formatMoney(data.totalPaidAmount)}</div>


          <div className="overview-bar">
            <div className="overview-bar-bg">
              <div className="overview-bar-fill" style={{ width: `${Math.min(data.totalPaidPct, 100)}%`, background: "#30d158" }} />
            </div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-label">Sudda (faol ishlar)</div>
          <div className="overview-value">{data.courtActiveCount} ta</div>
          <div className="overview-bar">
            <div className="overview-bar-bg">
              <div className="overview-bar-fill" style={{ width: `${Math.min(data.courtActivePct, 100)}%`, background: "#ff453a" }} />
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
              <div className="card-sub">So&apos;m (mlrd) · Joriy yil</div>
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
            {data.monthlyPayments.map((v, i) => (
              <div className="bar-col" key={i}>
                <div className="bar-group">
                  <div className="bar bank" style={{ 
                    height: `${(v.bank / chartMax) * 150}px`
                  }}>
                    <div className="bar-tooltip">
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{formatMoney(v.bank)}</div>
                    </div>

                  </div>
                  <div className="bar payme" style={{ 
                    height: `${(v.payme / chartMax) * 150}px`
                  }}>
                    <div className="bar-tooltip">
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{formatMoney(v.payme)}</div>
                    </div>

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
              <div className="card-sub">Jami {data.totalDebtors} ta qarzdor</div>
            </div>
          </div>
          <DonutChart data={data.statusColors} total={data.totalDebtors} />
        </div>
      </div>

      {/* ── Tables ── */}
      <div className="tables-row">
        <div className="table-card">
          <div className="card-head">
            <div>
              <div className="card-title">Eng ko&apos;p kechikkanlar</div>
              <div className="card-sub">Muddati o&apos;tgan kunlar va summa bo&apos;yicha</div>
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
              {data.lateDebtors.length > 0 ? data.lateDebtors.map((r, i) => (
                <tr key={i}>
                  <td>
                    <div className="debtor-name">{r.name}</div>
                    <div className="debtor-sub">{r.type}</div>
                  </td>
                  <td><span className="day-chip">{r.days}</span></td>
                  <td style={{ textAlign: 'right' }}><span className="amount">{formatMoney(r.sum)}</span></td>

                  <td style={{ minWidth: 110 }}><RiskBar value={r.risk} color={riskColor(r.risk)} /></td>
                  <td><div className="action-btn"><FileText size={16} /></div></td>
                </tr>
              )) : <tr><td colSpan={5} style={{textAlign: "center", color: "var(--text-secondary)"}}>Ma'lumot topilmadi</td></tr>}
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
              {data.upcomingSchedules.length > 0 ? data.upcomingSchedules.map((r, i) => (
                <tr key={i}>
                  <td><div className="debtor-name">{r.name}</div></td>
                  <td><span className="badge badge-yellow">{r.date}</span></td>
                  <td style={{ textAlign: 'right' }}><span className="amount">{formatMoney(r.sum)}</span></td>

                  <td>
                    <span className={`badge ${r.tur === "7 yil" ? "badge-blue" : "badge-gray"}`}>{r.tur}</span>
                  </td>
                  <td><div className="action-btn"><Eye size={16} /></div></td>
                </tr>
              )) : <tr><td colSpan={5} style={{textAlign: "center", color: "var(--text-secondary)"}}>Yaqin oradagi to'lovlar yo'q</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
