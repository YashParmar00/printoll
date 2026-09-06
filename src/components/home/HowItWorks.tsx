import Link from "next/link";
import { SparkleIcon, GiftIcon, ShirtIcon, ArrowRightIcon } from "@/components/ui/icons";

const steps = [
  {
    n: 1,
    title: "Choose a shared print",
    text: "King & Queen, Mr & Mrs, your date, or just your initials.",
  },
  {
    n: 2,
    title: "Pick your own sizes",
    text: "Unisex XS–XXL, chosen separately for each tee. Same print, your own fit.",
  },
  {
    n: 3,
    title: "Add your personal detail",
    text: "Names, initials or a date — printed on both tees exactly as you type it.",
  },
];

const cards = [
  {
    Icon: SparkleIcon,
    title: "Printed to order",
    text: "Nothing sits in a warehouse. Your set is printed after you choose, which is why the custom bit is part of the price, not an add-on.",
  },
  {
    Icon: GiftIcon,
    title: "Gift-ready, always",
    text: "Both tees arrive folded in one box — ready to hand over without a trip to the wrapping shop.",
  },
  {
    Icon: ShirtIcon,
    title: "Cotton that survives Indian summers",
    text: "180 GSM soft-washed cotton with DTF/DTG inks: breathable, and the print doesn't crack after four washes.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-28 bg-night-soft py-20">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="eyebrow-dark">A match, not a uniform</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl">
            The print connects you.
            <br />
            Your fit stays yours.
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-night-ink">
            Start with one of our prints, then choose the size each of you actually wears. Add your
            names, a date, or a private joke — we print it on both tees.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map(({ n, title, text }) => (
              <li key={n} className="flex gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                  {n}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-night-ink">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href="/category" className="btn-primary mt-9">
            Build your set <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:content-start">
          {cards.map(({ Icon, title, text }, i) => (
            <div key={title} className={`card-dark p-5 ${i === 2 ? "sm:col-span-2" : ""}`}>
              <Icon className="h-6 w-6 text-coral" />
              <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-night-ink">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
