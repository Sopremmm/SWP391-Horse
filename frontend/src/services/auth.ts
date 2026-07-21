import { api } from './api.ts';

export type AppRole = 'ADMIN' | 'HORSE_OWNER' | 'JOCKEY' | 'REFEREE' | 'SPECTATOR';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: AppRole;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  token: string;
  type: string;
}

export interface MessageResponse {
  message: string;
}

function normalizeRoles(roles: string[] | undefined) {
  return (roles || []).map((role) => String(role || '').replace(/^ROLE_/i, '').toUpperCase());
}

export function persistSession(user: AuthUser) {
  const normalizedUser = {
    ...user,
    roles: normalizeRoles(user.roles),
  };

  window.localStorage.setItem('token', normalizedUser.token);
  window.localStorage.setItem('user', JSON.stringify(normalizedUser));
  window.localStorage.setItem('fullName', normalizedUser.fullName || normalizedUser.email);
  window.localStorage.setItem('username', normalizedUser.email);
  window.localStorage.setItem('role', normalizedUser.roles[0] || '');

  return normalizedUser;
}

export async function login(credentials: LoginRequest): Promise<AuthUser> {
  const response = await api.post<AuthUser>('/auth/signin', credentials);
  return persistSession(response);
}

export async function signup(userData: SignupRequest): Promise<MessageResponse> {
  return api.post<MessageResponse>('/auth/signup', userData);
}

export function logout() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('fullName');
  window.localStorage.removeItem('username');
  window.localStorage.removeItem('role');
}

export function getCurrentUser(): AuthUser | null {
  const raw = window.localStorage.getItem('user');

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return {
      ...parsed,
      roles: normalizeRoles(parsed.roles),
    };
  } catch {
    return null;
  }
}

export function updateCurrentUserProfile(patch: Partial<Pick<AuthUser, 'fullName' | 'email'>>) {
  const current = getCurrentUser();
  if (!current) return null;

  const nextUser = {
    ...current,
    ...patch,
    fullName: patch.fullName ?? current.fullName,
    email: patch.email ?? current.email,
  };

  window.localStorage.setItem('user', JSON.stringify(nextUser));
  window.localStorage.setItem('fullName', nextUser.fullName || nextUser.email);
  window.localStorage.setItem('username', nextUser.email);

  return nextUser;
}

export function getPrimaryRole(user = getCurrentUser()): AppRole | null {
  const role = user?.roles?.[0];
  if (!role) return null;
  return role as AppRole;
}

export function isAuthenticated() {
  return Boolean(window.localStorage.getItem('token'));
}

export function hasRole(roles: AppRole[], user = getCurrentUser()) {
  const currentRoles = normalizeRoles(user?.roles);
  return roles.some((role) => currentRoles.includes(role));
}

export function redirectPathForRole(role = getPrimaryRole()) {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'HORSE_OWNER':
      return '/HorseOwner/Home';
    case 'JOCKEY':
      return '/Jockey/Home';
    case 'REFEREE':
      return '/Referee/Home';
    case 'SPECTATOR':
      return '/Spectator/Home';
    default:
      return '/';
  }
}
