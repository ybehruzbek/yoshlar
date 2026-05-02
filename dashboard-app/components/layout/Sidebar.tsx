"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target, SignOut, CaretDown
} from "@phosphor-icons/react";
import { getSidebarStats } from "../../lib/actions/stats";

interface NavItemData {
  icon: any;
  label: string;
  href: string;
  badgeKey?: string;
  badgeColor?: string;
}

const NAV: NavItemData[] = [
  { icon: ChartBar, label: "Dashboard", href: "/" },
  { icon: Users, label: "Qarzdorlar", href: "/debtors", badgeKey: "debtorCount" },
  { icon: CreditCard, label: "To'lovlar", href: "/payments" },
  { icon: FileText, label: "Hujjatlar", href: "/documents" },
  { icon: Scales, label: "Sud bo'limi", href: "/court", badgeKey: "courtCount", badgeColor: "yellow" },
  { icon: CalendarBlank, label: "Kalendar", href: "/calendar" },
  { icon: ChartLineUp, label: "Hisobotlar", href: "/reports" },
  { icon: Target, label: "KPI", href: "/kpi" },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  operator: "Operator",
  viewer: "Kuzatuvchi",
};

function NavItem({ item, currentPath, stats }: { item: NavItemData; currentPath: string; stats: Record<string, number> }) {
  const Icon = item.icon;
  const isActive = item.href === "/" ? currentPath === item.href : currentPath.startsWith(item.href);
  const badgeValue = item.badgeKey ? stats[item.badgeKey] : undefined;
  
  return (
    <Link href={item.href} className={`nav-item ${isActive ? "active" : ""}`} style={{ textDecoration: 'none' }}>
      <span className="nav-icon"><Icon size={20} weight={isActive ? "fill" : "regular"} /></span>
      {item.label}
      {badgeValue !== undefined && badgeValue > 0 && (
        <span className={`nav-badge ${item.badgeColor === "yellow" ? "yellow" : ""}`}>
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  useEffect(() => {
    getSidebarStats().then(data => {
      setStats(data as Record<string, number>);
    });
  }, [pathname]); // Refresh stats on navigation

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const userName = session?.user?.name || "Foydalanuvchi";
  const userRole = ROLE_LABELS[session?.user?.role || "operator"] || session?.user?.role || "Operator";
  const userInitial = userName.charAt(0).toUpperCase();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Image src="/logo.png" alt="Yoshlar Ittifoqi" width={180} height={50} className="logo-img" priority />
        <div className="sidebar-logo-text">Monitoring Tizimi</div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-label">Asosiy</div>
        {NAV.slice(0, 4).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} stats={stats} />)}
        
        <div className="nav-label">Huquqiy</div>
        {NAV.slice(4, 6).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} stats={stats} />)}
        
        <div className="nav-label">Tahlil</div>
        {NAV.slice(6).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} stats={stats} />)}
      </nav>
      
      <div className="sidebar-footer">
        <div
          className={`user-card ${showUserMenu ? "active" : ""}`}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info-block">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
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
