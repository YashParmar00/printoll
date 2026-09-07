import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon, ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

const promises = ["Printed in India", "COD across India", "7-day damage replacement"];

export default function AboutTeaser() {
  return (
    <section className="relative overflow-hidden bg-night py-14 sm:py-16 md:py-20">
      <div aria-hidden className="glow pointer-events-none absolute inset-0 opacity-70" />
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="eyebrow-dark text-[10px] sm:text-xs">Our story</p>
          <h2 className="mt-2 text-2xl text-white sm:text-3xl md:mt-3 md:text-4xl">
            Made for two, by a small team in India
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-night-ink sm:mt-4 sm:text-base">
            {site.name} started with one idea: matching couple tees shouldn&apos;t look cheap or say
            something you&apos;d never actually say out loud. So we print small runs, on good cotton,
            with your names on them — and we&apos;re always a WhatsApp message away,{" "}
            {site.supportHours}.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
            <Link href="/about" className="btn-primary px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base">
              Read our story <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <a
              href={whatsappLink(`Hi ${site.name}, I'd like help picking a couple set.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Message us
            </a>
          </div>
        </div>

        <ul className="card-dark grid gap-2.5 p-4 sm:gap-3 sm:p-6">
          {promises.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-white sm:gap-3 sm:text-base">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-white sm:h-8 sm:w-8">
                <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="font-medium">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
