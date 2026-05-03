"use client";

import { useState } from "react";
import { MagnifyingGlass, IdentificationCard, ShieldCheck, WarningCircle, UserCircle, MapPin, Phone, Money, TrendUp, Clock, Receipt } from "@phosphor-icons/react";
import { formatMoney } from "@/lib/utils/format";

export default function FuqaroClient() {
  const [jshshir, setJshshir] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jshshir.length !== 14) {
      setError("JSHSHIR 14 ta raqamdan iborat bo'lishi kerak");
      return;
    }

    setIsLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/fuqaro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jshshir }),
      });

      const result = await res.json();
      
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || "Ma'lumot topilmadi");
      }
    } catch (err) {
      setError("Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("uz-UZ");
  };

  return (
    <div className="fuqaro-page">
      {/* Public Header */}
      <header className="fuqaro-header">
        <div className="fuqaro-header-inner">
          <div className="fuqaro-logo-block">
            <img src="/logo.png" alt="Yoshlar Ittifoqi" className="fuqaro-logo-img" />
            <div>
              <div className="fuqaro-org-name">Yoshlar Ittifoqi</div>
              <div className="fuqaro-org-sub">Qarzdorlik holatini tekshirish</div>
            </div>
          </div>
        </div>
      </header>

      <main className="fuqaro-main">
        <div className="fuqaro-container">
          
          {/* Search Form */}
          <div className="fuqaro-search-card">
            <div className="fuqaro-shield-icon">
              <ShieldCheck size={32} weight="duotone" />
            </div>
            <h2 className="fuqaro-title">Qarzdorlikni tekshirish</h2>
            <p className="fuqaro-desc">
              O'zingizning JSHSHIR (PINFL) raqamingizni kiritish orqali Yoshlar Ittifoqidan olingan qarz holatini ko'rishingiz mumkin.
            </p>

            <form onSubmit={handleSearch} className="fuqaro-form">
              <div className="fuqaro-input-wrap">
                <IdentificationCard className="fuqaro-input-icon" size={24} />
                <input
                  type="text"
                  placeholder="JSHSHIR (14 ta raqam)"
                  className="fuqaro-input"
                  value={jshshir}
                  onChange={(e) => setJshshir(e.target.value.replace(/[^0-9]/g, '').substring(0, 14))}
                  maxLength={14}
                />
              </div>

              {error && (
                <div className="fuqaro-error">
                  <WarningCircle size={20} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || jshshir.length !== 14}
                className="fuqaro-submit"
              >
                {isLoading ? (
                  <span className="fuqaro-spinner"></span>
                ) : (
                  <>
                    <MagnifyingGlass size={24} />
                    Tekshirish
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Area */}
          {data && (
            <div className="fuqaro-results">
              {/* Profile Card */}
              <div className="fuqaro-card">
                <div className="fuqaro-card-head">
                  <UserCircle size={20} />
                  <span>Shaxsiy ma'lumotlar</span>
                </div>
                <div className="fuqaro-card-body">
                  <h2 className="fuqaro-person-name">{data.fish}</h2>
                  <div className="fuqaro-info-grid">
                    <div className="fuqaro-info-item">
                      <div className="fuqaro-info-icon"><MapPin size={20} /></div>
                      <div>
                        <div className="fuqaro-info-label">Yashash manzili</div>
                        <div className="fuqaro-info-value">{data.manzil}</div>
                      </div>
                    </div>
                    <div className="fuqaro-info-item">
                      <div className="fuqaro-info-icon"><Phone size={20} /></div>
                      <div>
                        <div className="fuqaro-info-label">Telefon raqami</div>
                        <div className="fuqaro-info-value">{data.telefon}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loans list */}
              {data.loans.map((loan: any, i: number) => (
                <div key={i} className="fuqaro-card">
                  <div className="fuqaro-card-head" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Receipt size={20} />
                      <span>Shartnoma: {loan.turi}</span>
                    </div>
                    <span className={`badge ${
                      loan.holat === 'faol' ? 'badge-green' :
                      loan.holat === 'yopilgan' ? 'badge-gray' :
                      'badge-red'
                    }`}>
                      {loan.holat.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="fuqaro-card-body">
                    <div className="fuqaro-loan-stats">
                      <div className="fuqaro-loan-stat">
                        <div className="fuqaro-loan-stat-head">
                          <Money size={18} />
                          <span>Jami qarz</span>
                        </div>
                        <div className="fuqaro-loan-stat-val">{formatMoney(loan.qarzSummasi)} s.</div>
                      </div>
                      
                      <div className="fuqaro-loan-stat" style={{ background: 'var(--accent-light)' }}>
                        <div className="fuqaro-loan-stat-head" style={{ color: 'var(--accent)' }}>
                          <TrendUp size={18} />
                          <span>To'langan</span>
                        </div>
                        <div className="fuqaro-loan-stat-val" style={{ color: 'var(--accent)' }}>{formatMoney(loan.tolanganSumma)} s.</div>
                      </div>
                      
                      <div className="fuqaro-loan-stat" style={{ background: 'var(--yellow-bg)' }}>
                        <div className="fuqaro-loan-stat-head" style={{ color: 'var(--yellow-text)' }}>
                          <Clock size={18} />
                          <span>Qoldiq</span>
                        </div>
                        <div className="fuqaro-loan-stat-val" style={{ color: 'var(--yellow-text)' }}>{formatMoney(loan.qoldiq)} s.</div>
                      </div>
                    </div>

                    {loan.tolovlar.length > 0 && (
                      <div>
                        <h4 className="fuqaro-section-title">To'lovlar tarixi</h4>
                        <div className="table-responsive" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Sana</th>
                                <th>Summa</th>
                                <th>To'lov turi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loan.tolovlar.slice(0, 5).map((p: any, j: number) => (
                                <tr key={j}>
                                  <td>{formatDate(p.sana)}</td>
                                  <td style={{ fontWeight: 600 }}>{formatMoney(p.summa)} so'm</td>
                                  <td style={{ textTransform: 'capitalize' }}>{p.usul}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {loan.tolovlar.length > 5 && (
                            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-tertiary)', background: 'var(--bg-sidebar)', borderTop: '1px solid var(--border)' }}>
                              + yana {loan.tolovlar.length - 5} ta to'lov (faqat oxirgi 5 tasi ko'rsatildi)
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="fuqaro-footer">
        <p>&copy; {new Date().getFullYear()} O'zbekiston Yoshlar Ittifoqi. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
