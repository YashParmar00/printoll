import { PaletteIcon, ShirtIcon, GiftIcon } from "@/components/ui/icons";

/** Three-up promise band directly under the hero (dark home theme). */
const items = [
  {
    Icon: PaletteIcon,
    title: "Your little language",
    text: "Pick a print, add your names, initials or a date — it's yours, not a marketplace slogan.",
  },
  {
    Icon: ShirtIcon,
    title: "Designed as a pair",
    text: "One print story across two tees, on 180 GSM soft-washed cotton in your own sizes.",
  },
  {
    Icon: GiftIcon,
    title: "Gift-ready, always",
    text: "Both tees arrive folded in one box — ready to hand over, no wrapping shop needed.",
  },
];

export default function ValueStrip() {
  return (
    <section className="border-y border-night-line bg-night-soft">
      <div className="container-page grid divide-y divide-night-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex gap-3.5 px-2 py-7 sm:px-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-night-ink">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
