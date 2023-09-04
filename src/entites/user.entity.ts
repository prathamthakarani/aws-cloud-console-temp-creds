import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
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

  @Column({ nullable: true })
  arn: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  credsTs: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  consoleTs: Date;

  @Column({ nullable: true })
  accessKeyId: string;
}
