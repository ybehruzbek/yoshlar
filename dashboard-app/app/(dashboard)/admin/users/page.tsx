"use client";

import { useState, useEffect } from "react";
import { Users, Plus, PencilSimple, CheckCircle, XCircle, ShieldCheck } from "@phosphor-icons/react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { usePageTracker } from "@/hooks/usePageTracker";
import { ALL_ROLES, ROLE_LABELS } from "@/lib/rbac";

export default function UsersPage() {
  usePageTracker();

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "YURIST",
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ id: 0, name: "", email: "", password: "", role: "YURIST", isActive: true });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setFormData({ 
      id: user.id, 
      name: user.name || "", 
      email: user.email, 
      password: "", // password stays empty for edit unless changing
      role: user.role, 
      isActive: user.isActive 
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = isEditMode ? `/api/users/${formData.id}` : "/api/users";
    const method = isEditMode ? "PUT" : "POST";
    
    const body: any = { ...formData };
    if (isEditMode && !body.password) {
      delete body.password; // don't send empty password if not changing
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Xatolik yuz berdi");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    }
  };

  const toggleStatus = async (user: any) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Foydalanuvchilar</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Tizim xodimlari va ularning ruxsatlarini boshqarish
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Yangi xodim qo'shish
        </button>
      </div>

      <div className="card">
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            Yuklanmoqda...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>F.I.SH</th>
                  <th>Email / Login</th>
                  <th>Rol (Ruxsat)</th>
                  <th>So'nggi tashrif</th>
                  <th>Amallar soni</th>
                  <th>Holat</th>
                  <th style={{ textAlign: "right" }}>Tahrirlash</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <Users size={18} color="var(--primary)" />
                        {user.name || "—"}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge flex items-center gap-1 w-max" style={{ 
                        background: user.role === 'SUPER_ADMIN' ? '#fee2e2' : 'var(--bg-tertiary)',
                        color: user.role === 'SUPER_ADMIN' ? '#991b1b' : 'var(--text-primary)'
                      }}>
                        {user.role === 'SUPER_ADMIN' && <ShieldCheck size={14} />}
                        {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] || user.role}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("uz-UZ") : "Hech qachon"}
                        <div style={{ color: "var(--text-secondary)" }}>{user.lastLoginIp || ""}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge">{user._count?.auditLogs || 0} ta</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(user)}
                        className={`badge flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{ 
                          background: user.isActive ? "var(--success-bg)" : "var(--danger-bg)",
                          color: user.isActive ? "var(--success-text)" : "var(--danger-text)",
                          border: "none"
                        }}
                        title={user.isActive ? "Bloklash" : "Aktivlashtirish"}
                      >
                        {user.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {user.isActive ? "Faol" : "Bloklangan"}
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn-icon" onClick={() => openEditModal(user)}>
                        <PencilSimple size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: "500px" }}>
            <div className="modal-header">
              <h3>{isEditMode ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="input-label">F.I.SH</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Email (Login sifatida ishlatiladi)</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    disabled={isEditMode}
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Rol (Tizim ruxsatlari)</label>
                  <CustomSelect
                    options={ALL_ROLES}
                    value={formData.role}
                    onChange={v => setFormData({...formData, role: v})}
                  />
                </div>
                <div>
                  <label className="input-label">
                    {isEditMode ? "Yangi parol (o'zgartirish uchun kiritng)" : "Parol"}
                  </label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required={!isEditMode}
                    minLength={6}
                  />
                </div>
                
                <div className="modal-actions mt-4">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Saqlash
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
