"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChartBar, Users, CreditCard, FileText, Scales, CalendarBlank,
  ChartLineUp, Target
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
  const [stats, setStats] = useState<Record<string, number>>({});
  
  useEffect(() => {
    getSidebarStats().then(data => {
      setStats(data as Record<string, number>);
    });
  }, [pathname]); // Refresh stats on navigation
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <Image src="/logo.png" alt="Yoshlar Ittifoqi" width={40} height={40} className="logo-img" />
          <div>
            <div className="logo-title">Yoshlar Ittifoqi</div>
            <div className="logo-sub">Qarz Monitoring</div>
          </div>
        </div>
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

