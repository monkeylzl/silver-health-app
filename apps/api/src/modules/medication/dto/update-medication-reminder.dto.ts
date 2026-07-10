import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateMedicationReminderDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  medicineName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  dosageText?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  remindTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  repeatRule?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
