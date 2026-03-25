import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDailyTaskDto) {
    return this.prisma.dailyTask.create({
      data: {
        elderUserId: dto.elderUserId,
        taskDate: new Date(dto.taskDate),
        taskType: dto.taskType,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: dto.status ?? TaskStatus.todo,
        sourceType: dto.sourceType,
        relatedContentId: dto.relatedContentId,
        dueTime: dto.dueTime,
      },
    });
  }

  async findTodayByElderUserId(elderUserId: string, taskDate?: string) {
    const targetDate = taskDate ? new Date(taskDate) : new Date();
    return this.prisma.dailyTask.findMany({
      where: { elderUserId, taskDate: targetDate },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
  }
}
