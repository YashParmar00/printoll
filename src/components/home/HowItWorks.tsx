import { BagIcon, PenIcon, TruckIcon } from "@/components/ui/icons";

const steps = [
  {
    n: "01",
    Icon: BagIcon,
    title: "Choose your gift",
    text: "Pick a personalized necklace, mug or frame — or our wellness bestseller.",
  },
  {
    n: "02",
    Icon: PenIcon,
    title: "Personalize it",
    text: "Add a name or upload a photo and preview it live before you order.",
  },
  {
    n: "03",
    Icon: TruckIcon,
    title: "We deliver in 5–7 days",
    text: "Handcrafted in India and shipped to their door. Cash on Delivery available.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream py-16">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">A thoughtful gift in three steps</h2>
        </div>
        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map(({ n, Icon, title, text }) => (
            <li
              key={n}
              className="relative rounded-2xl border border-line bg-white p-6 text-center shadow-sm"
            >
              <span className="absolute right-5 top-4 font-[family-name:var(--font-heading)] text-4xl font-semibold text-cream-dark">
                {n}
              </span>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-plum/10 text-plum">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
