import "server-only";

import { env } from "@/lib/env";
import { requestJson } from "@/lib/server/http";
import type { OAuthTokenResponse } from "@/types/auth";

export async function exchangePasswordForTokens(
  username: string,
  password: string,
): Promise<OAuthTokenResponse> {
  const body = new URLSearchParams({
    client_id: env.OAUTH_CLIENT_ID,
    client_secret: env.OAUTH_CLIENT_SECRET,
    grant_type: "password",
    scope: env.OAUTH_SCOPE,
    username,
    password,
  });

  return requestJson<OAuthTokenResponse>(
    `${env.AUTH_BASE_URL}/t/101digital.core/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );
}
