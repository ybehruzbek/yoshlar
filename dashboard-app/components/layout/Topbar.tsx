"use client";

import { Bell, Moon, Sun } from "@phosphor-icons/react";

import { usePathname } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";

const TITLE_MAP: Record<string, string> = {
  "/": "Bosh sahifa",
  "/debtors": "Qarzdorlar",
  "/payments": "To'lovlar",
  "/documents": "Hujjatlar",
  "/court": "Sud bo'limi",
  "/calendar": "Kalendar",
  "/reports": "Hisobotlar",
  "/kpi": "KPI",
};

export function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  
  // Extract base path to match with TITLE_MAP (e.g., /debtors/123 -> /debtors)
  const basePath = pathname === "/" ? "/" : `/${pathname.split('/')[1]}`;
  const title = TITLE_MAP[basePath] || "Dashboard";

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
      </div>
      <div className="topbar-actions">
        <button className="notif-btn" onClick={toggleTheme} title="Rejimni o'zgartirish">
          {theme === "light" ? <Moon size={20} weight="bold" /> : <Sun size={20} weight="bold" />}
        </button>
        <div className="notif-btn">
          <Bell size={20} weight="bold" />
          <div className="notif-dot" />
        </div>
      </div>

    </div>
  );
}

