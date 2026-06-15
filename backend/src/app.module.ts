import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { VehiclesModule } from './vehicles/vehicles.module';

import { ServicesModule } from './services/services.module';

import { AuthModule } from './auth/auth.module';

import { AuditModule } from './audit/audit.module';

import { PhotosModule } from './photos/photos.module';

import { Vehicle } from './entities/vehicle.entity';

import { ServiceRecord } from './entities/service-record.entity';

import { StaffUser } from './entities/staff-user.entity';

import { ServicePhoto } from './entities/service-photo.entity';

import { AuditLog } from './entities/audit-log.entity';



@Module({

  imports: [

    TypeOrmModule.forRoot({

      type: 'sqlite',

      database: process.env.DATABASE_PATH || './servidiesel.db',

      entities: [Vehicle, ServiceRecord, StaffUser, ServicePhoto, AuditLog],

      synchronize: true,

    }),

    AuthModule,

    AuditModule,

    VehiclesModule,

    ServicesModule,

    PhotosModule,

  ],

})

export class AppModule {}

