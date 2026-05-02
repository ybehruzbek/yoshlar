"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  Phone, MapPin, IdentificationCard, Calendar, 
  CurrencyCircleDollar, Warning, CheckCircle, 
  Clock, FileText, ChatText, ArrowLeft,
  Receipt, Plus, DotsThree, Bell, Scales,
  CreditCard, TrendUp, ShieldCheck, Envelope, X
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/utils/format";
import { generateSchedule, ScheduleItem } from "@/lib/utils/schedule";
import { addPayment } from "@/lib/actions/addPayment";

const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktyabr", "noyabr", "dekabr"];

const SafeDate = ({ date, format }: { date: string | Date | null; format?: "short" | "full" }) => {
  const [formatted, setFormatted] = useState<string>("");
  useEffect(() => {
    if (!date) return;
    const d = new Date(date);
    if (isNaN(d.getTime())) return;
    const day = d.getDate();
    const month = UZ_MONTHS[d.getMonth()];
    const year = d.getFullYear();
    if (format === "full") {
      setFormatted(`${year}-yil ${day}-${month}`);
    } else {
      setFormatted(`${String(day).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${year}`);
    }
  }, [date, format]);
  return <>{formatted || "—"}</>;
};

export function DebtorProfileClient({ debtor }: { debtor: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"loans" | "schedule" | "notes" | "docs">("loans");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [paymentForm, setPaymentForm] = useState({
    loanId: debtor.loans[0]?.id || 0,
    summa: "",
    tolovSana: new Date().toISOString().split("T")[0],
    usul: "bank",
    izoh: ""
  });

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

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addPayment({
        loanId: Number(paymentForm.loanId),
        summa: Number(paymentForm.summa.replace(/[^0-9.-]+/g,"")),
        tolovSana: paymentForm.tolovSana,
        usul: paymentForm.usul,
        maqsad: paymentForm.izoh
      });
      if (res.success) {
        setIsPaymentModalOpen(false);
        setPaymentForm(prev => ({ ...prev, summa: "", izoh: "" }));
      } else {
        alert("Xatolik yuz berdi: " + res.error);
      }
    });
  };

  return (
    <>
      <div className="dp">
        {/* Back */}
        <div className="dp-top">
          <button className="dp-back" onClick={() => router.back()}>
            <ArrowLeft size={18} weight="bold" /> Orqaga
          </button>
          <button className="icon-btn-row"><DotsThree size={20} weight="bold" /></button>
        </div>

        {/* ── Person Card + Finance Summary ── */}
        <div className="dp-hero-grid">
          {/* Shaxsiy ma'lumotlar */}
          <div className="dp-person-card">
            <div className="dp-person-top">
              <div className="dp-avatar">
                {debtor.photo ? <img src={debtor.photo} alt="" /> : debtor.fish.charAt(0)}
              </div>
              <div className="dp-person-info">
                <h1 className="dp-name">{debtor.fish}</h1>
                {debtor.tugilganSana && (
                  <div className="dp-birthdate"><Calendar size={14} /> <SafeDate date={debtor.tugilganSana} format="full" /></div>
                )}
              </div>
            </div>

            <div className="dp-details-grid">
              {debtor.pasport && (
                <div className="dp-detail">
                  <div className="dp-detail-label">Pasport</div>
                  <div className="dp-detail-val">{debtor.pasport}</div>
                </div>
              )}
              {debtor.jshshir && (
                <div className="dp-detail">
                  <div className="dp-detail-label">JShShIR</div>
                  <div className="dp-detail-val">{debtor.jshshir}</div>
                </div>
              )}
              <div className="dp-detail">
                <div className="dp-detail-label">Telefon</div>
                <div className="dp-detail-val">{debtor.telefon || "Kiritilmagan"}</div>
              </div>
              {debtor.manzil && (
                <div className="dp-detail dp-detail-full">
                  <div className="dp-detail-label">Manzil</div>
                  <div className="dp-detail-val">{debtor.manzil}</div>
                </div>
              )}
            </div>
          </div>

          {/* Moliyaviy xulosa */}
          <div className="dp-finance-card">
            <div className="dp-fin-row">
              <div className="dp-fin-item">
                <div className="dp-fin-label">Jami qarz</div>
                <div className="dp-fin-val">{formatMoney(totalLoan)}</div>
              </div>
              <div className="dp-fin-item">
                <div className="dp-fin-label">To&apos;langan</div>
                <div className="dp-fin-val dp-fin-green">{formatMoney(totalPaid)}</div>
              </div>
            </div>
            <div className="dp-fin-row">
              <div className="dp-fin-item">
                <div className="dp-fin-label">Kechikkan</div>
                <div className={`dp-fin-val ${totalOverdue > 0 ? 'dp-fin-red' : ''}`}>{formatMoney(totalOverdue)}</div>
              </div>
              <div className="dp-fin-item">
                <div className="dp-fin-label">Qoldiq qarz</div>
                <div className="dp-fin-val">{formatMoney(totalLoan - totalPaid)}</div>
              </div>
            </div>
            <div className="dp-fin-risk-section">
              <div className="dp-fin-label">Xavf darajasi</div>
              <div className="dp-fin-risk">
                <div className="dp-risk-mini-bar"><div className="dp-risk-mini-fill" style={{ width: `${avgRisk}%`, background: avgRisk > 70 ? 'var(--red)' : avgRisk > 40 ? 'var(--yellow)' : 'var(--green)' }} /></div>
                <span style={{ color: avgRisk > 70 ? 'var(--red)' : 'inherit', fontWeight: 800, fontSize: 16 }}>{avgRisk}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className={`dp-grid ${activeTab === "schedule" ? "schedule-mode" : ""}`}>
          <div className="dp-main">
            {/* Tabs */}
            <div className="dp-tabs">
              {[
                { key: "loans", icon: <CurrencyCircleDollar size={18} />, label: "Shartnomalar", count: debtor.loans.length },
                { key: "schedule", icon: <Calendar size={18} />, label: "To'lov grafigi" },
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
                  const qoldiq = loan.qarzSummasi - paid;
                  return (
                    <div key={loan.id} className="dp-loan-card">
                      {/* Header */}
                      <div className="dp-loan-head">
                        <div className="dp-loan-head-left">
                          <span className={`dp-loan-type-badge ${loan.loanType === '20_yil' ? 'type-20' : 'type-7'}`}>
                            {loan.loanType === '20_yil' ? '20 yillik' : '7 yillik'}
                          </span>
                          <span className="dp-loan-title">Uy-joy shartnomasi</span>
                        </div>
                        {getStatusBadge(loan.status)}
                      </div>

                      {/* Stats */}
                      <div className="dp-loan-body">
                        <div className="dp-loan-stats">
                          <div className="dp-ls">
                            <label>Shartnoma summasi</label>
                            <span>{formatMoney(loan.qarzSummasi)}</span>
                          </div>
                          <div className="dp-ls">
                            <label>Muddati o&apos;tgan</label>
                            <span className={loan.muddatOtganSumma > 0 ? 'dp-val-red' : ''}>{formatMoney(loan.muddatOtganSumma)}</span>
                          </div>
                          <div className="dp-ls">
                            <label>To&apos;langan</label>
                            <span className={paid > 0 ? 'dp-val-green' : 'dp-val-muted'}>{formatMoney(paid)}</span>
                          </div>
                          <div className="dp-ls">
                            <label>Qoldiq qarz</label>
                            <span>{formatMoney(qoldiq > 0 ? qoldiq : 0)}</span>
                          </div>
                        </div>

                        {/* Progress bar - faqat to'lov bo'lganda */}
                        {progress > 0 && (
                          <div className="dp-progress-wrap">
                            <div className="dp-progress-bar">
                              <div className="dp-progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="dp-progress-label">
                              <span>To&apos;lash jarayoni</span>
                              <span>{progress.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}

                        {/* Ma'lumotlar jadvali */}
                        <div className="dp-loan-info-table">
                          {loan.shartnomaSana && (
                            <div className="dp-info-row">
                              <span className="dp-info-key">Shartnoma sanasi</span>
                              <span className="dp-info-value"><SafeDate date={loan.shartnomaSana} format="full" /></span>
                            </div>
                          )}
                          {loan.reestrRaqam && (
                            <div className="dp-info-row">
                              <span className="dp-info-key">Reestr raqami</span>
                              <span className="dp-info-value dp-info-mono">{loan.reestrRaqam}</span>
                            </div>
                          )}
                          {loan.oylikTolov > 0 && (
                            <div className="dp-info-row">
                              <span className="dp-info-key">Oylik to&apos;lov</span>
                              <span className="dp-info-value">{formatMoney(loan.oylikTolov)}</span>
                            </div>
                          )}
                          {loan.holatSanasi && (
                            <div className="dp-info-row">
                              <span className="dp-info-key">Holat sanasi</span>
                              <span className="dp-info-value"><SafeDate date={loan.holatSanasi} format="full" /></span>
                            </div>
                          )}
                          {loan.notarius && (() => {
                            // Aqlli ajratish: "...notariusi Ism1 ...notariusi Ism2" → 2 ta
                            const parts = loan.notarius
                              .split(/(?=Toshkent shahar)/gi)
                              .map((s: string) => s.trim())
                              .filter((s: string) => s.length > 5);
                            return (
                              <div className="dp-info-row dp-info-col">
                                <span className="dp-info-key">Notarius{parts.length > 1 ? 'lar' : ''}</span>
                                <div className="dp-notarius-list">
                                  {parts.map((n: string, i: number) => (
                                    <div key={i} className="dp-notarius-item">
                                      <span className="dp-notarius-num">{i + 1}</span>
                                      <span>{n}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Payment history */}
                      {loan.payments.length > 0 && (
                        <div className="dp-payments">
                          <div className="dp-payments-title">So&apos;nggi to&apos;lovlar</div>
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

            {/* Schedule */}
            {activeTab === "schedule" && (
              <div className="dp-schedule">
                {debtor.loans.map((loan: any) => {
                  const schedule = generateSchedule(
                    loan.qarzSummasi,
                    loan.loanType,
                    loan.shartnomaSana,
                    loan.payments
                  );
                  return (
                    <div key={loan.id} className="dp-schedule-card">
                      <div className="dp-sc-head">
                        <h3>{loan.loanType === '20_yil' ? '20 yillik' : '7 yillik'} kredit jadvali</h3>
                        {loan.shartnomaSana && <span className="dp-sc-date">Boshlanish: <SafeDate date={loan.shartnomaSana} format="full" /></span>}
                      </div>
                      
                      {schedule.length === 0 ? (
                        <div className="dp-empty">Jadval tuzish uchun shartnoma sanasi va summa kiritilgan bo'lishi kerak.</div>
                      ) : (
                        <div className="dp-table-wrap">
                          <table className="dp-table">
                            <thead>
                              <tr>
                                <th>Oy</th>
                                <th>To'lov sanasi</th>
                                <th className="num">Qoldiq qarz</th>
                                <th className="num">Asosiy qarz</th>
                                {loan.loanType === '7_yil' && <th className="num">Foiz</th>}
                                <th className="num">Jami to'lov</th>
                                <th className="num">To'landi</th>
                                <th>Holat</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schedule.map((row: ScheduleItem) => (
                                <tr key={row.monthIndex} className={row.status === 'overdue' ? 'row-danger' : row.status === 'paid' ? 'row-success' : ''}>
                                  <td>{row.monthIndex}</td>
                                  <td><SafeDate date={row.date} /></td>
                                  <td className="num">{formatMoney(row.remainingPrincipal + row.principal)}</td>
                                  <td className="num">{formatMoney(row.principal)}</td>
                                  {loan.loanType === '7_yil' && <td className="num">{formatMoney(row.interest)}</td>}
                                  <td className="num bold">{formatMoney(row.total)}</td>
                                  <td className={`num ${row.paid > 0 ? 'text-green' : ''}`}>{formatMoney(row.paid)}</td>
                                  <td>
                                    {row.status === 'paid' && <span className="badge badge-green">To'langan</span>}
                                    {row.status === 'partial' && <span className="badge badge-yellow">Qisman</span>}
                                    {row.status === 'overdue' && <span className="badge badge-red">Kechikkan</span>}
                                    {row.status === 'pending' && <span className="badge badge-gray">Kutilmoqda</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
                <button onClick={() => setIsPaymentModalOpen(true)} className="btn-pay" style={{ background: 'var(--green)', color: '#fff', border: 'none' }}>
                  <CreditCard size={18} /> To'lov kiritish
                </button>
                <button><Warning size={18} /> Sudga ariza tayyorlash</button>
                <button><Envelope size={18} /> SMS xabarnoma yuborish</button>
                <button onClick={() => setActiveTab('schedule')}><Clock size={18} /> To'lov grafigini ko'rish</button>
                <button><FileText size={18} /> Hujjat generatsiya</button>
              </div>
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

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-glass">
            <div className="modal-head">
              <h2>To'lov kiritish</h2>
              <button className="modal-close" onClick={() => setIsPaymentModalOpen(false)}><X size={20} /></button>
            </div>
            <form className="modal-body" onSubmit={handleAddPayment}>
              {debtor.loans.length > 1 && (
                <div className="form-group">
                  <label>Shartnoma</label>
                  <select value={paymentForm.loanId} onChange={e => setPaymentForm({...paymentForm, loanId: Number(e.target.value)})}>
                    {debtor.loans.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.loanType === '20_yil' ? '20 yillik' : '7 yillik'} ({formatMoney(l.qarzSummasi)})</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label>To'lov summasi</label>
                <div className="input-wrap">
                  <input 
                    type="text" 
                    required
                    placeholder="Masalan: 1 500 000"
                    value={paymentForm.summa} 
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setPaymentForm({...paymentForm, summa: val ? Number(val).toLocaleString() : ""});
                    }} 
                  />
                  <span className="input-suffix">so'm</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sana</label>
                  <input type="date" required value={paymentForm.tolovSana} onChange={e => setPaymentForm({...paymentForm, tolovSana: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Usul</label>
                  <select value={paymentForm.usul} onChange={e => setPaymentForm({...paymentForm, usul: e.target.value})}>
                    <option value="bank">Bank</option>
                    <option value="payme">Payme/Click</option>
                    <option value="naqd">Naqd pul</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Izoh (ixtiyoriy)</label>
                <input type="text" placeholder="Kvitansiya raqami yoki izoh..." value={paymentForm.izoh} onChange={e => setPaymentForm({...paymentForm, izoh: e.target.value})} />
              </div>

              <button type="submit" className="btn-primary-full" disabled={isPending} style={{ marginTop: '12px' }}>
                {isPending ? "Saqlanmoqda..." : "Saqlash va qo'shish"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dp { max-width: 1200px; margin: 0 auto; padding-bottom: 80px; }
        
        /* ── Modal ── */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 20px; animation: fadeIn 0.2s ease; }
        .modal-glass { background: var(--bg-card); width: 100%; max-width: 440px; border-radius: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); overflow: hidden; animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-head { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border); }
        .modal-head h2 { font-size: 18px; font-weight: 700; margin: 0; }
        .modal-close { background: var(--bg-sidebar); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .modal-close:hover { background: var(--border); color: var(--text-primary); }
        .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
        .form-group input, .form-group select { padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-sidebar); color: var(--text-primary); font-family: inherit; font-size: 14px; outline: none; transition: border 0.2s; }
        .form-group input:focus, .form-group select:focus { border-color: var(--accent); }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-wrap input { width: 100%; padding-right: 48px; font-size: 16px; font-weight: 700; }
        .input-suffix { position: absolute; right: 16px; color: var(--text-tertiary); font-size: 14px; font-weight: 600; }
        .dp-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .dp-back { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-secondary); font-weight: 600; cursor: pointer; font-size: 14px; }
        .dp-back:hover { color: var(--text-primary); }

        /* ── Hero Grid (2 cards) ── */
        .dp-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        .dp-person-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 36px;
        }
        .dp-person-top { display: flex; align-items: center; gap: 28px; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--border); }
        .dp-avatar {
          width: 120px; height: 120px; border-radius: 30px;
          background: var(--bg-sidebar); border: 3px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 44px; font-weight: 700; color: var(--accent);
          flex-shrink: 0; overflow: hidden;
        }
        .dp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .dp-person-info { flex: 1; }
        .dp-name { font-size: 24px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.3px; }
        .dp-birthdate { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-tertiary); }

        .dp-details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
        .dp-detail-full { grid-column: 1 / -1; }
        .dp-detail-label { font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .dp-detail-val { font-size: 14px; font-weight: 600; color: var(--text-primary); word-break: break-word; }

        .dp-finance-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 24px; padding: 36px;
          display: flex; flex-direction: column; justify-content: center; gap: 8px;
        }
        .dp-fin-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px; }
        .dp-fin-label { font-size: 12px; font-weight: 600; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.4px; }
        .dp-fin-val { font-size: 22px; font-weight: 800; }
        .dp-fin-green { color: var(--green); }
        .dp-fin-red { color: var(--red); }
        .dp-fin-risk-section { padding-top: 16px; border-top: 1px solid var(--border); }
        .dp-fin-risk { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
        .dp-risk-mini-bar { flex: 1; height: 10px; background: var(--border); border-radius: 5px; overflow: hidden; }
        .dp-risk-mini-fill { height: 100%; border-radius: 5px; transition: width 0.6s ease; }

        /* ── Grid ── */
        .dp-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; transition: all 0.3s ease; }
        .dp-grid.schedule-mode { grid-template-columns: 1fr; }
        .dp-grid.schedule-mode .dp-side { display: none; }

        /* ── Tabs ── */
        .dp-tabs { display: flex; gap: 6px; margin-bottom: 28px; background: var(--bg-card); padding: 6px; border-radius: 14px; border: 1px solid var(--border); width: fit-content; }
        .dp-tab { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; border: none; background: none; color: var(--text-secondary); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .dp-tab.active { background: var(--text-primary); color: var(--bg); }
        .dp-tab-count { background: rgba(var(--accent-rgb, 0.15)); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }

        /* ── Loan Cards ── */
        .dp-loan-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; margin-bottom: 24px; overflow: hidden; }
        .dp-loan-head { padding: 18px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .dp-loan-head-left { display: flex; align-items: center; gap: 12px; }
        .dp-loan-type-badge { padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .dp-loan-type-badge.type-20 { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
        .dp-loan-type-badge.type-7 { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
        .dp-loan-title { font-weight: 700; font-size: 15px; }
        .dp-loan-body { padding: 28px; }
        .dp-loan-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 24px; }
        .dp-ls label { display: block; font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .dp-ls span { font-weight: 700; font-size: 16px; }
        .dp-val-red { color: var(--red) !important; }
        .dp-val-green { color: var(--green) !important; }
        .dp-val-muted { color: var(--text-tertiary) !important; }

        .dp-progress-wrap { margin-bottom: 24px; }
        .dp-progress-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .dp-progress-fill { height: 100%; background: var(--green); border-radius: 4px; transition: width 0.6s ease; }
        .dp-progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-tertiary); margin-top: 8px; font-weight: 500; }

        /* Info Table */
        .dp-loan-info-table { border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 14px; }
        .dp-info-row { display: flex; align-items: baseline; justify-content: space-between; }
        .dp-info-row.dp-info-col { flex-direction: column; gap: 6px; }
        .dp-info-key { font-size: 13px; color: var(--text-tertiary); font-weight: 500; flex-shrink: 0; }
        .dp-info-value { font-size: 13px; font-weight: 600; color: var(--text-primary); text-align: right; }
        .dp-info-value.dp-info-mono { font-family: 'SF Mono', 'Menlo', monospace; font-size: 12px; letter-spacing: 0.3px; word-break: break-all; }
        .dp-info-value.dp-info-small { font-size: 12px; font-weight: 500; color: var(--text-secondary); line-height: 1.6; text-align: left; }

        .dp-notarius-list { display: flex; flex-direction: column; gap: 10px; }
        .dp-notarius-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px; border-radius: 12px;
          background: var(--bg-sidebar); border: 1px solid var(--border);
          font-size: 13px; line-height: 1.6; color: var(--text-secondary);
        }
        .dp-notarius-num {
          flex-shrink: 0; width: 22px; height: 22px;
          border-radius: 7px; background: var(--accent);
          color: #fff; font-size: 11px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        /* ── Payments ── */
        .dp-payments { border-top: 1px solid var(--border); padding: 20px 28px; }
        .dp-payments-title { font-size: 12px; font-weight: 700; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .dp-payment-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; }
        .dp-payment-row + .dp-payment-row { border-top: 1px solid var(--border); }
        .dp-pay-left { display: flex; align-items: center; gap: 12px; }
        .dp-pay-amount { font-weight: 700; font-size: 14px; }
        .dp-pay-meta { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }

        /* ── Side Cards ── */
        .dp-side-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 20px; }
        .dp-side-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 20px; }
        .dp-actions { display: flex; flex-direction: column; gap: 10px; }
        .dp-actions button { width: 100%; display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-sidebar); color: var(--text-primary); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .dp-actions button:hover { background: var(--bg-hover); border-color: var(--text-tertiary); }

        .dp-risk-meter { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 14px; }
        .dp-risk-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
        .dp-risk-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
        .dp-risk-desc { font-size: 13px; color: var(--text-tertiary); margin-top: 14px; line-height: 1.6; }

        .dp-info-rows { display: flex; flex-direction: column; gap: 14px; }
        .dp-info-rows > div { display: flex; justify-content: space-between; font-size: 13px; }
        .dp-info-rows span { color: var(--text-tertiary); }
        .dp-info-rows strong { font-weight: 600; }

        /* ── Notes ── */
        .dp-notes { padding: 8px 0; }
        .dp-note-add { margin-bottom: 24px; }
        .dp-note-add textarea { width: 100%; height: 90px; border-radius: 14px; border: 1px solid var(--border); background: var(--bg-sidebar); padding: 16px; font-family: inherit; font-size: 14px; resize: none; margin-bottom: 12px; color: var(--text-primary); }
        .dp-btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 12px; border: none; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
        .dp-note-item { padding: 18px; border-radius: 14px; border: 1px solid var(--border); background: var(--bg-sidebar); margin-bottom: 14px; }
        .dp-note-date { font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px; }
        .dp-note-text { font-size: 14px; line-height: 1.6; }
        .dp-empty { text-align: center; padding: 48px; color: var(--text-tertiary); font-size: 14px; }

        /* ── Docs ── */
        .dp-docs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .dp-doc-add { border: 2px dashed var(--border); border-radius: 16px; padding: 36px; display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--text-tertiary); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .dp-doc-add:hover { border-color: var(--accent); color: var(--accent); }

        /* ── Schedule ── */
        .dp-schedule-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; margin-bottom: 24px; }
        .dp-sc-head { padding: 20px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .dp-sc-head h3 { font-size: 15px; font-weight: 700; }
        .dp-sc-date { font-size: 13px; color: var(--text-tertiary); font-weight: 500; }
        .dp-table-wrap { overflow-x: auto; max-height: 500px; overflow-y: auto; }
        .dp-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
        .dp-table th { position: sticky; top: 0; background: var(--bg-sidebar); padding: 12px 20px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); z-index: 10; }
        .dp-table td { padding: 12px 20px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
        .dp-table tr:last-child td { border-bottom: none; }
        .dp-table tr:hover td { background: rgba(255,255,255,0.02); }
        .dp-table th.num, .dp-table td.num { text-align: right; font-family: 'SF Mono', 'Menlo', monospace; letter-spacing: -0.2px; white-space: nowrap; }
        .dp-table td.bold { font-weight: 700; }
        .dp-table tr.row-danger td { background: rgba(255, 59, 48, 0.05); }
        .dp-table tr.row-success td { background: rgba(52, 199, 89, 0.05); }

        @media (max-width: 900px) {
          .dp-hero-grid { grid-template-columns: 1fr; }
          .dp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
