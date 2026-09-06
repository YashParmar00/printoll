import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const promises = ["Printed in India", "COD across India", "7-day damage replacement"];

export default function AboutTeaser() {
  return (
    <section className="relative overflow-hidden bg-night py-20">
      <div aria-hidden className="glow pointer-events-none absolute inset-0 opacity-70" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow-dark">Our story</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">
            Made for two, by a small team in India
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-night-ink">
            {site.name} started with one idea: matching couple tees shouldn&apos;t look cheap or say
            something you&apos;d never actually say out loud. So we print small runs, on good cotton,
            with your names on them — and we&apos;re always a WhatsApp message away,{" "}
            {site.supportHours}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/about" className="btn-primary">
              Read our story <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(`Hi ${site.name}, I'd like help picking a couple set.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Message us
            </a>
          </div>
        </div>

        <ul className="card-dark grid gap-3 p-6">
          {promises.map((p) => (
            <li key={p} className="flex items-center gap-3 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-coral text-white">
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
