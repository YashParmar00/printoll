import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Printoll is a small India-based team creating custom printed tees, matching styles and thoughtful gifts, delivered across India.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title="Made personal, by a small team in India"
      intro="Printoll started with one idea: custom prints should feel personal, not generic."
    >
      <p>
        We&apos;re a small, India-based team that creates custom printed tees, matching styles and gifts.
        Add names, initials, a date or a design that makes the piece feel like yours.
      </p>

      <h2>Why we started {site.name}</h2>
      <p>
        Too many printed clothes feel disposable: a slogan you&apos;d never wear again or fabric that goes
        stiff after two washes. We wanted pieces that work on ordinary Tuesdays too. So we picked good
        cotton, kept the prints considered, and made the personal detail the point.
      </p>

      <h2>How we work</h2>
      <p>
        Nothing sits in a warehouse. Each piece is printed after you order with the design and details
        you choose. It is delivered across India in about 5–7 days. We keep Cash on Delivery available
        because it&apos;s how most of India prefers to shop, and we&apos;re always a WhatsApp message
        away, {site.supportHours}.
      </p>

      <h2>Printed in India, made for you</h2>
      <p>
        Every item is packed with care, ready to wear or hand over as a gift. We&apos;re just getting started.
        Thank you for being one of our early customers. Your trust is what lets us keep printing.
      </p>

      <p>{site.founder}</p>

      <a
        href={whatsappLink(`Hi ${site.name}, I'd like help picking a printed item.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-4"
      >
        <WhatsAppIcon className="h-5 w-5" /> Chat with us
      </a>
    </PageShell>
  );
}
