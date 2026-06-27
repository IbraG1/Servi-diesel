import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ServiceRecord } from './service-record.entity';
import { StaffUser } from './staff-user.entity';

export type PhotoPhase = 'antes' | 'despues';

@Entity('service_photos')
export class ServicePhoto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  serviceRecordId!: number;

  @ManyToOne(() => ServiceRecord, (record) => record.fotos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceRecordId' })
  serviceRecord!: ServiceRecord;

  @Column()
  phase!: PhotoPhase;

  @Column()
  fileName!: string;

  @Column()
  originalName!: string;

  @Column()
  mimeType!: string;

  @Column()
  fileSize!: number;

  @Column({ nullable: true })
  uploadedById?: number;

  @ManyToOne(() => StaffUser, { nullable: true })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy?: StaffUser;

  @Column({ nullable: true })
  descripcion?: string;

  // Hash SHA-256 calculado al momento de subir la foto.
  // Sirve como evidencia de integridad para resolver disputas
  // entre mecánico y cliente (Ley 19.628 + ISO 27001 A.8.24).
  @Column({ type: 'varchar', length: 64, nullable: true })
  hashSha256?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
