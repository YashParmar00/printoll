"use client";

import { useEffect, useRef, useState } from "react";

type Values = { budget: string; edit: string };
type Group = { key: keyof Values; title: string; options: { value: string; label: string }[] };
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral";

export function FilterOptions({ groups, values, onChange, prefix }: { groups: Group[]; values: Values; onChange: (key: keyof Values, value: string) => void; prefix: string }) {
  return <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
    {groups.map(group => <fieldset key={group.key}>
      <legend className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink">{group.title}</legend>
      <div className="grid grid-cols-2 gap-1.5 lg:flex lg:flex-wrap">
        {group.options.map(option => <label key={option.value} className="cursor-pointer">
          <input className="peer sr-only" type="radio" name={`${prefix}-${group.key}`} value={option.value} checked={values[group.key] === option.value} onChange={() => onChange(group.key, option.value)} />
          <span className="flex min-h-9 items-center gap-2 rounded-lg border border-line bg-paper/40 px-2.5 py-1.5 text-[11px] text-ink transition-colors hover:border-coral/40 peer-checked:border-coral/60 peer-checked:bg-coral/10 peer-checked:text-coral-light peer-focus-visible:ring-2 peer-focus-visible:ring-coral lg:text-xs">
            <span className={`h-2 w-2 shrink-0 rounded-full ${values[group.key] === option.value ? "bg-coral" : "bg-ink/30"}`} />{option.label}
          </span>
        </label>)}
      </div>
    </fieldset>)}
  </div>;
}

export default function ShopFilters({ groups, values, count, desktopOpen, onDesktopToggle, onApply, resultCount }: {
  groups: Group[]; values: Values; count: number; desktopOpen: boolean; onDesktopToggle: () => void;
  onApply: (values: Values) => void; resultCount: (values: Values) => number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function show() {
    if (window.matchMedia("(min-width: 1024px)").matches) { onDesktopToggle(); return; }
    setDraft(values);
    setOpen(true);
    dialog.current?.showModal();
  }
  return <>
    <button type="button" onClick={show} aria-expanded={open || desktopOpen} aria-label={count ? `Filters, ${count} active` : "Filters"}
      className={`flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold lg:h-12 lg:rounded-xl lg:px-4 lg:text-sm ${focus} ${count || open || desktopOpen ? "border-coral/50 bg-coral/10 text-coral-light" : "border-line text-white hover:border-coral/50"}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>
      <span className="hidden sm:inline">Filters</span> {count > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] text-white">{count}</span>}
    </button>
    <dialog ref={dialog} aria-labelledby="filter-dialog-title" onClose={() => setOpen(false)} onClick={event => {
      if (event.target === event.currentTarget) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
      }
    }} className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-none overflow-hidden rounded-t-2xl border border-line bg-night-card p-0 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:inset-0 sm:m-auto sm:max-h-[85dvh] sm:w-[380px] sm:rounded-2xl">
      <div className="flex max-h-[90dvh] flex-col sm:max-h-[85dvh]">
        <div className="shrink-0 border-b border-line px-4 py-2">
          <div className="flex items-center justify-between">
            <h2 id="filter-dialog-title" className="text-base">Filters</h2>
            <button type="button" aria-label="Close filters" onClick={() => dialog.current?.close()} className={`flex h-8 w-8 items-center justify-center rounded-lg text-ink hover:text-white ${focus}`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg>
            </button>
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4">
          <FilterOptions groups={groups} values={draft} prefix="mobile" onChange={(key, value) => setDraft(current => ({ ...current, [key]: value }))} />
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-line bg-night-card px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={() => setDraft({ budget: "all", edit: "all" })} className={`min-h-9 rounded-lg px-2 text-xs text-ink underline underline-offset-4 hover:text-white ${focus}`}>Reset</button>
          <button type="button" onClick={() => { onApply(draft); dialog.current?.close(); }} className="btn-primary min-h-9 flex-1 rounded-lg px-3 py-2 text-xs">Show {resultCount(draft)} results</button>
        </div>
      </div>
    </dialog>
  </>;
}
