import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './model/task.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'tasks', schema: TaskSchema }]),
    AuthModule,
  ],
  providers: [TaskService, TaskResolver],
})
export class TaskModule {}
