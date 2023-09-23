import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatusEnum.OPEN,
      user,
    });

    try {
      await this.save(task);
      return task;
    } catch (ex) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }". Task Data: ${JSON.stringify(createTaskDto)}`,
        ex.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Array<TaskEntity>> {
    const { status, search } = filterDto;
    //same name as DB table!
    const query = this.createQueryBuilder('task_entity');
    query.where({ user });

    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task_entity.title) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (ex) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        ex.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
