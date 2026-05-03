"use client";

import { Scales, Clock, Gavel, FileText } from "@phosphor-icons/react";

export default function CourtPage() {
  return (
    <>
      <div className="page-header">
        <div className="section-title">Sud bo'limi</div>
        <div className="section-sub">Sudga o'tkazilgan ishlar va ularning statuslari</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Faol sud ishlari</div>
          <div className="stat-footer">Oxirgi yangilanish: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Qaror chiqarilgan</div>
          <div className="stat-footer">Ijobiy: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Kutilayotgan</div>
          <div className="stat-footer">Keyingi sud: <strong>—</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Sud ishlari ro'yxati</div>
            <div className="card-sub">Barcha sudga o'tkazilgan qarzdorlar</div>
          </div>
        </div>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 20, 
            background: 'var(--red-bg)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--red)'
          }}>
            <Scales size={36} weight="duotone" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Tez kunda ishga tushadi
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Sud jarayonidagi ishlar ro'yxati va ularning statuslarini boshqarish bo'limi ishlab chiqilmoqda.
          </div>
          <div className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Clock size={14} weight="bold" />
            Ishlab chiqilmoqda
          </div>
        </div>
      </div>
    </>
  );
}
