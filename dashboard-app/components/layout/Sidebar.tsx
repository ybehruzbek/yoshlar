"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target, SignOut, CaretDown, FileDoc, ShieldCheck, List
} from "@phosphor-icons/react";
import { getSidebarStats } from "../../lib/actions/stats";
import { getSidebarItems, ROLE_LABELS } from "../../lib/rbac";
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

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Stats for everyone
    getSidebarStats().then(data => {
      setStats({
        debtors: data.debtorCount,
        court: data.courtCount
      });
    }).catch(e => console.error(e));
  }, []);

  const role = (session?.user?.role as UserRole) || "YURIST";
  const { main: mainItems, admin: adminItems } = getSidebarItems(role);
  const roleLabel = ROLE_LABELS[role] || role;

  return (
    <>
      <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">
              YI
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Yoshlar Ittifoqi</h2>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Qarz monitoring tizimi</span>
            </div>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <div className="nav-group-title">ASOSIY MENYU</div>
          {mainItems.map((item) => (
            <NavItem key={item.key} item={item} currentPath={pathname} stats={stats} />
          ))}

          {adminItems.length > 0 && (
            <>
              <div className="nav-group-title mt-6">MA'MURIYAT</div>
              {adminItems.map((item) => (
                <NavItem key={item.key} item={item} currentPath={pathname} stats={stats} />
              ))}
            </>
          )}
        </div>

        <div className="sidebar-footer" style={{ marginTop: "auto" }}>
          {session?.user && (
            <div className="user-profile mb-4">
              <div className="user-avatar bg-blue-100 text-blue-600 font-bold uppercase flex items-center justify-center">
                {session.user.name?.[0] || session.user.email?.[0] || "U"}
              </div>
              <div className="user-info">
                <div className="user-name">{session.user.name || session.user.email}</div>
                <div className="user-role flex items-center gap-1">
                  {role === 'SUPER_ADMIN' && <ShieldCheck size={12} color="var(--danger-text)" />}
                  {roleLabel}
                </div>
              </div>
            </div>
          )}
          
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="nav-item text-danger w-full justify-start border-none bg-transparent cursor-pointer">
            <span className="nav-icon"><SignOut size={20} /></span>
            Tizimdan chiqish
          </button>
        </div>
      </div>
      
      {isMobileOpen && (
        <div className="modal-backdrop" onClick={() => setIsMobileOpen(false)} style={{ zIndex: 99 }}></div>
      )}
    </>
  );
}
