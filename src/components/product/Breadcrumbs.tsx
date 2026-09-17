import Link from "next/link";

export default function Breadcrumbs({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-coral">Home</Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/category" className="hover:text-coral">Shop</Link>
        </li>
        <li aria-hidden>/</li>
        <li className="truncate font-medium text-white" aria-current="page">{name}</li>
      </ol>
    </nav>
  );
}
