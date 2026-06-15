export type ServiceStatus = 'completado' | 'en_proceso' | 'pendiente';
export type PrivacyLevel = 'public' | 'client' | 'staff';
export type PhotoPhase = 'antes' | 'despues';
export type UserRole = 'admin' | 'mechanic' | 'client';

export interface ServiceRecord {
  id: number;
  vehicleId: number;
  fecha: string;
  tipoServicio: string;
  descripcion: string;
  notasTecnico?: string;
  kilometraje?: number;
  estado: ServiceStatus;
  repuestos?: string[];
  tecnico?: string;
  costo?: number;
  fotoCount?: number;
  fotos?: ServicePhoto[];
  createdAt?: string;
  privacyLevel?: PrivacyLevel;
}

export interface Vehicle {
  id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  clienteNombre?: string;
  clienteTelefono?: string;
  color?: string;
  servicios: ServiceRecord[];
  createdAt?: string;
  privacyLevel?: PrivacyLevel;
}

export interface ServicePhoto {
  id: number;
  serviceRecordId: number;
  phase: PhotoPhase;
  originalName: string;
  mimeType: string;
  fileSize: number;
  descripcion?: string;
  uploadedBy?: string;
  createdAt: string;
  url: string;
}

export interface ServiceStats {
  total: number;
  completados: number;
  enProceso: number;
}

export interface AuthResponse {
  accessToken: string;
  role: UserRole;
  patente?: string;
  nombre?: string;
  expiresIn: string;
}

export interface ClientLoginPayload {
  patente: string;
  identificador: string;
  tipo: 'telefono' | 'nombre';
}

export interface StaffLoginPayload {
  username: string;
  password: string;
}

export interface PrivacyNotice {
  titular: string;
  marcoLegal: string[];
  finalidad: string;
  datosTratados: string[];
  datosPublicos: string;
  derechosTitular: string[];
  medidasSeguridad: string[];
  contacto: string;
  ultimaActualizacion: string;
}
