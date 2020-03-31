import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './model/task.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel('tasks') private tasks: Model<Task>) {}

  async getAllTasks(user): Promise<Task[]> {
    return await this.tasks.find({ userId: user._id });
  }

  async getTaskById(id: String, user): Promise<Task> {
    try {
      return await this.tasks.findOne({ userId: user._id, _id: id });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async createTask(newTaskForm: CreateTaskDto, user): Promise<Task> {
    const completeTaskForm: Task = {
      userId: user._id,
      ...newTaskForm,
      status: TaskStatus.OPEN,
    };
    const newTask = new this.tasks(completeTaskForm);
    return await newTask.save();
  }

  async deleteTask(id: String, user): Promise<void> {
    try {
      await this.tasks.deleteOne({ _id: id, userId: user._id });
    } catch (error) {
      throw new NotFoundException('Task not found');
    }
  }

  async updateTaskStatus(
    id: String,
    newStatus: UpdateTaskStatusDto,
    user,
  ): Promise<Task> {
    return await this.tasks.findOneAndUpdate(
      { _id: id, userId: user._id },
      newStatus,
      {
        returnOriginal: false,
      },
    );
  }
}
