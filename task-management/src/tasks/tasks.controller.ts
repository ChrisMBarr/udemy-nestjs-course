import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TaskEntity } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController', { timestamp: true });

  constructor(private tasksSvc: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<Array<TaskEntity>> {
    this.logger.verbose(
      `Retrieving all tasks for user "${
        user.username
      }". Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.tasksSvc.getTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    this.logger.verbose(
      `Retrieving task with ID "${id}" for user "${user.username}"`,
    );
    return this.tasksSvc.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    this.logger.verbose(
      `Deleting task with ID "${id}" for user "${user.username}"`,
    );
    return this.tasksSvc.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    const { status } = updateTaskStatusDto;
    this.logger.verbose(
      `Updating task ID "${id}" with new status "${status}", for user "${user.username}"`,
    );
    return this.tasksSvc.updateTaskStatus(id, status, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    this.logger.verbose(
      `User "${user.username}" created a task: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksSvc.createTask(createTaskDto, user);
  }
}
