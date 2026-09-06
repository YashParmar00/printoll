import Link from "next/link";
import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl">This page hasn&apos;t been printed yet</h1>
      <p className="mt-3 max-w-md text-ink">
        We&apos;re building {site.name}{" "}milestone by milestone, so this page isn&apos;t ready
        yet. Let&apos;s get you back to the sets.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <a
          href={whatsappLink(`Hi ${site.name}, I couldn't find a page on your site.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Chat with us
        </a>
      </div>
    </section>
  );
}
