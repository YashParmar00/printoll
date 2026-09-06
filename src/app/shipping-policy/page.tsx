import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Shipping Policy" updated="26 July 2026">
      <p>
        We ship across India. Because every set is printed to order, here is exactly what to expect
        after you place an order.
      </p>

      <h2>Processing & delivery time</h2>
      <p>
        Every set is printed after you order, so please allow a little time for production. Most
        orders are delivered within <strong>5–7 days</strong> of confirmation. The estimated delivery
        date is shown on every product page and at checkout before you pay.
      </p>

      <h2>Shipping charges</h2>
      <p>
        Shipping is <strong>free</strong> on every set across India — no minimum. Both tees in a set
        ship together in one box.
      </p>

      <h2>Order confirmation & tracking</h2>
      <ul>
        <li>For Cash on Delivery, we confirm your order over WhatsApp before dispatch.</li>
        <li>Once shipped, we share tracking with you on WhatsApp, and you can check your order any
          time on our <a href="/track">Track Order</a> page.</li>
      </ul>

      <h2>Delays</h2>
      <p>
        Deliveries may take a little longer during festivals, sales, or in remote pincodes, or due to
        courier or weather disruptions. If anything is delayed, we&apos;ll keep you updated on WhatsApp.
      </p>

      <h2>Incorrect address</h2>
      <p>
        Please double-check your address and pincode at checkout. If a parcel is returned because the
        address was incomplete or unreachable, we&apos;ll contact you to arrange re-delivery.
      </p>

      <h2>Questions?</h2>
      <p>
        Message us on WhatsApp or email <a href={`mailto:${site.email}`}>{site.email}</a> — we reply
        within 2 hours, {site.supportHours}.
      </p>

      <p className="text-sm">
        <em>This policy is a starting template for Pairwear and should be reviewed for your final
        launch details.</em>
      </p>
    </PageShell>
  );
}
