import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const REPORT_TIME_ZONE = 'Asia/Shanghai';

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function toDateKey(date: Date) {
  const parts = getDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getCurrentWeekRange(now = new Date()) {
  const dateKey = toDateKey(now);
  const localDate = new Date(`${dateKey}T00:00:00.000Z`);
  const day = localDate.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(localDate);
  start.setUTCDate(localDate.getUTCDate() + mondayOffset);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return {
    start,
    end,
    metricStart: new Date(`${start.toISOString().slice(0, 10)}T00:00:00.000Z`),
    metricEnd: new Date(`${end.toISOString().slice(0, 10)}T23:59:59.999Z`),
  };
}

function percent(doneCount: number, totalCount: number) {
  if (totalCount <= 0) return null;
  return Math.round((doneCount / totalCount) * 100);
}

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findByElderUserId(elderUserId: string) {
    return this.prisma.weeklyReport.findMany({
      where: { elderUserId },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
  }

  async generateCurrentWeek(elderUserId: string) {
    const { start, end, metricStart, metricEnd } = getCurrentWeekRange();
    const [tasks, metricRecordCount, enabledReminders] = await Promise.all([
      this.prisma.dailyTask.findMany({
        where: {
          elderUserId,
          taskDate: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.healthMetric.count({
        where: {
          elderUserId,
          measuredAt: {
            gte: metricStart,
            lte: metricEnd,
          },
        },
      }),
      this.prisma.medicationReminder.findMany({
        where: {
          elderUserId,
          enabled: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const doneTaskCount = tasks.filter((task) => task.status === TaskStatus.done).length;
    const enabledReminderNames = enabledReminders.map((reminder) => reminder.medicineName);
    const exerciseCompletionRate = percent(doneTaskCount, tasks.length);
    const medicationCompletionRate = enabledReminders.length > 0 ? 100 : null;
    const summaryText = `本周任务已完成 ${doneTaskCount}/${tasks.length} 项，新增指标 ${metricRecordCount} 次，启用提醒 ${enabledReminders.length} 条${enabledReminderNames.length > 0 ? `（${enabledReminderNames.join('、')}）` : ''}。`;
    const suggestionList = [
      tasks.length > doneTaskCount ? '优先提醒未完成任务，避免当天事项遗漏。' : '本周任务完成节奏不错，可以继续保持。',
      metricRecordCount >= 4 ? '指标记录比较完整，下周继续保持固定时间记录。' : '指标记录偏少，下周建议固定一个时间补齐。',
      enabledReminders.length > 0 ? `继续关注${enabledReminderNames.slice(0, 2).join('、')}等用药提醒。` : '建议先补充常用药提醒，方便家属持续跟进。',
    ];

    return this.prisma.weeklyReport.upsert({
      where: {
        elderUserId_weekStartDate_weekEndDate: {
          elderUserId,
          weekStartDate: start,
          weekEndDate: end,
        },
      },
      update: {
        exerciseCompletionRate,
        medicationCompletionRate,
        metricRecordCount,
        summaryText,
        suggestionList,
      },
      create: {
        elderUserId,
        weekStartDate: start,
        weekEndDate: end,
        exerciseCompletionRate,
        medicationCompletionRate,
        metricRecordCount,
        summaryText,
        suggestionList,
      },
    });
  }
}
