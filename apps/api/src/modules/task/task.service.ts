import { Injectable, NotFoundException } from '@nestjs/common';
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
    const baseDate = taskDate ? new Date(taskDate) : new Date();
    const startOfDay = new Date(baseDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(baseDate);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.dailyTask.findMany({
      where: {
        elderUserId,
        taskDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async complete(taskId: string) {
    const task = await this.prisma.dailyTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(`task not found: ${taskId}`);
    }

    return this.prisma.dailyTask.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.done,
        completedAt: new Date(),
      },
    });
  }
}
