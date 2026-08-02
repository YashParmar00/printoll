import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/site";
import { WhatsAppIcon, RupeeIcon, ShieldIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Chat with AuraaMarts on WhatsApp or email us — we reply within 2 hours, 10 AM–8 PM IST.",
};

export default function ContactPage() {
  return (
    <div className="container-page max-w-4xl py-12">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">We&apos;re here to help</h1>
      <p className="mt-3 text-lg text-ink">
        Questions about a gift, personalization, or an order? We reply within 2 hours,{" "}
        {site.supportHours}.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ContactForm />

        <div className="rounded-2xl border border-line bg-cream p-6">
          <h2 className="text-lg">Reach us directly</h2>
          <ul className="mt-4 space-y-3 text-sm text-charcoal">
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" /> WhatsApp: {site.phoneDisplay}
            </li>
            <li>
              Email:{" "}
              <a href={`mailto:${site.email}`} className="text-plum underline">
                {site.email}
              </a>
            </li>
            <li>Hours: {site.supportHours}</li>
            <li className="text-ink">{site.addressLine}</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink">
            <span className="inline-flex items-center gap-1.5">
              <RupeeIcon className="h-4 w-4 text-plum" /> COD available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldIcon className="h-4 w-4 text-plum" /> 7-day damage replacement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
