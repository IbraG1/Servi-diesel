import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'];
    const expectedKey = process.env.ADMIN_API_KEY || 'servidiesel-admin-2024';

    if (apiKey !== expectedKey) {
      throw new UnauthorizedException('Clave de administrador inválida');
    }

    return true;
  }
}
