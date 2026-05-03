"use client";

import { Target, Clock, Users, ChartBar } from "@phosphor-icons/react";

export default function KpiPage() {
  return (
    <>
      <div className="page-header">
        <div className="section-title">Xodimlar samaradorligi (KPI)</div>
        <div className="section-sub">Ish xodimlarining natijalari va ko'rsatkichlari</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Xodimlar soni</div>
          <div className="stat-footer">Faol: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">O'rtacha KPI</div>
          <div className="stat-footer">Eng yuqori: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Bajarilgan vazifalar</div>
          <div className="stat-footer">Bu oy: <strong>—</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">KPI jadvali</div>
            <div className="card-sub">Xodimlar bo'yicha batafsil ko'rsatkichlar</div>
          </div>
        </div>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 20, 
            background: 'var(--yellow-bg)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--yellow-text)'
          }}>
            <Target size={36} weight="duotone" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Tez kunda ishga tushadi
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Ish xodimlarining natijalari va samaradorlik ko'rsatkichlari real vaqtda kuzatiladi.
          </div>
          <div className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} weight="bold" />
            Ishlab chiqilmoqda
          </div>
        </div>
      </div>
    </>
  );
}
