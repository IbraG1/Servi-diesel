import {

  Controller,

  Get,

  Post,

  Put,

  Delete,

  Body,

  Param,

  Query,

  ParseIntPipe,

  UseGuards,

  Req,

} from '@nestjs/common';

import { Request } from 'express';

import { VehiclesService } from './vehicles.service';

import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { AuthenticatedUser } from '../auth/decorators/roles.decorator';



@Controller('vehicles')

export class VehiclesController {

  constructor(private readonly vehiclesService: VehiclesService) {}



  /** Público — historial técnico sin datos personales */

  @Get('search')

  searchByPatente(@Query('patente') patente: string, @Req() req: Request) {

    return this.vehiclesService.findByPatentePublic(patente, req);

  }



  /** Cliente autenticado — historial completo con datos personales */

  @Get('my-history')

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('client')

  myHistory(

    @Query('patente') patente: string,

    @CurrentUser() user: AuthenticatedUser,

    @Req() req: Request,

  ) {

    return this.vehiclesService.findByPatentePrivate(patente, user, req);

  }



  @Get()

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('admin', 'mechanic')

  findAll() {

    return this.vehiclesService.findAll();

  }



  @Get(':id')

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('admin', 'mechanic')

  findOne(@Param('id', ParseIntPipe) id: number) {

    return this.vehiclesService.findOne(id);

  }



  @Post()

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('admin', 'mechanic')

  create(

    @Body() dto: CreateVehicleDto,

    @CurrentUser() user: AuthenticatedUser,

    @Req() req: Request,

  ) {

    return this.vehiclesService.create(dto, req, user);

  }



  @Put(':id')

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('admin', 'mechanic')

  update(

    @Param('id', ParseIntPipe) id: number,

    @Body() dto: UpdateVehicleDto,

    @CurrentUser() user: AuthenticatedUser,

    @Req() req: Request,

  ) {

    return this.vehiclesService.update(id, dto, req, user);

  }



  @Delete(':id')

  @UseGuards(JwtAuthGuard, RolesGuard)

  @Roles('admin')

  remove(

    @Param('id', ParseIntPipe) id: number,

    @CurrentUser() user: AuthenticatedUser,

    @Req() req: Request,

  ) {

    return this.vehiclesService.remove(id, req, user);

  }

}


