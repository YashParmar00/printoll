import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AuraaMarts is a small India-based team making personalized gifts — engraved, printed and packed by hand, delivered across India.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title="Started in India, gifting across India"
      intro="AuraaMarts began with a simple belief: the best gifts feel personal."
    >
      <p>
        We&apos;re a small, India-based team that makes personalized gifts — engraved name necklaces,
        custom photo mugs, and photo frames — the kind of gift that turns a name or a memory into
        something someone keeps.
      </p>

      <h2>Why we started AuraaMarts</h2>
      <p>
        Too many gifts get opened, appreciated for a moment, and forgotten. We wanted to make gifts that
        stay — worn every day, kept on a desk, or hung on a wall. So we focused on personalization done
        well: clean engraving, sharp photo printing, and packaging that feels ready to give.
      </p>

      <h2>How we work</h2>
      <p>
        Every order is made after you place it. We engrave, print, and pack each piece with care, then
        deliver it across India in about 5–7 days. We keep Cash on Delivery available because we know
        it&apos;s how most of India prefers to shop — and we&apos;re always a WhatsApp message away if you
        need help choosing or checking on an order.
      </p>

      <h2>Made in India, delivered with care</h2>
      <p>
        We&apos;re proud to make our gifts in India, and we&apos;re just getting started. Thank you for
        being one of our early customers — your trust means everything as we grow.
      </p>

      <p>— Team AuraaMarts</p>

      <a
        href={whatsappLink(`Hi ${site.name}, I'd like help choosing a gift.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-4"
      >
        <WhatsAppIcon className="h-5 w-5" /> Chat with us
      </a>
    </PageShell>
  );
}
