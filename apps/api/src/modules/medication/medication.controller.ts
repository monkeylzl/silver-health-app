import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';

@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post()
  async create(@Body() dto: CreateMedicationReminderDto) {
    return { code: 0, message: 'ok', data: await this.medicationService.create(dto) };
  }

  @Get('elder/:elderUserId')
  async findByElderUserId(@Param('elderUserId') elderUserId: string) {
    return { code: 0, message: 'ok', data: await this.medicationService.findByElderUserId(elderUserId) };
  }
}
