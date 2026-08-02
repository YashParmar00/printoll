import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PageShell eyebrow="Policies" title="Terms & Conditions" updated="26 July 2026">
      <p>
        By using auraamarts.com and placing an order, you agree to these terms. Please read them
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
        <li>You can pay by Cash on Delivery, a small online advance plus COD (on personalized items), or
          fully online via Razorpay.</li>
        <li>We may confirm Cash-on-Delivery orders by WhatsApp or phone before dispatch, and may cancel
          orders we&apos;re unable to verify or fulfil.</li>
      </ul>

      <h2>Personalization is your responsibility</h2>
      <p>
        We produce personalized items exactly as you provide them. Please check the spelling of any name
        and the quality of any uploaded photo before ordering — we can&apos;t replace items for errors in
        the details you supplied (see our Return &amp; Refund Policy).
      </p>

      <h2>Intellectual property</h2>
      <p>
        Site content and branding belong to AuraaMarts. By uploading a photo, you confirm you have the
        right to use it for your personalized product.
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
