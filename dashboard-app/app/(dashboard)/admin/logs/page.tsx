"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlass, Funnel, FileArrowDown, Clock, CursorClick, SignIn, Eyeglasses, FileDoc } from "@phosphor-icons/react";
import { usePageTracker } from "@/hooks/usePageTracker";

export default function LogsPage() {
  usePageTracker();

  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [turi, setTuri] = useState("");
  const [userId, setUserId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  // Fetch logs when filters change
  useEffect(() => {
    fetchLogs(1);
  }, [turi, userId, dateFrom, dateTo]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch (e) {}
  };

  const fetchLogs = async (page = pagination.page) => {
    setIsLoading(true);
    try {
      let url = `/api/audit?page=${page}&limit=${pagination.limit}`;
      if (turi) url += `&turi=${turi}`;
      if (userId) url += `&userId=${userId}`;
      if (dateFrom) url += `&from=${dateFrom}`;
      if (dateTo) url += `&to=${dateTo}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to load logs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "LOGIN": return <SignIn size={16} color="var(--primary)" />;
      case "LOGOUT": return <SignIn size={16} color="var(--danger-text)" style={{ transform: "rotate(180deg)" }} />;
      case "SAHIFA_OCHISH": return <Eyeglasses size={16} color="var(--info-text)" />;
      case "AMAL": return <CursorClick size={16} color="var(--warning-text)" />;
      case "HUJJAT_YARATISH": return <FileDoc size={16} color="var(--success-text)" />;
      default: return <Clock size={16} />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const downloadCsv = () => {
    if (logs.length === 0) return;
    
    const headers = ["Sana", "Vaqt", "Foydalanuvchi", "Turi", "Amal", "IP", "Sahifa", "Davomiyligi (s)"];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + logs.map(l => {
        const d = new Date(l.createdAt);
        return [
          d.toLocaleDateString("uz-UZ"),
          d.toLocaleTimeString("uz-UZ"),
          l.user?.name || "Tizim / Fuqaro",
          l.turi,
          `"${l.amal.replace(/"/g, '""')}"`,
          l.ipAddress || "",
          l.sahifa || "",
          l.davomiyligi || ""
        ].join(",");
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Audit Loglar</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Tizimdagi barcha xatti-harakatlar, sahifalarga kirishlar va o'zgarishlar tarixi
          </p>
        </div>
        <button className="btn btn-secondary" onClick={downloadCsv} disabled={logs.length === 0}>
          <FileArrowDown size={18} />
          Eksport (CSV)
        </button>
      </div>

      <div className="card" style={{ padding: "16px" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Hodisa turi</label>
            <select 
              className="input-field py-2" 
              value={turi}
              onChange={e => setTuri(e.target.value)}
            >
              <option value="">Barchasi</option>
              <option value="LOGIN">Tizimga kirish</option>
              <option value="SAHIFA_OCHISH">Sahifa ko'rish</option>
              <option value="AMAL">O'zgartirishlar</option>
              <option value="HUJJAT_YARATISH">Hujjat yaratish</option>
              <option value="FUQARO_QIDIRUV">Fuqaro qidiruv</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Foydalanuvchi</label>
            <select 
              className="input-field py-2" 
              value={userId}
              onChange={e => setUserId(e.target.value)}
            >
              <option value="">Barchasi</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Dan (Sana)</label>
            <input 
              type="date" 
              className="input-field py-2"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Gacha (Sana)</label>
            <input 
              type="date" 
              className="input-field py-2"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Yuklanmoqda...
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sana va Vaqt</th>
                    <th>Foydalanuvchi</th>
                    <th>IP / Qurilma</th>
                    <th>Amal turi</th>
                    <th>Hodisa tafsiloti</th>
                    <th>Sahifa (Davomiylik)</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>Ma'lumot topilmadi</td></tr>
                  ) : logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <div className="text-sm font-medium">
                          {new Date(log.createdAt).toLocaleDateString("uz-UZ")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleTimeString("uz-UZ", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        {log.user ? (
                          <div>
                            <div className="text-sm font-medium">{log.user.name}</div>
                            <div className="text-xs text-gray-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="badge">Tizim / Public</span>
                        )}
                      </td>
                      <td>
                        <div className="text-sm">{log.ipAddress || "—"}</div>
                        {log.userAgent && (
                          <div className="text-xs text-gray-400" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.userAgent}>
                            {log.userAgent.split(" ")[0]}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {getTypeIcon(log.turi)}
                          <span className="text-xs font-medium">{log.turi}</span>
                        </div>
                      </td>
                      <td style={{ maxWidth: "300px" }}>
                        <div className="text-sm truncate" title={log.amal}>{log.amal}</div>
                        {log.eskiQiymat && log.yangiQiymat && (
                          <div className="text-xs mt-1 px-2 py-1 bg-gray-50 rounded border border-gray-100 flex items-center gap-2">
                            <span className="text-red-500 line-through truncate max-w-[80px]" title={log.eskiQiymat}>{log.eskiQiymat}</span>
                            <span>→</span>
                            <span className="text-green-600 truncate max-w-[80px]" title={log.yangiQiymat}>{log.yangiQiymat}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {log.sahifa ? (
                          <div>
                            <code className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                              {log.sahifa}
                            </code>
                            {log.davomiyligi ? (
                              <span className="ml-2 text-xs font-medium text-gray-500">
                                {formatDuration(log.davomiyligi)}
                              </span>
                            ) : null}
                          </div>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Jami {pagination.total} ta log (Sahifa {pagination.page} / {pagination.totalPages})
                </span>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-secondary px-3 py-1"
                    disabled={pagination.page <= 1}
                    onClick={() => fetchLogs(pagination.page - 1)}
                  >
                    Oldingi
                  </button>
                  <button 
                    className="btn btn-secondary px-3 py-1"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchLogs(pagination.page + 1)}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
