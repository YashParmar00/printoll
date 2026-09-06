import Link from "next/link";

export default function Breadcrumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-plum">Home</Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/#featured" className="hover:text-coral">Couple Sets</Link>
        </li>
        <li aria-hidden>/</li>
        <li className="font-medium text-charcoal" aria-current="page">{name}</li>
      </ol>
    </nav>
  );
}
