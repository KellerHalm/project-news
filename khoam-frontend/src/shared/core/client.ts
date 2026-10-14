import axios from 'axios';

import { getAccessToken } from '../services';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'token';

const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
  }

  return config;
});

export default apiClient;
