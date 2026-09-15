"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { setCustomerSession, clearCustomerSession, getCurrentCustomer } from "@/lib/customer-auth";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  // Only ever redirect back within the site — never to an attacker-supplied host.
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const qs = `next=${encodeURIComponent(next)}`;

  if (!(await rateLimit(await headers(), "account-register", 8, 300))) redirect(`/account/register?error=rate&${qs}`);
  if (!name) redirect(`/account/register?error=name&${qs}`);
  if (!EMAIL_RE.test(email) || email.length > 200) redirect(`/account/register?error=email&${qs}`);
  if (password.length < 8) redirect(`/account/register?error=password&${qs}`);

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) redirect(`/account/register?error=exists&${qs}`);

  const customer = await prisma.customer.create({ data: { name, email, passwordHash: hashPassword(password) } });
  await setCustomerSession(customer);
  redirect(next);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const qs = `next=${encodeURIComponent(next)}`;

  if (!(await rateLimit(await headers(), "account-login", 10, 300))) redirect(`/account/login?error=rate&${qs}`);

  const customer = email ? await prisma.customer.findUnique({ where: { email } }) : null;
  if (!customer || !verifyPassword(password, customer.passwordHash)) redirect(`/account/login?error=invalid&${qs}`);

  await setCustomerSession(customer);
  redirect(next);
}

export async function logoutAction() {
  await clearCustomerSession();
  redirect("/");
}

export async function addAddressAction(formData: FormData) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account/addresses");

  const label = String(formData.get("label") ?? "Home").trim().slice(0, 40) || "Home";
  const fullName = String(formData.get("fullName") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "").slice(0, 10);
  const line1 = String(formData.get("line1") ?? "").trim().slice(0, 240);
  const line2 = String(formData.get("line2") ?? "").trim().slice(0, 240);
  const city = String(formData.get("city") ?? "").trim().slice(0, 80);
  const state = String(formData.get("state") ?? "").trim().slice(0, 80);
  const pincode = String(formData.get("pincode") ?? "").replace(/\D/g, "").slice(0, 6);

  if (!fullName || phone.length !== 10 || !line1 || !city || !state || pincode.length !== 6) {
    redirect("/account/addresses?error=invalid");
  }

  const makeDefault = formData.get("isDefault") === "on" || (await prisma.address.count({ where: { customerId: customer.id } })) === 0;
  if (makeDefault) await prisma.address.updateMany({ where: { customerId: customer.id }, data: { isDefault: false } });
  await prisma.address.create({ data: { customerId: customer.id, label, fullName, phone, line1, line2, city, state, pincode, isDefault: makeDefault } });
  redirect("/account/addresses");
}

export async function deleteAddressAction(formData: FormData) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account/addresses");
  const id = String(formData.get("id") ?? "");
  await prisma.address.deleteMany({ where: { id, customerId: customer.id } });
  redirect("/account/addresses");
}

export async function setDefaultAddressAction(formData: FormData) {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login?next=/account/addresses");
  const id = String(formData.get("id") ?? "");
  const address = await prisma.address.findFirst({ where: { id, customerId: customer.id } });
  if (address) {
    await prisma.address.updateMany({ where: { customerId: customer.id }, data: { isDefault: false } });
    await prisma.address.update({ where: { id: address.id }, data: { isDefault: true } });
  }
  redirect("/account/addresses");
}
