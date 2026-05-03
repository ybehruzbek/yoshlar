"use client";

import { CalendarBlank, Clock, CalendarCheck, CalendarX } from "@phosphor-icons/react";

export default function CalendarPage() {
  return (
    <>
      <div className="page-header">
        <div className="section-title">To'lovlar kalendari</div>
        <div className="section-sub">Rejalashtirilgan to'lovlar va muhim sanalar</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Bu oydagi to'lovlar</div>
          <div className="stat-footer">Jami summa: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">To'langan</div>
          <div className="stat-footer">Foiz: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Muddati o'tgan</div>
          <div className="stat-footer">Kechikkan: <strong>—</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Kalendar ko'rinishi</div>
            <div className="card-sub">To'lov jadvalining vizual ko'rinishi</div>
          </div>
        </div>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 20, 
            background: 'var(--green-bg)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--green)'
          }}>
            <CalendarBlank size={36} weight="duotone" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Tez kunda ishga tushadi
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Rejalashtirilgan to'lovlar va muhim sanalar tizimi ishlab chiqilmoqda.
          </div>
          <div className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} weight="bold" />
            Ishlab chiqilmoqda
          </div>
        </div>
      </div>
    </>
  );
}
