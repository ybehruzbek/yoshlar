"use client";

import { useState, useEffect, useRef } from "react";
import { FileDoc, UploadSimple, Trash, CheckCircle, XCircle, Eye, X, Info, PencilSimple, FloppyDisk, ArrowsClockwise, Check, BookOpen, CaretDown, CaretUp, Copy } from "@phosphor-icons/react";
import { CustomSelect } from "@/components/ui/CustomSelect";

// Map placeholder names to human-readable labels
const VAR_LABELS: Record<string, string> = {
  "{{FISH}}": "F.I.SH.",
  "{{MANZIL}}": "Manzil",
  "{{PASPORT}}": "Pasport",
  "{{JSHSHIR}}": "JShShIR",
  "{{SHARTNOMA_SANA}}": "Shartnoma sanasi",
  "{{SHARTNOMA_RAQAMI}}": "Shartnoma raqami",
  "{{REESTR_RAQAM}}": "Reestr raqami",
  "{{QARZ_SUMMASI}}": "Qarz summasi",
  "{{QARZ_SUMMA_SOZ}}": "Qarz summasi (so'z)",
  "{{OYLIK_TOLOV}}": "Oylik to'lov",
  "{{OYLIK_TOLOV_SOZ}}": "Oylik to'lov (so'z)",
  "{{TOLOV_BOSHLANISH_SANA}}": "To'lov boshlanish sanasi",
  "{{HOLAT_SANASI}}": "Holat sanasi",
  "{{QARZ_QOLDIQ}}": "Qarz qoldig'i",
  "{{QOLDIQ_SOZ}}": "Qarz qoldig'i (so'z)",
  "{{SUD_NOMI}}": "Sud nomi",
  "{{NOTARIUS}}": "Notarius",
  "{{RAIS_FISH}}": "Rais F.I.SH.",
  "{{DAVOGAR_MANZIL}}": "Da'vogar manzili",
  "{{OGOHLANTIRISH_SANALARI}}": "Ogohlantirish sanalari",
  "{{TALABNOMA_SANA}}": "Talabnoma sanasi",
  "{{BANK_NOMI}}": "Bank nomi",
  "{{HUJJAT_SANA}}": "Hujjat sanasi",
};

