"use client";

import { useEffect } from 'react';
import { WarningCircle, ArrowClockwise, House } from '@phosphor-icons/react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-page-container">
      <div className="error-bg-glow error-bg-red"></div>
      <div className="error-card-glass">
        <div className="error-icon-wrap" style={{background: 'rgba(255, 59, 48, 0.1)'}}>
           <WarningCircle size={72} weight="light" color="var(--red)" />
        </div>
        <h1 className="error-title" style={{color: 'var(--red)', fontSize: '32px'}}>Xatolik yuz berdi</h1>
        <h2 className="error-subtitle">Kutilmagan texnik nosozlik</h2>
        <p className="error-text">
          Tizimda xatolik kuzatildi. Iltimos, sahifani qayta yuklab ko'ring yoki birozdan so'ng qayta urinib ko'ring.
        </p>
        <div className="error-actions">
           <button onClick={() => reset()} className="btn-primary-full" style={{background: 'var(--red)', boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)'}}>
             <ArrowClockwise size={20} weight="bold" /> Qayta yuklash
           </button>
           <Link href="/" className="secondary-btn" style={{width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', textDecoration: 'none'}}>
             <House size={20} /> Bosh sahifaga qaytish
           </Link>
        </div>
      </div>
    </div>
  );
}
