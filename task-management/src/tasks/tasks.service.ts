import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from './task.entity';
import { TaskStatusEnum } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Array<TaskEntity>> {
    console.log(this.tasksRepository.getTasks);
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
    const foundTask = await this.tasksRepository.findOneBy({ id, user });
    if (!foundTask) {
      throw new NotFoundException(`Task with id '${id}' not found.`);
    }
    return foundTask;
  }

  async deleteTask(id: string, user: UserEntity): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Cannot delete with ID "${id}" because it cannot be found!`,
      );
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatusEnum,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
}