const TURI_OPTIONS = [
  { value: "Da'vo ariza", label: "Da'vo ariza" },
  { value: "Talabnoma", label: "Talabnoma" },
  { value: "Ogohlantirish", label: "Ogohlantirish" },
  { value: "Boshqa", label: "Boshqa" },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nomi, setNomi] = useState("");
  const [turi, setTuri] = useState("Da'vo ariza");
  const [previewVars, setPreviewVars] = useState<string[] | null>(null);
  const [previewName, setPreviewName] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  // Edit modal state
  const [editTemplate, setEditTemplate] = useState<any | null>(null);
  const [editNomi, setEditNomi] = useState("");
  const [editTuri, setEditTuri] = useState("");
  const [editFaol, setEditFaol] = useState(true);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);
  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Upload success — show detected vars
  const [uploadResult, setUploadResult] = useState<{ nomi: string; vars: string[] } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".docx")) {
        alert("Faqat .docx formatidagi fayllar qabul qilinadi");
        return;
      }
      setSelectedFile(file);
      if (!nomi) setNomi(file.name.replace(".docx", ""));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !nomi) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("nomi", nomi);
    formData.append("turi", turi);
    formData.append("rollar", JSON.stringify(["SUPER_ADMIN", "YURIST"]));

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const vars: string[] = Array.isArray(data.ozgaruvchilar)
          ? data.ozgaruvchilar
          : JSON.parse(data.ozgaruvchilar || "[]");

        setUploadResult({ nomi, vars });
        setSelectedFile(null);
        setNomi("");
        fetchTemplates();
      } else {
        const data = await res.json();
        alert(data.error || "Yuklashda xatolik yuz berdi");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (t: any) => {
    setDeleteTarget(t);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/templates/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteTarget(null);
        fetchTemplates();
      } else {
        alert("O'chirishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFaol = async (id: number, faol: boolean) => {
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faol: !faol }),
      });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error toggling template status:", error);
    }
  };

  const showVarsPreview = (template: any) => {
    let vars: string[] = [];
    try { vars = JSON.parse(template.ozgaruvchilar); } catch {}
    setPreviewVars(vars);
    setPreviewName(template.nomi);
  };

  // ---- Edit functions ----
  const openEdit = (t: any) => {
    setEditTemplate(t);
    setEditNomi(t.nomi);
    setEditTuri(t.turi);
    setEditFaol(t.faol);
    setEditFile(null);
  };

  const closeEdit = () => {
    setEditTemplate(null);
    setEditFile(null);
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".docx")) {
        alert("Faqat .docx formatidagi fayllar qabul qilinadi");
        return;
      }
      setEditFile(file);
    }
  };

  const handleEditSave = async () => {
    if (!editTemplate) return;
    setIsSaving(true);

    try {
      // If file is being replaced, upload via POST first, then delete old
      if (editFile) {
        const formData = new FormData();
        formData.append("file", editFile);
        formData.append("nomi", editNomi);
        formData.append("turi", editTuri);
        formData.append("rollar", JSON.stringify(["SUPER_ADMIN", "YURIST"]));
        formData.append("replaceId", String(editTemplate.id));

        const res = await fetch("/api/templates/replace", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Faylni almashtishda xatolik");
          return;
        }
      } else {
        // Just update metadata
        const res = await fetch(`/api/templates/${editTemplate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nomi: editNomi,
            turi: editTuri,
            faol: editFaol,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Saqlashda xatolik");
          return;
        }
      }

      closeEdit();
      fetchTemplates();
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <h1 className="page-title">Shablonlar</h1>
        <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Avtomatik hujjat yaratish uchun Word (.docx) shablonlarini boshqarish
        </div>
      </div>

      {/* Upload card */}
      <div className="card" style={{ padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Yangi shablon yuklash</div>
          <div style={{ fontSize: "13px", color: "var(--text-tertiary)", marginTop: "4px" }}>
            .docx faylda {`{{FISH}}`}, {`{{PASPORT}}`} kabi placeholder'lar ishlatilgan bo'lishi kerak
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label className="input-label">Shablon nomi</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Masalan: Da'vo ariza 2025" 
              value={nomi}
              onChange={(e) => setNomi(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">Hujjat turi</label>
            <CustomSelect options={TURI_OPTIONS} value={turi} onChange={setTuri} />
          </div>
          <div>
            <label className="input-label">Word fayl (.docx)</label>
            <input type="file" accept=".docx" id="template-upload" onChange={handleFileSelect} style={{ display: "none" }} />
            <label 
              htmlFor="template-upload" 
              className="btn btn-secondary" 
              style={{ width: '100%', display: "flex", justifyContent: "center", cursor: "pointer", padding: "12px", borderStyle: "dashed", borderWidth: "2px", borderColor: "var(--border-strong)", background: "transparent" }}
            >
              <UploadSimple size={20} style={{ marginRight: "8px", color: "var(--text-tertiary)" }} />
              <span style={{ color: selectedFile ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedFile ? selectedFile.name : "Fayl tanlash"}
              </span>
            </label>
          </div>
          <div>
            <button 
              className="btn btn-primary" 
              onClick={handleUpload}
              disabled={isUploading || !nomi || !selectedFile}
              style={{ width: "100%", padding: "12px", justifyContent: "center" }}
            >
              {isUploading ? "Yuklanmoqda..." : "Yuklash"}
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ QO'LLANMA ═══════════ */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <button
          onClick={() => setShowGuide(!showGuide)}
          style={{
            width: "100%", padding: "18px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <BookOpen size={22} color="var(--accent)" weight="fill" />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>Shablon tayyorlash qo'llanmasi</div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                Qaysi o'zgaruvchi nima uchun ishlatiladi va qanday yoziladi
              </div>
            </div>
          </div>
          {showGuide ? <CaretUp size={20} color="var(--text-tertiary)" /> : <CaretDown size={20} color="var(--text-tertiary)" />}
        </button>

        {showGuide && (
          <div style={{ padding: "0 24px 28px", borderTop: "1px solid var(--border)" }}>

            {/* Qanday ishlaydi */}
            <div style={{ marginTop: "20px", marginBottom: "24px", padding: "20px", background: "var(--accent-light)", borderRadius: "12px", border: "1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--accent)", marginBottom: "10px" }}>📋 Qanday ishlaydi?</div>
              <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                <li>Microsoft Word dasturida shablonni oching</li>
                <li>O'zgarishi kerak bo'lgan joylarga <code style={{ background: "var(--bg-hover)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700, color: "var(--accent)" }}>{`{{O'ZGARUVCHI_NOMI}}`}</code> deb yozing</li>
                <li>Faylni saqlang va platformaga yuklang</li>
                <li>Tizim avtomatik barcha o'zgaruvchilarni topadi va qarzdor ma'lumotlaridan to'ldiradi</li>
              </ol>
            </div>

            {/* Misol */}
            <div style={{ marginBottom: "24px", padding: "20px", background: "var(--bg-hover)", borderRadius: "12px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "10px" }}>💡 Misol</div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Word faylda shunday yozing:<br />
                <div style={{ marginTop: "8px", padding: "14px 18px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid var(--border)", fontFamily: "monospace", fontSize: "13px", lineHeight: 2 }}>
                  &quot;Men, <span style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{FISH}}`}</span>, pasport raqami <span style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{PASPORT}}`}</span>, manzilim: <span style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{MANZIL}}`}</span>, shartnomaga asosan <span style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_SUMMASI}}`}</span> so'm miqdorida qarz oldim.&quot;
                </div>
                <div style={{ marginTop: "10px", color: "var(--text-tertiary)", fontSize: "12px" }}>
                  ✅ Hujjat yaratilganda shunday bo'ladi: <em>&quot;Men, KADIROV ODIL MURATOVICH, pasport raqami AD1114901, manzilim: Toshkent sh., Uchtepa tumani..., shartnomaga asosan 15 000 000 so'm miqdorida qarz oldim.&quot;</em>
                </div>
              </div>
            </div>

            {/* O'zgaruvchilar jadvali */}
            <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "16px" }}>📌 Barcha mavjud o'zgaruvchilar</div>

            {/* Shaxsiy ma'lumotlar */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>👤 Qarzdor shaxsiy ma'lumotlari</div>
              <div className="table-responsive"><table className="table" style={{ fontSize: "13px" }}>
                <thead><tr><th style={{ width: "220px" }}>O'zgaruvchi</th><th>Tavsifi</th><th style={{ width: "220px" }}>Misol natija</th></tr></thead>
                <tbody>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{FISH}}`}</code></td><td>Qarzdorning to'liq F.I.SH. (KATTA HARFDA)</td><td>KADIROV ODIL MURATOVICH</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{PASPORT}}`}</code></td><td>Pasport seriya va raqami</td><td>AD 1114901</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{JSHSHIR}}`}</code></td><td>JShShIR (14 xonali raqam)</td><td>31602870171169</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{MANZIL}}`}</code></td><td>Yashash manzili</td><td>Toshkent sh., Uchtepa t., ...</td></tr>
                </tbody>
              </table></div>
            </div>

            {/* Qarz ma'lumotlari */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--green-text)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>💰 Qarz va to'lov ma'lumotlari</div>
              <div className="table-responsive"><table className="table" style={{ fontSize: "13px" }}>
                <thead><tr><th style={{ width: "220px" }}>O'zgaruvchi</th><th>Tavsifi</th><th style={{ width: "220px" }}>Misol natija</th></tr></thead>
                <tbody>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_SUMMASI}}`}</code></td><td>Qarz summasi (raqamda)</td><td>15 000 000</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_SUMMA_SOZ}}`}</code></td><td>Qarz summasi (so'zda)</td><td>o'n besh million</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_QOLDIQ}}`}</code></td><td>Qarz qoldig'i (raqamda)</td><td>12 500 000</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QOLDIQ_SOZ}}`}</code></td><td>Qarz qoldig'i (so'zda)</td><td>o'n ikki million besh yuz ming</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{OYLIK_TOLOV}}`}</code></td><td>Oylik to'lov (raqamda)</td><td>625 000</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{OYLIK_TOLOV_SOZ}}`}</code></td><td>Oylik to'lov (so'zda)</td><td>olti yuz yigirma besh ming</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_MUDDATI_RAQAM}}`}</code></td><td>Qarz muddati (raqamda)</td><td>20</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{QARZ_MUDDATI_SOZ}}`}</code></td><td>Qarz muddati (so'zda)</td><td>yigirma</td></tr>
                </tbody>
              </table></div>
            </div>

            {/* Shartnoma ma'lumotlari */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>📄 Shartnoma va yuridik ma'lumotlar</div>
              <div className="table-responsive"><table className="table" style={{ fontSize: "13px" }}>
                <thead><tr><th style={{ width: "270px" }}>O'zgaruvchi</th><th>Tavsifi</th><th style={{ width: "250px" }}>Misol natija</th></tr></thead>
                <tbody>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{SHARTNOMA_SANA}}`}</code></td><td>Shartnoma tuzilgan sana</td><td>2019-yil 20-mart</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{SHARTNOMA_RAQAMI}}`}</code></td><td>Shartnoma/reestr raqami</td><td>20190005</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{NOTARIUS}}`}</code></td><td>Notarius ismi</td><td>M.Abdullayeva</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{OTKAZILGAN_SANA}}`}</code></td><td>Bank hisobiga o'tkazilgan sana</td><td>2019-yil 25-mart</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{TOLOV_BOSHLANISH_SANA}}`}</code></td><td>To'lov boshlanish sanasi</td><td>2019-yil 20-aprel</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{HOLAT_SANASI}}`}</code></td><td>Hozirgi holat sanasi</td><td>2026-yil 4-may</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{DAVOGAR_MANZIL}}`}</code></td><td>Da'vogar tashkilot manzili</td><td>Toshkent sh., Mirzo Ulug'bek...</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{TUMAN}}`}</code></td><td>Sud tuman nomi</td><td>Uchtepa tumani</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{NOTARIAL_TUMAN}}`}</code></td><td>Notarial tuman nomi</td><td>Yashnobod tumani</td></tr>
                </tbody>
              </table></div>
            </div>

            {/* Sanalar */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--red)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>📅 Sanalar va boshqalar</div>
              <div className="table-responsive"><table className="table" style={{ fontSize: "13px" }}>
                <thead><tr><th style={{ width: "280px" }}>O'zgaruvchi</th><th>Tavsifi</th><th style={{ width: "280px" }}>Misol natija</th></tr></thead>
                <tbody>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{TALABNOMA_SANA}}`}</code></td><td>Talabnoma yuborilgan sana</td><td>2026-yil 4-may</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{BUGUNGI_SANA}}`}</code></td><td>Bugungi sana (avtomatik)</td><td>2026-yil 4-may</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{OGOHLANTIRISH_XATLARI}}`}</code></td><td>Ogohlantirish xatlari sanalari</td><td>2024-yil 15-yanvar, 2024-yil 20-mart sanalari</td></tr>
                  <tr><td><code style={{ color: "var(--accent)", fontWeight: 700 }}>{`{{BANK_FILIALI}}`}</code></td><td>Bank filiali nomi</td><td>ATIB "Ipoteka banki" Yashnobod filialida</td></tr>
                </tbody>
              </table></div>
            </div>

            {/* Hujjat turlari */}
            <div style={{ marginTop: "24px", padding: "20px", background: "var(--bg-hover)", borderRadius: "12px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "12px" }}>📂 Hujjat turlari va ularda ishlatiladigan o'zgaruvchilar</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ padding: "16px", background: "var(--bg-card)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px", color: "var(--accent)" }}>📝 Da'vo ariza</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Asosiy o'zgaruvchilar: <code>{`{{FISH}}`}</code>, <code>{`{{PASPORT}}`}</code>, <code>{`{{JSHSHIR}}`}</code>, <code>{`{{MANZIL}}`}</code>, <code>{`{{SHARTNOMA_SANA}}`}</code>, <code>{`{{QARZ_SUMMASI}}`}</code>, <code>{`{{QARZ_QOLDIQ}}`}</code>, <code>{`{{HOLAT_SANASI}}`}</code>, <code>{`{{BUGUNGI_SANA}}`}</code>
                  </div>
                </div>
                <div style={{ padding: "16px", background: "var(--bg-card)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "8px", color: "var(--green-text)" }}>📨 Talabnoma</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Asosiy o'zgaruvchilar: <code>{`{{FISH}}`}</code>, <code>{`{{MANZIL}}`}</code>, <code>{`{{QARZ_SUMMASI}}`}</code>, <code>{`{{QARZ_SUMMA_SOZ}}`}</code>, <code>{`{{TALABNOMA_SANA}}`}</code>, <code>{`{{OYLIK_TOLOV}}`}</code>, <code>{`{{OGOHLANTIRISH_XATLARI}}`}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Muhim eslatma */}
            <div style={{ marginTop: "16px", padding: "16px 20px", background: "var(--red-bg)", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div style={{ fontSize: "13px", color: "var(--red)", fontWeight: 600, marginBottom: "4px" }}>⚠️ Muhim eslatmalar</div>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
                <li>O'zgaruvchi nomlarini <strong>aynan shunday</strong> yozing — katta harfda, qavslarda: <code>{`{{FISH}}`}</code></li>
                <li>Ikki jingalak qavs <strong>{`{{ }}`}</strong> — ikki tomonda ham 2 tadan bo'lishi shart</li>
                <li>O'zgaruvchi ichida bo'sh joy emas, pastki chiziq ishlatiladi: <code>{`{{QARZ_SUMMASI}}`}</code> ✅, <code>{`{{QARZ SUMMASI}}`}</code> ❌</li>
                <li>Bir hujjatda bitta o'zgaruvchini bir necha marta ishlatish mumkin (masalan, <code>{`{{FISH}}`}</code> sarlavhada va matnda)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Templates list */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Mavjud shablonlar ({templates.length})</div>
        </div>
        
        {isLoading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>Yuklanmoqda...</div>
        ) : templates.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <FileDoc size={48} color="var(--text-tertiary)" style={{ marginBottom: "12px" }} />
            <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Hozircha shablonlar mavjud emas</div>
            <div style={{ color: "var(--text-tertiary)", fontSize: "13px", marginTop: "4px" }}>Yuqoridagi formadan yangi shablon yuklang</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nomi</th>
                  <th>Turi</th>
                  <th>O'zgaruvchilar</th>
                  <th>Hajmi</th>
                  <th>Holati</th>
                  <th>Sana</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => {
                  let vars: string[] = [];
                  try { vars = JSON.parse(t.ozgaruvchilar); } catch {}
                  
                  return (
                    <tr key={t.id} style={{ opacity: t.faol ? 1 : 0.5 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                            <FileDoc size={22} weight="fill" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{t.nomi}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{t.faylNomi}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}>{t.turi}</span>
                      </td>
                      <td>
                        <button onClick={() => showVarsPreview(t)} style={{
                          background: vars.length > 0 ? "var(--green-bg)" : "var(--red-bg)",
                          color: vars.length > 0 ? "var(--green-text)" : "var(--red)",
                          border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 600,
                          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", transition: "all 0.2s",
                        }}>
                          <Eye size={14} /> {vars.length} ta
                        </button>
                      </td>
                      <td>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                          {t.faylHajmi ? (t.faylHajmi / 1024).toFixed(0) + " KB" : "—"}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => toggleFaol(t.id, t.faol)} className="badge" style={{ 
                          background: t.faol ? "var(--green-bg)" : "var(--red-bg)",
                          color: t.faol ? "var(--green-text)" : "var(--red)",
                          border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
                        }}>
                          {t.faol ? <CheckCircle size={14} weight="fill" /> : <XCircle size={14} weight="fill" />}
                          {t.faol ? "Faol" : "Faol emas"}
                        </button>
                      </td>
                      <td>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button className="btn-icon" onClick={() => openEdit(t)} title="Tahrirlash"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            <PencilSimple size={16} />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(t)} title="O'chirish"
                            style={{ background: 'var(--bg-hover)' }}>
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Variables Preview Modal */}
      {previewVars !== null && (
        <>
          <div className="modal-backdrop" onClick={() => setPreviewVars(null)} />
          <div className="modal" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Info size={20} color="var(--accent)" style={{ marginRight: "8px", verticalAlign: "middle" }} />
                {previewName} — O'zgaruvchilar
              </h3>
              <button className="modal-close" onClick={() => setPreviewVars(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: "16px 24px 24px" }}>
              {previewVars.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
                  Bu shablonda hech qanday o'zgaruvchi topilmadi.
                  <br />
                  <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                    Shablonda {`{{FISH}}`}, {`{{PASPORT}}`} kabi belgilar ishlatilganligiga ishonch hosil qiling.
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {previewVars.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--bg-hover)", borderRadius: "8px", fontSize: "13px" }}>
                      <span style={{ fontWeight: 600, color: "var(--accent)", fontFamily: "monospace" }}>{v}</span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{VAR_LABELS[v] || v.replace(/[{}]/g, "")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Edit Template Modal */}
      {editTemplate && (
        <>
          <div className="modal-backdrop" onClick={closeEdit} />
          <div className="modal" style={{ maxWidth: "560px" }}>
            <div className="modal-header">
              <h3 className="modal-title">
                <PencilSimple size={20} color="var(--accent)" style={{ marginRight: "8px", verticalAlign: "middle" }} />
                Shablonni tahrirlash
              </h3>
              <button className="modal-close" onClick={closeEdit}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: "20px 24px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Name */}
                <div>
                  <label className="input-label">Shablon nomi</label>
                  <input type="text" className="input-field" value={editNomi} onChange={(e) => setEditNomi(e.target.value)} />
                </div>

                {/* Type */}
                <div>
                  <label className="input-label">Hujjat turi</label>
                  <CustomSelect options={TURI_OPTIONS} value={editTuri} onChange={setEditTuri} />
                </div>

                {/* Status toggle */}
                <div>
                  <label className="input-label">Holati</label>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    <button
                      onClick={() => setEditFaol(true)}
                      className="badge"
                      style={{
                        background: editFaol ? "var(--green-bg)" : "var(--bg-hover)",
                        color: editFaol ? "var(--green-text)" : "var(--text-tertiary)",
                        border: editFaol ? "1px solid var(--green)" : "1px solid var(--border)",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", transition: "all 0.2s"
                      }}
                    >
                      <CheckCircle size={16} weight="fill" /> Faol
                    </button>
                    <button
                      onClick={() => setEditFaol(false)}
                      className="badge"
                      style={{
                        background: !editFaol ? "var(--red-bg)" : "var(--bg-hover)",
                        color: !editFaol ? "var(--red)" : "var(--text-tertiary)",
                        border: !editFaol ? "1px solid var(--red)" : "1px solid var(--border)",
                        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", transition: "all 0.2s"
                      }}
                    >
                      <XCircle size={16} weight="fill" /> Faol emas
                    </button>
                  </div>
                </div>

                {/* Replace file */}
                <div>
                  <label className="input-label">Faylni almashtirish (ixtiyoriy)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
                    <div style={{ flex: 1, padding: "10px 14px", background: "var(--bg-hover)", borderRadius: "8px", fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileDoc size={18} color="var(--accent)" />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {editFile ? editFile.name : editTemplate.faylNomi}
                      </span>
                      {editFile && (
                        <span style={{ marginLeft: "auto", fontSize: "11px", background: "var(--yellow-bg)", color: "var(--yellow-text)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                          YANGI
                        </span>
                      )}
                    </div>
                    <input type="file" accept=".docx" ref={editFileRef} onChange={handleEditFileSelect} style={{ display: "none" }} />
                    <button
                      className="btn btn-secondary"
                      onClick={() => editFileRef.current?.click()}
                      style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                    >
                      <ArrowsClockwise size={16} /> Almashtirish
                    </button>
                  </div>
                  {editFile && (
                    <div style={{ fontSize: "12px", color: "var(--yellow-text)", marginTop: "6px" }}>
                      ⚠️ Yangi fayl yuklanadi va o'zgaruvchilar qaytadan aniqlanadi.
                    </div>
                  )}
                </div>

                {/* Current vars info */}
                <div style={{ padding: "12px 14px", background: "var(--bg-hover)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-tertiary)", marginBottom: "6px" }}>Hozirgi o'zgaruvchilar</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {(() => {
                      let v: string[] = [];
                      try { v = JSON.parse(editTemplate.ozgaruvchilar); } catch {}
                      return v.length === 0 ? (
                        <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>Topilmadi</span>
                      ) : v.map((name: string, i: number) => (
                        <span key={i} style={{ fontSize: "11px", padding: "3px 8px", background: "var(--accent-light)", color: "var(--accent)", borderRadius: "4px", fontFamily: "monospace", fontWeight: 600 }}>
                          {name}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <button className="btn btn-secondary" onClick={closeEdit} style={{ padding: "10px 20px" }}>
                  Bekor qilish
                </button>
                <button className="btn btn-primary" onClick={handleEditSave} disabled={isSaving || !editNomi}
                  style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FloppyDisk size={18} />
                  {isSaving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <>
          <div className="modal-backdrop" onClick={() => !isDeleting && setDeleteTarget(null)} />
          <div className="modal" style={{ maxWidth: "400px" }}>
            <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--red-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)" }}>
                  <Trash size={22} weight="fill" />
                </div>
                <h3>Shablonni o'chirish</h3>
              </div>
              <button className="modal-close" onClick={() => !isDeleting && setDeleteTarget(null)} disabled={isDeleting}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ paddingTop: "10px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
                Haqiqatan ham <strong>{deleteTarget.nomi}</strong> shablonini o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="modal-actions" style={{ gap: "10px", width: "100%", justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                  Bekor qilish
                </button>
                <button className="btn" onClick={confirmDelete} disabled={isDeleting} style={{ background: "var(--red)", color: "#fff", border: "none" }}>
                  {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Upload Success — Show detected vars */}
      {uploadResult && (
        <>
          <div className="modal-backdrop" onClick={() => setUploadResult(null)} />
          <div className="modal" style={{ maxWidth: "480px" }}>
            <div className="modal-header" style={{ borderBottom: "none", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--green-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green-text)" }}>
                  <Check size={22} weight="bold" />
                </div>
                <div>
                  <h3>Shablon yuklandi!</h3>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{uploadResult.nomi}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setUploadResult(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ paddingTop: "10px" }}>
              {uploadResult.vars.length > 0 ? (
                <>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", marginBottom: "16px" }}>
                    Hujjatdan <strong>{uploadResult.vars.length} ta</strong> o'zgaruvchi topildi:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                    {uploadResult.vars.map((v: string) => (
                      <span key={v} style={{
                        padding: "4px 10px", borderRadius: "6px",
                        background: "var(--accent-light)", color: "var(--accent)",
                        fontSize: "12px", fontWeight: 700, fontFamily: "monospace",
                      }}>
                        {v}
                        {VAR_LABELS[v] && <span style={{ fontFamily: "inherit", fontWeight: 400, marginLeft: "6px", color: "var(--text-tertiary)" }}>({VAR_LABELS[v]})</span>}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <div style={{ color: "var(--red)", marginBottom: "8px", fontSize: "14px", fontWeight: 600 }}>
                    ⚠️ Hech qanday o'zgaruvchi topilmadi!
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
                    Word faylda <code style={{ background: "var(--bg-hover)", padding: "2px 6px", borderRadius: "4px" }}>{`{{FISH}}`}</code> kabi o'zgaruvchilar yozilgan bo'lishi kerak.
                    Iltimos, faylni Wordda ochib, kerakli joylarga o'zgaruvchi nomlarini qo'shing.
                  </p>
                </div>
              )}
              <div className="modal-actions" style={{ justifyContent: "flex-end" }}>
                <button className="btn btn-primary" onClick={() => setUploadResult(null)} style={{ padding: "10px 24px" }}>
                  Tushunarli
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
