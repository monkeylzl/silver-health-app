import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateMedicationReminderDto {
  @IsString()
  elderUserId!: string;

  @IsString()
  @MaxLength(128)
  medicineName!: string;

  @IsString()
  @MaxLength(64)
  dosageText!: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  remindTime!: string;

  @IsString()
  @MaxLength(32)
  repeatRule!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
