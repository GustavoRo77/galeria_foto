export interface RegisteredUser {
  name: string;
  email: string;
  password: string;
}

const USER_KEY = 'galeria-foto:user';
const SESSION_KEY = 'galeria-foto:session';

function getUser(): RegisteredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) as RegisteredUser : null;
}

export function register(user: RegisteredUser): { ok: boolean; message?: string } {
  const currentUser = getUser();
  if (currentUser?.email.toLowerCase() === user.email.toLowerCase()) {
    return { ok: false, message: 'Já existe uma conta com este e-mail.' };
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { ok: true };
}

export function login(email: string, password: string): boolean {
  const user = getUser();
  if (!user || user.email.toLowerCase() !== email.toLowerCase() || user.password !== password) return false;
  localStorage.setItem(SESSION_KEY, user.email);
  return true;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

export function currentUserName(): string {
  return getUser()?.name ?? 'Usuário';
}
