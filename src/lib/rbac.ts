// Role-Based Access Control (RBAC)
// Stub implementation for demonstration

export type Role = 
  | 'OrgAdmin'
  | 'Epidemiologist'
  | 'HospitalOps'
  | 'FieldOfficer'
  | 'Viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// Mock current user - in production, this would come from auth context
let currentUser: User | null = null;

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Mock user based on email
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'OrgAdmin' : 'Epidemiologist',
    };
    
    currentUser = user;
    localStorage.setItem('prithvi-user', JSON.stringify(user));
    return user;
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'Viewer',
    };
    
    currentUser = user;
    localStorage.setItem('prithvi-user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    currentUser = null;
    localStorage.removeItem('prithvi-user');
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem('prithvi-user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },
};

// Role permissions mapping
const rolePermissions: Record<Role, string[]> = {
  OrgAdmin: ['*'], // All permissions
  Epidemiologist: ['view_data', 'create_alerts', 'run_scenarios', 'view_evidence', 'view_kg'],
  HospitalOps: ['view_data', 'view_hospital', 'view_alerts'],
  FieldOfficer: ['view_field', 'submit_data', 'view_alerts'],
  Viewer: ['view_data', 'view_alerts'],
};

export const hasPermission = (permission: string): boolean => {
  const user = authService.getCurrentUser();
  if (!user) return false;
  
  const permissions = rolePermissions[user.role];
  return permissions.includes('*') || permissions.includes(permission);
};

export const canAccessRoute = (route: string): boolean => {
  const user = authService.getCurrentUser();
  if (!user) return false;

  // Map routes to required permissions
  const routePermissions: Record<string, string> = {
    '/console/admin': '*',
    '/console/field': 'view_field',
    '/console/kg': 'view_kg',
    '/console/scenario': 'run_scenarios',
  };

  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return true; // No specific permission required

  return hasPermission(requiredPermission);
};
