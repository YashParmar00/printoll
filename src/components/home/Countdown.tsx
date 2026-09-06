"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; mins: number; secs: number };

function partsUntil(targetMs: number): Parts {
  const t = Math.max(0, targetMs - Date.now());
  return {
    days: Math.floor(t / 86_400_000),
    hours: Math.floor((t % 86_400_000) / 3_600_000),
    mins: Math.floor((t % 3_600_000) / 60_000),
    secs: Math.floor((t % 60_000) / 1_000),
  };
}

/**
 * Featured-occasion countdown (RESEARCH.md §B6). Renders "--" until mounted to
 * avoid a server/client hydration mismatch, then ticks every second.
 */
export default function Countdown({ target, label }: { target: string; label: string }) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(partsUntil(targetMs));
    const id = setInterval(() => setParts(partsUntil(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const units: { label: string; value?: number }[] = [
    { label: "Days", value: parts?.days },
    { label: "Hrs", value: parts?.hours },
    { label: "Min", value: parts?.mins },
    { label: "Sec", value: parts?.secs },
  ];

  return (
    <div className="flex gap-2" role="timer" aria-label={`Time left until ${label}`}>
      {units.map((u) => (
        <div
          key={u.label}
          className="min-w-[3.25rem] rounded-xl bg-white/15 px-2 py-1.5 text-center backdrop-blur"
        >
          <div className="font-display text-xl font-bold tabular-nums">
            {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] uppercase tracking-wider opacity-80">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
