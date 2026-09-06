import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Return & Refund Policy" };

export default function ReturnPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Return & Refund Policy" updated="6 September 2026">
      <p>
        We want you to love your set. Because every set is printed with your names and made just for
        you, our policy is built around that — please read it before ordering.
      </p>

      <h2>Printed couple sets</h2>
      <p>
        Every set is printed to order with your names, initials or date, so it can&apos;t be resold.
        For that reason we <strong>can&apos;t accept change-of-mind returns</strong>. We do offer a{" "}
        <strong>7-Day Damage Replacement Guarantee</strong>: if your set arrives{" "}
        <strong>damaged, defective, or incorrectly printed on our part</strong>, we&apos;ll replace it
        free.
      </p>
      <ul>
        <li>Report it within <strong>7 days</strong> of delivery on WhatsApp with a clear photo.</li>
        <li>
          Please check your spelling and date format carefully before ordering — we print exactly
          what you provide, so errors in your own input aren&apos;t covered.
        </li>
      </ul>

      <h2>Sizes</h2>
      <p>
        You choose a size for each of the two tees before ordering, and the size chart sits right on
        the product page. Because the set is printed after you choose, we{" "}
        <strong>can&apos;t exchange a set for a different size</strong>. If you&apos;re unsure,
        message us on WhatsApp before you order — we&apos;d much rather help you pick than send you a
        set that doesn&apos;t fit.
      </p>

      <h2>Advance payment for printed sets</h2>
      <p>
        Every couple set requires a ₹{site.advanceAmount} advance payment at checkout, with the
        remaining balance payable via Cash on Delivery. This advance is fully refunded if we are
        unable to fulfil or deliver your order for any reason, and non-refundable if you refuse the
        delivery after your set has already been printed and dispatched, since a personalized set
        cannot be resold to another customer.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved refunds for prepaid amounts are issued to your original payment method, typically
        within 5–7 working days. For Cash-on-Delivery orders, no online payment is collected upfront
        aside from the advance described above.
      </p>

      <h2>How to reach us</h2>
      <p>
        WhatsApp is fastest, or email <a href={`mailto:${site.email}`}>{site.email}</a>. We reply
        within 2 hours, {site.supportHours}.
      </p>

      <p className="text-sm">
        <em>
          This policy is a starting template and should be reviewed by a professional before launch.
        </em>
      </p>
    </PageShell>
  );
}
