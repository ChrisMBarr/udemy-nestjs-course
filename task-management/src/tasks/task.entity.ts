import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatusEnum } from './task-status.enum';
import { UserEntity } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatusEnum;

  @ManyToOne(() => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true }) //hide from response objects
  user: UserEntity;
}
