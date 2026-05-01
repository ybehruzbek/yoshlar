"use client";

import { Export, FilePlus, Bell, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../../context/ThemeContext";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-title">{title}</div>
      </div>
      <div className="topbar-actions">
        <button className="topbar-btn btn-ghost" onClick={toggleTheme} title="Rejimni o'zgartirish">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="topbar-btn btn-ghost">
          <Export size={16} weight="bold" /> Excel
        </button>
        <button className="topbar-btn btn-primary">
          <FilePlus size={16} weight="bold" /> Hujjat yaratish
        </button>
        <div className="notif-btn">
          <Bell size={18} />
          <div className="notif-dot" />
        </div>
      </div>
    </div>
  );
}

