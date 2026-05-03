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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Shablonlar</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Avtomatik hujjat yaratish uchun .docx shablonlarni boshqarish
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h2 className="text-lg font-medium mb-4">Yangi shablon yuklash</h2>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", alignItems: "end" }}>
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
            <label className="input-label">Word fayl (.docx)</label>
            <div className="flex gap-2">
              <input 
                type="file" 
                accept=".docx"
                id="template-upload"
                className="hidden"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
              <label 
                htmlFor="template-upload" 
                className="btn btn-secondary" 
                style={{ flex: 1, display: "flex", justifyContent: "center", cursor: "pointer" }}
              >
                <UploadSimple size={18} />
                {selectedFile ? selectedFile.name : "Fayl tanlash"}
              </label>
            </div>
          </div>
        </div>
        
        {selectedFile && (
          <div className="mt-4 flex justify-end">
            <button 
              className="btn btn-primary" 
              onClick={handleUpload}
              disabled={isUploading || !nomi}
            >
              {isUploading ? "Yuklanmoqda..." : "Shablonni yuklash"}
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Mavjud shablonlar</div>
        </div>
        
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Yuklanmoqda...
          </div>
        ) : templates.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Shablonlar topilmadi
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nomi</th>
                  <th>Turi</th>
                  <th>O'zgaruvchilar</th>
                  <th>Fayl</th>
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
                      <td style={{ fontWeight: 500 }}>
                        <div className="flex items-center gap-2">
                          <FileDoc size={18} color="var(--primary)" />
                          {t.nomi}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: "var(--bg-tertiary)" }}>
                          {t.turi}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: "13px", maxWidth: "200px" }}>
                          {vars.length} ta aniqlandi:
                          <span style={{ color: "var(--text-secondary)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {vars.slice(0, 3).join(", ")} {vars.length > 3 ? "..." : ""}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "13px" }}>
                          {t.faylNomi}
                          <div style={{ color: "var(--text-secondary)" }}>
                            {t.faylHajmi ? Math.round(t.faylHajmi / 1024) + " KB" : "-"}
                          </div>
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleFaol(t.id, t.faol)}
                          className={`badge flex items-center gap-1 cursor-pointer`}
                          style={{ 
                            background: t.faol ? "var(--success-bg)" : "var(--danger-bg)",
                            color: t.faol ? "var(--success-text)" : "var(--danger-text)",
                            border: "none"
                          }}
                        >
                          {t.faol ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {t.faol ? "Faol" : "O'chirilgan"}
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDelete(t.id)}
                          title="O'chirish"
                        >
                          <Trash size={18} />
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
  );
}
