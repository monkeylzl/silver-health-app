import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';

@Injectable()
export class MetricService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHealthMetricDto) {
    return this.prisma.healthMetric.create({
      data: {
        elderUserId: dto.elderUserId,
        metricType: dto.metricType,
        systolic: dto.systolic,
        diastolic: dto.diastolic,
        pulse: dto.pulse,
        glucoseValue: dto.glucoseValue,
        glucosePeriodType: dto.glucosePeriodType,
        weightKg: dto.weightKg,
        createdByRole: dto.createdByRole,
        createdByUserId: dto.createdByUserId,
        measuredAt: new Date(dto.measuredAt),
      },
    });
  }

  async findByElderUserId(elderUserId: string) {
    return this.prisma.healthMetric.findMany({
      where: { elderUserId },
      orderBy: { measuredAt: 'desc' },
      take: 20,
    });
  }
}
