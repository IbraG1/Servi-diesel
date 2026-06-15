import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StaffUser } from '../entities/staff-user.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { ClientLoginDto, StaffLoginDto } from './dto/auth.dto';
import {
  normalizePhone,
  normalizeName,
  normalizePatente,
} from '../common/normalize.util';
import { AuditService } from '../audit/audit.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StaffUser)
    private readonly staffRepo: Repository<StaffUser>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async loginClient(dto: ClientLoginDto, req?: Request) {
    const patente = normalizePatente(dto.patente);
    const vehicle = await this.vehicleRepo.findOne({ where: { patente } });

    if (!vehicle) {
      await this.auditService.log('LOGIN_FAILED', req, {
        metadata: { patente, tipo: dto.tipo, reason: 'vehicle_not_found' },
      });
      throw new NotFoundException('Vehículo no encontrado');
    }

    if (!vehicle.consentimientoDatos) {
      throw new UnauthorizedException(
        'El titular no ha otorgado consentimiento para acceso a datos personales (Ley 19.628)',
      );
    }

    const verified = this.verifyClientIdentity(vehicle, dto);
    if (!verified) {
      await this.auditService.log('LOGIN_FAILED', req, {
        metadata: { patente, tipo: dto.tipo, reason: 'identity_mismatch' },
      });
      throw new UnauthorizedException(
        'Los datos ingresados no coinciden con nuestros registros',
      );
    }

    const payload = {
      sub: `client-${vehicle.id}`,
      role: 'client' as const,
      patente: vehicle.patente,
      vehicleId: vehicle.id,
      nombre: vehicle.clienteNombre,
    };

    await this.auditService.log('LOGIN_CLIENT', req, {
      userId: payload.sub,
      userRole: 'client',
      entityType: 'vehicle',
      entityId: patente,
      metadata: { patente, tipo: dto.tipo },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      role: 'client',
      patente: vehicle.patente,
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    };
  }

  async loginStaff(dto: StaffLoginDto, req?: Request) {
    const staff = await this.staffRepo.findOne({
      where: { username: dto.username, active: true },
    });

    if (!staff || !(await bcrypt.compare(dto.password, staff.passwordHash))) {
      await this.auditService.log('LOGIN_FAILED', req, {
        metadata: { username: dto.username, reason: 'invalid_credentials' },
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: String(staff.id),
      role: staff.role,
      nombre: staff.nombre,
    };

    await this.auditService.log('LOGIN_STAFF', req, {
      userId: payload.sub,
      userRole: staff.role,
      metadata: { username: staff.username },
    });

    return {
      accessToken: this.jwtService.sign(payload),
      role: staff.role,
      nombre: staff.nombre,
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    };
  }

  getPrivacyNotice() {
    return {
      titular: 'ServiDiesel SpA',
      marcoLegal: [
        'Ley N° 19.628 — Protección de la Vida Privada',
        'Ley N° 21.459 — Protección de Activos Digitales',
        'Ley N° 20.663 — Delitos Informáticos y Ciberseguridad',
        'ISO/IEC 27001 — Gestión de Seguridad de la Información',
        'NIST Cybersecurity Framework',
      ],
      finalidad:
        'Gestión del historial de servicios automotrices, comunicación con clientes y cumplimiento de obligaciones legales.',
      datosTratados: [
        'Nombre del titular',
        'Teléfono de contacto',
        'Datos del vehículo (patente, marca, modelo)',
        'Historial de servicios y fotografías del vehículo',
      ],
      datosPublicos:
        'El historial técnico del vehículo (tipo de servicio, fecha, descripción general) es de acceso público mediante patente. Los datos personales del titular están protegidos y requieren autenticación.',
      derechosTitular: [
        'Acceso a sus datos personales',
        'Rectificación de datos inexactos',
        'Cancelación cuando proceda (Art. 16 Ley 19.628)',
        'Oposición al tratamiento',
        'Consultar registro de accesos a sus datos',
      ],
      medidasSeguridad: [
        'Autenticación JWT con expiración',
        'Control de acceso basado en roles (RBAC)',
        'Registro de auditoría de accesos',
        'Minimización de datos en vistas públicas',
        'Almacenamiento seguro de credenciales (bcrypt)',
        'Fotografías accesibles solo a personal autorizado y titular autenticado',
      ],
      contacto: 'privacidad@servidiesel.cl',
      ultimaActualizacion: '2025-06-12',
    };
  }

  private verifyClientIdentity(
    vehicle: Vehicle,
    dto: ClientLoginDto,
  ): boolean {
    if (dto.tipo === 'telefono') {
      if (!vehicle.clienteTelefono) return false;
      return (
        normalizePhone(vehicle.clienteTelefono) ===
        normalizePhone(dto.identificador)
      );
    }

    return (
      normalizeName(vehicle.clienteNombre) === normalizeName(dto.identificador)
    );
  }
}
