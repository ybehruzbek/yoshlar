"use client";

import { ChartLineUp, Clock, ChartBar, TrendUp } from "@phosphor-icons/react";

export default function ReportsPage() {
  return (
    <>
      <div className="page-header">
        <div className="section-title">Analitik hisobotlar</div>
        <div className="section-sub">Tizimning umumiy samaradorligi va tushumlar</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Oylik tushum</div>
          <div className="stat-footer">O'tgan oy: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Undirish foizi</div>
          <div className="stat-footer">O'sish: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Aktiv qarzdorlar</div>
          <div className="stat-footer">Yangi: <strong>—</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Hisobotlar markazi</div>
            <div className="card-sub">Batafsil analitika va eksport</div>
          </div>
        </div>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 20, 
            background: 'var(--accent-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--accent)'
          }}>
            <ChartLineUp size={36} weight="duotone" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Tez kunda ishga tushadi
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Tizimning umumiy samaradorligi va tushumlar to'g'risidagi batafsil hisobotlar ishlab chiqilmoqda.
          </div>
          <div className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} weight="bold" />
            Ishlab chiqilmoqda
          </div>
        </div>
      </div>
    </>
  );
}
