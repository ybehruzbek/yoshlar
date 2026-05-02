"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";

const UZ_MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
const UZ_DAYS = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"]; // Sun-Sat

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDatePicker({ value, onChange, placeholder = "Sanani tanlang", className = "" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => {
    // format as YYYY-MM-DD local time
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    const selectedDateObj = value ? new Date(value) : null;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDateObj ? isSameDay(day, selectedDateObj) : false;
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`dp-day ${!isCurrentMonth ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isToday && !isSelected ? "today" : ""}`}
            onClick={() => isCurrentMonth && onDateClick(cloneDay)}
          >
            <span className="dp-day-num">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="dp-row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="dp-body">{rows}</div>;
  };

  const formattedDisplay = value ? `${new Date(value).getDate()}-${UZ_MONTHS[new Date(value).getMonth()]} ${new Date(value).getFullYear()}` : "";

  return (
    <div className={`custom-dp-container ${className}`} ref={containerRef}>
      <div 
        className={`custom-dp-trigger ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-label">
          {value ? formattedDisplay : placeholder}
        </span>
        <CalendarBlank size={18} className="dp-icon" />
      </div>

      {isOpen && (
        <div className="custom-dp-dropdown">
          <div className="dp-header">
            <button type="button" onClick={prevMonth} className="dp-nav"><CaretLeft size={16} weight="bold" /></button>
            <span className="dp-current-month">
              {UZ_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" onClick={nextMonth} className="dp-nav"><CaretRight size={16} weight="bold" /></button>
          </div>
          <div className="dp-days-header">
            {UZ_DAYS.map((d, i) => (
              <div key={i} className="dp-day-name">{d}</div>
            ))}
          </div>
          {renderCells()}
        </div>
      )}

      <style jsx>{`
        .custom-dp-container {
          position: relative;
          width: 100%;
          font-family: inherit;
        }
        
        .custom-dp-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          user-select: none;
        }

        .custom-dp-trigger:hover {
          border-color: var(--border-strong);
        }

        .custom-dp-trigger.open {
          border-color: var(--accent);
          background: var(--bg-sidebar);
        }

        .dp-icon {
          color: var(--text-tertiary);
        }

        .custom-dp-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 280px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          z-index: 100;
          box-shadow: var(--shadow-lg);
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dp-current-month {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
        }

        .dp-nav {
          background: var(--bg-sidebar);
          border: 1px solid var(--border);
          color: var(--text-primary);
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dp-nav:hover {
          background: var(--border);
        }

        .dp-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 8px;
        }

        .dp-day-name {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
        }

        .dp-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dp-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .dp-day {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dp-day:not(.disabled):hover {
          background: var(--bg-hover);
        }

        .dp-day.disabled {
          color: var(--text-tertiary);
          opacity: 0.4;
          cursor: default;
        }

        .dp-day.today {
          color: var(--accent);
          font-weight: 700;
          background: var(--accent-light);
        }

        .dp-day.selected {
          background: var(--accent);
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0, 113, 227, 0.3);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
