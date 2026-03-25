import { Gender, HelperMode, MobilityLevel } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateElderProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

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

  @IsOptional()
  @IsEnum(MobilityLevel)
  mobilityLevel?: MobilityLevel;

  @IsOptional()
  @IsEnum(HelperMode)
  helperMode?: HelperMode;
}
