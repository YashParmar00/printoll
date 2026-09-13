"use client";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
export default function SubmitButton({ children, className = "btn-primary", pendingText = "Saving…" }: { children: ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-60`}>{pending ? pendingText : children}</button>;
}
