"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { 
  MagnifyingGlass, 
  Funnel, 
  CaretDown, 
  DotsThreeVertical,
  User as UserIcon,
  Phone,
  Calendar,
  CurrencyCircleDollar,
  ArrowRight,
  CheckCircle,
  Clock,
  Warning,
  FilePlus,
  FileText,
  Bell,
  FileArrowDown,
  CloudArrowUp,
  Trash,
  PencilSimple
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";
import { formatMoney } from "../../lib/utils/format";
import { previewDebtorsExcel, commitDebtorsImport } from "../../lib/actions/import";
import { deleteDebtor, deleteAllDebtors } from "../../lib/actions/debtors";
import { useRouter } from "next/navigation";

export interface DebtorItem {
  id: string;
  fish: string;
  telefon: string | null;
  loanType: string;
  qarzSummasi: number;
  muddatOtganSumma: number;
  status: string;
  riskScore: number;
  photo?: string | null;
}

interface DebtorsClientProps {
  initialDebtors: DebtorItem[];
  totalCount: number;
}

export function DebtorsClient({ initialDebtors, totalCount }: DebtorsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [typeFilter, setTypeFilter] = useState("Barchasi");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loanTypeToImport, setLoanTypeToImport] = useState<"20_yil" | "7_yil">("20_yil");
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRowActionClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveRowId(activeRowId === id ? null : id);
  };

  useEffect(() => {
    const handleClose = () => {
      setActiveRowId(null);
      setIsActionMenuOpen(false);
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleImportClick = () => {
    setIsActionMenuOpen(false);
    setIsImportModalOpen(true);
    setImportResult(null);
    setPreviewData(null);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Haqiqatan ham "${name}" ni va barcha bog'liq ma'lumotlarni o'chirib yubormoqchimisiz?`)) {
      const res = await deleteDebtor(id);
      if (res.success) {
        alert("Qarzdor muvaffaqiyatli o'chirildi");
        setActiveRowId(null);
      } else {
        alert("Xatolik: " + res.error);
      }
    }
  };

  const handleViewProfile = (id: string) => {
    router.push(`/debtors/${id}`);
  };

  const handleDeleteAll = async () => {
    if (confirm("DIQQAT! Barcha qarzdorlarni va ularga tegishli barcha ma'lumotlarni (qarzlar, eslatmalar) butunlay o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) {
      setIsLoading(true);
      const res = await deleteAllDebtors();
      setIsLoading(false);
      
      if (res.success) {
        alert("Barcha ma'lumotlar tozalandi");
        setIsActionMenuOpen(false);
        router.refresh();
      } else {
        alert("Xatolik: " + res.error);
      }
    }
  };

  const handleEdit = (id: string) => {
    alert("Tez kunda: Tahrirlash imkoniyati qo'shiladi");
  };

  const downloadSample = () => {
    const title = loanTypeToImport === "20_yil" ? "Uy-joy qarzdorlik ro'yxati 20-yillik" : "Uy-joy qarzdorlik ro'yxati 7-yillik";
    const data = [
      [title],
      [
        "T/r.", "Rasmi", "Pasport bo'yicha manzili", "F.I.O.", "Pasport seriyasi va raqami", 
        "Tug'ilgan vaqti", "JShShIR", "Olingan qarz summasi", "Olingan qarz summasi matnda", 
        "Qarz shartnomasi tasdiqlangan sana", "Tasdiqlagan notarius", "Shartnoma reestr raqami", 
        "Qarzdorlik holati sanasi", "Muddati o'tkan qarz summasi", "Muddati o'tkan qarz summasi matnda ", 
        "Telefon raqami", "Ogohlantirish xati yuborilgan sana va raqami", "Sudga chiqarilganligi haqida ma'lumot"
      ],
      [
        1, "", "Toshkent shahar, Uchtepa tumani", "KADIROV ODIL MURATOVICH", "AD1114901", 
        "1990-01-01", "31602870171169", 68590000, "oltmish sakkiz million...", 
        "2019-yil 20-mart", "Notarius Nomi", "201900043001468", 
        "2025-yil 5-noyabr", 22577489, "yigirma ikki million...", "998901234567"
      ]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Qarzdorlar");
    XLSX.writeFile(wb, `namuna_${loanTypeToImport}.xlsx`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handlePreview = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("loanType", loanTypeToImport);

    const result = await previewDebtorsExcel(formData);
    setIsLoading(false);

    if (result.success) {
      setPreviewData(result.data);
    } else {
      alert(`Xatolik yuz berdi: ${result.error}`);
    }
  };

  const handleCommit = async () => {
    if (!previewData) return;
    setIsLoading(true);
    const result = await commitDebtorsImport(previewData, loanTypeToImport);
    setIsLoading(false);

    if (result.success) {
      setImportResult(result);
      setPreviewData(null);
      router.refresh();
    } else {
      alert(`Xatolik yuz berdi: ${result.error}`);
    }
  };

  // Calculate summary stats
  const stats = {
    total: initialDebtors.length,
    y20: initialDebtors.filter(d => d.loanType === '20_yil').length,
    y7: initialDebtors.filter(d => d.loanType === '7_yil').length,
    overdueCount: initialDebtors.filter(d => d.muddatOtganSumma > 0).length,
    totalOverdue: initialDebtors.reduce((acc, d) => acc + d.muddatOtganSumma, 0),
    highRisk: initialDebtors.filter(d => d.riskScore >= 80).length,
    avgRisk: Math.round(initialDebtors.reduce((acc, d) => acc + d.riskScore, 0) / (initialDebtors.length || 1)),
    courtCount: initialDebtors.filter(d => d.status === 'sudda').length,
    paidCount: initialDebtors.filter(d => d.status === 'tolangan').length
  };

  const filteredDebtors = initialDebtors.filter(d => {
    const matchesSearch = d.fish.toLowerCase().includes(search.toLowerCase()) || 
                         (d.telefon && d.telefon.includes(search));
    const matchesStatus = statusFilter === "Barchasi" || d.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "Barchasi" || 
                       (typeFilter === "20 yillik" && d.loanType === "20_yil") ||
                       (typeFilter === "7 yillik" && d.loanType === "7_yil");
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case "faol": return <span className="badge badge-green">Faol</span>;
      case "kechikkan": return <span className="badge badge-red">Kechikkan</span>;
      case "sudda": return <span className="badge badge-yellow">Sudda</span>;
      case "tolangan": return <span className="badge badge-blue">To'langan</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "var(--red)";
    if (score >= 50) return "var(--yellow)";
    return "var(--green)";
  };

  return (
    <DashboardLayout title="Qarzdorlar">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="header-info">
          <h2 className="section-title">Barcha qarzdorlar</h2>
          <p className="section-sub">Baza ma&apos;lumotlari tahlili</p>
        </div>

        <div className="header-actions-wrap" style={{ display: 'flex', gap: 12 }}>
          <button 
            className="btn-delete-all" 
            onClick={handleDeleteAll}
            disabled={isLoading}
          >
            <Trash size={18} weight="bold" /> Barchasini o'chirish
          </button>

          <div style={{ position: 'relative' }}>
            <button 
              className="icon-btn-row" 
              style={{ width: 44, height: 44, borderRadius: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsActionMenuOpen(!isActionMenuOpen);
              }}
              disabled={isLoading}
            >
              {isLoading ? <Clock size={24} className="spin" /> : <DotsThreeVertical size={24} weight="bold" />}
            </button>

            {isActionMenuOpen && (
              <div className="dropdown-menu-glass">
                <div className="menu-item" onClick={() => setIsActionMenuOpen(false)}>
                  <UserIcon size={18} /> Yangi qo&apos;shish
                </div>
                <div className="menu-item" onClick={handleImportClick}>
                  <FilePlus size={18} /> Exceldan import
                </div>

                <div className="menu-divider" />
                <div className="menu-item" onClick={() => setIsActionMenuOpen(false)}>
                  <FileText size={18} /> Talabnomalar yaratish
                </div>
                <div className="menu-item" onClick={() => setIsActionMenuOpen(false)}>
                  <Bell size={18} /> SMS xabarnoma
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* ── Summary Stats ── */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card" style={{ padding: '24px 20px' }}>
          <div className="stat-value" style={{ fontSize: 24 }}>{stats.total} ta</div>
          <div className="stat-label">Jami qarzdorlar</div>
          <div className="stat-footer">20 yillik: <strong>{stats.y20}</strong> · 7 yillik: <strong>{stats.y7}</strong></div>
        </div>
        <div className="stat-card" style={{ padding: '24px 20px' }}>
          <div className="stat-value" style={{ fontSize: 24 }}>{stats.overdueCount} ta</div>
          <div className="stat-label">Muddati o&apos;tganlar</div>
          <div className="stat-footer">Jami qarz: <strong>{formatMoney(stats.totalOverdue)}</strong></div>
        </div>
        <div className="stat-card" style={{ padding: '24px 20px' }}>
          <div className="stat-value" style={{ fontSize: 24, color: stats.highRisk > 0 ? 'var(--red)' : 'var(--text-primary)' }}>{stats.highRisk} ta</div>
          <div className="stat-label">Yuqori xavf guruhi</div>
          <div className="stat-footer">O&apos;rtacha xavf: <strong>{stats.avgRisk}%</strong></div>
        </div>
        <div className="stat-card" style={{ padding: '24px 20px' }}>
          <div className="stat-value" style={{ fontSize: 24 }}>{stats.courtCount} ta</div>
          <div className="stat-label">Huquqiy jarayonda</div>
          <div className="stat-footer">MIB ga o&apos;tgan: <strong>0 ta</strong></div>
        </div>
      </div>


      {/* ── Filters ── */}
      <div className="filter-card">
        <div className="search-wrap">
          <MagnifyingGlass size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Ism yoki telefon bo'yicha qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <span className="filter-label">Holat:</span>
            <div className="select-wrap">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>Barchasi</option>
                <option>Faol</option>
                <option>Kechikkan</option>
                <option>Sudda</option>
                <option>Tolangan</option>
              </select>
              <CaretDown size={14} className="select-caret" />
            </div>
          </div>

          <div className="filter-item">
            <span className="filter-label">Tur:</span>
            <div className="select-wrap">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>Barchasi</option>
                <option>20 yillik</option>
                <option>7 yillik</option>
              </select>
              <CaretDown size={14} className="select-caret" />
            </div>
          </div>

          <button className="filter-btn-main">
            <Funnel size={16} weight="bold" /> Filtrlash
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-container-full">
        <table className="modern-table">
          <thead>
            <tr>
              <th>F.I.O va Ma'lumot</th>
              <th>Shartnoma turi</th>
              <th>Jami qarz</th>
              <th>Kechikkan summa</th>
              <th>Holat</th>
              <th>Xavf</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredDebtors.map((d, i) => (
              <tr 
                key={d.id} 
                className="fade-in-row"
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  position: 'relative',
                  zIndex: activeRowId === d.id ? 100 : 1
                }}
              >
                <td>
                  <div className="user-info-cell">
                    <div className="user-avatar-sm">
                      {d.photo ? (
                        <img src={d.photo} alt={d.fish} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                      ) : (
                        d.fish.charAt(0)
                      )}
                    </div>

                    <div>
                      <div className="user-name-cell">{d.fish}</div>
                      <div className="user-sub-cell">
                        <Phone size={12} style={{marginRight: 4}} /> {d.telefon || "Kiritilmagan"}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`type-tag ${d.loanType === "20_yil" ? "tag-purple" : "tag-blue"}`}>
                    {d.loanType === "20_yil" ? "20 yillik" : "7 yillik"}
                  </span>
                </td>
                <td>
                  <div className="amount-cell">{formatMoney(d.qarzSummasi)}</div>
                </td>
                <td>
                  <div className={`amount-cell ${d.muddatOtganSumma > 0 ? "text-red" : ""}`}>
                    {formatMoney(d.muddatOtganSumma)}
                  </div>
                </td>
                <td>{getStatusBadge(d.status)}</td>
                <td>
                  <div className="risk-indicator">
                    <div className="risk-dot" style={{ background: getRiskColor(d.riskScore) }} />
                    <span className="risk-text">{d.riskScore}%</span>
                  </div>
                </td>
                <td style={{ position: 'relative' }}>
                  <div className="row-actions">
                    <button className="icon-btn-row" title="Ko'rish" onClick={() => handleViewProfile(d.id)}>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                    <button 
                      className={`icon-btn-row ${activeRowId === d.id ? "active" : ""}`} 
                      title="Batafsil"
                      onClick={(e) => handleRowActionClick(e, d.id)}
                    >
                      <DotsThreeVertical size={18} weight="bold" />
                    </button>
                  </div>

                  {activeRowId === d.id && (
                    <div className="dropdown-menu-glass" style={{ right: 40, top: 0, zIndex: 100 }}>
                      <div className="menu-item" onClick={() => handleEdit(d.id)}>
                        <PencilSimple size={18} /> Tahrirlash
                      </div>
                      <div className="menu-item" onClick={() => handleViewProfile(d.id)}>
                        <UserIcon size={18} /> Profilni ko&apos;rish
                      </div>
                      <div 
                        className="menu-item delete-item" 
                        onClick={() => handleDelete(d.id, d.fish)}
                      >
                        <Trash size={18} weight="bold" /> O&apos;chirish
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDebtors.length === 0 && (
          <div className="empty-state">
            <UserIcon size={48} weight="light" />
            <h3>Qarzdorlar topilmadi</h3>
            <p>Qidiruv shartlarini o&apos;zgartirib ko&apos;ring yoki yangi qarzdor qo&apos;shing</p>
          </div>
        )}
      </div>


      {/* ── Import Modal ── */}
      {isImportModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card-glass" style={{ maxWidth: previewData ? 1000 : 500 }}>
            <div className="modal-header">
              <h3 className="modal-title">Exceldan ma&apos;lumot yuklash</h3>
              <button className="close-btn" onClick={() => { setIsImportModalOpen(false); setPreviewData(null); setImportResult(null); }}>×</button>
            </div>
            
            <div className="modal-body">
              {!previewData && !importResult ? (
                <>
                  <div className="type-selector-wrap">
                    <div className="selector-label">Shartnoma turi:</div>
                    <div className="selector-group">
                      <button 
                        className={`selector-btn ${loanTypeToImport === "20_yil" ? "active" : ""}`}
                        onClick={() => setLoanTypeToImport("20_yil")}
                      >
                        20 yillik
                      </button>
                      <button 
                        className={`selector-btn ${loanTypeToImport === "7_yil" ? "active" : ""}`}
                        onClick={() => setLoanTypeToImport("7_yil")}
                      >
                        7 yillik
                      </button>
                    </div>
                  </div>

                  <div className="sample-box" onClick={downloadSample}>
                    <FileArrowDown size={24} weight="bold" />
                    <div>
                      <div className="sample-title">Namuna yuklab olish ({loanTypeToImport === "20_yil" ? "20" : "7"} yillik)</div>
                      <div className="sample-sub">Fayl strukturasi bilan tanishing</div>
                    </div>
                  </div>

                  <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept=".xlsx, .xls"
                      onChange={handleFileSelect}
                    />
                    {selectedFile ? (
                      <div className="file-info-box">
                        <FileText size={32} weight="fill" color="var(--accent)" />
                        <div className="file-name-info">{selectedFile.name}</div>
                        <div className="file-size-info">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                    ) : (
                      <>
                        <CloudArrowUp size={40} weight="light" />
                        <p>Faylni tanlang yoki shu yerga olib keling</p>
                      </>
                    )}
                  </div>

                  <button 
                    className="btn-primary-full" 
                    disabled={!selectedFile || isLoading}
                    onClick={handlePreview}
                  >
                    {isLoading ? (
                      <> <Clock size={18} className="spin" /> O&apos;qilmoqda... </>
                    ) : (
                      <> <MagnifyingGlass size={18} weight="bold" /> Ma&apos;lumotlarni tekshirish </>
                    )}
                  </button>
                </>
              ) : previewData && !importResult ? (
                <div className="import-preview-stage">
                  <div className="preview-info-banner">
                    <CheckCircle size={20} weight="fill" color="var(--green)" />
                    <span>Fayl o&apos;qildi. {previewData.length} ta qator topildi. Iltimos, ma&apos;lumotlar to&apos;g&apos;riligini tekshiring:</span>
                  </div>

                  <div className="preview-table-wrap">
                    <table className="mini-table">
                      <thead>
                        <tr>
                          <th>F.I.O</th>
                          <th>JShShIR</th>
                          <th>Qarz Summasi</th>
                          <th>Kechikkan</th>
                          <th>Telefon</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 50).map((p: any, idx: number) => (
                          <tr key={idx}>
                            <td>{p.fish}</td>
                            <td><code>{p.jshshir}</code></td>
                            <td>{formatMoney(p.qarzSummasi)}</td>
                            <td className={p.muddatOtganSumma > 0 ? "text-red" : ""}>{formatMoney(p.muddatOtganSumma)}</td>
                            <td>{p.telefon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 50 && (
                      <div className="preview-more">Yana {previewData.length - 50} ta qator mavjud...</div>
                    )}
                  </div>

                  <div className="modal-footer-btns" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setPreviewData(null)}>
                      Orqaga qaytish
                    </button>
                    <button className="btn-primary-full" style={{ flex: 2, margin: 0 }} onClick={handleCommit} disabled={isLoading}>
                      {isLoading ? (
                        <> <Clock size={18} className="spin" /> Yuklanmoqda... </>
                      ) : (
                        <> <CheckCircle size={18} weight="bold" /> Hammasi to&apos;g&apos;ri, yuklash </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="import-report">
                  <div className="report-summary">
                    <div className="summary-item success">
                      <div className="summary-val">{importResult.count}</div>
                      <div className="summary-lbl">Yuklandi</div>
                    </div>
                    {importResult.errors?.length > 0 && (
                      <div className="summary-item error">
                        <div className="summary-val">{importResult.errors.length}</div>
                        <div className="summary-lbl">Xatolik</div>
                      </div>
                    )}
                  </div>

                  {importResult.errors?.length > 0 && (
                    <div className="report-errors">
                      <div className="report-section-title">Xatoliklar ro&apos;yxati:</div>
                      <div className="error-list-scroll">
                        {importResult.errors.map((err: any, idx: number) => (
                          <div key={idx} className="error-log-item">
                            <span className="row-num">{err.fish}:</span> {err.msg}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button className="btn-primary-full" onClick={() => { setIsImportModalOpen(false); setImportResult(null); }}>
                    Yopish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
