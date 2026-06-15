import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { Request } from 'express';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    action: AuditAction,
    req?: Request,
    details?: {
      entityType?: string;
      entityId?: string;
      userId?: string;
      userRole?: string;
      metadata?: Record<string, unknown>;
    },
  ): Promise<void> {
    const entry = this.auditRepo.create({
      action,
      entityType: details?.entityType,
      entityId: details?.entityId,
      userId: details?.userId,
      userRole: details?.userRole,
      ipAddress: req?.ip || req?.socket?.remoteAddress,
      userAgent: req?.headers['user-agent']?.slice(0, 256),
      metadata: details?.metadata,
    });
    await this.auditRepo.save(entry);
  }

  async getLogsForVehicle(patente: string, limit = 50): Promise<AuditLog[]> {
    return this.auditRepo
      .createQueryBuilder('log')
      .where("json_extract(log.metadata, '$.patente') = :patente", { patente })
      .orWhere('log.entityId = :patente', { patente })
      .orderBy('log.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getRecentLogs(limit = 100): Promise<AuditLog[]> {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
