export interface User {
  id: number;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (googleCredential: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}