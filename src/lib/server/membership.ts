import "server-only";

import { env } from "@/lib/env";
import { requestJson, UpstreamError } from "@/lib/server/http";
import type { Membership, UserProfileResponse } from "@/types/auth";

interface UsersMeResponse {
  data: UserProfileResponse;
}

export async function fetchUserProfile(
  accessToken: string,
): Promise<UserProfileResponse> {
  const response = await requestJson<UsersMeResponse>(
    `${env.API_BASE_URL}/membership-service/1.0.0/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}


export function resolveMembership(profile: UserProfileResponse): Membership {
  const membership = profile.memberships?.[0];
  if (!membership?.token) {
    throw new UpstreamError(403, "User has no organisation membership");
  }
  return membership;
}
