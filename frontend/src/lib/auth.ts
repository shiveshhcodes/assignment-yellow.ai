import { jwtDecode } from 'jwt-decode';
interface JWTPayload {
  id: string;
  email: string;
  exp: number;
}
const TOKEN_KEY = 'chatbot_jwt';
export const authService = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
  isTokenValid: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  getUser: (): JWTPayload | null => {
    const token = authService.getToken();
    if (!token || !authService.isTokenValid()) return null;
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  },
  logout: () => {
    authService.removeToken();
    window.location.href = '/login';
  }
};
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = authService.getToken();
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  const response = await fetch(url, config);
  if (response.status === 401) {
    authService.logout();
    throw new Error('Unauthorized');
  }
  return response;
};