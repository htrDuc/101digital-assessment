export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  scope?: string;
  expires_in: number;
}

export interface Membership {
  membershipId: string;
  organisationId: string;
  organisationName: string;
  roleName?: string;
  token: string;
}

export interface UserProfileResponse {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  memberships: Membership[];
}

export interface PublicProfile {
  userId: string;
  fullName: string;
  organisationName: string;
}
