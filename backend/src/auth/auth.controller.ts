import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { ClientLoginDto, StaffLoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('client/login')
  clientLogin(@Body() dto: ClientLoginDto, @Req() req: Request) {
    return this.authService.loginClient(dto, req);
  }

  @Post('staff/login')
  staffLogin(@Body() dto: StaffLoginDto, @Req() req: Request) {
    return this.authService.loginStaff(dto, req);
  }

  @Get('privacy-notice')
  privacyNotice() {
    return this.authService.getPrivacyNotice();
  }
}
