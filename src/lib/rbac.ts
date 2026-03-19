// Role-Based Access Control (RBAC)
// Integrated with backend auth (cookies + /auth/* endpoints)

import { api } from '@/lib/api-client';

export type Role =
  | 'OrgAdmin'
  | 'Epidemiologist'
  | 'HospitalOps'
  | 'FieldOfficer'
  | 'Viewer';

export interface User {
  id: number | string;
  email: string;
  name?: string;
  role: Role;
}

let currentUser: User | null = null;
const LS_KEY = 'prithvi-user';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    const res = await apiFetch<{ user: User }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    currentUser = res.user;
    localStorage.setItem(LS_KEY, JSON.stringify(currentUser));
    return currentUser;
  },

  signup: async (email: string, password: string, name?: string): Promise<User> => {
    const res = await apiFetch<{ user: User }>(`/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    currentUser = res.user;
    localStorage.setItem(LS_KEY, JSON.stringify(currentUser));
    return currentUser;
  },

  refresh: async (): Promise<boolean> => {
    try {
      await apiFetch(`/auth/refresh`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiFetch(`/auth/logout`, { method: 'POST' });
    } finally {
      currentUser = null;
      localStorage.removeItem(LS_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem(LS_KEY);
    if (stored) currentUser = JSON.parse(stored);
    return currentUser;
  },

  fetchProfile: async (): Promise<User> => {
    const user = await apiFetch<User>(`/me`, { method: 'GET' });
    currentUser = user;
    localStorage.setItem(LS_KEY, JSON.stringify(user));
    return user;
  },

  isAuthenticated: (): boolean => !!authService.getCurrentUser(),
};

// Expose apiFetch from the same module for convenience
async function apiFetch<T>(path: string, init?: RequestInit & { params?: Record<string,string> }) {
  return api.getRisk<T>(path, init as any);
}

// Minimal permission helpers (client-side hints only)
const rolePermissions: Record<Role, string[]> = {
  OrgAdmin: ['*'],
  Epidemiologist: ['view_data', 'create_alerts', 'run_scenarios', 'view_evidence', 'view_kg'],
  HospitalOps: ['view_data', 'view_hospital', 'view_alerts'],
  FieldOfficer: ['view_field', 'submit_data', 'view_alerts'],
  Viewer: ['view_data', 'view_alerts'],
};

export const hasPermission = (permission: string): boolean => {
  const user = authService.getCurrentUser();
  if (!user) return false;
  const perms = rolePermissions[user.role];
  return perms.includes('*') || perms.includes(permission);
};

export const canAccessRoute = (route: string): boolean => {
  const user = authService.getCurrentUser();
  if (!user) return false;
  const routePermissions: Record<string, string> = {
    '/console/admin': '*',
    '/console/field': 'view_field',
    '/console/kg': 'view_kg',
    '/console/scenario': 'run_scenarios',
  };
  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return true;
  return hasPermission(requiredPermission);
};
