"use client";

import { Bell, Moon, Sun } from "@phosphor-icons/react";

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

