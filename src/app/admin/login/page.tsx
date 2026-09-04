import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <div className="container-page flex min-h-[65vh] items-center justify-center py-10"><form action={loginAction} className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-sm"><p className="eyebrow">AuraaMarts</p><h1 className="mt-2 text-3xl">Admin login</h1><p className="mt-2 text-sm text-ink">Sign in to manage products, images, prices and orders.</p>{error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">Incorrect username or password.</p>}<label className="field-label mt-6">Username<input name="username" required autoComplete="username" className="field mt-1" /></label><label className="field-label mt-4">Password<input name="password" required type="password" autoComplete="current-password" className="field mt-1" /></label><button type="submit" className="btn-primary mt-6 w-full">Sign in</button></form></div>;
}
