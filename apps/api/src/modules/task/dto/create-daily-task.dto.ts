import { TaskPriority, TaskSourceType, TaskStatus, TaskType } from '@prisma/client';

export class CreateDailyTaskDto {
  elderUserId!: string;
  taskDate!: string;
  taskType!: TaskType;
  title!: string;
  description?: string;
  priority!: TaskPriority;
  status?: TaskStatus;
  sourceType!: TaskSourceType;
  relatedContentId?: string;
  dueTime?: string;
}
