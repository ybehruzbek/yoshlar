"use client";

import { CustomSelect } from "@/components/ui/CustomSelect";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MagnifyingGlass, Funnel, CaretDown, DotsThreeVertical,
  User as UserIcon, Phone, ArrowRight, CheckCircle, Clock, Warning,
  FilePlus, FileText, Bell, FileArrowDown, CloudArrowUp, Trash, PencilSimple
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";
import { formatMoney } from "../../../lib/utils/format";
import { previewDebtorsExcel, commitDebtorsImport } from "../../../lib/actions/import";
import { fetchDebtorsPaginated } from "../../../lib/actions/fetchDebtors";
import { deleteDebtor, deleteAllDebtors } from "../../../lib/actions/debtors";
import { useRouter } from "next/navigation";

export interface DebtorItem {
  id: number;
  fish: string;
  telefon: string | null;
  loanType: string;
  qarzSummasi: number;
  tolanganSumma: number;
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
  
  // Data & pagination
  const [debtors, setDebtors] = useState<DebtorItem[]>(initialDebtors);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialDebtors.length >= 20);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [typeFilter, setTypeFilter] = useState("Barchasi");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // UI state
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loanTypeToImport, setLoanTypeToImport] = useState<"20_yil" | "7_yil">("20_yil");
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Reset & reload when filters change ──
  useEffect(() => {
    // Skip initial render
    if (debouncedSearch === "" && statusFilter === "Barchasi" && typeFilter === "Barchasi") {
      setDebtors(initialDebtors);
      setPage(0);
      setHasMore(initialDebtors.length >= 20);
      return;
    }
    
    setLoadingMore(true);
    fetchDebtorsPaginated({
      page: 0,
      search: debouncedSearch,
      status: statusFilter,
      type: typeFilter,
    }).then(res => {
      setDebtors(res.items);
      setPage(0);
      setHasMore(res.hasMore);
      setLoadingMore(false);
    });
  }, [debouncedSearch, statusFilter, typeFilter, initialDebtors]);

  // ── Infinite Scroll: load more ──
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const res = await fetchDebtorsPaginated({
      page: nextPage,
      search: debouncedSearch,
      status: statusFilter,
      type: typeFilter,
    });
    setDebtors(prev => {
      // Deduplicate
      const existingIds = new Set(prev.map(d => d.id));
      const newItems = res.items.filter((d: DebtorItem) => !existingIds.has(d.id));
      return [...prev, ...newItems];
    });
    setPage(nextPage);
    setHasMore(res.hasMore);
    setLoadingMore(false);
  }, [page, hasMore, loadingMore, debouncedSearch, statusFilter, typeFilter]);

  // ── IntersectionObserver for infinite scroll ──
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // ── Close menus on outside click ──
  useEffect(() => {
    const handleClose = () => {
      setActiveRowId(null);
      setIsActionMenuOpen(false);
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // ── Handlers ──
  const handleRowActionClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveRowId(activeRowId === id ? null : id);
  };

  const handleImportClick = () => {
    setIsActionMenuOpen(false);
    setIsImportModalOpen(true);
    setImportResult(null);
    setPreviewData(null);
    setSelectedFile(null);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Haqiqatan ham "${name}" ni o'chirib yubormoqchimisiz?`)) {
      const res = await deleteDebtor(id);
      if (res.success) {
        setDebtors(prev => prev.filter(d => d.id !== id));
        setActiveRowId(null);
      } else {
        alert("Xatolik: " + res.error);
      }
    }
  };

  const handleViewProfile = (id: number) => router.push(`/debtors/${id}`);

  const handleDeleteAll = async () => {
    setIsActionMenuOpen(false);
    if (confirm("DIQQAT! Barcha qarzdorlarni butunlay o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) {
      setIsLoading(true);
      const res = await deleteAllDebtors();
      setIsLoading(false);
      if (res.success) {
        setDebtors([]);
        setHasMore(false);
        router.refresh();
      } else {
        alert("Xatolik: " + res.error);
      }
    }
  };

  const handleEdit = () => alert("Tez kunda: Tahrirlash imkoniyati qo'shiladi");

  const downloadSample = () => {
    const title = loanTypeToImport === "20_yil" ? "Uy-joy qarzdorlik ro'yxati 20-yillik" : "Uy-joy qarzdorlik ro'yxati 7-yillik";
    const data = [
      [title],
      ["T/r.", "Rasmi", "Pasport bo'yicha manzili", "F.I.O.", "Pasport seriyasi va raqami", 
       "Tug'ilgan vaqti", "JShShIR", "Olingan qarz summasi", "Olingan qarz summasi matnda", 
       "Qarz shartnomasi tasdiqlangan sana", "Tasdiqlagan notarius", "Shartnoma reestr raqami", 
       "Qarzdorlik holati sanasi", "Muddati o'tkan qarz summasi", "Muddati o'tkan qarz summasi matnda ", 
       "Telefon raqami", "Ogohlantirish xati yuborilgan sana va raqami", "Sudga chiqarilganligi haqida ma'lumot"],
      [1, "", "Toshkent shahar", "KADIROV ODIL MURATOVICH", "AD1114901", 
       "1990-01-01", "31602870171169", 68590000, "oltmish sakkiz million...", 
       "2019-yil 20-mart", "Notarius Nomi", "201900043001468", 
       "2025-yil 5-noyabr", 22577489, "yigirma ikki million...", "998901234567"]
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
    const result = await previewDebtorsExcel(formData);
    setIsLoading(false);
    if (result.success) setPreviewData(result.data || null);
    else alert(`Xatolik: ${result.error}`);
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
    } else alert(`Xatolik: ${result.error}`);
  };

  // ── Stats (from loaded debtors + totalCount from server) ──
  const overdueCount = debtors.filter(d => d.muddatOtganSumma > 0).length;
  const totalOverdue = debtors.reduce((acc, d) => acc + d.muddatOtganSumma, 0);
  const highRisk = debtors.filter(d => d.riskScore >= 80).length;

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case "faol": return <span className="badge badge-green">Faol</span>;
      case "kechikkan": return <span className="badge badge-red">Kechikkan</span>;
      case "sudda": return <span className="badge badge-yellow">Sudda</span>;
      case "tolangan": return <span className="badge badge-blue">To&apos;langan</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "var(--red)";
    if (score >= 50) return "var(--yellow)";
    return "var(--green)";
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="header-info">
          <h2 className="section-title">Barcha qarzdorlar</h2>
          <p className="section-sub">{totalCount} ta qarzdor bazada</p>
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn-row" 
            style={{ width: 44, height: 44, borderRadius: 12 }}
            onClick={(e) => { e.stopPropagation(); setIsActionMenuOpen(!isActionMenuOpen); }}
            disabled={isLoading}
          >
            {isLoading ? <Clock size={24} className="spin" /> : <DotsThreeVertical size={24} weight="bold" />}
          </button>

          {isActionMenuOpen && (
            <div className="dropdown-menu-glass" onClick={(e) => e.stopPropagation()}>
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
              <div className="menu-divider" />
              <div className="menu-item delete-item" onClick={handleDeleteAll}>
                <Trash size={18} weight="bold" /> Barchasini o&apos;chirish
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filter-card">
        <div className="search-wrap">
          <MagnifyingGlass size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Ism, telefon yoki JShShIR bo'yicha qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <span className="filter-label">Holat:</span>
            <div style={{ width: 140 }}>
              <CustomSelect 
                value={statusFilter} 
                onChange={setStatusFilter}
                options={[
                  { value: "Barchasi", label: "Barchasi" },
                  { value: "Faol", label: "Faol" },
                  { value: "Kechikkan", label: "Kechikkan" },
                  { value: "Sudda", label: "Sudda" },
                  { value: "Tolangan", label: "To'langan" }
                ]}
              />
            </div>
          </div>

          <div className="filter-item">
            <span className="filter-label">Tur:</span>
            <div style={{ width: 140 }}>
              <CustomSelect 
                value={typeFilter} 
                onChange={setTypeFilter}
                options={[
                  { value: "Barchasi", label: "Barchasi" },
                  { value: "20 yillik", label: "20 yillik" },
                  { value: "7 yillik", label: "7 yillik" }
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Loaded count indicator ── */}
      <div className="loaded-indicator">
        <span>{debtors.length} / {totalCount} ta ko&apos;rsatilmoqda</span>
        {loadingMore && <span className="loading-dot-text">Yuklanmoqda...</span>}
      </div>

      {/* ── Table ── */}
      <div className="table-container-full">
        <table className="modern-table">
          <thead>
            <tr>
              <th>F.I.O va Ma&apos;lumot</th>
              <th>Turi</th>
              <th>Jami qarz</th>
              <th>To&apos;langan</th>
              <th>Kechikkan</th>
              <th>Holat</th>
              <th>Xavf</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr 
                key={d.id} 
                className="fade-in-row"
                style={{ 
                  animationDelay: `${Math.min(i, 19) * 0.03}s`,
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
                  <span className={`type-tag ${d.loanType === "20_yil" ? "tag-purple" : d.loanType === "7_yil" ? "tag-blue" : "tag-green"}`}>
                    {d.loanType === "20_yil" ? "20 yillik" : d.loanType === "7_yil" ? "7 yillik" : "Aralash"}
                  </span>
                </td>
                <td><div className="amount-cell">{formatMoney(d.qarzSummasi)}</div></td>
                <td><div className="amount-cell text-green">{formatMoney(d.tolanganSumma)}</div></td>
                <td><div className={`amount-cell ${d.muddatOtganSumma > 0 ? "text-red" : ""}`}>{formatMoney(d.muddatOtganSumma)}</div></td>
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
                    <div className="dropdown-menu-glass" style={{ right: 40, top: 0, zIndex: 100 }} onClick={(e) => e.stopPropagation()}>
                      <div className="menu-item" onClick={() => handleEdit()}>
                        <PencilSimple size={18} /> Tahrirlash
                      </div>
                      <div className="menu-item" onClick={() => handleViewProfile(d.id)}>
                        <UserIcon size={18} /> Profilni ko&apos;rish
                      </div>
                      <div className="menu-item delete-item" onClick={() => handleDelete(d.id, d.fish)}>
                        <Trash size={18} weight="bold" /> O&apos;chirish
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="load-more-trigger">
            <div className="loading-spinner-row">
              <Clock size={20} className="spin" />
              <span>Yana yuklanmoqda...</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {debtors.length === 0 && !loadingMore && (
          <div className="empty-state-modern">
            <div className="empty-icon-wrap">
              <UserIcon size={48} weight="light" />
            </div>
            <h3>Qarzdorlar topilmadi</h3>
            <p>
              {search || statusFilter !== "Barchasi" || typeFilter !== "Barchasi"
                ? "Qidiruv shartlarini o'zgartirib ko'ring"
                : "Yangi qarzdor qo'shing yoki Exceldan import qiling"}
            </p>
            {(search || statusFilter !== "Barchasi" || typeFilter !== "Barchasi") && (
              <button className="empty-reset-btn" onClick={() => { setSearch(""); setStatusFilter("Barchasi"); setTypeFilter("Barchasi"); }}>
                Filtrlarni tozalash
              </button>
            )}
          </div>
        )}

        {/* End of list */}
        {!hasMore && debtors.length > 0 && (
          <div className="end-of-list">
            Barcha {debtors.length} ta qarzdor ko&apos;rsatildi
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
                      <button className={`selector-btn ${loanTypeToImport === "20_yil" ? "active" : ""}`} onClick={() => setLoanTypeToImport("20_yil")}>20 yillik</button>
                      <button className={`selector-btn ${loanTypeToImport === "7_yil" ? "active" : ""}`} onClick={() => setLoanTypeToImport("7_yil")}>7 yillik</button>
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
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleFileSelect} />
                    {selectedFile ? (
                      <div className="file-info-box">
                        <FileText size={32} weight="fill" color="var(--accent)" />
                        <div className="file-name-info">{selectedFile.name}</div>
                        <div className="file-size-info">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                      </div>
                    ) : (
                      <><CloudArrowUp size={40} weight="light" /><p>Faylni tanlang yoki shu yerga olib keling</p></>
                    )}
                  </div>
                  <button className="btn-primary-full" disabled={!selectedFile || isLoading} onClick={handlePreview}>
                    {isLoading ? <><Clock size={18} className="spin" /> O&apos;qilmoqda...</> : <><MagnifyingGlass size={18} weight="bold" /> Ma&apos;lumotlarni tekshirish</>}
                  </button>
                </>
              ) : previewData && !importResult ? (
                <div className="import-preview-stage">
                  <div className="preview-info-banner">
                    <CheckCircle size={20} weight="fill" color="var(--green)" />
                    <span><strong>{previewData.length}</strong> ta qarzdor topildi.</span>
                  </div>

                  <div className="preview-stats-row" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div className="preview-stat-chip">📱 {previewData.filter((d: any) => d.telefon).length} ta telefon</div>
                    <div className="preview-stat-chip">📷 {previewData.filter((d: any) => d.hasPhoto).length} ta rasm</div>
                    <div className="preview-stat-chip" style={{ color: 'var(--red)' }}>⚠️ {previewData.filter((d: any) => d.muddatOtganSumma > 0).length} ta kechikkan</div>
                    <div className="preview-stat-chip">⚖️ {previewData.filter((d: any) => d.sudMalumot).length} ta sudda</div>
                  </div>

                  <div className="preview-table-wrap">
                    <table className="mini-table">
                      <thead><tr><th>#</th><th>F.I.O</th><th>Pasport</th><th>JShShIR</th><th>Qarz</th><th>Kechikkan</th><th>Tel</th></tr></thead>
                      <tbody>
                        {previewData.slice(0, 50).map((p: any, idx: number) => (
                          <tr key={idx}>
                            <td style={{ color: 'var(--text-tertiary)' }}>{p.tartibRaqam || idx + 1}</td>
                            <td><strong>{p.fish}</strong></td>
                            <td><code style={{ fontSize: 12 }}>{p.pasport || "—"}</code></td>
                            <td><code style={{ fontSize: 12 }}>{p.jshshir || "—"}</code></td>
                            <td style={{ whiteSpace: 'nowrap' }}>{formatMoney(p.qarzSummasi)}</td>
                            <td className={p.muddatOtganSumma > 0 ? "text-red" : ""} style={{ whiteSpace: 'nowrap' }}>{formatMoney(p.muddatOtganSumma)}</td>
                            <td style={{ fontSize: 12 }}>{p.telefon || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 50 && <div className="preview-more">Yana {previewData.length - 50} ta qator mavjud...</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <button className="secondary-btn" style={{ flex: 1 }} onClick={() => setPreviewData(null)}>Orqaga</button>
                    <button className="btn-primary-full" style={{ flex: 2, margin: 0 }} onClick={handleCommit} disabled={isLoading}>
                      {isLoading ? <><Clock size={18} className="spin" /> Yuklanmoqda...</> : <><CheckCircle size={18} weight="bold" /> Hammasi to&apos;g&apos;ri, yuklash</>}
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
                      <div className="report-section-title">Xatoliklar:</div>
                      <div className="error-list-scroll">
                        {importResult.errors.map((err: any, idx: number) => (
                          <div key={idx} className="error-log-item"><span className="row-num">{err.fish}:</span> {err.msg}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button className="btn-primary-full" onClick={() => { setIsImportModalOpen(false); setImportResult(null); }}>Yopish</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
