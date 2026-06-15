import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type AuditAction =
  | 'LOGIN_CLIENT'
  | 'LOGIN_STAFF'
  | 'LOGIN_FAILED'
  | 'VIEW_PUBLIC_HISTORY'
  | 'VIEW_PRIVATE_HISTORY'
  | 'CREATE_VEHICLE'
  | 'UPDATE_VEHICLE'
  | 'DELETE_VEHICLE'
  | 'CREATE_SERVICE'
  | 'UPDATE_SERVICE'
  | 'DELETE_SERVICE'
  | 'UPLOAD_PHOTO'
  | 'DELETE_PHOTO'
  | 'VIEW_PHOTO'
  | 'EXPORT_DATA'
  | 'ACCESS_DENIED';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  action!: AuditAction;

  @Column({ nullable: true })
  entityType?: string;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  userRole?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column('simple-json', { nullable: true })
  metadata?: Record<string, unknown>;

  @Index()
  @CreateDateColumn()
  createdAt!: Date;
}
