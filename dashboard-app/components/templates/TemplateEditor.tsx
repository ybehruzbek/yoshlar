"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, FloppyDisk, Plus, Trash, TextAa, ArrowLeft, Check, Tag, MagnifyingGlass } from "@phosphor-icons/react";

// Preset placeholder options
const PRESET_VARS = [
  { value: "{{FISH}}", label: "F.I.SH. (Qarzdor)" },
  { value: "{{PASPORT}}", label: "Pasport" },
  { value: "{{JSHSHIR}}", label: "JShShIR" },
  { value: "{{MANZIL}}", label: "Manzil" },
  { value: "{{SHARTNOMA_SANA}}", label: "Shartnoma sanasi" },
  { value: "{{SHARTNOMA_RAQAMI}}", label: "Shartnoma raqami" },
  { value: "{{REESTR_RAQAM}}", label: "Reestr raqami" },
  { value: "{{NOTARIUS}}", label: "Notarius" },
  { value: "{{QARZ_SUMMASI}}", label: "Qarz summasi (raqam)" },
  { value: "{{QARZ_SUMMA_SOZ}}", label: "Qarz summasi (so'z)" },
  { value: "{{QARZ_MUDDATI_RAQAM}}", label: "Qarz muddati (raqam)" },
  { value: "{{QARZ_MUDDATI_SOZ}}", label: "Qarz muddati (so'z)" },
  { value: "{{OYLIK_TOLOV}}", label: "Oylik to'lov" },
  { value: "{{OYLIK_TOLOV_SOZ}}", label: "Oylik to'lov (so'z)" },
  { value: "{{TOLOV_BOSHLANISH_SANA}}", label: "To'lov boshlanish sanasi" },
  { value: "{{HOLAT_SANASI}}", label: "Holat sanasi" },
  { value: "{{QARZ_QOLDIQ}}", label: "Qarz qoldig'i (raqam)" },
  { value: "{{QOLDIQ_SOZ}}", label: "Qarz qoldig'i (so'z)" },
  { value: "{{SUD_NOMI}}", label: "Sud nomi" },
  { value: "{{RAIS_FISH}}", label: "Rais F.I.SH." },
  { value: "{{DAVOGAR_MANZIL}}", label: "Da'vogar manzili" },
  { value: "{{OGOHLANTIRISH_SANALARI}}", label: "Ogohlantirish sanalari" },
  { value: "{{TALABNOMA_SANA}}", label: "Talabnoma sanasi" },
  { value: "{{BANK_NOMI}}", label: "Bank nomi" },
  { value: "{{HUJJAT_SANA}}", label: "Hujjat sanasi" },
  { value: "{{TUMAN}}", label: "Tuman nomi" },
  { value: "{{NOTARIAL_TUMAN}}", label: "Notarial tuman" },
  { value: "{{OTKAZILGAN_SANA}}", label: "O'tkazilgan sana" },
  { value: "{{BUGUNGI_SANA}}", label: "Bugungi sana" },
  { value: "{{OGOHLANTIRISH_XATLARI}}", label: "Ogohlantirish xatlari" },
  { value: "{{BANK_FILIALI}}", label: "Bank filiali" },
];

interface Replacement {
  id: string;
  original: string;
  placeholder: string;
  label: string;
  /** The paragraph text surrounding the original — used for context-aware backend matching */
  context: string;
}

interface Props {
  file: File;
  nomi: string;
  turi: string;
  onSave: () => void;
  onCancel: () => void;
}

