import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './model/task.model';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@UseGuards(AuthGuard)
@Resolver('Task')
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query()
  async tasks(@Args('req') req): Promise<Task[]> {
    return this.taskService.getAllTasks(req.user);
  }

  @Query()
  task(@Args('taskID') taskID: String, @Args('req') req): Promise<Task> {
    return this.taskService.getTaskById(taskID, req.user);
  }

  @Mutation()
  @UsePipes(ValidationPipe)
  createTask(
    @Args('newTaskForm') newTaskForm: CreateTaskDto,
    @Args('req') req,
  ): Promise<Task> {
    return this.taskService.createTask(newTaskForm, req.user);
  }

  @Mutation()
  @UsePipes(ValidationPipe)
  updateStatus(
    @Args('id') id: String,
    @Args('newStatus') newStatus: UpdateTaskStatusDto,
    @Args('req') req,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, newStatus, req.user);
  }

  @Mutation()
  deleteTask(@Args('id') id: String, @Args('req') req): Promise<void> {
    return this.taskService.deleteTask(id, req.user);
  }
}
