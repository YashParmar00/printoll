"use client";

import { useState } from "react";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Contact form that composes a WhatsApp message (our primary support channel).
 * No email backend yet (Resend is a later milestone), so this deep-links to
 * WhatsApp with the message prefilled; the mailto link is a fallback.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const waText = `Hi ${site.name}, I'm ${name || "a customer"}.${message ? " " + message : ""}`;

  return (
    <div>
      <div className="space-y-4">
        <div>
          <label htmlFor="c-name" className="field-label">Your name</label>
          <input id="c-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-msg" className="field-label">How can we help?</label>
          <textarea id="c-msg" rows={4} className="field" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your question or order number…" />
        </div>
      </div>
      <a
        href={whatsappLink(waText)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-4 w-full sm:w-auto"
      >
        <WhatsAppIcon className="h-5 w-5" /> Send on WhatsApp
      </a>
      <p className="mt-3 text-sm text-ink">
        Prefer email? Write to{" "}
        <a href={`mailto:${site.email}`} className="text-plum underline">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}
