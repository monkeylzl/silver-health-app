import { Gender, HelperMode, MobilityLevel } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateElderProfileDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsMobilePhone('zh-CN')
  mobile?: string;

  @IsString()
  name!: string;

  @IsEnum(Gender)
  gender!: Gender;

  @IsInt()
  @Min(1)
  @Max(120)
  age!: number;

  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(260)
  heightCm?: number;

  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  chronicConditions?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  commonMedicines?: string[];

  @IsEnum(MobilityLevel)
  mobilityLevel!: MobilityLevel;

  @IsEnum(HelperMode)
  helperMode!: HelperMode;
}
