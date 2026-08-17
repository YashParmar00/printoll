import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Return & Refund Policy" };

export default function ReturnPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Return & Refund Policy" updated="26 July 2026">
      <p>
        We want you to love your gift. Because most of our products are personalized and made just for
        you, our policy is built around that — please read it before ordering.
      </p>

      <h2>Personalized items (necklace, mug, frame)</h2>
      <p>
        Personalized items are made to order with your name or photo, so they can&apos;t be resold. For
        that reason we <strong>can&apos;t accept change-of-mind returns</strong> on personalized items.
        We do offer a <strong>7-Day Damage Replacement Guarantee</strong>: if your item arrives
        <strong> damaged, defective, or incorrectly personalized on our part</strong>, we&apos;ll replace
        it free.
      </p>
      <ul>
        <li>Report it within <strong>7 days</strong> of delivery on WhatsApp with a clear photo.</li>
        <li>Please check your spelling and uploaded photo carefully at checkout — we print exactly what
          you provide, so errors in your own input aren&apos;t covered.</li>
      </ul>

      {/* Advance-payment wording — founder's final approved copy (matches the FAQ). */}
      <h2>Advance Payment for Personalized Items</h2>
      <p>
        Personalized products (Engraved Name Necklace, Custom Photo Frame, Magic Photo Mug, Custom Photo Mug) require a ₹99
        advance payment at checkout, with the remaining balance payable via Cash on Delivery. This advance
        is fully refunded if we are unable to fulfill or deliver your order for any reason, and
        non-refundable if you refuse the delivery after your order has already been personalized and
        dispatched, since a customized item cannot be resold to another customer. Products without
        personalization (such as the Acupressure Mat) are not subject to this advance and remain full Cash
        on Delivery.
      </p>

      <h2>Non-personalized items (acupressure mat)</h2>
      <p>
        Unused, non-personalized items in their original packaging can be returned for a replacement or
        refund if they arrive damaged or defective — message us within 7 days of delivery.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved refunds for prepaid amounts are issued to your original payment method, typically within
        5–7 working days. For Cash-on-Delivery orders, no online payment is collected upfront (aside from
        any advance described above).
      </p>

      <h2>How to reach us</h2>
      <p>
        WhatsApp is fastest, or email <a href={`mailto:${site.email}`}>{site.email}</a>. We reply within
        2 hours, {site.supportHours}.
      </p>

      <p className="text-sm">
        <em>This policy is a starting template and must be finalized (including the exact advance
        wording) before launch.</em>
      </p>
    </PageShell>
  );
}
