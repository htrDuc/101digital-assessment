import axios, { AxiosInstance } from 'axios';

const authInstance: AxiosInstance = axios.create({
  baseURL: '/auth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

const apiInstance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const orgToken = localStorage.getItem('orgToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    if (orgToken) config.headers['org-token'] = orgToken;
    return config;
  },
  (error) => Promise.reject(error),
);

export { authInstance, apiInstance };
