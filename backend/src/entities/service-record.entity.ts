import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ServicePhoto } from './service-photo.entity';

export type ServiceStatus = 'completado' | 'en_proceso' | 'pendiente';

@Entity('service_records')
export class ServiceRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  vehicleId!: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.servicios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle!: Vehicle;

  @Column({ type: 'date' })
  fecha!: string;

  @Column()
  tipoServicio!: string;

  @Column('text')
  descripcion!: string;

  @Column('text', { nullable: true })
  notasTecnico?: string;

  @Column({ nullable: true })
  kilometraje?: number;

  @Column({ default: 'completado' })
  estado!: ServiceStatus;

  @Column('simple-json', { nullable: true })
  repuestos?: string[];

  @Column({ nullable: true })
  tecnico?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo?: number;

  @OneToMany(() => ServicePhoto, (photo) => photo.serviceRecord)
  fotos!: ServicePhoto[];

  @CreateDateColumn()
  createdAt!: Date;
}