export default function TemplateEditor({ file, nomi, turi, onSave, onCancel }: Props) {
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [replacements, setReplacements] = useState<Replacement[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectedContext, setSelectedContext] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Load preview
  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/templates/preview", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setHtml(data.html);
        }
      } catch (error) {
        console.error("Preview error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [file]);

  /**
   * Get the plain-text content of the nearest block-level parent element
   * to use as context for uniquely identifying *which* occurrence to replace.
   */
  const getSelectionContext = (node: Node): string => {
    let el: HTMLElement | null = node.nodeType === Node.TEXT_NODE
      ? node.parentElement
      : (node as HTMLElement);

    // Walk up to the closest block element (p, td, li, h1-h6, div in preview)
    while (el && el !== contentRef.current) {
      const display = window.getComputedStyle(el).display;
      if (display === "block" || display === "table-cell" || display === "list-item") {
        return el.textContent?.trim() || "";
      }
      el = el.parentElement;
    }
    return "";
  };

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 1) return;

    // Don't allow selecting already-replaced placeholders
    if (text.startsWith("{{") && text.endsWith("}}")) return;

    // Get position for popup
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Get context (surrounding paragraph text)
    const context = getSelectionContext(range.startContainer);

    setSelectedText(text);
    setSelectedContext(context);
    setPopupPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowPopup(true);
    setSearchQuery("");
    setCustomName("");
  }, []);

  // Apply a replacement — now visually replaces the text in the HTML
  const applyReplacement = (placeholder: string, label: string) => {
    if (!selectedText) return;

    const newReplacement: Replacement = {
      id: Date.now().toString(),
      original: selectedText,
      placeholder,
      label,
      context: selectedContext,
    };

    // Update the HTML: replace the selected text with a styled placeholder badge
    setHtml(prevHtml => {
      return replaceFirstInContext(prevHtml, selectedText, selectedContext, placeholder);
    });

    setReplacements(prev => [...prev, newReplacement]);
    setShowPopup(false);
    window.getSelection()?.removeAllRanges();
  };

  /**
   * Replace only the FIRST occurrence of `text` that appears within
   * an HTML element whose text content matches `context`.
   * This prevents replacing ALL "20"s — only the one the user selected.
   */
  const replaceFirstInContext = (htmlStr: string, text: string, context: string, placeholder: string): string => {
    // Build the placeholder badge HTML
    const badge = `<span class="tpl-placeholder" data-var="${placeholder}" title="${placeholder}" contenteditable="false">${placeholder}</span>`;

    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // If no context or very short text with context, do targeted replacement
    if (context && text.length < 5) {
      // For short text (like "20"), we need to be very careful
      // Find the paragraph that contains this context and replace only there
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${htmlStr}</div>`, "text/html");
      const container = doc.body.firstElementChild!;

      // Walk all text-containing elements
      const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      let found = false;

      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const parentBlock = findBlockParent(node);
        const blockText = parentBlock?.textContent?.trim() || "";

        // Check if this block matches our context
        if (blockText === context || blockText.includes(text)) {
          const idx = node.textContent!.indexOf(text);
          if (idx !== -1 && !found) {
            // Check if context matches
            if (context && blockText !== context) continue;

            // Replace just this occurrence
            const before = node.textContent!.substring(0, idx);
            const after = node.textContent!.substring(idx + text.length);
            
            const span = doc.createElement("span");
            span.className = "tpl-placeholder";
            span.setAttribute("data-var", placeholder);
            span.setAttribute("title", placeholder);
            span.setAttribute("contenteditable", "false");
            span.textContent = placeholder;

            const parent = node.parentNode!;
            if (before) parent.insertBefore(doc.createTextNode(before), node);
            parent.insertBefore(span, node);
            if (after) parent.insertBefore(doc.createTextNode(after), node);
            parent.removeChild(node);
            found = true;
            break;
          }
        }
      }

      if (found) {
        return container.innerHTML;
      }
    }

    // For longer text, simple first-occurrence replacement is safe
    const regex = new RegExp(escapedText);
    return htmlStr.replace(regex, badge);
  };

  const findBlockParent = (node: Node): HTMLElement | null => {
    let el: HTMLElement | null = node.parentElement;
    while (el) {
      const tag = el.tagName.toLowerCase();
      if (["p", "td", "th", "li", "h1", "h2", "h3", "h4", "h5", "h6", "div"].includes(tag)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  // Remove a replacement — restore original text
  const removeReplacement = (id: string) => {
    const r = replacements.find(rep => rep.id === id);
    if (r) {
      // Restore: replace the placeholder badge back to original text
      setHtml(prevHtml => {
        // Remove the span wrapper and put back original text
        const badgeRegex = new RegExp(
          `<span[^>]*class="tpl-placeholder"[^>]*data-var="${r.placeholder.replace(/[{}]/g, '\\$&')}"[^>]*>[^<]*</span>`,
          ""
        );
        // Only replace the first match (the one for this specific replacement)
        return prevHtml.replace(badgeRegex, r.original);
      });
    }
    setReplacements(prev => prev.filter(rep => rep.id !== id));
  };

  // Apply custom variable name
  const applyCustom = () => {
    if (!customName.trim()) return;
    const name = customName.trim().toUpperCase().replace(/\s+/g, "_");
    const placeholder = `{{${name}}}`;
    applyReplacement(placeholder, name);
    setCustomName("");
  };

  // Save template
  const handleSave = async () => {
    if (replacements.length === 0) {
      alert("Kamida bitta o'zgaruvchi belgilang");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("nomi", nomi);
      formData.append("turi", turi);
      formData.append("replacements", JSON.stringify(
        replacements.map(r => ({
          original: r.original,
          placeholder: r.placeholder,
          context: r.context,
        }))
      ));

      const res = await fetch("/api/templates/save-with-replacements", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.appliedCount < replacements.length) {
          alert(`Shablon saqlandi! ${data.appliedCount}/${replacements.length} ta o'zgaruvchi qo'llanildi. Ba'zi o'zgaruvchilarni Word fayldan topib bo'lmadi.`);
        } else {
          alert(`Shablon saqlandi! Barcha ${data.appliedCount} ta o'zgaruvchi muvaffaqiyatli belgilandi.`);
        }
        onSave();
      } else {
        const data = await res.json();
        alert(data.error || "Saqlashda xatolik");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPresets = PRESET_VARS.filter(p =>
    !searchQuery || p.label.toLowerCase().includes(searchQuery.toLowerCase()) || p.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-card)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={onCancel} className="btn-icon" style={{ background: "var(--bg-hover)" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{nomi}</div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
              Matnni tanlab, o'zgaruvchi sifatida belgilang • {replacements.length} ta belgilangan
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={onCancel} style={{ padding: "10px 20px" }}>
            Bekor qilish
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving || replacements.length === 0}
            style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FloppyDisk size={18} />
            {isSaving ? "Saqlanmoqda..." : `Saqlash (${replacements.length})`}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Document preview */}
        <div style={{ flex: 1, overflow: "auto", padding: "32px" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--text-secondary)" }}>
              Hujjat yuklanmoqda...
            </div>
          ) : (
            <div
              ref={contentRef}
              className="template-preview"
              onMouseUp={handleMouseUp}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>

        {/* Right sidebar — replacements panel */}
        <div style={{
          width: "340px",
          borderLeft: "1px solid var(--border)",
          background: "var(--bg-card)",
          display: "flex", flexDirection: "column",
          flexShrink: 0,
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <Tag size={18} color="var(--accent)" />
            <span style={{ fontWeight: 700, fontSize: "14px" }}>Belgilangan o'zgaruvchilar</span>
            <span style={{
              marginLeft: "auto", background: "var(--accent)", color: "#fff",
              borderRadius: "10px", padding: "2px 8px", fontSize: "11px", fontWeight: 700,
            }}>
              {replacements.length}
            </span>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
            {replacements.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-tertiary)" }}>
                <TextAa size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <div style={{ fontSize: "13px", lineHeight: 1.6 }}>
                  Hujjatdagi istalgan matnni sichqoncha bilan tanlang va o'zgaruvchi sifatida belgilang.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {replacements.map(r => (
                  <div key={r.id} style={{
                    padding: "12px",
                    background: "var(--bg-hover)",
                    borderRadius: "10px",
                    borderLeft: "3px solid var(--accent)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
                        {r.placeholder}
                      </span>
                      <button
                        onClick={() => removeReplacement(r.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)", padding: "2px" }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                    <div style={{
                      fontSize: "12px", color: "var(--text-secondary)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      &quot;{r.original}&quot;
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border)",
            fontSize: "12px",
            color: "var(--text-tertiary)",
            lineHeight: 1.5,
          }}>
            💡 <strong>Maslahat:</strong> Matn belgilanishi bilan hujjatda <code>{`{{O'ZGARUVCHI}}`}</code> ko&apos;rinishida aks etadi. Qisqa so&apos;zlar (masalan, raqamlar) faqat tanlangan paragrafda almashtiriladi.
          </div>
        </div>
      </div>

      {/* Selection popup */}
      {showPopup && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 3000 }}
            onClick={() => { setShowPopup(false); window.getSelection()?.removeAllRanges(); }}
          />
          <div style={{
            position: "fixed",
            left: Math.min(popupPos.x - 160, window.innerWidth - 340),
            top: Math.max(popupPos.y - 360, 80),
            width: "320px",
            maxHeight: "350px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: "14px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05) inset",
            zIndex: 3001,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "fadeIn 0.15s ease",
          }}>
            {/* Selected text preview */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              fontSize: "12px",
            }}>
              <div style={{ color: "var(--text-tertiary)", marginBottom: "4px" }}>Tanlangan matn:</div>
              <div style={{
                fontWeight: 600, color: "var(--text-primary)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                &quot;{selectedText.length > 50 ? selectedText.substring(0, 50) + "..." : selectedText}&quot;
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "8px 10px", background: "var(--bg-hover)", borderRadius: "8px",
              }}>
                <MagnifyingGlass size={14} color="var(--text-tertiary)" />
                <input
                  type="text"
                  placeholder="Qidirish yoki yangi nom..."
                  value={searchQuery || customName}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCustomName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customName.trim()) {
                      applyCustom();
                    }
                  }}
                  style={{
                    background: "none", border: "none", outline: "none",
                    fontSize: "13px", color: "var(--text-primary)", width: "100%",
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* Custom name button */}
            {customName.trim() && !filteredPresets.some(p => p.value === `{{${customName.trim().toUpperCase().replace(/\s+/g, "_")}}}`) && (
              <button
                onClick={applyCustom}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 16px", background: "none", border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer", color: "var(--accent)", fontSize: "13px", fontWeight: 600,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <Plus size={14} />
                Yangi: {`{{${customName.trim().toUpperCase().replace(/\s+/g, "_")}}}`}
              </button>
            )}

            {/* Preset list */}
            <div style={{ flex: 1, overflow: "auto", padding: "4px 0" }}>
              {filteredPresets.map(p => {
                const isUsed = replacements.some(r => r.placeholder === p.value);
                return (
                  <button
                    key={p.value}
                    onClick={() => applyReplacement(p.value, p.label)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      width: "100%", padding: "9px 16px",
                      background: "none", border: "none",
                      cursor: "pointer", fontSize: "13px",
                      color: "var(--text-primary)",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span style={{
                      fontFamily: "monospace", fontSize: "11px", fontWeight: 700,
                      color: isUsed ? "var(--green-text)" : "var(--accent)",
                      background: isUsed ? "var(--green-bg)" : "var(--accent-light)",
                      padding: "2px 6px", borderRadius: "4px", flexShrink: 0,
                    }}>
                      {p.value}
                    </span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{p.label}</span>
                    {isUsed && <Check size={14} color="var(--green-text)" style={{ marginLeft: "auto" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
