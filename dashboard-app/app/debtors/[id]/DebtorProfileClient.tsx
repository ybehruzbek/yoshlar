"use client";

import { useState, useEffect } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Phone, MapPin, IdentificationCard, Calendar, 
  CurrencyCircleDollar, Warning, CheckCircle, 
  Clock, FileText, ChatText, ArrowLeft,
  TrendUp, Receipt, Plus, DotsThree, Bell
} from "@phosphor-icons/react";

import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/utils/format";

interface DebtorProfileClientProps {
  debtor: any;
}

const SafeDate = ({ date }: { date: string | Date | null }) => {
  const [formatted, setFormatted] = useState<string>("");
  useEffect(() => {
    if (!date) return;
    setFormatted(new Date(date).toLocaleDateString('uz-UZ'));
  }, [date]);
  return <>{formatted || "..."}</>;
};

export function DebtorProfileClient({ debtor }: DebtorProfileClientProps) {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"loans" | "notes" | "docs">("loans");

  // Summary logic
  const totalLoan = debtor.loans.reduce((acc: number, l: any) => acc + l.qarzSummasi, 0);
  const totalOverdue = debtor.loans.reduce((acc: number, l: any) => acc + l.muddatOtganSumma, 0);
  const avgRisk = Math.round(debtor.loans.reduce((acc: number, l: any) => acc + l.riskScore, 0) / (debtor.loans.length || 1));

  return (
    <DashboardLayout title="Qarzdor Profili">
      <div className="profile-container">
        {/* ── Header / Back ── */}
        <div className="profile-header-top">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={18} weight="bold" /> Orqaga
          </button>
          <div className="header-actions">
            <button className="icon-btn-row"><DotsThree size={20} weight="bold" /></button>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <div className="profile-hero-card">
          <div className="hero-main">
            <div className="profile-avatar-lg">
              {debtor.photo ? (
                <img src={debtor.photo} alt={debtor.fish} />
              ) : (
                debtor.fish.charAt(0)
              )}
            </div>
            
            <div className="hero-info">
              <div className="hero-badge">Qarzdor</div>
              <h1 className="hero-name">{debtor.fish}</h1>
              <div className="hero-meta">
                <span><IdentificationCard size={18} /> {debtor.jshshir}</span>
                <span><MapPin size={18} /> {debtor.manzil}</span>
                <span><Phone size={18} /> {debtor.telefon || "Kiritilmagan"}</span>
              </div>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="stat-label">Jami qarz</div>
                <div className="stat-value">{formatMoney(totalLoan)}</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <div className="stat-label">Kechikkan</div>
                <div className="stat-value text-red">{formatMoney(totalOverdue)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="profile-content-grid">
          <div className="content-left">
            {/* Tabs */}
            <div className="tab-nav">
              <button 
                className={`tab-item ${activeTab === 'loans' ? 'active' : ''}`}
                onClick={() => setActiveTab('loans')}
              >
                <CurrencyCircleDollar size={20} /> Shartnomalar
              </button>
              <button 
                className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <ChatText size={20} /> Eslatmalar
              </button>
              <button 
                className={`tab-item ${activeTab === 'docs' ? 'active' : ''}`}
                onClick={() => setActiveTab('docs')}
              >
                <FileText size={20} /> Hujjatlar
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'loans' && (
                <div className="loans-list">
                  {debtor.loans.map((loan: any) => (
                    <div key={loan.id} className="loan-card-item">
                      <div className="loan-card-header">
                        <div>
                          <div className="loan-type-label">
                            {loan.loanType === '20_yil' ? '20 yillik uy-joy' : '7 yillik uy-joy'}
                          </div>
                          <div className="loan-date">Shartnoma: <SafeDate date={loan.shartnomaSana} /></div>
                        </div>
                        <div className="loan-status">
                          {loan.status === 'kechikkan' ? (
                            <span className="badge badge-red">Kechikkan</span>
                          ) : (
                            <span className="badge badge-green">Faol</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="loan-card-body">
                        <div className="loan-info-grid">
                          <div className="info-box">
                            <label>Shartnoma summasi</label>
                            <span>{formatMoney(loan.qarzSummasi)}</span>
                          </div>
                          <div className="info-box">
                            <label>Oylik to'lov</label>
                            <span>{formatMoney(loan.oylikTolov || 0)}</span>
                          </div>
                          <div className="info-box">
                            <label>Muddati o'tgan</label>
                            <span className={loan.muddatOtganSumma > 0 ? "text-red" : ""}>
                              {formatMoney(loan.muddatOtganSumma)}
                            </span>
                          </div>
                          <div className="info-box">
                            <label>Xavf darajasi</label>
                            <span className="risk-tag" style={{ background: loan.riskScore > 70 ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)', color: loan.riskScore > 70 ? 'var(--red)' : 'var(--green)' }}>
                              {loan.riskScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="loan-card-footer">
                        <button className="secondary-btn"><Receipt size={16} /> To'lovlar tarixi</button>
                        <button className="primary-btn-sm"><Plus size={16} /> To'lov qo'shish</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="notes-section">
                  <div className="add-note-box">
                    <textarea placeholder="Yangi eslatma yozing..." />
                    <button className="primary-btn-sm">Saqlash</button>
                  </div>
                  <div className="notes-list">
                    {debtor.notes.length === 0 ? (
                      <div className="empty-mini">Hozircha eslatmalar yo'q</div>
                    ) : (
                      debtor.notes.map((note: any) => (
                        <div key={note.id} className="note-item">
                          <div className="note-date"><SafeDate date={note.createdAt} /></div>
                          <div className="note-content">{note.content}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="docs-grid">
                  <div className="doc-card-add">
                    <Plus size={32} weight="light" />
                    <span>Hujjat yaratish</span>
                  </div>
                  <div className="doc-card">
                    <FileText size={32} weight="fill" color="var(--accent)" />
                    <div className="doc-info">
                      <div className="doc-name">Ogohlantirish xati #12</div>
                      <div className="doc-meta">PDF · 1.2 MB · 12.05.2024</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="content-right">
            <div className="side-card">
              <h3 className="side-card-title">Tezkor amallar</h3>
              <div className="action-stack">
                <button className="action-btn-full">
                  <Warning size={20} /> Sudga ariza tayyorlash
                </button>
                <button className="action-btn-full">
                  <Bell size={20} /> SMS xabarnoma yuborish
                </button>
                <button className="action-btn-full">
                  <Clock size={20} /> To'lov grafigini ko'rish
                </button>
              </div>
            </div>

            <div className="side-card">
              <h3 className="side-card-title">Xavf tahlili</h3>
              <div className="risk-meter-wrap">
                <div className="risk-meter">
                  <div className="risk-meter-fill" style={{ width: `${avgRisk}%`, background: avgRisk > 70 ? 'var(--red)' : 'var(--accent)' }} />
                </div>
                <div className="risk-meter-labels">
                  <span>Xavf darajasi</span>
                  <span className="risk-val">{avgRisk}%</span>
                </div>
              </div>
              <p className="risk-desc">
                {avgRisk > 70 
                  ? "Ushbu qarzdor yuqori xavf guruhiga kiradi. Zudlik bilan chora ko'rish tavsiya etiladi."
                  : "Qarzdorlik holati barqaror. Monitoring davom ettirilsin."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 80px;
        }
        .profile-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--text-primary); }

        .profile-hero-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .hero-main {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .profile-avatar-lg {
          width: 140px;
          height: 140px;
          border-radius: 40px;
          background: var(--bg-sidebar);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          overflow: hidden;
          border: 4px solid var(--border);
        }
        .profile-avatar-lg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-info { flex: 1; }
        .hero-badge {
          display: inline-block;
          background: rgba(var(--accent-rgb), 0.1);
          color: var(--accent);
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .hero-name {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .hero-meta {
          display: flex;
          gap: 24px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        .hero-meta span {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 32px;
          background: var(--bg-sidebar);
          padding: 24px 32px;
          border-radius: 20px;
          border: 1px solid var(--border);
        }
        .stat-label { font-size: 12px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600; }
        .stat-value { font-size: 20px; font-weight: 800; }
        .hero-stat-divider { width: 1px; height: 40px; background: var(--border); }

        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
        }

        .tab-nav {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background: var(--bg-card);
          padding: 6px;
          border-radius: 14px;
          border: 1px solid var(--border);
          width: fit-content;
        }
        .tab-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-item.active {
          background: var(--text-primary);
          color: var(--bg);
        }

        .loan-card-item {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .loan-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: rgba(var(--bg-rgb), 0.3);
        }
        .loan-type-label { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
        .loan-date { font-size: 13px; color: var(--text-tertiary); }
        
        .loan-card-body { padding: 24px; }
        .loan-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .info-box label { display: block; font-size: 12px; color: var(--text-tertiary); margin-bottom: 6px; font-weight: 600; }
        .info-box span { font-weight: 700; font-size: 15px; }

        .loan-card-footer {
          padding: 16px 24px;
          background: var(--bg-sidebar);
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .side-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .side-card-title { font-size: 16px; font-weight: 700; margin-bottom: 20px; }
        .action-stack { display: flex; flex-direction: column; gap: 12px; }
        .action-btn-full {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--bg-sidebar);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .action-btn-full:hover { background: var(--bg-hover); border-color: var(--text-tertiary); }

        .risk-meter { height: 8px; background: var(--border); border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
        .risk-meter-fill { height: 100%; transition: width 0.5s ease; }
        .risk-meter-labels { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; }
        .risk-desc { font-size: 13px; color: var(--text-tertiary); margin-top: 16px; line-height: 1.5; }

        .secondary-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--bg-card);
          color: var(--text-primary); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .secondary-btn:hover { background: var(--bg-hover); }

        .primary-btn-sm {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 10px;
          border: none; background: var(--accent);
          color: #fff; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .primary-btn-sm:hover { opacity: 0.9; transform: translateY(-1px); }

        .notes-section { padding: 12px 0; }
        .add-note-box { margin-bottom: 24px; }
        .add-note-box textarea {
          width: 100%; height: 100px; border-radius: 14px;
          border: 1px solid var(--border); background: var(--bg-sidebar);
          padding: 16px; font-family: inherit; font-size: 14px; margin-bottom: 12px;
          resize: none;
        }
        .note-item {
          padding: 16px; border-radius: 16px; border: 1px solid var(--border);
          background: var(--bg-sidebar); margin-bottom: 12px;
        }
        .note-date { font-size: 12px; color: var(--text-tertiary); margin-bottom: 6px; }
        .note-content { font-size: 14px; line-height: 1.5; }

        .docs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .doc-card-add {
          border: 2px dashed var(--border); border-radius: 16px;
          padding: 24px; display: flex; flex-direction: column;
          align-items: center; gap: 12px; color: var(--text-tertiary);
          cursor: pointer; transition: all 0.2s;
        }
        .doc-card-add:hover { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb), 0.05); }
        .doc-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 16px;
        }
        .doc-name { font-weight: 700; font-size: 14px; margin-bottom: 4px; }
        .doc-meta { font-size: 11px; color: var(--text-tertiary); }
      `}</style>
    </DashboardLayout>
  );
}
