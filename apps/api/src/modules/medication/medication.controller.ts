import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { CreateMedicationReminderDto } from './dto/create-medication-reminder.dto';
import { UpdateMedicationReminderDto } from './dto/update-medication-reminder.dto';

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

  @Patch(':id')
  async update(@Param('id') id: string, @Query('elderUserId') elderUserId: string, @Body() dto: UpdateMedicationReminderDto) {
    return { code: 0, message: 'ok', data: await this.medicationService.update(id, elderUserId, dto) };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('elderUserId') elderUserId: string) {
    return { code: 0, message: 'ok', data: await this.medicationService.remove(id, elderUserId) };
  }
}
