import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const promises = ["Made in India", "COD across India", "7-day damage replacement"];

export default function AboutTeaser() {
  return (
    <section className="bg-plum py-16 text-cream">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow text-gold-light">Our story</p>
          <h2 className="mt-2 text-3xl text-white sm:text-4xl">Started in India, gifting across India</h2>
          <p className="mt-4 max-w-xl text-white/85">
            AuraaMarts began with a simple belief: the best gifts feel personal. We&apos;re a small
            India-based team that engraves, prints and packs every order with care — and we&apos;re
            always a WhatsApp message away, {site.supportHours}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-plum transition-colors hover:bg-cream"
            >
              Read our story <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(`Hi ${site.name}, I'd like help choosing a gift.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Message us
            </a>
          </div>
        </div>

        <ul className="grid gap-3 rounded-2xl bg-white/10 p-6 backdrop-blur">
          {promises.map((p) => (
            <li key={p} className="flex items-center gap-3 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal">
                <CheckIcon className="h-5 w-5" />
              </span>
              <span className="font-medium">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
