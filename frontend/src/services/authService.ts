
import api from '../lib/api';
import { UserRole } from '../App';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  async getMe(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
