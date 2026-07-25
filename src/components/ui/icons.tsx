/* Lightweight inline icons (no icon-library dependency). currentColor stroke. */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const RupeeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 3h12M6 8h12M6 13c8 0 8-10 0-10" />
    <path d="M6 13l7 8" />
  </svg>
);

export const IndiaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21c4.5-4 7-7.5 7-11a7 7 0 1 0-14 0c0 3.5 2.5 7 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const TruckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const StarIcon = (p: IconProps) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z" />
  </svg>
);

export const WhatsAppIcon = (p: IconProps) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84a9.7 9.7 0 0 0 1.4 5.04L2 22l5.28-1.56a9.9 9.9 0 0 0 4.76 1.2c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm5.72 13.9c-.24.68-1.4 1.3-1.94 1.34-.5.06-1.12.08-1.8-.12a15.5 15.5 0 0 1-1.64-.6c-2.88-1.24-4.76-4.14-4.9-4.34-.14-.2-1.18-1.56-1.18-2.98 0-1.42.74-2.12 1-2.4a1.06 1.06 0 0 1 .76-.36l.54.01c.18 0 .42-.06.66.5.24.58.82 2 .9 2.14.06.14.1.3.02.5-.08.2-.12.32-.24.48-.12.16-.26.36-.36.48-.12.14-.24.3-.1.54.14.24.62 1.02 1.34 1.66.92.82 1.7 1.08 1.94 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.18 1.26Z" />
  </svg>
);

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 8h12l-1 12H7z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const CalendarHeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 9h17M8 3v4M16 3v4" />
    <path d="M12 18c2.4-1.4 3-2.6 3-3.7a1.4 1.4 0 0 0-3-.6 1.4 1.4 0 0 0-3 .6c0 1.1.6 2.3 3 3.7Z" />
  </svg>
);

export const GiftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M4 13h16M12 9v11" />
    <path d="M12 9S9.5 4.5 7.5 6.5 12 9 12 9Zm0 0s2.5-4.5 4.5-2.5S12 9 12 9Z" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="M12 9c0 1.7-1.3 3-3 3 1.7 0 3 1.3 3 3 0-1.7 1.3-3 3-3-1.7 0-3-1.3-3-3Z" />
  </svg>
);

export const PenIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20l4-1 10-10-3-3L5 16z" />
    <path d="M13.5 6.5l3 3" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const UploadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 16V4M8 8l4-4 4 4" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
