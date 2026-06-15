const CLIENT_TOKEN_KEY = 'servidiesel_client_token';
const STAFF_TOKEN_KEY = 'servidiesel_staff_token';
const STAFF_INFO_KEY = 'servidiesel_staff_info';

export function getClientToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(CLIENT_TOKEN_KEY);
}

export function setClientToken(token: string) {
  sessionStorage.setItem(CLIENT_TOKEN_KEY, token);
}

export function clearClientToken() {
  sessionStorage.removeItem(CLIENT_TOKEN_KEY);
}

export function getStaffToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STAFF_TOKEN_KEY);
}

export function setStaffToken(token: string) {
  sessionStorage.setItem(STAFF_TOKEN_KEY, token);
}

export function setStaffInfo(role: string, nombre: string) {
  sessionStorage.setItem(STAFF_INFO_KEY, JSON.stringify({ role, nombre }));
}

export function getStaffInfo(): { role: string; nombre: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STAFF_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearStaffToken() {
  sessionStorage.removeItem(STAFF_TOKEN_KEY);
  sessionStorage.removeItem(STAFF_INFO_KEY);
}

export function clearAllTokens() {
  clearClientToken();
  clearStaffToken();
}
