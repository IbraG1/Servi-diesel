import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ServiceRecord } from './service-record.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  patente!: string;

  @Column()
  marca!: string;

  @Column()
  modelo!: string;

  @Column()
  anio!: number;

  @Column()
  clienteNombre!: string;

  @Column({ nullable: true })
  clienteTelefono?: string;

  @Column({ nullable: true })
  color?: string;

  /** Ley 19.628 — consentimiento para tratamiento de datos personales */
  @Column({ default: true })
  consentimientoDatos!: boolean;

  @Column({ type: 'datetime', nullable: true })
  consentimientoFecha?: Date;

  @OneToMany(() => ServiceRecord, (record) => record.vehicle)
  servicios!: ServiceRecord[];

  @CreateDateColumn()
  createdAt!: Date;
}
