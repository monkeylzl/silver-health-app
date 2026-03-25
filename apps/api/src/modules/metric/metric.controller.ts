import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MetricService } from './metric.service';
import { CreateHealthMetricDto } from './dto/create-health-metric.dto';

@Controller('metrics')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post()
  async create(@Body() dto: CreateHealthMetricDto) {
    return { code: 0, message: 'ok', data: await this.metricService.create(dto) };
  }

  @Get('elder/:elderUserId')
  async findByElderUserId(@Param('elderUserId') elderUserId: string) {
    return { code: 0, message: 'ok', data: await this.metricService.findByElderUserId(elderUserId) };
  }
}
