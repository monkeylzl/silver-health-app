import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() dto: CreateDailyTaskDto) {
    return { code: 0, message: 'ok', data: await this.taskService.create(dto) };
  }

  @Get('elder/:elderUserId')
  async findTodayByElderUserId(@Param('elderUserId') elderUserId: string, @Query('taskDate') taskDate?: string) {
    return { code: 0, message: 'ok', data: await this.taskService.findTodayByElderUserId(elderUserId, taskDate) };
  }
}
