"use client";

import { CreditCard, Clock, ArrowRight, Bank, DeviceMobile } from "@phosphor-icons/react";

export default function PaymentsPage() {
  return (
    <>
      <div className="page-header">
        <div className="section-title">To'lovlar va tushumlar</div>
        <div className="section-sub">Bank va Payme orqali kelib tushgan to'lovlarni kuzatish</div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Jami tushumlar</div>
          <div className="stat-footer">Bu oy: <strong>—</strong></div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Bank orqali</div>
          <div className="stat-footer">So'nggi 30 kun</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Payme orqali</div>
          <div className="stat-footer">So'nggi 30 kun</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">To'lovlar jadvali</div>
            <div className="card-sub">Barcha tushum va to'lovlar ro'yxati</div>
          </div>
        </div>
        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 20, 
            background: 'var(--accent-light)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', color: 'var(--accent)'
          }}>
            <CreditCard size={36} weight="duotone" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            Tez kunda ishga tushadi
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Bank va Payme orqali kelib tushgan to'lovlarni kuzatish va tasdiqlash vositalari ishlab chiqilmoqda.
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
