import { IsString, IsIn, MinLength } from 'class-validator';

export class ClientLoginDto {
  @IsString()
  @MinLength(4)
  patente!: string;

  @IsString()
  @MinLength(2)
  identificador!: string;

  @IsIn(['telefono', 'nombre'])
  tipo!: 'telefono' | 'nombre';
}

export class StaffLoginDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
