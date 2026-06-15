import type {
  Vehicle,
  ServiceRecord,
  ServiceStats,
  AuthResponse,
  ClientLoginPayload,
  StaffLoginPayload,
  ServicePhoto,
  PrivacyNotice,
} from './types';
import { getClientToken, getStaffToken } from './auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_BASE = API_URL.replace(/\/api$/, '');

type FetchOptions = RequestInit & {
  token?: string | null;
  useStaffToken?: boolean;
  useClientToken?: boolean;
};

async function fetchApi<T>(path: string, options?: FetchOptions): Promise<T> {
  const { token, useStaffToken, useClientToken, ...fetchOptions } = options || {};
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const authToken =
    token ??
    (useStaffToken ? getStaffToken() : useClientToken ? getClientToken() : null);

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Auth ───────────────────────────────────────────────

export async function loginClient(payload: ClientLoginPayload): Promise<AuthResponse> {
  return fetchApi<AuthResponse>('/auth/client/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginStaff(payload: StaffLoginPayload): Promise<AuthResponse> {
  return fetchApi<AuthResponse>('/auth/staff/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getPrivacyNotice(): Promise<PrivacyNotice> {
  return fetchApi<PrivacyNotice>('/auth/privacy-notice');
}

// ─── Vehicles ───────────────────────────────────────────

export async function searchByPatentePublic(patente: string): Promise<Vehicle> {
  return fetchApi<Vehicle>(`/vehicles/search?patente=${encodeURIComponent(patente)}`);
}

export async function getMyHistory(patente: string): Promise<Vehicle> {
  return fetchApi<Vehicle>(`/vehicles/my-history?patente=${encodeURIComponent(patente)}`, {
    useClientToken: true,
  });
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  return fetchApi<Vehicle[]>('/vehicles', { useStaffToken: true });
}

export async function createVehicle(
  data: Record<string, unknown>,
): Promise<Vehicle> {
  return fetchApi<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
    useStaffToken: true,
  });
}

// ─── Services ───────────────────────────────────────────

export async function getAllServices(): Promise<ServiceRecord[]> {
  return fetchApi<ServiceRecord[]>('/services', { useStaffToken: true });
}

export async function createService(
  data: Record<string, unknown>,
): Promise<ServiceRecord> {
  return fetchApi<ServiceRecord>('/services', {
    method: 'POST',
    body: JSON.stringify(data),
    useStaffToken: true,
  });
}

export async function deleteService(id: number): Promise<void> {
  await fetchApi<void>(`/services/${id}`, {
    method: 'DELETE',
    useStaffToken: true,
  });
}

export async function getStats(): Promise<ServiceStats> {
  return fetchApi<ServiceStats>('/services/stats', { useStaffToken: true });
}

// ─── Photos ─────────────────────────────────────────────

export async function getServicePhotos(serviceId: number, asClient = false): Promise<ServicePhoto[]> {
  return fetchApi<ServicePhoto[]>(`/photos/service/${serviceId}`, {
    useStaffToken: !asClient,
    useClientToken: asClient,
  });
}

export async function uploadServicePhoto(
  serviceId: number,
  file: File,
  phase: 'antes' | 'despues',
  descripcion?: string,
): Promise<ServicePhoto> {
  const form = new FormData();
  form.append('file', file);
  form.append('phase', phase);
  if (descripcion) form.append('descripcion', descripcion);

  return fetchApi<ServicePhoto>(`/photos/service/${serviceId}`, {
    method: 'POST',
    body: form,
    useStaffToken: true,
  });
}

export async function deletePhoto(id: number): Promise<void> {
  await fetchApi<void>(`/photos/${id}`, {
    method: 'DELETE',
    useStaffToken: true,
  });
}

export function getPhotoUrl(photo: ServicePhoto): string {
  return `${API_BASE}${photo.url}`;
}

export async function fetchPhotoBlob(
  photo: ServicePhoto,
  asClient = false,
): Promise<string> {
  const token = asClient ? getClientToken() : getStaffToken();
  const res = await fetch(getPhotoUrl(photo), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('No se pudo cargar la imagen');
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// ─── Utils ──────────────────────────────────────────────

export function formatPatente(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** @deprecated use searchByPatentePublic */
export const searchByPatente = searchByPatentePublic;
