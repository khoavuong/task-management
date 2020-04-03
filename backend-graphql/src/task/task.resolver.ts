import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TaskService } from './task.service';
import { Task } from './model/task.model';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(AuthGuard)
@Resolver('Task')
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {}

  @Query()
  async tasks(@Args('req') req): Promise<Task[]> {
    return this.taskService.getAllTasks(req.user);
  }

  @ResolveField()
  async user(@Parent() task) {
    const user = await this.authService.getUserById(task.userId);
    return user;
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
  deleteTask(@Args('id') id: String, @Args('req') req) {
    return this.taskService.deleteTask(id, req.user);
  }
}
