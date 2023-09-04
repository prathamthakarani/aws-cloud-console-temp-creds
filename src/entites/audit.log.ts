import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREDS_CREATED = 'creds_created',
  CREDS_DELETED = 'creds_deleted',
  CONSOLE_CREDS_CREATED = 'console_creds_created',
  CONSOLE_CREDS_DELETED = 'console_creds_deleted',
  IAM_USER_CREATED = 'iam_user_created',
}

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.auditLogs)
  user: User;
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column()
  actionPerformedBy: string;
}
