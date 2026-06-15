import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/decorators/roles.decorator';
import { PhotoPhase } from '../entities/service-photo.entity';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('service/:serviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mechanic')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '10') || 10) * 1024 * 1024,
      },
    }),
  )
  upload(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('phase') phase: PhotoPhase,
    @Body('descripcion') descripcion: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    if (!phase || !['antes', 'despues'].includes(phase)) {
      throw new BadRequestException('phase debe ser "antes" o "despues"');
    }
    return this.photosService.upload(
      serviceId,
      file,
      phase,
      user,
      descripcion,
      req,
    );
  }

  @Get('service/:serviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mechanic', 'client')
  listByService(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.photosService.findByService(serviceId, user, req);
  }

  @Get(':id/file')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mechanic', 'client')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { stream, mimeType, originalName } =
      await this.photosService.getFileStream(id, user, req);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${originalName}"`,
      'Cache-Control': 'private, no-store',
    });
    stream.pipe(res);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mechanic')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    return this.photosService.remove(id, user, req);
  }
}
