import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

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

  @Patch(':taskId/complete')
  async complete(@Param('taskId') taskId: string, @Body() dto: UpdateTaskStatusDto) {
    return { code: 0, message: 'ok', data: await this.taskService.complete(taskId, dto.elderUserId) };
  }

  @Patch(':taskId/status')
  async updateStatus(@Param('taskId') taskId: string, @Body() dto: UpdateTaskStatusDto) {
    return { code: 0, message: 'ok', data: await this.taskService.updateStatus(taskId, dto.status, dto.elderUserId) };
  }
}
