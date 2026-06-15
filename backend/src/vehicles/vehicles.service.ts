import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Vehicle } from '../entities/vehicle.entity';

import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

import { normalizePatente } from '../common/normalize.util';

import {

  toPublicVehicle,

  toClientVehicle,

} from '../common/privacy.mapper';

import { AuditService } from '../audit/audit.service';

import { AuthenticatedUser } from '../auth/decorators/roles.decorator';

import { Request } from 'express';



@Injectable()

export class VehiclesService {

  constructor(

    @InjectRepository(Vehicle)

    private readonly vehicleRepo: Repository<Vehicle>,

    private readonly auditService: AuditService,

  ) {}



  async findAll(): Promise<Vehicle[]> {

    return this.vehicleRepo.find({

      relations: ['servicios', 'servicios.fotos'],

      order: { createdAt: 'DESC' },

    });

  }



  /** Historial público — sin datos personales (Ley 19.628) */

  async findByPatentePublic(patente: string, req?: Request) {

    const vehicle = await this.loadVehicle(patente);



    await this.auditService.log('VIEW_PUBLIC_HISTORY', req, {

      entityType: 'vehicle',

      entityId: vehicle.patente,

      metadata: { patente: vehicle.patente },

    });



    return toPublicVehicle(vehicle);

  }



  /** Historial privado — requiere autenticación de cliente */

  async findByPatentePrivate(

    patente: string,

    user: AuthenticatedUser,

    req?: Request,

  ) {

    const vehicle = await this.loadVehicle(patente);



    if (

      user.role !== 'client' ||

      (user.patente !== vehicle.patente && user.vehicleId !== vehicle.id)

    ) {

      throw new ForbiddenException(

        'Solo puede acceder al historial de su propio vehículo',

      );

    }



    await this.auditService.log('VIEW_PRIVATE_HISTORY', req, {

      userId: user.sub,

      userRole: user.role,

      entityType: 'vehicle',

      entityId: vehicle.patente,

      metadata: { patente: vehicle.patente },

    });



    return toClientVehicle(vehicle);

  }



  async findOne(id: number): Promise<Vehicle> {

    const vehicle = await this.vehicleRepo.findOne({

      where: { id },

      relations: ['servicios', 'servicios.fotos'],

    });



    if (!vehicle) {

      throw new NotFoundException(`Vehículo #${id} no encontrado`);

    }



    return vehicle;

  }



  async create(dto: CreateVehicleDto, req?: Request, user?: AuthenticatedUser): Promise<Vehicle> {

    const patente = normalizePatente(dto.patente);

    const vehicle = this.vehicleRepo.create({

      ...dto,

      patente,

      consentimientoDatos: dto.consentimientoDatos ?? true,

      consentimientoFecha: dto.consentimientoDatos !== false ? new Date() : undefined,

    });

    const saved = await this.vehicleRepo.save(vehicle);



    await this.auditService.log('CREATE_VEHICLE', req, {

      userId: user?.sub,

      userRole: user?.role,

      entityType: 'vehicle',

      entityId: saved.patente,

    });



    return saved;

  }



  async update(

    id: number,

    dto: UpdateVehicleDto,

    req?: Request,

    user?: AuthenticatedUser,

  ): Promise<Vehicle> {

    const vehicle = await this.findOne(id);

    if (dto.patente) {

      dto.patente = normalizePatente(dto.patente);

    }

    Object.assign(vehicle, dto);

    const saved = await this.vehicleRepo.save(vehicle);



    await this.auditService.log('UPDATE_VEHICLE', req, {

      userId: user?.sub,

      userRole: user?.role,

      entityType: 'vehicle',

      entityId: saved.patente,

    });



    return saved;

  }



  async remove(id: number, req?: Request, user?: AuthenticatedUser): Promise<void> {

    const vehicle = await this.findOne(id);

    await this.vehicleRepo.remove(vehicle);



    await this.auditService.log('DELETE_VEHICLE', req, {

      userId: user?.sub,

      userRole: user?.role,

      entityType: 'vehicle',

      entityId: vehicle.patente,

    });

  }



  private async loadVehicle(patente: string): Promise<Vehicle> {

    const normalized = normalizePatente(patente);

    const vehicle = await this.vehicleRepo.findOne({

      where: { patente: normalized },

      relations: ['servicios', 'servicios.fotos'],

    });



    if (!vehicle) {

      throw new NotFoundException(

        `No se encontró historial para la patente ${patente}`,

      );

    }



    vehicle.servicios.sort(

      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),

    );



    return vehicle;

  }

}


