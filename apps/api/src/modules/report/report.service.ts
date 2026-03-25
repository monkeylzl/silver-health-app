import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
}
