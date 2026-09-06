import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PageShell eyebrow="Policies" title="Terms & Conditions" updated="26 July 2026">
      <p>
        By using pairwear.in and placing an order, you agree to these terms. Please read them
        alongside our Shipping, Return &amp; Refund, and Privacy policies.
      </p>

      <h2>Products & pricing</h2>
      <p>
        All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We may
        update prices, products, and offers at any time. We try to describe products accurately; colours
        may vary slightly between screens and the final item.
      </p>

      <h2>Orders & payment</h2>
      <ul>
        <li>You can pay by Cash on Delivery, a small online advance plus COD (on personalized sets), or
          fully online via Razorpay.</li>
        <li>We may confirm Cash-on-Delivery orders by WhatsApp or phone before dispatch, and may cancel
          orders we&apos;re unable to verify or fulfil.</li>
      </ul>

      <h2>Personalization and sizes are your responsibility</h2>
      <p>
        We print sets exactly as you provide them. Please check the spelling of every name and the
        format of any date, and pick each size carefully, before ordering — we can&apos;t replace a set
        for errors in the details you supplied or for a size you chose incorrectly (see our Return
        &amp; Refund Policy).
      </p>

      <h2>Intellectual property</h2>
      <p>
        Site content, print designs and branding belong to Pairwear. By submitting names, a date or
        any artwork, you confirm you have the right to use it on your printed set.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, our liability for any order is limited to the value of that
        order.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, with jurisdiction in the courts of Vadodara,
        Gujarat.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a>. {site.addressLine}
      </p>

      <p className="text-sm">
        <em>This is a starting template and should be reviewed by a professional before launch.</em>
      </p>
    </PageShell>
  );
}
