export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateInput {
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}