"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target, Gavel
} from "@phosphor-icons/react";

const NAV = [
  { icon: ChartBar, label: "Dashboard", href: "/", badge: null },
  { icon: Users, label: "Qarzdorlar", href: "/debtors", badge: "900" },
  { icon: CreditCard, label: "To'lovlar", href: "/payments", badge: null },
  { icon: FileText, label: "Hujjatlar", href: "/documents", badge: null },
  { icon: Scales, label: "Sud bo'limi", href: "/court", badge: "12", badgeColor: "yellow" },
  { icon: CalendarBlank, label: "Kalendar", href: "/calendar", badge: null },
  { icon: ChartLineUp, label: "Hisobotlar", href: "/reports", badge: null },
  { icon: Target, label: "KPI", href: "/kpi", badge: null },
];

function NavItem({ item, currentPath }: { item: typeof NAV[0], currentPath: string }) {
  const Icon = item.icon;
  // Exact match for dashboard, partial match for subpages
  const isActive = item.href === "/" ? currentPath === item.href : currentPath.startsWith(item.href);
  
  return (
    <Link href={item.href} className={`nav-item ${isActive ? "active" : ""}`} style={{ textDecoration: 'none' }}>
      <span className="nav-icon"><Icon size={20} weight={isActive ? "fill" : "regular"} /></span>
      {item.label}
      {item.badge && (
        <span className={`nav-badge ${"badgeColor" in item && item.badgeColor === "yellow" ? "yellow" : ""}`}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <div className="logo-icon"><Gavel size={22} weight="fill" /></div>
          <div>
            <div className="logo-title">Yoshlar Ittifoqi</div>
            <div className="logo-sub">Qarz Monitoring</div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-label">Asosiy</div>
        {NAV.slice(0, 4).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} />)}
        
        <div className="nav-label">Huquqiy</div>
        {NAV.slice(4, 6).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} />)}
        
        <div className="nav-label">Tahlil</div>
        {NAV.slice(6).map(item => <NavItem key={item.label} item={item} currentPath={pathname || "/"} />)}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">A</div>
          <div>
            <div className="user-name">Admin</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
