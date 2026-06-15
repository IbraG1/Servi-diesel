import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRecord } from '../entities/service-record.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { AuditService } from '../audit/audit.service';
import { AuthenticatedUser } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRecord)
    private readonly serviceRepo: Repository<ServiceRecord>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<ServiceRecord[]> {
    return this.serviceRepo.find({
      relations: ['vehicle', 'fotos'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number, user?: AuthenticatedUser): Promise<ServiceRecord> {
    const record = await this.serviceRepo.findOne({
      where: { id },
      relations: ['vehicle', 'fotos', 'fotos.uploadedBy'],
    });

    if (!record) {
      throw new NotFoundException(`Servicio #${id} no encontrado`);
    }

    if (user?.role === 'client') {
      if (
        user.vehicleId !== record.vehicleId &&
        user.patente !== record.vehicle?.patente
      ) {
        throw new ForbiddenException('Acceso denegado a este servicio');
      }
    }

    return record;
  }

  async create(
    dto: CreateServiceDto,
    req?: Request,
    user?: AuthenticatedUser,
  ): Promise<ServiceRecord> {
    const record = this.serviceRepo.create(dto);
    const saved = await this.serviceRepo.save(record);

    await this.auditService.log('CREATE_SERVICE', req, {
      userId: user?.sub,
      userRole: user?.role,
      entityType: 'service',
      entityId: String(saved.id),
      metadata: { vehicleId: saved.vehicleId },
    });

    return saved;
  }

  async update(
    id: number,
    dto: UpdateServiceDto,
    req?: Request,
    user?: AuthenticatedUser,
  ): Promise<ServiceRecord> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    const saved = await this.serviceRepo.save(record);

    await this.auditService.log('UPDATE_SERVICE', req, {
      userId: user?.sub,
      userRole: user?.role,
      entityType: 'service',
      entityId: String(saved.id),
    });

    return saved;
  }

  async remove(
    id: number,
    req?: Request,
    user?: AuthenticatedUser,
  ): Promise<void> {
    const record = await this.findOne(id);
    await this.serviceRepo.remove(record);

    await this.auditService.log('DELETE_SERVICE', req, {
      userId: user?.sub,
      userRole: user?.role,
      entityType: 'service',
      entityId: String(id),
    });
  }

  async getStats() {
    const total = await this.serviceRepo.count();
    const completados = await this.serviceRepo.count({
      where: { estado: 'completado' },
    });
    const enProceso = await this.serviceRepo.count({
      where: { estado: 'en_proceso' },
    });
    return { total, completados, enProceso };
  }
}
