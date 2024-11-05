import { apiInstance } from '@/lib/axios';

export async function getUserProfile() {
  const response = await apiInstance.get('/membership-service/1.0.0/users/me');
  return response.data;
}
