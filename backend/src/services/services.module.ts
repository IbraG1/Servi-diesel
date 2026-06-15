import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRecord } from '../entities/service-record.entity';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRecord])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
