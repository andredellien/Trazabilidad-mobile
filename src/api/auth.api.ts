import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  operator: {
    operator_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    role: {
      role_id: string;
      name: string;
    };
  };
}

export const authApi = {
  login: async (data: LoginRequest) => {
    console.log('Login attempt:', { username: data.username, url: apiClient.defaults.baseURL + '/auth/login' });
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      console.log('Login success:', response.status);
      return response.data;
    } catch (error: any) {
      console.log('Login error:', error.response?.status, error.response?.data);
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
