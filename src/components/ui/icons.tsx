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

export const InstagramIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
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

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>
);

export const ShareIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16M10 11v5M14 11v5M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
);

export const LockIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 4C11 4 5 8 5 15c0 2.8 1.8 5 4.5 5C16 20 20 12 20 4Z" /><path d="M4 21c3-5 7-8 12-10" /></svg>
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

export const HeartIcon = (p: IconProps) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M12 20.5C6.8 17.4 3.5 14.2 3.5 10.4A4.9 4.9 0 0 1 12 7.1a4.9 4.9 0 0 1 8.5 3.3c0 3.8-3.3 7-8.5 10.1Z" />
  </svg>
);

export const ShirtIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 3.5 12 5l4-1.5 4 2.5-1.6 4L18 9.4V20H6V9.4l-2.4.6L2 6z" />
  </svg>
);

/** Symmetrical tee silhouette for product-customisation actions. */
export const TeeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m8.5 4 3.5 1.8L15.5 4 20 7l-2.1 4.1-2.4-1.2V20H8.5V9.9l-2.4 1.2L4 7z" />
    <path d="M9.2 4c.4 1.5 1.4 2.2 2.8 2.2s2.4-.7 2.8-2.2" />
  </svg>
);

export const PaletteIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2s-.6-2 0-2.5c.5-.5 1.4-.5 2.5-.5A4.5 4.5 0 0 0 21 11.5C21 6.8 16.9 3 12 3Z" />
    <circle cx="7.5" cy="12" r="1" fill="currentColor" />
    <circle cx="10" cy="8" r="1" fill="currentColor" />
    <circle cx="15" cy="8.5" r="1" fill="currentColor" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const EyeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.9 3.8M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </svg>
);

export const StoreIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M2.5 5h19l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" />
    <path d="M4 10v11h16V10" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export const LogoutIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const HeadsetIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="3" y="13" width="4" height="6" rx="1.5" />
    <rect x="17" y="13" width="4" height="6" rx="1.5" />
    <path d="M20 19v1a3 3 0 0 1-3 3h-3" />
  </svg>
);

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V17.5a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
