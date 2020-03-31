import { TaskStatus } from '../model/task.model';
import { IsIn } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;
}
