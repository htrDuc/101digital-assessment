import "server-only";

import { exchangePasswordForTokens } from "@/lib/server/identity";
import { fetchUserProfile, resolveMembership } from "@/lib/server/membership";
import type { SessionData } from "@/lib/session";
import type { PublicProfile } from "@/types/auth";

/**
 * Full login flow, server-side:
 *   1. Exchange credentials for tokens (identity server).
 *   2. Fetch the user profile + resolve the org-token (membership-service).
 *   3. Build the session payload and the safe public profile.
 *
 * Returns the data to persist in the encrypted session; the route handler owns
 * writing the cookie. Throws {@link UpstreamError} on any upstream failure.
 */
export async function authenticate(
  username: string,
  password: string,
): Promise<SessionData> {
  const tokens = await exchangePasswordForTokens(username, password);
  const profile = await fetchUserProfile(tokens.access_token);
  const membership = resolveMembership(profile);

  const publicProfile: PublicProfile = {
    userId: profile.userId,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    organisationName: membership.organisationName,
  };

  return {
    accessToken: tokens.access_token,
    orgToken: membership.token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    profile: publicProfile,
  };
}
