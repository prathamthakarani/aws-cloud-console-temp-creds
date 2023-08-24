import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { logging } from './audit.log.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @OneToMany(() => logging, (logId) => logId.userId)
  userId: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('json', { nullable: true })
  policy: object;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  credsTs: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  consoleTs: Date;
}
