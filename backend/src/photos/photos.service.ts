import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, mkdirSync, unlinkSync, createReadStream } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ServicePhoto, PhotoPhase } from '../entities/service-photo.entity';
import { ServiceRecord } from '../entities/service-record.entity';
import { AuditService } from '../audit/audit.service';
import { toPhotoMeta } from '../common/privacy.mapper';
import { AuthenticatedUser } from '../auth/decorators/roles.decorator';
import { Request } from 'express';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

@Injectable()
export class PhotosService {
  private uploadDir: string;

  constructor(
    @InjectRepository(ServicePhoto)
    private readonly photoRepo: Repository<ServicePhoto>,
    @InjectRepository(ServiceRecord)
    private readonly serviceRepo: Repository<ServiceRecord>,
    private readonly auditService: AuditService,
  ) {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    serviceId: number,
    file: Express.Multer.File,
    phase: PhotoPhase,
    user: AuthenticatedUser,
    descripcion?: string,
    req?: Request,
  ) {
    if (!file) throw new BadRequestException('Archivo requerido');
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP');
    }

    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      throw new BadRequestException('Extensión de archivo no permitida');
    }

    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['vehicle'],
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    const fileName = `${uuidv4()}${ext}`;
    const serviceDir = join(this.uploadDir, 'services', String(serviceId));
    if (!existsSync(serviceDir)) mkdirSync(serviceDir, { recursive: true });

    const filePath = join(serviceDir, fileName);
    const { writeFileSync } = await import('fs');
    writeFileSync(filePath, file.buffer);

    const photo = this.photoRepo.create({
      serviceRecordId: serviceId,
      phase,
      fileName: join('services', String(serviceId), fileName),
      originalName: file.originalname.slice(0, 255),
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedById: user.staffId,
      descripcion,
    });

    const saved = await this.photoRepo.save(photo);

    await this.auditService.log('UPLOAD_PHOTO', req, {
      userId: user.sub,
      userRole: user.role,
      entityType: 'service_photo',
      entityId: String(saved.id),
      metadata: {
        serviceId,
        phase,
        patente: service.vehicle?.patente,
      },
    });

    return toPhotoMeta(saved);
  }

  async findByService(
    serviceId: number,
    user: AuthenticatedUser,
    req?: Request,
  ) {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['vehicle', 'fotos', 'fotos.uploadedBy'],
    });
    if (!service) throw new NotFoundException('Servicio no encontrado');

    this.assertPhotoAccess(service, user);

    await this.auditService.log('VIEW_PHOTO', req, {
      userId: user.sub,
      userRole: user.role,
      entityType: 'service',
      entityId: String(serviceId),
      metadata: { patente: service.vehicle?.patente, action: 'list' },
    });

    return (service.fotos || []).map(toPhotoMeta);
  }

  async getFileStream(photoId: number, user: AuthenticatedUser, req?: Request) {
    const photo = await this.photoRepo.findOne({
      where: { id: photoId },
      relations: ['serviceRecord', 'serviceRecord.vehicle'],
    });
    if (!photo) throw new NotFoundException('Foto no encontrada');

    this.assertPhotoAccess(photo.serviceRecord, user, photo.serviceRecord.vehicle);

    const filePath = join(this.uploadDir, photo.fileName);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado en almacenamiento');
    }

    await this.auditService.log('VIEW_PHOTO', req, {
      userId: user.sub,
      userRole: user.role,
      entityType: 'service_photo',
      entityId: String(photoId),
      metadata: {
        patente: photo.serviceRecord.vehicle?.patente,
        action: 'download',
      },
    });

    return {
      stream: createReadStream(filePath),
      mimeType: photo.mimeType,
      originalName: photo.originalName,
    };
  }

  async remove(photoId: number, user: AuthenticatedUser, req?: Request) {
    const photo = await this.photoRepo.findOne({
      where: { id: photoId },
      relations: ['serviceRecord', 'serviceRecord.vehicle'],
    });
    if (!photo) throw new NotFoundException('Foto no encontrada');

    const filePath = join(this.uploadDir, photo.fileName);
    if (existsSync(filePath)) unlinkSync(filePath);

    await this.photoRepo.remove(photo);

    await this.auditService.log('DELETE_PHOTO', req, {
      userId: user.sub,
      userRole: user.role,
      entityType: 'service_photo',
      entityId: String(photoId),
      metadata: { patente: photo.serviceRecord.vehicle?.patente },
    });
  }

  private assertPhotoAccess(
    service: ServiceRecord & { vehicle?: { patente: string; id: number } },
    user: AuthenticatedUser,
    vehicle?: { patente: string; id: number },
  ) {
    const v = vehicle || service.vehicle;
    if (user.role === 'admin' || user.role === 'mechanic') return;

    if (user.role === 'client') {
      if (user.vehicleId === service.vehicleId || user.patente === v?.patente) {
        return;
      }
    }

    throw new ForbiddenException(
      'Acceso denegado a fotografías del vehículo (Ley 19.628)',
    );
  }
}
