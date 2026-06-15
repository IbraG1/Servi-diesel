import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getRecent(@Query('limit') limit?: string) {
    return this.auditService.getRecentLogs(limit ? parseInt(limit) : 100);
  }

  @Get('my-access')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  getMyAccessLog(@Req() req: Request & { user: { patente: string } }) {
    return this.auditService.getLogsForVehicle(req.user.patente);
  }
}
