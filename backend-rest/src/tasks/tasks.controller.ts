import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './model/task.model';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(@Req() req): Promise<Task[]> {
    return this.tasksService.getAllTasks(req.user);
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: String, @Req() req): Promise<Task> {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() newTaskForm: CreateTaskDto, @Req() req): Promise<Task> {
    return this.tasksService.createTask(newTaskForm, req.user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: String, @Req() req): Promise<void> {
    return this.tasksService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  @UsePipes(ValidationPipe)
  updateTaskStatus(
    @Param('id') id: String,
    @Body() newStatus: UpdateTaskStatusDto,
    @Req() req,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, newStatus, req.user);
  }
}
