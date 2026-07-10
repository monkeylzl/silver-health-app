import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';
import { UpdateMedicationReminderDto } from './dto/update-medication-reminder.dto';
import { recordBelongsToElder } from '../../security/record-ownership';

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

  async update(id: string, elderUserId: string, dto: UpdateMedicationReminderDto) {
    await this.ensureOwned(id, elderUserId);
    return this.prisma.medicationReminder.update({ where: { id }, data: dto });
  }

  async remove(id: string, elderUserId: string) {
    await this.ensureOwned(id, elderUserId);
    return this.prisma.medicationReminder.delete({ where: { id } });
  }

  private async ensureOwned(id: string, elderUserId: string) {
    const reminder = await this.prisma.medicationReminder.findUnique({ where: { id } });
    if (!reminder || !recordBelongsToElder(reminder.elderUserId, elderUserId)) throw new NotFoundException(`medication reminder not found: ${id}`);
    return reminder;
  }
}
