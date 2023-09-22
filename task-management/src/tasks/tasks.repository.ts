import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { TaskEntity } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusEnum } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {
  constructor(dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatusEnum.OPEN,
    });

    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Array<TaskEntity>> {
    const { status, search } = filterDto;
    //same name as DB table!
    const query = this.createQueryBuilder('task_entity');

    if (status) {
      query.andWhere('task_entity.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task_entity.title) LIKE LOWER(:search) OR LOWER(task_entity.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
