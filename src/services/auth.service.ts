import apiClient from '@/lib/axios';
import { authStorage } from '@/lib/auth';
import { AuthResponse, LoginCredentials, User } from '@/types/auth';

export const authService = {
  /**
   * Authenticate user with username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 120,
    });

    const data = response.data;
    const token = data.accessToken || data.token;

    if (token) {
      authStorage.setToken(token);
      authStorage.setUser(data);
    }

    return data;
  },

  /**
   * Fetch current authenticated user's profile from /auth/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    const user = response.data;
    authStorage.setUser(user);
    return user;
  },

  /**
   * Log out user and clean up local auth storage
   */
  logout(): void {
    authStorage.clearAuth();
  },

  /**
   * Check if token is present locally
   */
  isAuthenticated(): boolean {
    return authStorage.isAuthenticated();
  },

  /**
   * Get cached user profile
   */
  getStoredUser(): User | null {
    return authStorage.getUser();
  },
};

export default authService;
