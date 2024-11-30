import { jwtDecode } from 'jwt-decode';
import { User, UserRole, AuthResponse } from '../types/user';

const USERS_STORAGE_KEY = 'users';

// Simple hash function for demo purposes
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Simple token generation for demo purposes
const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

export async function signUp(email: string, password: string, name: string, role: UserRole): Promise<AuthResponse> {
  const users = getAllUsers();
  
  if (users.find(u => u.email === email)) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    name,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const token = generateToken(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  
  return { user: userWithoutPassword, token };
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const user = getAllUsers().find(u => u.email === email);
  const hashedPassword = await hashPassword(password);
  
  if (!user || user.password !== hashedPassword) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;
  
  return { user: userWithoutPassword, token };
}

export function getAllUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function updateUser(id: string, updates: Partial<User>): User {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    throw new Error('User not found');
  }

  const updatedUser = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  users[index] = updatedUser;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return updatedUser;
}

export function deleteUser(id: string): void {
  const users = getAllUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function verifyToken(token: string): { userId: string; email: string; role: UserRole } {
  try {
    const decoded = jwtDecode(token);
    if (typeof decoded === 'object' && decoded !== null) {
      const { exp, userId, email, role } = decoded as any;
      
      if (exp && exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }
      
      return { userId, email, role };
    }
    throw new Error('Invalid token');
  } catch (error) {
    throw new Error('Invalid token');
  }
}