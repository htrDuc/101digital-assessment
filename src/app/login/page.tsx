import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Sign in · SimpleInvoice" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : ROUTES.invoices;

  return (
    <main className="flex flex-1 items-center justify-center bg-muted/30 p-4">
      <LoginForm next={safeNext} />
    </main>
  );
}
