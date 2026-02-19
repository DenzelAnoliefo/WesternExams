export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
