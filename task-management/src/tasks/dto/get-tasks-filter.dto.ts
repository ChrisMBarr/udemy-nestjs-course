import { TaskStatusEnum } from '../task.model';

export class GetTasksFilterDto {
  status?: TaskStatusEnum;
  search?: string;
}
