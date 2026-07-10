import { TaskStatus } from '@prisma/client';
import { IsIn, IsString } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsString()
  elderUserId!: string;

  @IsIn([TaskStatus.done, TaskStatus.todo])
  status!: 'done' | 'todo';
}
