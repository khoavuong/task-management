import * as mongoose from 'mongoose';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const TaskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: TaskStatus, required: true },
});

export class Task extends mongoose.Document {
  userId: String;
  title: String;
  description: String;
  status: TaskStatus;
}
