import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';

@Injectable()
export class MedicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicationReminderDto) {
    return this.prisma.medicationReminder.create({
      data: {
        elderUserId: dto.elderUserId,
        medicineName: dto.medicineName,
        dosageText: dto.dosageText,
        remindTime: dto.remindTime,
        repeatRule: dto.repeatRule,
        enabled: dto.enabled ?? true,
      },
    });
  }

  async findByElderUserId(elderUserId: string) {
    return this.prisma.medicationReminder.findMany({
      where: { elderUserId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
