import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/ui/SubmitButton";
import PasswordInput from "@/components/ui/PasswordInput";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { loginAction } from "@/app/account/actions";

export const metadata: Metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  invalid: "Incorrect email or password.",
  rate: "Too many attempts. Please wait a few minutes and try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  if (await getCurrentCustomer()) redirect("/account");
  const { error, next = "/account" } = await searchParams;
  return (
    <div className="container-page flex min-h-[65vh] items-center justify-center py-10">
      <form action={loginAction} className="w-full max-w-md rounded-2xl border border-line bg-night-card p-7 shadow-sm">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-2 text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-ink">Access your saved addresses and wishlist.</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errors[error] ?? "Something went wrong. Please try again."}</p>}
        <input type="hidden" name="next" value={next} />
        <label className="field-label mt-6">Email<input name="email" type="email" required maxLength={200} autoComplete="email" className="field mt-1" /></label>
        <label className="field-label mt-4">Password<PasswordInput name="password" required autoComplete="current-password" /></label>
        <SubmitButton className="btn-primary mt-6 w-full" pendingText="Signing in...">Sign in</SubmitButton>
        <p className="mt-4 text-center text-sm text-ink">
          New here? <Link href={`/account/register?next=${encodeURIComponent(next)}`} className="font-semibold text-coral hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
