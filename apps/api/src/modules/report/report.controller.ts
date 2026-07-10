import { Controller, Get, Param, Post } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('elder/:elderUserId')
  async findByElderUserId(@Param('elderUserId') elderUserId: string) {
    return { code: 0, message: 'ok', data: await this.reportService.findByElderUserId(elderUserId) };
  }

  @Post('elder/:elderUserId/generate')
  async generateForElder(@Param('elderUserId') elderUserId: string) {
    return { code: 0, message: 'ok', data: await this.reportService.generateCurrentWeek(elderUserId) };
  }
}
