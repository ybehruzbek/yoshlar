import Link from 'next/link';
import { WarningCircle, House, ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="error-page-container">
      <div className="error-bg-glow"></div>
      <div className="error-card-glass">
        <div className="error-icon-wrap">
           <WarningCircle size={72} weight="light" color="var(--accent)" />
        </div>
        <h1 className="error-title">404</h1>
        <h2 className="error-subtitle">Sahifa topilmadi</h2>
        <p className="error-text">
          Siz qidirayotgan sahifa o'chirilgan, manzil noto'g'ri kiritilgan yoki vaqtinchalik ishlamayotgan bo'lishi mumkin.
        </p>
        <div className="error-actions">
           <Link href="/" className="btn-primary-full" style={{ textDecoration: 'none' }}>
             <House size={20} weight="bold" /> Bosh sahifaga qaytish
           </Link>
        </div>
      </div>
    </div>
  );
}
