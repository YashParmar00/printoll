import type { ReactNode } from "react";

/** Consistent wrapper for long-form content pages (policies, about, FAQ, etc.). */
export default function PageShell({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-12">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-lg text-ink">{intro}</p>}
      {updated && <p className="mt-2 text-sm text-ink">Last updated: {updated}</p>}
      <div className="content mt-8 space-y-4">{children}</div>
    </div>
  );
}
