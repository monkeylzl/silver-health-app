import { MetricCreatedByRole, MetricType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateHealthMetricDto {
  @IsString()
  elderUserId!: string;

  @IsEnum(MetricType)
  metricType!: MetricType;

  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(260)
  systolic?: number;

  @IsOptional()
  @IsNumber()
  @Min(40)
  @Max(180)
  diastolic?: number;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(220)
  pulse?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(40)
  glucoseValue?: number;

  @IsOptional()
  @IsString()
  glucosePeriodType?: string;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsEnum(MetricCreatedByRole)
  createdByRole!: MetricCreatedByRole;

  @IsString()
  createdByUserId!: string;

  @IsDateString()
  measuredAt!: string;
}
