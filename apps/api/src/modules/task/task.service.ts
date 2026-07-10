import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';
import { buildTaskStatusUpdate, isTaskStatusUnchanged } from './task-status';
import { recordBelongsToElder } from '../../security/record-ownership';

const DEFAULT_TASK_TIME_ZONE = 'Asia/Shanghai';

function formatBusinessDate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: DEFAULT_TASK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function resolveDateKey(taskDate?: string) {
  if (!taskDate) {
    return formatBusinessDate(new Date());
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(taskDate)) {
    return taskDate;
  }

  const parsedDate = new Date(taskDate);
  return Number.isNaN(parsedDate.getTime()) ? formatBusinessDate(new Date()) : formatBusinessDate(parsedDate);
}

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
    const dateKey = resolveDateKey(taskDate);
    const startOfDay = new Date(`${dateKey}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateKey}T23:59:59.999Z`);

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

  async complete(taskId: string, elderUserId: string) {
    return this.updateStatus(taskId, TaskStatus.done, elderUserId);
  }

  async updateStatus(taskId: string, status: 'done' | 'todo', elderUserId: string) {
    const task = await this.prisma.dailyTask.findFirst({ where: { id: taskId, elderUserId } });

    if (!task || !recordBelongsToElder(task.elderUserId, elderUserId)) {
      throw new NotFoundException(`task not found: ${taskId}`);
    }

    if (isTaskStatusUnchanged(task.status, task.completedAt, status)) return task;

    const updated = await this.prisma.dailyTask.updateMany({
      where: status === TaskStatus.done
        ? { id: taskId, elderUserId, status: { not: TaskStatus.done } }
        : {
            id: taskId,
            elderUserId,
            OR: [{ status: { not: TaskStatus.todo } }, { completedAt: { not: null } }],
          },
      data: buildTaskStatusUpdate(status),
    });
    if (updated.count === 0) {
      const current = await this.prisma.dailyTask.findFirst({ where: { id: taskId, elderUserId } });
      if (!current) throw new NotFoundException(`task not found: ${taskId}`);
      return current;
    }
    return this.prisma.dailyTask.findUniqueOrThrow({ where: { id: taskId } });
  }
}
