"use client";

import { useState, useEffect } from "react";
import { FileDoc, DownloadSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { usePageTracker } from "@/hooks/usePageTracker";

export default function DocumentsPage() {
  usePageTracker(); // Log page visit

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.loan?.debtor?.fish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.hujjatTuri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.kimYaratdi?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString("uz-UZ")} ${d.toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Hujjatlar tarixi</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Tizimda yaratilgan barcha avtomatik hujjatlar jurnali
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Hujjatlar ro'yxati</div>
          <div className="search-box">
            <MagnifyingGlass size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Qidirish (F.I.SH, Hujjat turi...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Yuklanmoqda...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Hujjatlar topilmadi
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Yaratilgan sana</th>
                  <th>Hujjat turi</th>
                  <th>Qarzdor F.I.SH</th>
                  <th>JSHSHIR</th>
                  <th>Kim yaratdi</th>
                  <th>Holati</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex flex-col">
                        <span>{formatDate(doc.createdAt).split(" ")[0]}</span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                          {formatDate(doc.createdAt).split(" ")[1]}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <FileDoc size={18} color="var(--primary)" />
                        {doc.hujjatTuri}
                      </div>
                    </td>
                    <td>{doc.loan?.debtor?.fish || "—"}</td>
                    <td>{doc.loan?.debtor?.jshshir || "—"}</td>
                    <td>{doc.kimYaratdi?.name || "Tizim"}</td>
                    <td>
                      <span className="badge" style={{ background: "var(--success-bg)", color: "var(--success-text)" }}>
                        {doc.holat}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
