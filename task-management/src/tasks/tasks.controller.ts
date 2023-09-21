import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksSvc: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Array<ITask> {
    if (Object.keys(filterDto).length) {
      return this.tasksSvc.getTasksWithFilters(filterDto);
    } else {
      return this.tasksSvc.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): ITask {
    return this.tasksSvc.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksSvc.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): ITask {
    const { status } = updateTaskStatusDto;
    return this.tasksSvc.updateTaskStatus(id, status);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): ITask {
    const task = this.tasksSvc.createTask(createTaskDto);
    return task;
  }
}
