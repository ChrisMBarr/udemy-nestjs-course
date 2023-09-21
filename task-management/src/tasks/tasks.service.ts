import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatusEnum } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Array<ITask> = [];

  getAllTasks(): Array<ITask> {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Array<ITask> {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    if (search) {
      tasks = tasks.filter((t) => {
        if (
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
        ) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): ITask {
    const foundTask = this.tasks.find((t) => t.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with id '${id}' not found.`);
    }

    return foundTask;
  }

  deleteTask(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatusEnum): ITask {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description } = createTaskDto;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: TaskStatusEnum.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
}
