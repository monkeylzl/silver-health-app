import { TaskPriority, TaskSourceType, TaskStatus, TaskType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateDailyTaskDto {
  @IsString()
  elderUserId!: string;

  @IsDateString()
  taskDate!: string;

  @IsEnum(TaskType)
  taskType!: TaskType;

  @IsString()
  @MaxLength(128)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsEnum(TaskSourceType)
  sourceType!: TaskSourceType;

  @IsOptional()
  @IsString()
  relatedContentId?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  dueTime?: string;
}
