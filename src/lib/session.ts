import "server-only";

import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { PublicProfile } from "@/types/auth";

/**
 * Data stored in the encrypted session cookie.
 */
export interface SessionData {
  accessToken: string;
  orgToken: string;
  refreshToken?: string;
  expiresAt: number;
  profile: PublicProfile;
}

export const sessionOptions: SessionOptions = {
  password: env.SESSION_PASSWORD,
  cookieName:
    process.env.NODE_ENV === "production"
      ? "__Host-si_session"
      : "si_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export function isSessionValid(session: Partial<SessionData>): boolean {
  return Boolean(
    session.accessToken && session.expiresAt && session.expiresAt > Date.now(),
  );
}
