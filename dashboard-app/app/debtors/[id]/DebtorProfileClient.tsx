"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  Phone, MapPin, IdentificationCard, Calendar, 
  CurrencyCircleDollar, Warning, CheckCircle, 
  Clock, FileText, ChatText, ArrowLeft,
  Receipt, Plus, DotsThree, Bell, Scales,
  CreditCard, TrendUp, ShieldCheck, Envelope
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/utils/format";

const SafeDate = ({ date, format }: { date: string | Date | null; format?: "short" | "full" }) => {
  const [formatted, setFormatted] = useState<string>("");
  useEffect(() => {
    if (!date) return;
    const d = new Date(date);
    if (format === "full") {
      setFormatted(d.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }));
    } else {
      setFormatted(d.toLocaleDateString('uz-UZ'));
    }
  }, [date, format]);
  return <>{formatted || "—"}</>;
};

export function DebtorProfileClient({ debtor }: { debtor: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"loans" | "notes" | "docs">("loans");

  const totalLoan = debtor.loans.reduce((a: number, l: any) => a + l.qarzSummasi, 0);
  const totalOverdue = debtor.loans.reduce((a: number, l: any) => a + l.muddatOtganSumma, 0);
  const totalPaid = debtor.loans.reduce((a: number, l: any) => a + l.payments.reduce((s: number, p: any) => s + p.summa, 0), 0);
  const avgRisk = Math.round(debtor.loans.reduce((a: number, l: any) => a + l.riskScore, 0) / (debtor.loans.length || 1));

  const getStatusBadge = (status: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      faol: { cls: "badge-green", label: "Faol" },
      kechikkan: { cls: "badge-red", label: "Kechikkan" },
      sudda: { cls: "badge-yellow", label: "Sudda" },
      tolangan: { cls: "badge-blue", label: "To'langan" },
    };
    const s = map[status] || { cls: "badge-gray", label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <DashboardLayout title="Qarzdor Profili">
      <div className="dp">
        {/* Back */}
        <div className="dp-top">
          <button className="dp-back" onClick={() => router.back()}>
            <ArrowLeft size={18} weight="bold" /> Orqaga
          </button>
          <button className="icon-btn-row"><DotsThree size={20} weight="bold" /></button>
        </div>

        {/* Hero */}
        <div className="dp-hero">
          <div className="dp-hero-left">
            <div className="dp-avatar">
              {debtor.photo ? <img src={debtor.photo} alt="" /> : debtor.fish.charAt(0)}
            </div>
            <div className="dp-hero-info">
              <h1 className="dp-name">{debtor.fish}</h1>
              <div className="dp-meta-row">
                {debtor.pasport && <span><IdentificationCard size={15} /> {debtor.pasport}</span>}
                {debtor.jshshir && <span><ShieldCheck size={15} /> {debtor.jshshir}</span>}
                <span><Phone size={15} /> {debtor.telefon || "Kiritilmagan"}</span>
              </div>
              {debtor.manzil && (
                <div className="dp-meta-row">
                  <span><MapPin size={15} /> {debtor.manzil}</span>
                </div>
              )}
              {debtor.tugilganSana && (
                <div className="dp-meta-row">
                  <span><Calendar size={15} /> <SafeDate date={debtor.tugilganSana} format="full" /></span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="dp-summary">
            <div className="dp-sum-item">
              <div className="dp-sum-label">Jami qarz</div>
              <div className="dp-sum-val">{formatMoney(totalLoan)}</div>
            </div>
            <div className="dp-sum-divider" />
            <div className="dp-sum-item">
              <div className="dp-sum-label">To'langan</div>
              <div className="dp-sum-val" style={{ color: 'var(--green)' }}>{formatMoney(totalPaid)}</div>
            </div>
            <div className="dp-sum-divider" />
            <div className="dp-sum-item">
              <div className="dp-sum-label">Kechikkan</div>
              <div className="dp-sum-val" style={{ color: totalOverdue > 0 ? 'var(--red)' : 'inherit' }}>{formatMoney(totalOverdue)}</div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="dp-grid">
          <div className="dp-main">
            {/* Tabs */}
            <div className="dp-tabs">
              {[
                { key: "loans", icon: <CurrencyCircleDollar size={18} />, label: "Shartnomalar", count: debtor.loans.length },
                { key: "notes", icon: <ChatText size={18} />, label: "Eslatmalar", count: debtor.notes.length },
                { key: "docs", icon: <FileText size={18} />, label: "Hujjatlar" },
              ].map(t => (
                <button key={t.key} className={`dp-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key as any)}>
                  {t.icon} {t.label}
                  {t.count !== undefined && t.count > 0 && <span className="dp-tab-count">{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Loans */}
            {activeTab === "loans" && (
              <div className="dp-loans">
                {debtor.loans.map((loan: any) => {
                  const paid = loan.payments.reduce((s: number, p: any) => s + p.summa, 0);
                  const progress = loan.qarzSummasi > 0 ? Math.min((paid / loan.qarzSummasi) * 100, 100) : 0;
                  return (
                    <div key={loan.id} className="dp-loan-card">
                      <div className="dp-loan-head">
                        <div>
                          <div className="dp-loan-type">{loan.loanType === '20_yil' ? '20 yillik uy-joy' : '7 yillik uy-joy'}</div>
                          <div className="dp-loan-date">
                            Shartnoma: <SafeDate date={loan.shartnomaSana} />
                            {loan.reestrRaqam && <> · #{loan.reestrRaqam}</>}
                          </div>
                        </div>
                        {getStatusBadge(loan.status)}
                      </div>

                      <div className="dp-loan-body">
                        <div className="dp-loan-stats">
                          <div className="dp-ls"><label>Shartnoma summasi</label><span>{formatMoney(loan.qarzSummasi)}</span></div>
                          <div className="dp-ls"><label>To'langan</label><span style={{ color: 'var(--green)' }}>{formatMoney(paid)}</span></div>
                          <div className="dp-ls"><label>Muddati o'tgan</label><span style={{ color: loan.muddatOtganSumma > 0 ? 'var(--red)' : 'inherit' }}>{formatMoney(loan.muddatOtganSumma)}</span></div>
                          <div className="dp-ls"><label>Oylik to'lov</label><span>{formatMoney(loan.oylikTolov || 0)}</span></div>
                        </div>

                        {/* Progress bar */}
                        <div className="dp-progress-wrap">
                          <div className="dp-progress-bar">
                            <div className="dp-progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="dp-progress-label">
                            <span>To'lash jarayoni</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                        </div>

                        {loan.notarius && (
                          <div className="dp-loan-extra">
                            <span>Notarius: {loan.notarius}</span>
                          </div>
                        )}
                      </div>

                      {/* Payment history */}
                      {loan.payments.length > 0 && (
                        <div className="dp-payments">
                          <div className="dp-payments-title">So'nggi to'lovlar</div>
                          {loan.payments.slice(0, 3).map((p: any) => (
                            <div key={p.id} className="dp-payment-row">
                              <div className="dp-pay-left">
                                <CreditCard size={16} />
                                <div>
                                  <div className="dp-pay-amount">{formatMoney(p.summa)}</div>
                                  <div className="dp-pay-meta"><SafeDate date={p.tolovSana} /> · {p.usul === 'bank' ? 'Bank' : 'Payme'}</div>
                                </div>
                              </div>
                              <CheckCircle size={18} weight="fill" color="var(--green)" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Notes */}
            {activeTab === "notes" && (
              <div className="dp-notes">
                <div className="dp-note-add">
                  <textarea placeholder="Yangi eslatma yozing..." />
                  <button className="dp-btn-primary"><Plus size={16} /> Saqlash</button>
                </div>
                {debtor.notes.length === 0 ? (
                  <div className="dp-empty">Hozircha eslatmalar yo'q</div>
                ) : debtor.notes.map((note: any) => (
                  <div key={note.id} className="dp-note-item">
                    <div className="dp-note-date"><SafeDate date={note.createdAt} /></div>
                    <div className="dp-note-text">{note.matn}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Docs */}
            {activeTab === "docs" && (
              <div className="dp-docs">
                <div className="dp-doc-add"><Plus size={28} weight="light" /><span>Hujjat yaratish</span></div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="dp-side">
            <div className="dp-side-card">
              <h3>Tezkor amallar</h3>
              <div className="dp-actions">
                <button><Warning size={18} /> Sudga ariza tayyorlash</button>
                <button><Envelope size={18} /> SMS xabarnoma yuborish</button>
                <button><Clock size={18} /> To'lov grafigini ko'rish</button>
                <button><FileText size={18} /> Hujjat generatsiya</button>
              </div>
            </div>

            <div className="dp-side-card">
              <h3>Xavf tahlili</h3>
              <div className="dp-risk-meter">
                <div className="dp-risk-fill" style={{ width: `${avgRisk}%`, background: avgRisk > 70 ? 'var(--red)' : avgRisk > 40 ? 'var(--yellow)' : 'var(--green)' }} />
              </div>
              <div className="dp-risk-row"><span>Xavf darajasi</span><strong style={{ color: avgRisk > 70 ? 'var(--red)' : 'inherit' }}>{avgRisk}%</strong></div>
              <p className="dp-risk-desc">
                {avgRisk > 70 ? "Yuqori xavf. Zudlik bilan chora ko'ring." : avgRisk > 40 ? "O'rtacha xavf. Monitoring davom ettirilsin." : "Past xavf. Holat barqaror."}
              </p>
            </div>

            {/* Quick info */}
            <div className="dp-side-card">
              <h3>Tizim ma'lumoti</h3>
              <div className="dp-info-rows">
                <div><span>Ro'yxat raqami</span><strong>{debtor.tartibRaqam || "—"}</strong></div>
                <div><span>Qo'shilgan sana</span><strong><SafeDate date={debtor.createdAt} /></strong></div>
                <div><span>Yangilangan</span><strong><SafeDate date={debtor.updatedAt} /></strong></div>
                <div><span>Qarzlar soni</span><strong>{debtor.loans.length}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dp { max-width: 1200px; margin: 0 auto; padding-bottom: 80px; }
        .dp-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .dp-back { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer; font-size: 14px; }
        .dp-back:hover { color: var(--text-primary); }

        .dp-hero { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 28px 32px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .dp-hero-left { display: flex; align-items: flex-start; gap: 24px; flex: 1; min-width: 300px; }
        .dp-avatar { width: 90px; height: 90px; border-radius: 24px; background: var(--bg-sidebar); border: 3px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; color: var(--accent); flex-shrink: 0; overflow: hidden; }
        .dp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .dp-name { font-size: 22px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.3px; }
        .dp-meta-row { display: flex; flex-wrap: wrap; gap: 16px; color: var(--text-secondary); font-size: 13px; margin-bottom: 4px; }
        .dp-meta-row span { display: flex; align-items: center; gap: 6px; }
        
        .dp-summary { display: flex; align-items: center; gap: 20px; background: var(--bg-sidebar); padding: 16px 24px; border-radius: 16px; border: 1px solid var(--border); }
        .dp-sum-label { font-size: 11px; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .dp-sum-val { font-size: 17px; font-weight: 800; white-space: nowrap; }
        .dp-sum-divider { width: 1px; height: 36px; background: var(--border); }

        .dp-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }

        .dp-tabs { display: flex; gap: 6px; margin-bottom: 20px; background: var(--bg-card); padding: 5px; border-radius: 14px; border: 1px solid var(--border); width: fit-content; }
        .dp-tab { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 10px; border: none; background: none; color: var(--text-secondary); font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .dp-tab.active { background: var(--text-primary); color: var(--bg); }
        .dp-tab-count { background: rgba(var(--accent-rgb, 0.15)); padding: 1px 7px; border-radius: 6px; font-size: 11px; font-weight: 700; }

        .dp-loan-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
        .dp-loan-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .dp-loan-type { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
        .dp-loan-date { font-size: 12px; color: var(--text-tertiary); }
        .dp-loan-body { padding: 20px; }
        .dp-loan-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
        .dp-ls label { display: block; font-size: 11px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
        .dp-ls span { font-weight: 700; font-size: 14px; }

        .dp-progress-wrap { margin-bottom: 12px; }
        .dp-progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .dp-progress-fill { height: 100%; background: var(--green); border-radius: 3px; transition: width 0.6s ease; }
        .dp-progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); margin-top: 6px; font-weight: 500; }

        .dp-loan-extra { font-size: 12px; color: var(--text-tertiary); padding-top: 8px; border-top: 1px solid var(--border); }

        .dp-payments { border-top: 1px solid var(--border); padding: 16px 20px; }
        .dp-payments-title { font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .dp-payment-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
        .dp-payment-row + .dp-payment-row { border-top: 1px solid var(--border); }
        .dp-pay-left { display: flex; align-items: center; gap: 10px; }
        .dp-pay-amount { font-weight: 700; font-size: 14px; }
        .dp-pay-meta { font-size: 11px; color: var(--text-tertiary); }

        .dp-side-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .dp-side-card h3 { font-size: 14px; font-weight: 700; margin-bottom: 16px; }
        .dp-actions { display: flex; flex-direction: column; gap: 8px; }
        .dp-actions button { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-sidebar); color: var(--text-primary); font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .dp-actions button:hover { background: var(--bg-hover); border-color: var(--text-tertiary); }

        .dp-risk-meter { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 10px; }
        .dp-risk-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        .dp-risk-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; }
        .dp-risk-desc { font-size: 12px; color: var(--text-tertiary); margin-top: 10px; line-height: 1.5; }

        .dp-info-rows { display: flex; flex-direction: column; gap: 10px; }
        .dp-info-rows > div { display: flex; justify-content: space-between; font-size: 13px; }
        .dp-info-rows span { color: var(--text-tertiary); }
        .dp-info-rows strong { font-weight: 600; }

        .dp-notes { padding: 4px 0; }
        .dp-note-add { margin-bottom: 20px; }
        .dp-note-add textarea { width: 100%; height: 80px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-sidebar); padding: 14px; font-family: inherit; font-size: 13px; resize: none; margin-bottom: 10px; }
        .dp-btn-primary { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 10px; border: none; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
        .dp-note-item { padding: 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-sidebar); margin-bottom: 10px; }
        .dp-note-date { font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; }
        .dp-note-text { font-size: 13px; line-height: 1.5; }
        .dp-empty { text-align: center; padding: 40px; color: var(--text-tertiary); font-size: 14px; }
        .dp-docs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .dp-doc-add { border: 2px dashed var(--border); border-radius: 14px; padding: 28px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-tertiary); cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .dp-doc-add:hover { border-color: var(--accent); color: var(--accent); }

        @media (max-width: 900px) {
          .dp-grid { grid-template-columns: 1fr; }
          .dp-hero { flex-direction: column; }
          .dp-summary { width: 100%; justify-content: space-around; }
        }
      `}</style>
    </DashboardLayout>
  );
}
