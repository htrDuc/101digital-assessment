import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { ROUTES } from "@/lib/constants";
import { getSession, isSessionValid } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!isSessionValid(session)) {
    redirect(ROUTES.login);
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <AppHeader profile={session.profile} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  );
}
