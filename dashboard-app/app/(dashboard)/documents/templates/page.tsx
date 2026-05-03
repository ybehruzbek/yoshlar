"use client";

import { useState, useEffect } from "react";
import { FileDoc, UploadSimple, Plus, Trash, CheckCircle, XCircle } from "@phosphor-icons/react";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nomi, setNomi] = useState("");
  const [turi, setTuri] = useState("Da'vo ariza");

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
    // Standard roles that can use templates
    formData.append("rollar", JSON.stringify(["SUPER_ADMIN", "YURIST"]));

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSelectedFile(null);
        setNomi("");
        fetchTemplates();
        alert("Shablon muvaffaqiyatli yuklandi");
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

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham ushbu shablonni o'chirmoqchimisiz?")) return;

    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <h1 className="page-title">Shablonlar</h1>
        <div style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Avtomatik hujjat yaratish uchun Word (.docx) shablonlarini boshqarish
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Yuklash formasi */}
        <div className="card" style={{ padding: "24px", position: 'sticky', top: '24px' }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Yangi shablon yuklash</div>
            <div style={{ fontSize: "13px", color: "var(--text-tertiary)", marginTop: "4px" }}>.docx formatidagi faylni tizimga yuklang</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <CustomSelect
                options={[
                  { value: "Da'vo ariza", label: "Da'vo ariza" },
                  { value: "Talabnoma", label: "Talabnoma" },
                  { value: "Ogohlantirish", label: "Ogohlantirish" },
                  { value: "Boshqa", label: "Boshqa" },
                ]}
                value={turi}
                onChange={setTuri}
              />
            </div>
            <div>
              <label className="input-label">Word fayl biriktirish</label>
              <input 
                type="file" 
                accept=".docx"
                id="template-upload"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <label 
                htmlFor="template-upload" 
                className="btn btn-secondary" 
                style={{ width: '100%', display: "flex", justifyContent: "center", cursor: "pointer", padding: "12px", borderStyle: "dashed", borderWidth: "2px", borderColor: "var(--border-strong)", background: "transparent" }}
              >
                <UploadSimple size={20} style={{ marginRight: "8px", color: "var(--text-tertiary)" }} />
                <span style={{ color: selectedFile ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: 500 }}>
                  {selectedFile ? selectedFile.name : "Fayl tanlash (.docx)"}
                </span>
              </label>
            </div>

            <div style={{ marginTop: "8px" }}>
              <button 
                className="btn btn-primary" 
                onClick={handleUpload}
                disabled={isUploading || !nomi || !selectedFile}
                style={{ width: "100%", padding: "12px", justifyContent: "center" }}
              >
                {isUploading ? "Yuklanmoqda..." : "Shablonni saqlash"}
              </button>
            </div>
          </div>
        </div>

        {/* Mavjud shablonlar */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-head">
            <div className="card-title">Mavjud shablonlar</div>
          </div>
          
          {isLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>
              Yuklanmoqda...
            </div>
          ) : templates.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--text-secondary)" }}>
              Hozircha tizimda shablonlar mavjud emas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nomi</th>
                    <th>Turi</th>
                    <th>Fayl / O'zgaruvchilar</th>
                    <th>Holati</th>
                    <th style={{ textAlign: "right" }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => {
                    let vars = [];
                    try { vars = JSON.parse(t.ozgaruvchilar); } catch (e) {}
                    
                    return (
                      <tr key={t.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                              <FileDoc size={20} weight="fill" />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{t.nomi}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>ID: #{t.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge" style={{ background: "var(--bg-hover)", color: "var(--text-secondary)" }}>
                            {t.turi}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                            {t.faylNomi}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginTop: "2px" }}>
                            {vars.length} ta o'zgaruvchi topildi
                          </div>
                        </td>
                        <td>
                          <button 
                            onClick={() => toggleFaol(t.id, t.faol)}
                            className="badge"
                            style={{ 
                              background: t.faol ? "var(--green-bg)" : "var(--red-bg)",
                              color: t.faol ? "var(--green-text)" : "var(--red)",
                              border: "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              transition: "all 0.2s"
                            }}
                          >
                            {t.faol ? <CheckCircle size={14} weight="fill" /> : <XCircle size={14} weight="fill" />}
                            {t.faol ? "Faol" : "Faol emas"}
                          </button>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button 
                            className="btn-icon danger" 
                            onClick={() => handleDelete(t.id)}
                            title="O'chirish"
                            style={{ background: 'var(--bg-hover)' }}
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
