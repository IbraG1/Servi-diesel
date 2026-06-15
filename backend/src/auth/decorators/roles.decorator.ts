import { SetMetadata } from '@nestjs/common';

export type UserRole = 'admin' | 'mechanic' | 'client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export interface JwtPayload {
  sub: string;
  role: UserRole;
  patente?: string;
  vehicleId?: number;
  nombre?: string;
}

export interface AuthenticatedUser extends JwtPayload {
  staffId?: number;
}
