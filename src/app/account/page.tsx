import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/account/actions";
import { HeartIcon, BagIcon, HomeIcon, ArrowRightIcon, SparkleIcon, LogoutIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "My account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account");
  const [addressCount, wishlistCount, orderCount] = await Promise.all([
    prisma.address.count({ where: { customerId: customer.id } }),
    prisma.wishlistItem.count({ where: { customerId: customer.id } }),
    prisma.order.count({ where: { customerId: customer.id } }),
  ]);
  const initials = customer.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div className="container-page min-h-[900px] max-w-lg py-6 sm:py-10">
      {/* Profile header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-sand text-lg font-bold text-white">{initials}</span>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-white">Hi, {customer.name.split(" ")[0]}</h1>
            <p className="truncate text-xs text-ink">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* Curated collection promo */}
      <Link href="/edit" className="mt-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4 transition hover:border-gold/50">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold"><SparkleIcon className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">The Printoll Edit</span>
          <span className="block text-xs text-ink">Best Sellers, Top Picks &amp; what&apos;s Trending</span>
        </span>
        <ArrowRightIcon className="h-4 w-4 shrink-0 text-gold" />
      </Link>

      <h2 className="mt-7 text-sm font-bold uppercase tracking-wide text-ink">My account</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <AccountTile href="/track" icon={<BagIcon className="h-5 w-5" />} title="My orders" subtitle={orderCount ? `${orderCount} order${orderCount > 1 ? "s" : ""} · track status` : "No orders yet"} />
        <AccountTile href="/account/addresses" icon={<HomeIcon className="h-5 w-5" />} title="Saved addresses" subtitle={addressCount ? `${addressCount} saved` : "None saved yet"} />
        <AccountTile href="/wishlist" icon={<HeartIcon className="h-5 w-5" />} title="Wishlist" subtitle={wishlistCount ? `${wishlistCount} saved` : "Nothing saved yet"} />
      </div>

      {/* Shop CTA */}
      <Link href="/category" className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-night-card p-4 transition hover:border-coral/40">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sand text-2xl">🎁</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-white">Make it yours</span>
          <span className="block text-xs text-ink">Unique prints for your story.</span>
        </span>
        <span className="btn-primary shrink-0 !px-4 !py-2 text-xs">Shop Now <ArrowRightIcon className="h-3.5 w-3.5" /></span>
      </Link>

      <form action={logoutAction} className="mt-7">
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full border border-coral/40 py-3 text-sm font-semibold text-coral transition hover:bg-coral/10">
          <LogoutIcon className="h-4 w-4" /> Sign out
        </button>
      </form>
    </div>
  );
}

function AccountTile({ href, icon, title, subtitle }: { href: string; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <Link href={href} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-night-card p-4 transition hover:border-coral/40">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">{icon}</span>
        <div className="min-w-0">
          <span className="block text-sm font-bold text-white">{title}</span>
          <span className="block truncate text-xs text-ink">{subtitle}</span>
        </div>
      </div>
      <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink" />
    </Link>
  );
}
