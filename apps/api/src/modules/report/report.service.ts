import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildWeeklyReportSummary, getCurrentWeekRange } from './report-generation';

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

    const reportSummary = buildWeeklyReportSummary(tasks, metricRecordCount, enabledReminders);

    return this.prisma.weeklyReport.upsert({
      where: {
        elderUserId_weekStartDate_weekEndDate: {
          elderUserId,
          weekStartDate: start,
          weekEndDate: end,
        },
      },
      update: {
        ...reportSummary,
        metricRecordCount,
      },
      create: {
        elderUserId,
        weekStartDate: start,
        weekEndDate: end,
        ...reportSummary,
        metricRecordCount,
      },
    });
  }
}
