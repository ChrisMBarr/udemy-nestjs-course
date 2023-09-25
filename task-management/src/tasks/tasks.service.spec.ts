import { Test } from '@nestjs/testing';

import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { UserEntity } from 'src/auth/user.entity';
import { TaskEntity } from './task.entity';
import { TaskStatusEnum } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  createTask: jest.fn(),
});

const mockUser: UserEntity = {
  username: 'Chris',
  id: 'foo',
  password: 'pa55word',
  tasks: [],
};

const mockTask: TaskEntity = {
  id: 'my-test-id',
  title: 'Test Title',
  description: 'Test description',
  status: TaskStatusEnum.IN_PROGRESS,
  user: mockUser,
};

describe('TasksService', () => {
  let tasksService: jest.Mocked<TasksService>;
  let tasksRepository: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useFactory: mockTasksRepository }],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('should get an array of tasks from the TaskRepository', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should get a task with a matching ID from the TasksRepository', async () => {
      tasksRepository.findOneBy.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('my-test-id', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error when no matching task is returned', async () => {
      tasksRepository.findOneBy.mockResolvedValue(null);
      expect(tasksService.getTaskById('wrong-id', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('should NOT throw an error when the TasksRepository reports a task as successfully being deleted', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 1, raw: '' });
      expect(tasksService.deleteTask('my-task-id', mockUser)).resolves.not.toThrow(NotFoundException);
    });

    it('should throw an error when the TasksRepository reports NO tasks are reported as being deleted', async () => {
      tasksRepository.delete.mockResolvedValue({ affected: 0, raw: '' });
      expect(tasksService.deleteTask('my-task-id', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('should return a task when it has been created', async () => {
      tasksRepository.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask({ title: mockTask.title, description: mockTask.description }, mockUser);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTaskStatus', () => {
    it('should return a task with the updated status', async () => {
      tasksRepository.findOneBy.mockResolvedValue(mockTask);

      const result = await tasksService.updateTaskStatus(mockTask.id, TaskStatusEnum.DONE, mockUser);

      const newTask = { ...mockTask };
      newTask.status = TaskStatusEnum.DONE;

      expect(tasksRepository.save).toHaveBeenCalledWith(newTask);
      expect(result).toEqual(newTask);
    });
  });
});
