import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import SubmitButton from "@/components/ui/SubmitButton";
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from "@/app/account/actions";

export const metadata: Metadata = { title: "Saved addresses" };
export const dynamic = "force-dynamic";

export default async function AddressesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account/addresses");
  const { error } = await searchParams;
  const addresses = await prisma.address.findMany({ where: { customerId: customer.id }, orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }] });

  return (
    <div className="container-page min-h-[900px] py-10">
      <Link href="/account" className="text-sm font-semibold text-coral">← My account</Link>
      <h1 className="mt-3 text-3xl sm:text-4xl">Saved addresses</h1>
      <p className="mt-1 text-sm text-ink">Add addresses here to fill them in faster at checkout.</p>

      {addresses.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-2xl border border-line bg-night-card p-5">
              <div className="flex items-center gap-2">
                <span className="tag bg-blush text-noir">{address.label}</span>
                {address.isDefault && <span className="tag bg-coral text-white">Default</span>}
              </div>
              <p className="mt-2 font-semibold text-noir">{address.fullName}</p>
              <p className="text-sm text-ink">{address.phone}</p>
              <p className="mt-1 text-sm text-ink">{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} – {address.pincode}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                {!address.isDefault && (
                  <form action={setDefaultAddressAction}><input type="hidden" name="id" value={address.id} /><button type="submit" className="text-coral hover:underline">Set as default</button></form>
                )}
                <form action={deleteAddressAction}><input type="hidden" name="id" value={address.id} /><button type="submit" className="text-ink hover:underline">Remove</button></form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={addAddressAction} className="mt-8 max-w-xl rounded-2xl border border-line bg-night-card p-6">
        <h2 className="text-lg font-semibold text-noir">Add a new address</h2>
        {error === "invalid" && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">Please fill every field — phone needs 10 digits and pincode needs 6.</p>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="field-label">Label<input name="label" defaultValue="Home" maxLength={40} className="field mt-1" placeholder="Home, Work…" /></label>
          <label className="field-label">Full name<input name="fullName" required maxLength={120} autoComplete="name" className="field mt-1" /></label>
          <label className="field-label">Mobile number<input name="phone" required inputMode="numeric" maxLength={10} autoComplete="tel" className="field mt-1" placeholder="10-digit number" /></label>
          <label className="field-label">Pincode<input name="pincode" required inputMode="numeric" maxLength={6} autoComplete="postal-code" className="field mt-1" /></label>
          <label className="field-label sm:col-span-2">Address line 1<input name="line1" required maxLength={240} autoComplete="address-line1" className="field mt-1" placeholder="House / flat, street, area" /></label>
          <label className="field-label sm:col-span-2">Address line 2 <span className="font-normal text-ink">(optional)</span><input name="line2" maxLength={240} autoComplete="address-line2" className="field mt-1" placeholder="Landmark" /></label>
          <label className="field-label">City<input name="city" required maxLength={80} autoComplete="address-level2" className="field mt-1" /></label>
          <label className="field-label">State<input name="state" required maxLength={80} autoComplete="address-level1" className="field mt-1" /></label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-noir"><input type="checkbox" name="isDefault" /> Set as default address</label>
        <SubmitButton className="btn-primary mt-5" pendingText="Saving...">Save address</SubmitButton>
      </form>
    </div>
  );
}
