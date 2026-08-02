import type { Metadata } from "next";
import PageShell from "@/components/site/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PageShell eyebrow="Policies" title="Privacy Policy" updated="26 July 2026">
      <p>
        AuraaMarts respects your privacy. This policy explains what we collect, why, and how we protect
        it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact & delivery details: name, phone number, email (optional), address and pincode.</li>
        <li>Personalization content: the name you enter or the photo you upload for your gift.</li>
        <li>Order details: what you bought and your order status.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To make, confirm, and deliver your order, and to provide support over WhatsApp/email.</li>
        <li>To send order updates and delivery information.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Online payments are processed securely by <strong>Razorpay</strong>. We do not see or store your
        full card, UPI, or bank details on our servers.
      </p>

      <h2>Sharing</h2>
      <p>
        We share only what&apos;s needed to fulfil your order — for example your delivery address with our
        courier and fulfilment partner. We do not sell your personal data.
      </p>

      <h2>Your uploaded photos</h2>
      <p>
        Photos you upload are used solely to produce your personalized item. Tell us on WhatsApp if
        you&apos;d like yours removed after your order is complete.
      </p>

      <h2>Data retention & your rights</h2>
      <p>
        We keep order information only as long as needed for fulfilment, support, and legal/accounting
        requirements. To access, correct, or delete your data, contact us.
      </p>

      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${site.email}`}>{site.email}</a> or message us on WhatsApp,
        {" "}{site.supportHours}. {site.addressLine}
      </p>

      <p className="text-sm">
        <em>This is a starting template and should be reviewed before launch.</em>
      </p>
    </PageShell>
  );
}
