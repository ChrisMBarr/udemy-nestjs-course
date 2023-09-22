import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskEntity } from './task.entity';
import { TaskStatusEnum } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Array<TaskEntity>> {
    console.log(this.tasksRepository.getTasks)
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<TaskEntity> {
    const foundTask = await this.tasksRepository.findOneBy({ id: id });
    if (!foundTask) {
      throw new NotFoundException(`Task with id '${id}' not found.`);
    }
    return foundTask;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatusEnum,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
