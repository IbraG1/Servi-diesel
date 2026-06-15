import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateServiceDto {
  @IsNumber()
  vehicleId!: number;

  @IsDateString()
  fecha!: string;

  @IsString()
  tipoServicio!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsString()
  notasTecnico?: string;

  @IsOptional()
  @IsNumber()
  kilometraje?: number;

  @IsOptional()
  @IsIn(['completado', 'en_proceso', 'pendiente'])
  estado?: 'completado' | 'en_proceso' | 'pendiente';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  repuestos?: string[];

  @IsOptional()
  @IsString()
  tecnico?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsNumber()
  vehicleId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  tipoServicio?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  notasTecnico?: string;

  @IsOptional()
  @IsNumber()
  kilometraje?: number;

  @IsOptional()
  @IsIn(['completado', 'en_proceso', 'pendiente'])
  estado?: 'completado' | 'en_proceso' | 'pendiente';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  repuestos?: string[];

  @IsOptional()
  @IsString()
  tecnico?: string;

  @IsOptional()
  @IsNumber()
  costo?: number;
}
