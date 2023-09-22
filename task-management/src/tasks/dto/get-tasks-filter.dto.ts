import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatusEnum } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;
}
