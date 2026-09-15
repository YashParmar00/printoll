import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/account/actions";
import { HeartIcon, TruckIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account");
  const [addressCount, wishlistCount] = await Promise.all([
    prisma.address.count({ where: { customerId: customer.id } }),
    prisma.wishlistItem.count({ where: { customerId: customer.id } }),
  ]);

  return (
    <div className="container-page min-h-[900px] py-10">
      <p className="eyebrow">Your account</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Hi, {customer.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-ink">{customer.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/account/addresses" className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-night-card p-5 transition hover:border-coral/40">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral"><TruckIcon className="h-5 w-5" /></span>
            <div>
              <span className="block font-semibold text-noir">Saved addresses</span>
              <span className="block text-sm text-ink">{addressCount ? `${addressCount} saved` : "None saved yet"}</span>
            </div>
          </div>
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink" />
        </Link>

        <Link href="/wishlist" className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-night-card p-5 transition hover:border-coral/40">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral"><HeartIcon className="h-5 w-5" /></span>
            <div>
              <span className="block font-semibold text-noir">Wishlist</span>
              <span className="block text-sm text-ink">{wishlistCount ? `${wishlistCount} saved` : "Nothing saved yet"}</span>
            </div>
          </div>
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink" />
        </Link>
      </div>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="btn-secondary">Sign out</button>
      </form>
    </div>
  );
}
