import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FamilyBindingService } from './family-binding.service';
import { CreateFamilyBindingDto } from './dto/create-family-binding.dto';

@Controller('family-bindings')
export class FamilyBindingController {
  constructor(private readonly familyBindingService: FamilyBindingService) {}

  @Post()
  async create(@Body() dto: CreateFamilyBindingDto) {
    return {
      code: 0,
      message: 'ok',
      data: await this.familyBindingService.create(dto),
    };
  }

  @Get('elder/:elderUserId')
  async findByElderUserId(@Param('elderUserId') elderUserId: string) {
    return {
      code: 0,
      message: 'ok',
      data: await this.familyBindingService.findByElderUserId(elderUserId),
    };
  }
}
