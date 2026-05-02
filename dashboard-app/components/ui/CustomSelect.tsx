"use client";

import { useState, useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  options: SelectOption[];
  onChange: (val: any) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, options, onChange, placeholder, className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      <div 
        className={`custom-select-trigger ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-label">
          {selectedOption ? selectedOption.label : placeholder || "Tanlang..."}
        </span>
        <CaretDown size={16} weight="bold" className={`caret ${isOpen ? "rotate" : ""}`} />
      </div>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? "active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-select-container {
          position: relative;
          width: 100%;
          font-family: inherit;
        }
        
        .custom-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-sidebar);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-primary);
          font-size: 14px;
          user-select: none;
        }

        .custom-select-trigger:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .custom-select-trigger.open {
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.05);
        }

        .caret {
          color: var(--text-tertiary);
          transition: transform 0.2s ease;
        }

        .caret.rotate {
          transform: rotate(180deg);
          color: var(--text-primary);
        }

        .custom-select-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: rgba(20, 20, 20, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 6px;
          z-index: 100;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          max-height: 240px;
          overflow-y: auto;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .custom-select-option {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }

        .custom-select-option:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .custom-select-option.active {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          font-weight: 600;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
