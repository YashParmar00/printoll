import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordInput from "@/components/ui/PasswordInput";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { registerAction } from "@/app/account/actions";

export const metadata: Metadata = { title: "Create account" };

const errors: Record<string, string> = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  password: "Password must be at least 8 characters.",
  exists: "An account with this email already exists. Try signing in instead.",
  rate: "Too many attempts. Please wait a few minutes and try again.",
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  if (await getCurrentCustomer()) redirect("/account");
  const { error, next = "/account" } = await searchParams;
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-10">
      <form action={registerAction} className="w-full max-w-md rounded-2xl border border-line bg-night-card p-7 shadow-sm">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-2 text-3xl">Create an account</h1>
        <p className="mt-2 text-sm text-ink">Save addresses and build a wishlist. Guest checkout is always available too — an account is never required to order.</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errors[error] ?? "Something went wrong. Please try again."}</p>}
        <input type="hidden" name="next" value={next} />
        <label className="field-label mt-6">Full name<input name="name" required maxLength={120} autoComplete="name" className="field mt-1" /></label>
        <label className="field-label mt-4">Email<input name="email" type="email" required maxLength={200} autoComplete="email" className="field mt-1" /></label>
        <label className="field-label mt-4">Password<PasswordInput name="password" required minLength={8} autoComplete="new-password" /></label>
        <p className="mt-1 text-xs text-ink">At least 8 characters.</p>
        <SubmitButton className="btn-primary mt-6 w-full" pendingText="Creating account...">Create account</SubmitButton>
        <p className="mt-4 text-center text-sm text-ink">
          Already have an account? <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-semibold text-coral hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
