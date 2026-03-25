import { MetricCreatedByRole, MetricType } from '@prisma/client';

export class CreateHealthMetricDto {
  elderUserId!: string;
  metricType!: MetricType;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  glucoseValue?: number;
  glucosePeriodType?: string;
  weightKg?: number;
  createdByRole!: MetricCreatedByRole;
  createdByUserId!: string;
  measuredAt!: string;
}
