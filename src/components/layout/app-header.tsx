"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { logout } from "@/lib/client/api";
import type { PublicProfile } from "@/types/auth";

export function AppHeader({ profile }: { profile: PublicProfile }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace(ROUTES.login);
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={ROUTES.invoices} className="font-semibold tracking-tight">
          SimpleInvoice
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">{profile.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {profile.organisationName}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
