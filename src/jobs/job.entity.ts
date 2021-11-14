import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobStatus } from './job-status.enum';

@Entity()
export class Job {
  // Internally referenced ID
  @PrimaryGeneratedColumn()
  id: number;

  // Publicly referenced ID
  @Column()
  uuid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: JobStatus;

  @ManyToOne((_type) => User, (user) => user.jobs, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
