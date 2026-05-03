"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target, SignOut, CaretDown, FileDoc, ShieldCheck, List
} from "@phosphor-icons/react";
import { getSidebarStats } from "../../lib/actions/stats";
import { getSidebarItems, ROLE_LABELS, normalizeRole } from "../../lib/rbac";
import { UserRole } from "@prisma/client";

// Icon mapping
const ICONS: Record<string, any> = {
  dashboard: ChartBar,
  debtors: Users,
  payments: CreditCard,
  documents: FileText,
  court: Scales,
  calendar: CalendarBlank,
  reports: ChartLineUp,
  kpi: Target,
  templates: FileDoc,
  users: Users,
  logs: List,
};

function NavItem({ item, currentPath, stats }: { item: any; currentPath: string; stats: Record<string, number> }) {
  const Icon = ICONS[item.key] || ChartBar;
  const isActive = item.href === "/" ? currentPath === item.href : currentPath.startsWith(item.href);
  const badgeValue = stats[item.key];

  return (
    <Link href={item.href} className={`nav-item ${isActive ? "active" : ""}`} style={{ textDecoration: 'none' }}>
      <span className="nav-icon"><Icon size={20} weight={isActive ? "fill" : "regular"} /></span>
      {item.label}
      {badgeValue !== undefined && badgeValue > 0 && (
        <span className="nav-badge">
          {badgeValue}
        </span>
      )}
    </Link>
  );
}

/* ── Sidebar Skeleton ── */
function SidebarSkeleton() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="skeleton" style={{ width: 130, height: 36, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 110, height: 10, borderRadius: 4 }} />
      </div>
      <nav className="sidebar-nav">
        <div className="skeleton" style={{ width: 90, height: 10, borderRadius: 4, margin: '20px 12px 12px' }} />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{
            width: '100%', height: 40, borderRadius: 10, marginBottom: 4
          }} />
        ))}
        <div className="skeleton" style={{ width: 80, height: 10, borderRadius: 4, margin: '24px 12px 12px' }} />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton" style={{
            width: '100%', height: 40, borderRadius: 10, marginBottom: 4
          }} />
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
          <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: 100, height: 12, borderRadius: 4, marginBottom: 6 }} />
            <div className="skeleton" style={{ width: 60, height: 10, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getSidebarStats().then(data => {
      setStats({
        debtors: data.debtorCount,
        court: data.courtCount
      });
    }).catch(e => console.error(e));
  }, []);

  // Show skeleton until mounted + session loaded
  if (!mounted || status === "loading") {
    return <SidebarSkeleton />;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const role = normalizeRole((session?.user?.role as string) || "SUPER_ADMIN");
  const { main: mainItems, admin: adminItems } = getSidebarItems(role);
  const roleLabel = ROLE_LABELS[role] || role;

  const userName = session?.user?.name || "Foydalanuvchi";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Yoshlar Ittifoqi" className="logo-img" />
        <div className="sidebar-logo-text">Monitoring Tizimi</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">ASOSIY MENYU</div>
        {mainItems.map((item) => (
          <NavItem key={item.key} item={item} currentPath={pathname} stats={stats} />
        ))}

        {adminItems.length > 0 && (
          <>
            <div className="nav-label" style={{ marginTop: 8 }}>MA'MURIYAT</div>
            {adminItems.map((item) => (
              <NavItem key={item.key} item={item} currentPath={pathname} stats={stats} />
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div
          className={`user-card ${showUserMenu ? "active" : ""}`}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info-block">
            <div className="user-name">{userName}</div>
            <div className="user-role">
              {role === 'SUPER_ADMIN' && <ShieldCheck size={12} color="var(--red)" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
              {roleLabel}
            </div>
          </div>
          <CaretDown size={14} className={`user-caret ${showUserMenu ? "rotated" : ""}`} />
        </div>

        {showUserMenu && (
          <div className="user-menu">
            <div className="user-menu-email">{session?.user?.email}</div>
            <button className="user-menu-btn logout-btn" onClick={handleLogout}>
              <SignOut size={18} weight="bold" />
              Chiqish
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
