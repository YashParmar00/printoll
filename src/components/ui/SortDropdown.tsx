"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string };

export default function SortDropdown({ options, value, onChange }: { options: Option[]; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selected = Math.max(0, options.findIndex(option => option.value === value));

  useEffect(() => {
    if (!open) return;
    items.current[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function show(index = selected) {
    setActive(index);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div ref={root} className="relative min-w-0 shrink-0" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button ref={trigger} id={`${id}-trigger`} type="button" aria-label={`Sort products: ${options[selected]?.label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
        onClick={() => open ? close() : show()}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            show(event.key === "ArrowUp" ? options.length - 1 : selected);
          }
        }}
        className={`flex h-9 w-full items-center justify-between gap-2 rounded-lg lg:h-12 lg:rounded-xl border bg-paper px-3 text-left text-xs font-medium text-white transition-colors hover:border-coral/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral sm:w-44 lg:w-52 lg:px-4 lg:text-sm ${open ? "border-coral/60 ring-1 ring-coral/20" : "border-line"}`}>
        <span className="sm:hidden">{value === "low" ? "Price ?" : value === "high" ? "Price ?" : "Sort"}</span><span className="hidden truncate sm:inline">{options[selected]?.label}</span>
        <svg aria-hidden="true" className={`h-4 w-4 shrink-0 text-coral-light transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 7 5 5 5-5" /></svg>
      </button>
      {open && <div id={id} role="menu" aria-labelledby={`${id}-trigger`} className="absolute right-0 top-full z-30 mt-1.5 w-52 max-w-[calc(100vw-3rem)] rounded-xl border border-coral/25 bg-night-card p-2 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        onKeyDown={event => {
          if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setActive(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (active + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
          }
        }}>
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink">Sort by</p>
        {options.map((option, index) => <button key={option.value} ref={node => { items.current[index] = node; }} type="button" role="menuitemradio" aria-checked={value === option.value} tabIndex={-1}
          onFocus={() => setActive(index)}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onChange(option.value);
              close();
            }
          }}
          onClick={() => { onChange(option.value); close(); }}
          className={`flex min-h-9 w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-coral/10 hover:text-coral-light focus:bg-coral/15 focus:text-coral-light focus:outline-none focus:ring-1 focus:ring-inset focus:ring-coral/30 ${value === option.value ? "bg-coral/10 font-semibold text-coral-light" : "text-white/85"}`}>
          {option.label}
          {value === option.value && <svg aria-hidden="true" className="h-4 w-4 shrink-0 text-coral" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 10 4 4 8-8" /></svg>}
        </button>)}
      </div>}
    </div>
  );
}
