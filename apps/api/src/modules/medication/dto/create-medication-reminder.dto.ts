export class CreateMedicationReminderDto {
  elderUserId!: string;
  medicineName!: string;
  dosageText!: string;
  remindTime!: string;
  repeatRule!: string;
  enabled?: boolean;
}
