import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return {
      code: 0,
      message: 'ok',
      data: await this.userService.create(dto),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return {
      code: 0,
      message: 'ok',
      data: await this.userService.findById(id),
    };
  }
}
