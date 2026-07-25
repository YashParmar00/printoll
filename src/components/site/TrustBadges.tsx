import { RupeeIcon, IndiaIcon, TruckIcon, ShieldIcon } from "@/components/ui/icons";

/** Honest early-stage trust strip (RESEARCH.md §B1). No fabricated numbers. */
const badges = [
  { Icon: RupeeIcon, label: "COD Available" },
  { Icon: IndiaIcon, label: "Made in India" },
  { Icon: TruckIcon, label: "5–7 Day Delivery" },
  { Icon: ShieldIcon, label: "7-Day Damage Replacement" },
];

export default function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${className}`}>
      {badges.map(({ Icon, label }) => (
        <li key={label} className="flex items-center gap-2 text-sm font-medium text-ink">
          <Icon className="h-5 w-5 shrink-0 text-plum" />
          {label}
        </li>
      ))}
    </ul>
  );
}
