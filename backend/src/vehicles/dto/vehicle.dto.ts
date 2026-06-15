import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
  MinLength,
} from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @MinLength(4)
  patente!: string;

  @IsString()
  marca!: string;

  @IsString()
  modelo!: string;

  @IsNumber()
  anio!: number;

  @IsString()
  clienteNombre!: string;

  @IsOptional()
  @IsString()
  clienteTelefono?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  consentimientoDatos?: boolean;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsNumber()
  anio?: number;

  @IsOptional()
  @IsString()
  clienteNombre?: string;

  @IsOptional()
  @IsString()
  clienteTelefono?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
