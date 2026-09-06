import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pairwear is a small India-based team printing matching couple T-shirt sets — two tees, one print, personalized with your names and delivered across India.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Our story"
      title="Made for two, by a small team in India"
      intro="Pairwear started with one idea: matching couple tees shouldn't look cheap."
    >
      <p>
        We&apos;re a small, India-based team that prints matching couple T-shirt sets — two tees, one
        print, personalized with your names, your initials, or the date only the two of you get.
      </p>

      <h2>Why we started {site.name}</h2>
      <p>
        Most couple tees fall into one of two traps: a slogan you&apos;d never say out loud, or fabric
        that goes stiff after two washes. Neither survives past the first photo. We wanted sets that
        get worn on ordinary Tuesdays too — so we picked good cotton, kept the prints restrained, and
        made the personal bit the point rather than an upsell.
      </p>

      <h2>How we work</h2>
      <p>
        Nothing sits in a warehouse. Every set is printed after you order — your names, your two
        sizes — and delivered across India in about 5–7 days. We keep Cash on Delivery available
        because it&apos;s how most of India prefers to shop, and we&apos;re always a WhatsApp message
        away, {site.supportHours}.
      </p>

      <h2>Printed in India, shipped as a pair</h2>
      <p>
        Both tees arrive folded in one box, ready to hand over. We&apos;re just getting started —
        thank you for being one of our early couples. Your trust is what lets us keep printing.
      </p>

      <p>— {site.founder}</p>

      <a
        href={whatsappLink(`Hi ${site.name}, I'd like help picking a couple set.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-4"
      >
        <WhatsAppIcon className="h-5 w-5" /> Chat with us
      </a>
    </PageShell>
  );
}
