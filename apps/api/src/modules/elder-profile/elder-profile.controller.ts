import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ElderProfileService } from './elder-profile.service';
import { CreateElderProfileDto } from './dto/create-elder-profile.dto';
import { UpdateElderProfileDto } from './dto/update-elder-profile.dto';

@Controller('profile/elder')
export class ElderProfileController {
  constructor(private readonly elderProfileService: ElderProfileService) {}

  @Post()
  async create(@Body() dto: CreateElderProfileDto) {
    return {
      code: 0,
      message: 'ok',
      data: await this.elderProfileService.create(dto),
    };
  }

  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    return {
      code: 0,
      message: 'ok',
      data: await this.elderProfileService.findByUserId(userId),
    };
  }

  @Patch(':userId')
  async updateByUserId(@Param('userId') userId: string, @Body() dto: UpdateElderProfileDto) {
    return {
      code: 0,
      message: 'ok',
      data: await this.elderProfileService.updateByUserId(userId, dto),
    };
  }
}
