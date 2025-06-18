import axios from 'axios';
import { AuthResponse, User } from '../types/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class AuthService {
  private token: string | null = null;
  
  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
    if (this.token) {
      this.setAuthHeader(this.token);
    }
  }

  private setAuthHeader(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private removeAuthHeader(): void {
    delete axios.defaults.headers.common['Authorization'];
  }

  async loginWithGoogle(googleToken: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, {
        token: googleToken
      });

      const { access_token } = response.data;
      
      // Store token
      this.token = access_token;
      localStorage.setItem('auth_token', access_token);
      this.setAuthHeader(access_token);

      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await axios.post(`${API_BASE_URL}/auth/logout`);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state
      this.token = null;
      localStorage.removeItem('auth_token');
      this.removeAuthHeader();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/auth/me`);
      return response.data;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`);
      
      const { access_token } = response.data;
      
      // Update token
      this.token = access_token;
      localStorage.setItem('auth_token', access_token);
      this.setAuthHeader(access_token);

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout
      this.logout();
      throw error;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();