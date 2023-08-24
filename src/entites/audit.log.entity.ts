//Add audit logs entity
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class logging {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userId)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column()
  url: string;

  @Column()
  body: string;

  @Column()
  method: string;

  @CreateDateColumn()
  date: Date;
}
