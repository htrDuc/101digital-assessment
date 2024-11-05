import { authInstance } from '@/lib/axios';

export async function fetchAppAccessToken(username: string, password: string) {
  const params = new URLSearchParams();
  params.append('client_id', 'v3V87ZIqjdUMnQlf4yv7eW3k1aAa');
  params.append('client_secret', 'DXhnQ6TcE_wisvn6mWqAUqJrtpQa');
  params.append('grant_type', 'password');
  params.append('scope', 'openid');
  params.append('username', username);
  params.append('password', password);

  const response = await authInstance.post('/oauth2/token', params);
  return response.data;
}
