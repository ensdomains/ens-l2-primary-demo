export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface UserState {
  profile: User | null;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
} 